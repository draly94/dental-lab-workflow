// ==========================================
// notifications.js — Notification system
// ==========================================

// Get unread count
async function getUnreadCount(userId) {
  var client = getSupabase();
  if (!client) return 0;
  
  var result = await client
    .from('notifications')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('is_read', false);
  
  return result.count || 0;
}

// Get notifications
async function getNotifications(userId, limit) {
  limit = limit || 50;
  var client = getSupabase();
  if (!client) return [];
  
  var result = await client
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return result.data || [];
}

// Mark as read
async function markNotificationRead(notificationId) {
  var client = getSupabase();
  if (!client) return;
  
  await client
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);
}

// Mark all as read
async function markAllNotificationsRead(userId) {
  var client = getSupabase();
  if (!client) return;
  
  await client
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);
}

// Update bell badge on all pages
async function updateNotificationBadge() {
  var user = await getCurrentUser();
  if (!user) return;
  
  var count = await getUnreadCount(user.id);
  
  // Update all bell dots on the page
  document.querySelectorAll('.badge-dot').forEach(function(dot) {
    if (count > 0) {
      dot.classList.add('has-unread');
    } else {
      dot.classList.remove('has-unread');
    }
  });
  
  // Update count if there's a count element
  var countEls = document.querySelectorAll('.notification-count');
  countEls.forEach(function(el) {
    el.textContent = count > 99 ? '99+' : count;
    if (count === 0) {
      el.style.display = 'none';
    } else {
      el.style.display = 'inline';
    }
  });
  
  return count;
}

// Subscribe to real-time notifications
function subscribeToNotifications(userId, callback) {
  var client = getSupabase();
  if (!client) return;
  
  client
    .channel('notifications-' + userId)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: 'user_id=eq.' + userId
    }, function(payload) {
      console.log('🔔 New notification:', payload.new);
      if (callback) callback(payload.new);
      updateNotificationBadge();
    })
    .subscribe();
}