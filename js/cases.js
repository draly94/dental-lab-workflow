// ==========================================
// cases.js — Case CRUD + RPC function calls
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
  var result = await client.from('cases').select('*, designer:designer_id(full_name)').eq('lab_id', labId).order('created_at', { ascending: false });
  if (result.error) { console.error('Error:', result.error); return []; }
  return result.data;
}

async function getDesignerCases(designerId) {
  var client = getSupabase();
  if (!client) return [];
  var result = await client.from('cases').select('*, lab:lab_id(full_name, company_name)').eq('designer_id', designerId).order('created_at', { ascending: false });
  if (result.error) { console.error('Error:', result.error); return []; }
  return result.data;
}

async function getAllCases() {
  var client = getSupabase();
  if (!client) return [];
  var result = await client.from('cases').select('*, lab:lab_id(full_name), designer:designer_id(full_name)').order('created_at', { ascending: false });
  if (result.error) { console.error('Error:', result.error); return []; }
  return result.data;
}

async function updateCase(caseId, updates) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  updates.updated_at = new Date().toISOString();
  return await client.from('cases').update(updates).eq('id', caseId);
}

// ==========================================
// RPC FUNCTIONS
// ==========================================
async function submitCaseRPC(caseId, labId) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  return await client.rpc('submit_case', { p_case_id: caseId, p_lab_id: labId });
}

async function designerStartReviewRPC(caseId, designerId) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  return await client.rpc('designer_start_review', { p_case_id: caseId, p_designer_id: designerId });
}

async function designerAcceptCaseRPC(caseId, designerId) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  return await client.rpc('designer_accept_case', { p_case_id: caseId, p_designer_id: designerId });
}

async function approveCaseRPC(caseId, adminId) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  return await client.rpc('approve_case', { p_case_id: caseId, p_admin_id: adminId });
}

async function disputeCaseRPC(caseId, labId, feedback) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  return await client.rpc('dispute_case', { p_case_id: caseId, p_lab_id: labId, p_feedback: feedback });
}

async function resolveDisputeRPC(caseId, adminId, resolution, notes) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  return await client.rpc('resolve_dispute', { p_case_id: caseId, p_admin_id: adminId, p_resolution: resolution, p_notes: notes || null });
}

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
  var result = await client.from('case_files').select('*').eq('case_id', caseId).order('created_at', { ascending: true });
  return result.data || [];
}

async function addCaseFile(caseId, filePath, fileName, fileSize, uploadType, uploadedBy) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  return await client.from('case_files').insert({
    case_id: caseId, file_path: filePath, file_name: fileName,
    file_size: fileSize, file_type: fileName.split('.').pop().toLowerCase(),
    upload_type: uploadType, uploaded_by: uploadedBy
  });
}

// ==========================================
// FEEDBACK
// ==========================================
async function getCaseFeedback(caseId) {
  var client = getSupabase();
  if (!client) return [];
  var result = await client.from('case_feedback').select('*, sender:sender_id(full_name, role)').eq('case_id', caseId).order('created_at', { ascending: true });
  return result.data || [];
}

// ==========================================
// TIMERS
// ==========================================
async function getCaseTimer(caseId) {
  var client = getSupabase();
  if (!client) return null;
  var result = await client.from('case_timers').select('*').eq('case_id', caseId).single();
  return result.error ? null : result.data;
}

// ==========================================
// HELPERS
// ==========================================
async function getAvailableDesigners(specialty) {
  var client = getSupabase();
  if (!client) return [];
  var result = await client.from('profiles').select('*').eq('role', 'designer').eq('is_active', true);
  if (result.error) return [];
  if (specialty) return result.data.filter(function(d) { return d.specialties && d.specialties.indexOf(specialty) !== -1; });
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

// ==========================================
// RATINGS
// ==========================================
async function submitRating(caseId, reviewerId, ratedUserId, rating, comment) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  var result = await client.rpc('submit_rating', {
    p_case_id: caseId, p_reviewer_id: reviewerId,
    p_rated_user_id: ratedUserId, p_rating: rating, p_comment: comment || null
  });
  if (result.error) return { error: result.error.message || 'Rating failed' };
  return result.data || { success: true, message: 'Rating submitted' };
}

async function getCaseRatings(caseId) {
  var client = getSupabase();
  if (!client) return [];
  var result = await client.rpc('get_case_ratings', { p_case_id: caseId });
  if (result.error) { console.error('getCaseRatings error:', result.error); return []; }
  return (result.data || []).map(function(r) {
    return {
      id: r.id, reviewer_id: r.reviewer_id, reviewer_name: r.reviewer_name,
      reviewer_role: r.reviewer_role, rated_user_id: r.rated_user_id,
      rated_user_name: r.rated_user_name, rated_user_role: r.rated_user_role,
      rating: r.rating, comment: r.comment, created_at: r.created_at
    };
  });
}

async function getUserRatings(userId, limit) {
  limit = limit || 20;
  var client = getSupabase();
  if (!client) return [];
  var result = await client.rpc('get_user_ratings', { p_user_id: userId, p_limit: limit });
  return result.data || [];
}

// FIXED: getUserProfile — no more line 212 error
async function getUserProfile(userId) {
  var client = getSupabase();
  if (!client) return null;
  
  try {
    // Try RPC first
    var rpcResult = await client.rpc('get_user_profile', { p_user_id: userId });
    if (!rpcResult.error && rpcResult.data && rpcResult.data.length > 0) {
      return rpcResult.data[0];
    }
  } catch (e) {
    console.warn('getUserProfile RPC failed, using fallback');
  }
  
  // Fallback: direct query
  try {
    var pResult = await client.from('profiles').select('*').eq('id', userId).single();
    if (pResult.error || !pResult.data) return null;
    
    var wResult = await client.from('wallets').select('balance, total_earned, total_spent').eq('user_id', userId).single();
    
    var p = pResult.data;
    var w = wResult.data || {};
    
    return {
      id: p.id, full_name: p.full_name, email: p.email, role: p.role,
      company_name: p.company_name, bio: p.bio, specialties: p.specialties,
      avg_rating: p.avg_rating || 0, total_ratings: p.total_ratings || 0,
      completed_cases: p.completed_cases || 0,
      wallet_balance: w.balance || 0, total_earned: w.total_earned || 0,
      total_spent: w.total_spent || 0, is_active: p.is_active, created_at: p.created_at
    };
  } catch (e2) {
    console.error('getUserProfile fallback error:', e2);
    return null;
  }
}

// Backward compat
async function designerStartWorkRPC(caseId, designerId) {
  return await designerStartReviewRPC(caseId, designerId);
}