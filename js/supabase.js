// ==========================================
// supabase.js — Initialize Supabase client
// Uses window.db to avoid conflict with CDN's 'supabase' global
// ==========================================

function getSupabase() {
  // Return existing instance if already created
  if (window.db) {
    return window.db;
  }
  
  // Debug: check what's available
  console.log('🔍 Checking Supabase availability...');
  console.log('   window.supabase:', typeof window.supabase);
  console.log('   SUPABASE_URL:', typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL.substring(0, 30) + '...' : 'NOT SET');
  
  // Check CDN
  if (typeof window.supabase === 'undefined') {
    console.error('❌ Supabase CDN not loaded. window.supabase is undefined.');
    console.error('   Make sure this script tag exists BEFORE supabase.js:');
    console.error('   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
    return null;
  }
  
  // Check config
  if (typeof SUPABASE_URL === 'undefined' || SUPABASE_URL.includes('YOUR-PROJECT-ID')) {
    console.error('❌ SUPABASE_URL not configured. Open js/config.js and add your real Supabase URL.');
    return null;
  }
  
  if (typeof SUPABASE_ANON_KEY === 'undefined' || SUPABASE_ANON_KEY.includes('YOUR-ANON-KEY')) {
    console.error('❌ SUPABASE_ANON_KEY not configured. Open js/config.js and add your real anon key.');
    return null;
  }
  
  // Create client
  try {
    window.db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client initialized successfully!');
    console.log('   URL:', SUPABASE_URL);
    return window.db;
  } catch (err) {
    console.error('❌ Error creating Supabase client:', err.message);
    return null;
  }
}

// Auto-initialize when the page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 Page loaded, initializing Supabase...');
    getSupabase();
  });
} else {
  // Page already loaded
  console.log('📄 Page already loaded, initializing Supabase...');
  getSupabase();
}