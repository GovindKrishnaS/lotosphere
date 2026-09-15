/**
 * Notification Service
 * 
 * This service abstracts notification delivery so the provider
 * (email, SMS, webhook) can be swapped without changing order logic.
 * 
 * In production: Wire this to your Supabase Edge Function or webhook.
 * In development: Events are logged to console and the admin notification feed.
 */

import { supabase } from '@/lib/supabase'

/**
 * Trigger order notifications (customer confirmation + admin alert).
 * Reads pending notifications from notification_log and dispatches them.
 * 
 * @param {string} orderId - UUID of the newly created order
 */
export async function triggerOrderNotifications(orderId) {
  try {
    // In development, just log the event clearly
    console.log('📧 Notification event: order_confirmed + new_order_admin for order', orderId)

    // Attempt to call the Edge Function if it's deployed
    // This gracefully fails in development without breaking order flow
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      // Fire-and-forget — don't block the order confirmation page
      fetchNotificationLogs(orderId).then(logs => {
        logs.forEach(log => {
          callEdgeFunction(log.id).catch(err => {
            console.warn('Edge function not available (expected in dev):', err.message)
          })
        })
      }).catch(() => {
        // Silently ignore — notification delivery is best-effort
      })
    }
  } catch (error) {
    // Never let notification failure block the order
    console.warn('Notification trigger failed (non-blocking):', error)
  }
}

async function fetchNotificationLogs(orderId) {
  const { data } = await supabase
    .from('notification_log')
    .select('id, type, recipient, status')
    .eq('order_id', orderId)
    .eq('status', 'pending')
  return data || []
}

async function callEdgeFunction(notificationId) {
  const { data, error } = await supabase.functions.invoke('notify-order', {
    body: { notification_id: notificationId },
  })
  if (error) throw error
  return data
}

/**
 * Mark a notification as sent (called by admin when acknowledging)
 */
export async function markNotificationSent(notificationId) {
  return supabase
    .from('notification_log')
    .update({ status: 'sent' })
    .eq('id', notificationId)
}
