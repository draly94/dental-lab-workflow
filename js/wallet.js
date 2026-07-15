// ==========================================
// wallet.js — Wallet operations
// ==========================================

// Get wallet balance
async function getWalletBalance(userId) {
  var client = getSupabase();
  if (!client) return 0;
  
  var result = await client.from('wallets').select('balance, total_earned, total_spent').eq('user_id', userId).single();
  if (result.error) { console.error('Wallet error:', result.error); return 0; }
  return result.data;
}

// Top up wallet
async function topUpWallet(userId, amount) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  
  return await client.rpc('top_up_wallet', { p_user_id: userId, p_amount: amount });
}

// Get transaction history
async function getTransactions(userId, limit) {
  limit = limit || 50;
  var client = getSupabase();
  if (!client) return [];
  
  var result = await client
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return result.data || [];
}

// Request withdrawal
async function requestWithdrawal(designerId, amount) {
  var client = getSupabase();
  if (!client) return { error: { message: 'Not connected' } };
  
  return await client.from('withdrawal_requests').insert({
    designer_id: designerId,
    amount: amount,
    status: 'pending'
  });
}

// Get withdrawal history
async function getWithdrawalHistory(designerId) {
  var client = getSupabase();
  if (!client) return [];
  
  var result = await client
    .from('withdrawal_requests')
    .select('*')
    .eq('designer_id', designerId)
    .order('created_at', { ascending: false });
  
  return result.data || [];
}