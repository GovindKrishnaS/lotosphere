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
  if (!userId) return []
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id, quantity, product_id,
        products(id, name, slug, price, sale_price, image_url, stock)
      `)
      .eq('user_id', userId)

    if (error) {
      console.error('🌿 [Supabase getDbCart Error]:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })
      throw error
    }
    return (data || []).map(item => ({
      id: item.id,
      quantity: item.quantity,
      product: item.products,
    }))
  } catch (err) {
    console.warn('getDbCart query exception:', err.message)
    throw err
  }
}

export async function addToDbCart(userId, productId, quantity = 1) {
  if (!userId || !productId) throw new Error('userId and productId are required')

  try {
    // Check existing item in db cart to increment quantity
    const { data: existing, error: selectErr } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle()

    if (selectErr && selectErr.code !== 'PGRST116') {
      console.warn('cart_items select warning:', selectErr)
    }

    const finalQuantity = existing ? existing.quantity + quantity : quantity

    const { error } = await supabase
      .from('cart_items')
      .upsert(
        { user_id: userId, product_id: productId, quantity: finalQuantity, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,product_id' }
      )

    if (error) {
      console.error('🌿 [Supabase addToDbCart Error]:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        table: 'cart_items',
        userId,
        productId,
      })
      throw error
    }
  } catch (err) {
    console.error('addToDbCart failed:', {
      code: err.code || 'ERR_CART_WRITE',
      message: err.message,
      details: err.details || null,
      hint: err.hint || null,
    })
    throw err
  }
}

export async function updateDbCartItem(userId, productId, quantity) {
  if (quantity <= 0) {
    return removeFromDbCart(userId, productId)
  }
  const { error } = await supabase
    .from('cart_items')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('product_id', productId)

  if (error) {
    console.error('🌿 [Supabase updateDbCartItem Error]:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    })
    throw error
  }
}

export async function removeFromDbCart(userId, productId) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)

  if (error) {
    console.error('🌿 [Supabase removeFromDbCart Error]:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    })
    throw error
  }
}

export async function clearDbCart(userId) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)

  if (error) {
    console.error('🌿 [Supabase clearDbCart Error]:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    })
    throw error
  }
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
