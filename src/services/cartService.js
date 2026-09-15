import { supabase } from '@/lib/supabase'

// Cart stored in DB for logged-in users, localStorage for guests

const CART_KEY = 'lotosphere_cart'

// ── Guest (localStorage) helpers ─────────────────────────────

export function getGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveGuestCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function clearGuestCart() {
  localStorage.removeItem(CART_KEY)
}

// ── Authenticated cart (Supabase) ────────────────────────────

export async function getDbCart(userId) {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id, quantity, product_id,
      products(id, name, slug, price, sale_price, image_url, stock)
    `)
    .eq('user_id', userId)
  if (error) throw error
  return (data || []).map(item => ({
    id: item.id,
    quantity: item.quantity,
    product: item.products,
  }))
}

export async function addToDbCart(userId, productId, quantity = 1) {
  const { error } = await supabase
    .from('cart_items')
    .upsert(
      { user_id: userId, product_id: productId, quantity },
      { onConflict: 'user_id,product_id', ignoreDuplicates: false }
    )
  if (error) throw error
}

export async function updateDbCartItem(userId, productId, quantity) {
  if (quantity <= 0) {
    return removeFromDbCart(userId, productId)
  }
  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('user_id', userId)
    .eq('product_id', productId)
  if (error) throw error
}

export async function removeFromDbCart(userId, productId) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)
  if (error) throw error
}

export async function clearDbCart(userId) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
  if (error) throw error
}

// ── Merge guest cart into DB on login ───────────────────────

export async function mergeGuestCartToDb(userId) {
  const guestItems = getGuestCart()
  if (!guestItems.length) return

  for (const item of guestItems) {
    try {
      await addToDbCart(userId, item.product.id, item.quantity)
    } catch {
      // Ignore individual merge failures
    }
  }
  clearGuestCart()
}
