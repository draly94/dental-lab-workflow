// ==========================================
// router.js — Page protection & routing
// Include on every protected page
// ==========================================

// Check auth and role on page load
// Call this at the top of every protected page
async function guardPage(allowedRoles) {
  const client = getSupabase();
  
  if (!client) {
    console.error('❌ Supabase not initialized, redirecting to login');
    window.location.href = 'index.html';
    return null;
  }
  
  // Check if user is logged in
  const { data: { user } } = await client.auth.getUser();
  
  if (!user) {
    console.log('🔒 No user found, redirecting to login');
    window.location.href = 'index.html';
    return null;
  }
  
  // Get role from metadata
  const role = user.user_metadata?.role;
  
  if (!role) {
    console.error('⚠️ User has no role in metadata');
    // Log them out and send to login
    await client.auth.signOut();
    window.location.href = 'index.html';
    return null;
  }
  
  // Check if user's role is allowed on this page
  if (allowedRoles && !allowedRoles.includes(role)) {
    console.log(`🚫 Role "${role}" not allowed here. Redirecting...`);
    redirectByRole(role);
    return null;
  }
  
  console.log(`✅ Access granted: ${user.email} (${role})`);
  
  // Update navbar with user's name
  const nameElements = document.querySelectorAll('.user-name');
  const userName = user.user_metadata?.full_name || user.email || 'User';
  nameElements.forEach(el => {
    el.textContent = userName;
  });
  
  return user;
}

// Setup logout button
function setupLogout() {
  const logoutBtn = document.querySelector('.btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const client = getSupabase();
      if (client) {
        // Sign out from Supabase (clears session + tokens)
        await client.auth.signOut();
        
        // Clear any remaining Supabase items from local storage
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('supabase') || key.startsWith('sb-')) {
            localStorage.removeItem(key);
          }
        });
        
        console.log('✅ Logged out, all tokens cleared');
      }
      // Redirect to login
      window.location.href = 'index.html';
    });
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  setupLogout();
});