// ==========================================
// auth.js — Authentication functions
// Signup, login, logout, session management
// ==========================================

// Real Supabase signup
async function signUp(email, password, fullName, role) {
  const client = getSupabase();
  if (!client) return { error: { message: 'Supabase not connected' } };
  
  const { data, error } = await client.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        full_name: fullName,
        role: role
      }
    }
  });
  
  return { data, error };
}

// Real Supabase login
async function signIn(email, password) {
  const client = getSupabase();
  if (!client) return { error: { message: 'Supabase not connected' } };
  
  const { data, error } = await client.auth.signInWithPassword({
    email: email,
    password: password
  });
  
  return { data, error };
}

// Logout
async function signOut() {
  const client = getSupabase();
  if (!client) return;
  
  await client.auth.signOut();
  window.location.href = 'index.html';
}

// Get current user (returns null if not logged in)
async function getCurrentUser() {
  const client = getSupabase();
  if (!client) return null;
  
  const { data: { user } } = await client.auth.getUser();
  return user;
}

// Get current session
async function getSession() {
  const client = getSupabase();
  if (!client) return null;
  
  const { data: { session } } = await client.auth.getSession();
  return session;
}

// Get user role from metadata
function getUserRole(user) {
  if (!user) return null;
  return user.user_metadata?.role || null;
}

// Get user full name from metadata
function getUserFullName(user) {
  if (!user) return null;
  return user.user_metadata?.full_name || user.email || 'User';
}

// Redirect based on role
function redirectByRole(role) {
  switch (role) {
    case 'admin':
      window.location.href = 'admin.html';
      break;
    case 'designer':
      window.location.href = 'designer-dashboard.html';
      break;
    case 'lab':
    default:
      window.location.href = 'dashboard.html';
      break;
  }
}

// Check if user is authenticated, redirect to login if not
async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    // Not logged in — go to login page
    window.location.href = 'index.html';
    return null;
  }
  
  return user;
}

// Check if user has the required role, redirect if not
async function requireRole(allowedRoles) {
  const user = await requireAuth();
  if (!user) return null;
  
  const role = getUserRole(user);
  
  if (!allowedRoles.includes(role)) {
    // Wrong role — redirect to their correct dashboard
    redirectByRole(role);
    return null;
  }
  
  return user;
}

// Update navbar with user info
async function updateNavbar() {
  const user = await getCurrentUser();
  if (!user) return;
  
  // Update all username displays on the page
  const nameElements = document.querySelectorAll('.user-name');
  const userName = getUserFullName(user);
  
  nameElements.forEach(el => {
    el.textContent = userName;
  });
}