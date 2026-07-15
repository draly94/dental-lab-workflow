// ==========================================
// files.js — Real upload progress via XHR
// Real speed measurement, ETA calculation
// ==========================================

var STORAGE_BUCKET = 'case-files';
var MAX_RETRIES = 5;
var RETRY_BASE_DELAY = 1000;
var SPEED_WINDOW = 10; // seconds

// ==========================================
// UPLOAD MANAGER
// ==========================================
function UploadManager(caseId, folder, options) {
  options = options || {};
  
  this.caseId = caseId;
  this.folder = folder;
  this.queue = [];
  this.completed = [];
  this.failed = [];
  this.active = null;
  this.activeIndex = -1;
  this.paused = false;
  this.cancelled = false;
  this.totalBytes = 0;
  this.uploadedBytes = 0;
  this.completedBytes = 0;
  this.startTime = null;
  this.speedHistory = [];
  this.currentSpeed = 0;
  this.abortController = null;
  
  // Callbacks
  this.onProgress = options.onProgress || null;
  this.onFileStart = options.onFileStart || null;
  this.onFileComplete = options.onFileComplete || null;
  this.onFileError = options.onFileError || null;
  this.onComplete = options.onComplete || null;
  this.onPause = options.onPause || null;
  this.onResume = options.onResume || null;
  this.onSpeedUpdate = options.onSpeedUpdate || null;
}

UploadManager.prototype.addFiles = function(files) {
  var self = this;
  var arr = Array.isArray(files) ? files : Array.from(files);
  arr.forEach(function(f) {
    self.queue.push({ file: f, status: 'pending', progress: 0, retries: 0, uploadedBytes: 0 });
    self.totalBytes += f.size;
  });
  console.log('📦 Queue: ' + this.queue.length + ' file(s) — ' + formatFileSize(this.totalBytes));
};

UploadManager.prototype.deleteFile = function(index) {
  if (index < 0 || index >= this.queue.length) return false;
  var item = this.queue[index];
  if (item.status === 'uploading') return false;
  if (item.status === 'completed') {
    this.completedBytes -= item.file.size;
    this.uploadedBytes -= item.file.size;
    this.completed = this.completed.filter(function(c) { return c.name !== item.file.name; });
  }
  if (item.status !== 'completed') {
    this.totalBytes -= item.file.size;
  }
  this.queue.splice(index, 1);
  if (index < this.activeIndex) this.activeIndex--;
  return true;
};

UploadManager.prototype.start = async function() {
  this.paused = false;
  this.cancelled = false;
  this.startTime = Date.now();
  
  for (var i = 0; i < this.queue.length; i++) {
    if (this.cancelled) break;
    var item = this.queue[i];
    if (item.status === 'completed' || item.status === 'failed') continue;
    this.activeIndex = i;
    while (this.paused && !this.cancelled) { await sleep(500); }
    if (this.cancelled) break;
    await this.uploadFileItem(item, i);
  }
  
  if (!this.cancelled && this.onComplete) {
    this.onComplete(this.completed, this.failed);
  }
};

UploadManager.prototype.uploadFileItem = async function(item, index) {
  var self = this;
  var file = item.file;
  
  item.status = 'uploading';
  this.active = item;
  if (this.onFileStart) this.onFileStart(file, index, this.queue.length);
  
  var timestamp = Date.now();
  var cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  var filePath = this.caseId + '/' + this.folder + '/' + timestamp + '_' + cleanName;
  filePath = filePath.replace(/\s+/g, '');
  
  var result = await this.uploadWithXHR(file, filePath, item);
  
  if (result.error) {
    item.status = 'failed';
    item.progress = 0;
    this.failed.push({ name: file.name, error: result.error });
    if (this.onFileError) this.onFileError(file.name, result.error, index);
  } else {
    item.status = 'completed';
    item.progress = 100;
    item.uploadedBytes = file.size;
    this.completedBytes += file.size;
    this.uploadedBytes = this.completedBytes;
    this.completed.push({ name: file.name, path: result.path, size: file.size });
    if (this.onFileComplete) this.onFileComplete(file.name, result, index);
  }
  
  this.active = null;
  this.activeIndex = -1;
  this.updateOverallProgress();
};

// ==========================================
// REAL XHR UPLOAD WITH PROGRESS
// ==========================================
UploadManager.prototype.uploadWithXHR = function(file, filePath, item) {
  var self = this;
  var client = getSupabase();
  
  return new Promise(async function(resolve) {
    var sessionResult = await client.auth.getSession();
    var token = sessionResult.data.session ? sessionResult.data.session.access_token : null;
    
    if (!token) {
      resolve({ error: { message: 'Not authenticated' } });
      return;
    }
    
    // Track speed for this file
    var fileStartTime = Date.now();
    var lastSpeedCheck = Date.now();
    var lastSpeedBytes = 0;
    
    function attemptUpload(attempt) {
      if (self.cancelled) {
        resolve({ error: { message: 'Cancelled' } });
        return;
      }
      
      if (!isOnline()) {
        self.waitForConnection().then(function() {
          attemptUpload(attempt);
        });
        return;
      }
      
      var xhr = new XMLHttpRequest();
      var uploadUrl = SUPABASE_URL + '/storage/v1/object/' + STORAGE_BUCKET + '/' + filePath;
      
      xhr.upload.addEventListener('progress', function(e) {
        if (e.lengthComputable) {
          var percent = Math.round((e.loaded / e.total) * 100);
          var currentBytes = self.completedBytes + e.loaded;
          
          item.progress = percent;
          item.uploadedBytes = e.loaded;
          
          // Update speed
          var now = Date.now();
          var elapsed = (now - lastSpeedCheck) / 1000;
          if (elapsed >= 0.5) {
            var byteDiff = e.loaded - lastSpeedBytes;
            var speed = byteDiff / elapsed;
            
            self.speedHistory.push({ time: now, speed: speed });
            var cutoff = now - (SPEED_WINDOW * 1000);
            self.speedHistory = self.speedHistory.filter(function(s) { return s.time > cutoff; });
            
            if (self.speedHistory.length > 0) {
              var total = 0;
              self.speedHistory.forEach(function(s) { total += s.speed; });
              self.currentSpeed = total / self.speedHistory.length;
            }
            
            lastSpeedCheck = now;
            lastSpeedBytes = e.loaded;
            
            if (self.onSpeedUpdate) self.onSpeedUpdate(self.currentSpeed);
          }
          
          // Overall progress
          self.uploadedBytes = currentBytes;
          self.updateOverallProgress();
        }
      });
      
      xhr.addEventListener('load', function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ path: filePath, name: file.name, size: file.size });
        } else if (isRetryableError({ status: xhr.status }) && attempt < MAX_RETRIES) {
          var delay = RETRY_BASE_DELAY * Math.pow(2, attempt);
          setTimeout(function() { attemptUpload(attempt + 1); }, delay);
        } else {
          // Fallback to SDK
          client.storage.from(STORAGE_BUCKET).upload(filePath, file, { cacheControl: '3600', upsert: false })
            .then(function(r) { resolve(r.error ? { error: r.error } : { path: filePath, name: file.name, size: file.size }); });
        }
      });
      
      xhr.addEventListener('error', function() {
        if (attempt < MAX_RETRIES) {
          var delay = RETRY_BASE_DELAY * Math.pow(2, attempt);
          setTimeout(function() { attemptUpload(attempt + 1); }, delay);
        } else {
          client.storage.from(STORAGE_BUCKET).upload(filePath, file, { cacheControl: '3600', upsert: false })
            .then(function(r) { resolve(r.error ? { error: r.error } : { path: filePath, name: file.name, size: file.size }); });
        }
      });
      
      xhr.addEventListener('abort', function() {
        resolve({ error: { message: 'Aborted' } });
      });
      
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
      xhr.setRequestHeader('x-upsert', 'false');
      
      // Read and send
      var reader = new FileReader();
      reader.onload = function() { xhr.send(reader.result); };
      reader.readAsArrayBuffer(file);
    }
    
    attemptUpload(0);
  });
};

UploadManager.prototype.waitForConnection = function() {
  var self = this;
  return new Promise(function(resolve) {
    if (isOnline()) { resolve(); return; }
    function check() { if (isOnline()) { window.removeEventListener('online', check); resolve(); } }
    window.addEventListener('online', check);
    setTimeout(function() { window.removeEventListener('online', check); resolve(); }, 300000);
  });
};

UploadManager.prototype.pause = function() {
  this.paused = true;
  if (this.onPause) this.onPause(this.getStats());
};

UploadManager.prototype.resume = function() {
  this.paused = false;
  if (this.onResume) this.onResume(this.getStats());
};

UploadManager.prototype.cancel = function() {
  this.cancelled = true;
  this.paused = false;
};

UploadManager.prototype.getETA = function() {
  var remaining = this.totalBytes - this.uploadedBytes;
  if (this.currentSpeed <= 0) return '—';
  var seconds = remaining / this.currentSpeed;
  if (seconds < 60) return Math.round(seconds) + 's';
  if (seconds < 3600) return Math.round(seconds / 60) + 'm ' + Math.round(seconds % 60) + 's';
  var h = Math.floor(seconds / 3600);
  var m = Math.round((seconds % 3600) / 60);
  return h + 'h ' + m + 'm';
};

UploadManager.prototype.getStats = function() {
  var totalProgress = this.totalBytes > 0 ? Math.round((this.uploadedBytes / this.totalBytes) * 100) : 0;
  return {
    total: this.queue.length,
    completed: this.completed.length,
    failed: this.failed.length,
    totalBytes: this.totalBytes,
    uploadedBytes: this.uploadedBytes,
    totalProgress: totalProgress,
    speed: this.currentSpeed,
    speedFormatted: formatSpeed(this.currentSpeed),
    eta: this.getETA(),
    isPaused: this.paused,
    isOnline: isOnline(),
    elapsed: this.startTime ? Math.round((Date.now() - this.startTime) / 1000) : 0
  };
};

UploadManager.prototype.updateOverallProgress = function() {
  if (this.onProgress) {
    var s = this.getStats();
    this.onProgress(s.totalProgress, this.uploadedBytes, this.totalBytes, s);
  }
};

// ==========================================
// SIMPLE UPLOADS (backward compat)
// ==========================================
async function uploadFile(file, caseId, folder, onProgress) {
  var m = new UploadManager(caseId, folder, {
    onProgress: function(p, l, t) { if (onProgress) onProgress(p, l, t); }
  });
  m.addFiles([file]);
  return new Promise(function(resolve) {
    m.onComplete = function(completed, failed) {
      if (failed.length > 0) resolve({ error: failed[0].error });
      else resolve({ data: { path: completed[0].path, name: completed[0].name, size: completed[0].size }, error: null });
    };
    m.start();
  });
}

async function uploadMultipleFiles(files, caseId, folder, onProgress, onFileComplete) {
  var m = new UploadManager(caseId, folder, {
    onProgress: function(p, l, t) { if (onProgress) onProgress(p, l, t); },
    onFileComplete: function(n, r) { if (onFileComplete) onFileComplete(n, r); }
  });
  m.addFiles(files);
  return new Promise(function(resolve) {
    m.onComplete = function(c, f) {
      var results = [];
      c.forEach(function(x) { results.push({ name: x.name, data: x, success: true }); });
      f.forEach(function(x) { results.push({ name: x.name, error: x.error, success: false }); });
      resolve(results);
    };
    m.start();
  });
}

// ==========================================
// DOWNLOAD
// ==========================================
async function downloadFile(filePath, fileName) {
  var client = getSupabase();
  if (!client || !filePath) return;
  filePath = filePath.replace(/\s+/g, '');
  var urlResult = await client.storage.from(STORAGE_BUCKET).createSignedUrl(filePath, 3600);
  if (urlResult.error) { alert('File not found.'); return; }
  var a = document.createElement('a');
  a.href = urlResult.data.signedUrl;
  a.download = fileName || filePath.split('/').pop() || 'download';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function getFileUrl(filePath) {
  var client = getSupabase();
  if (!client || !filePath) return null;
  filePath = filePath.replace(/\s+/g, '');
  var r = await client.storage.from(STORAGE_BUCKET).createSignedUrl(filePath, 3600);
  return r.error ? null : r.data.signedUrl;
}

// ==========================================
// HELPERS
// ==========================================
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes';
  var k = 1024;
  var sizes = ['Bytes', 'KB', 'MB', 'GB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatSpeed(bytesPerSec) {
  if (!bytesPerSec || bytesPerSec === 0) return '—';
  if (bytesPerSec < 1024) return Math.round(bytesPerSec) + ' B/s';
  if (bytesPerSec < 1048576) return (bytesPerSec / 1024).toFixed(1) + ' KB/s';
  return (bytesPerSec / 1048576).toFixed(2) + ' MB/s';
}

function sleep(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }
function isOnline() { return navigator.onLine !== false; }

function isRetryableError(error) {
  if (!error) return true;
  var msg = (error.message || '').toLowerCase();
  if (msg.indexOf('network') !== -1) return true;
  if (msg.indexOf('timeout') !== -1) return true;
  if (msg.indexOf('fetch') !== -1) return true;
  if (msg.indexOf('connection') !== -1) return true;
  if (error.status && error.status >= 500) return true;
  return false;
}

function onNetworkChange(callback) {
  window.addEventListener('online', function() { callback(true); });
  window.addEventListener('offline', function() { callback(false); });
}