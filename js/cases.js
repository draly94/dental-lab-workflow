// ==========================================
// cases.js — Case CRUD + RPC function calls
// All business logic runs server-side
// ==========================================

// ==========================================
// CREATE
// ==========================================
async function createCase(caseData) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  
  var result = await client
    .from('cases')
    .insert({
      lab_id: caseData.lab_id,
      name: caseData.name,
      description: caseData.description || null,
      patient_name: caseData.patient_name || null,
      specialty: caseData.specialty,
      due_date: caseData.due_date || null,
      is_urgent: caseData.is_urgent || false,
      status: 'draft'
    })
    .select()
    .single();
  
  return result;
}

// ==========================================
// READ
// ==========================================
async function getCase(caseId) {
  var client = getSupabase();
  if (!client) return null;
  
  var result = await client
    .from('cases')
    .select('*, lab:lab_id(full_name, company_name), designer:designer_id(full_name), assigned_by:assigned_by(full_name)')
    .eq('id', caseId)
    .single();
  
  if (result.error) { console.error('Error fetching case:', result.error); return null; }
  return result.data;
}

async function getLabCases(labId) {
  var client = getSupabase();
  if (!client) return [];
  
  var result = await client
    .from('cases')
    .select('*, designer:designer_id(full_name)')
    .eq('lab_id', labId)
    .order('created_at', { ascending: false });
  
  if (result.error) { console.error('Error:', result.error); return []; }
  return result.data;
}

async function getDesignerCases(designerId) {
  var client = getSupabase();
  if (!client) return [];
  
  var result = await client
    .from('cases')
    .select('*, lab:lab_id(full_name, company_name)')
    .eq('designer_id', designerId)
    .order('created_at', { ascending: false });
  
  if (result.error) { console.error('Error:', result.error); return []; }
  return result.data;
}

async function getAllCases() {
  var client = getSupabase();
  if (!client) return [];
  
  var result = await client
    .from('cases')
    .select('*, lab:lab_id(full_name), designer:designer_id(full_name)')
    .order('created_at', { ascending: false });
  
  if (result.error) { console.error('Error:', result.error); return []; }
  return result.data;
}

// ==========================================
// UPDATE (direct — only for simple field updates)
// ==========================================
async function updateCase(caseId, updates) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  updates.updated_at = new Date().toISOString();
  return await client.from('cases').update(updates).eq('id', caseId);
}

// ==========================================
// RPC FUNCTIONS
// ==========================================

// Lab submits case → deducts payment
async function submitCaseRPC(caseId, labId) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  return await client.rpc('submit_case', { p_case_id: caseId, p_lab_id: labId });
}

// Designer starts REVIEW (status → review_in_progress, review timer begins)
async function designerStartReviewRPC(caseId, designerId) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  return await client.rpc('designer_start_review', { p_case_id: caseId, p_designer_id: designerId });
}

// Designer accepts case (skips remaining review, status → in_progress)
async function designerAcceptCaseRPC(caseId, designerId) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  return await client.rpc('designer_accept_case', { p_case_id: caseId, p_designer_id: designerId });
}

// Admin approves final work → credits designer
async function approveCaseRPC(caseId, adminId) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  return await client.rpc('approve_case', { p_case_id: caseId, p_admin_id: adminId });
}

// Lab disputes case
async function disputeCaseRPC(caseId, labId, feedback) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  return await client.rpc('dispute_case', { p_case_id: caseId, p_lab_id: labId, p_feedback: feedback });
}

// Admin resolves dispute
async function resolveDisputeRPC(caseId, adminId, resolution, notes) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  return await client.rpc('resolve_dispute', { 
    p_case_id: caseId, 
    p_admin_id: adminId, 
    p_resolution: resolution, 
    p_notes: notes || null 
  });
}

// Process expired timers
async function processExpiredReviewsRPC() {
  var client = getSupabase();
  if (!client) return [];
  var result = await client.rpc('process_expired_reviews');
  return result.data || [];
}

async function processOverdueWorkRPC() {
  var client = getSupabase();
  if (!client) return [];
  var result = await client.rpc('process_overdue_work');
  return result.data || [];
}

// ==========================================
// FILES
// ==========================================
async function getCaseFiles(caseId) {
  var client = getSupabase();
  if (!client) return [];
  
  var result = await client
    .from('case_files')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: true });
  
  if (result.error) { console.error('Error:', result.error); return []; }
  return result.data;
}

async function addCaseFile(caseId, filePath, fileName, fileSize, uploadType, uploadedBy) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  
  return await client
    .from('case_files')
    .insert({
      case_id: caseId,
      file_path: filePath,
      file_name: fileName,
      file_size: fileSize,
      file_type: fileName.split('.').pop().toLowerCase(),
      upload_type: uploadType,
      uploaded_by: uploadedBy
    });
}

// ==========================================
// FEEDBACK
// ==========================================
async function getCaseFeedback(caseId) {
  var client = getSupabase();
  if (!client) return [];
  
  var result = await client
    .from('case_feedback')
    .select('*, sender:sender_id(full_name, role)')
    .eq('case_id', caseId)
    .order('created_at', { ascending: true });
  
  if (result.error) { console.error('Error:', result.error); return []; }
  return result.data;
}

// ==========================================
// TIMERS
// ==========================================
async function getCaseTimer(caseId) {
  var client = getSupabase();
  if (!client) return null;
  
  var result = await client
    .from('case_timers')
    .select('*')
    .eq('case_id', caseId)
    .single();
  
  if (result.error) return null;
  return result.data;
}

// ==========================================
// HELPERS
// ==========================================
async function getAvailableDesigners(specialty) {
  var client = getSupabase();
  if (!client) return [];
  
  var result = await client
    .from('profiles')
    .select('*')
    .eq('role', 'designer')
    .eq('is_active', true);
  
  if (result.error) return [];
  
  if (specialty) {
    return result.data.filter(function(d) { 
      return d.specialties && d.specialties.indexOf(specialty) !== -1; 
    });
  }
  return result.data;
}

async function getPriceList() {
  var client = getSupabase();
  if (!client) return [];
  var result = await client.from('price_list').select('*').eq('is_active', true);
  return result.data || [];
}

async function getAdminSettings() {
  var client = getSupabase();
  if (!client) return null;
  var result = await client.from('admin_settings').select('*').single();
  return result.data;
}

// Old designerStartWorkRPC kept for backward compatibility
async function designerStartWorkRPC(caseId, designerId) {
  return await designerStartReviewRPC(caseId, designerId);
}

// ==========================================
// RATINGS
// ==========================================
async function submitRating(caseId, reviewerId, ratedUserId, rating, comment) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  return await client.rpc('submit_rating', {
    p_case_id: caseId,
    p_reviewer_id: reviewerId,
    p_rated_user_id: ratedUserId,
    p_rating: rating,
    p_comment: comment || null
  });
}

async function getUserProfile(userId) {
  var client = getSupabase();
  if (!client) return null;
  var result = await client.rpc('get_user_profile', { p_user_id: userId });
  if (result.error) return null;
  return result.data[0] || null;
}

async function getCaseRatings(caseId) {
  var client = getSupabase();
  if (!client) return [];
  var result = await client
    .from('ratings')
    .select('*, reviewer:reviewer_id(full_name, role), rated:rated_user_id(full_name, role)')
    .eq('case_id', caseId);
  return result.data || [];
}