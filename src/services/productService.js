import { supabase } from '@/lib/supabase'

// ── Products ────────────────────────────────────────────────

export async function getProducts({
  page = 1,
  pageSize = 12,
  category = null,
  search = '',
  sort = 'created_at',
  order = 'desc',
  featured = null,
  careLevel = null,
  petFriendly = null,
  airPurifying = null,
} = {}) {
  let query = supabase
    .from('products')
    .select('*, categories(id, name, slug)', { count: 'exact' })

  if (category) query = query.eq('categories.slug', category)
  if (featured !== null) query = query.eq('featured', featured)
  if (careLevel) query = query.eq('care_level', careLevel)
  if (petFriendly !== null) query = query.eq('pet_friendly', petFriendly)
  if (airPurifying !== null) query = query.eq('air_purifying', airPurifying)

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  query = query.order(sort, { ascending: order === 'asc' }).range(from, to)

  const { data, error, count } = await query
  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

export async function getFeaturedProducts(limit = 6) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .eq('featured', true)
    .gt('stock', 0)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

// ── Admin: Product CRUD ──────────────────────────────────────

export async function createProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

// ── Categories ───────────────────────────────────────────────

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  if (error) throw error
  return data || []
}

export async function createCategory(category) {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single()
  if (error) throw error
  return data
}

// ── Admin: Low Stock ─────────────────────────────────────────

export async function getLowStockProducts(threshold = 10) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, stock, image_url')
    .lte('stock', threshold)
    .order('stock')
  if (error) throw error
  return data || []
}
