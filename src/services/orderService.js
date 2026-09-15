import { supabase } from '@/lib/supabase'
import { triggerOrderNotifications } from './notificationService'

// ── Place Order (uses DB RPC for atomicity) ──────────────────

export async function placeOrder({
  customerName,
  email,
  phone,
  address,
  city,
  state,
  pincode,
  notes = '',
  items, // [{product_id, quantity}]
}) {
  const { data, error } = await supabase.rpc('place_order', {
    p_customer_name: customerName,
    p_email: email,
    p_phone: phone,
    p_address: address,
    p_city: city,
    p_state: state,
    p_pincode: pincode,
    p_notes: notes,
    p_items: items,
  })

  if (error) throw error
  if (!data.success) throw new Error(data.error || 'Order failed')

  // Trigger notifications (non-blocking)
  triggerOrderNotifications(data.order_id)

  return data // { success, order_id, total }
}

// ── Get User Orders ──────────────────────────────────────────

export async function getUserOrders(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, total_amount, status, created_at, customer_name,
      order_items(id, product_name, quantity, unit_price)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getOrderById(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(id, product_name, quantity, unit_price, product_id)
    `)
    .eq('id', orderId)
    .single()
  if (error) throw error
  return data
}

// ── Admin: All Orders ────────────────────────────────────────

export async function getAllOrders({ page = 1, pageSize = 20, status = null } = {}) {
  let query = supabase
    .from('orders')
    .select(`
      id, customer_name, email, total_amount, status, created_at,
      order_items(id)
    `, { count: 'exact' })

  if (status) query = query.eq('status', status)

  const from = (page - 1) * pageSize
  query = query.order('created_at', { ascending: false }).range(from, from + pageSize - 1)

  const { data, error, count } = await query
  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ── Admin: Revenue Stats ─────────────────────────────────────

export async function getOrderStats() {
  const { data, error } = await supabase
    .from('orders')
    .select('total_amount, status, created_at')

  if (error) throw error

  const orders = data || []
  const total = orders.reduce((sum, o) => sum + Number(o.total_amount), 0)
  const pending = orders.filter(o => o.status === 'pending').length
  const delivered = orders.filter(o => o.status === 'delivered').length

  return {
    totalOrders: orders.length,
    totalRevenue: total,
    pendingOrders: pending,
    deliveredOrders: delivered,
  }
}

// ── Notification Log (admin) ─────────────────────────────────

export async function getNotificationLog(limit = 20) {
  const { data, error } = await supabase
    .from('notification_log')
    .select(`
      *,
      orders(id, customer_name, email, total_amount)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}
