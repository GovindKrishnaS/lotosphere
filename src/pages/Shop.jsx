import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, SlidersHorizontal, ArrowUpDown, RefreshCw, AlertCircle } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeletons'
import { getProducts, getCategories } from '@/services/productService'
import { staggerContainer } from '@/animations/variants'

// Fallback seed products if database is unreachable or empty during setup
const MOCK_FALLBACK_PRODUCTS = [
  {
    id: 'mock-1',
    name: 'Monstera Deliciosa',
    slug: 'monstera-deliciosa',
    price: 1499,
    sale_price: 1299,
    stock: 12,
    featured: true,
    care_level: 'Easy',
    light_requirement: 'Bright Indirect',
    water_requirement: 'Moderate',
    pet_friendly: false,
    air_purifying: true,
    image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80',
    categories: { name: 'Indoor Plants', slug: 'indoor-plants' }
  },
  {
    id: 'mock-2',
    name: 'Fiddle Leaf Fig',
    slug: 'fiddle-leaf-fig',
    price: 2499,
    sale_price: null,
    stock: 5,
    featured: true,
    care_level: 'Moderate',
    light_requirement: 'Bright Indirect',
    water_requirement: 'Moderate',
    pet_friendly: false,
    air_purifying: true,
    image_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80',
    categories: { name: 'Indoor Plants', slug: 'indoor-plants' }
  },
  {
    id: 'mock-3',
    name: 'Snake Plant Laurentii',
    slug: 'snake-plant-laurentii',
    price: 899,
    sale_price: 749,
    stock: 20,
    featured: false,
    care_level: 'Easy',
    light_requirement: 'Low',
    water_requirement: 'Low',
    pet_friendly: false,
    air_purifying: true,
    image_url: 'https://images.unsplash.com/photo-1599598425947-020645558055?w=800&q=80',
    categories: { name: 'Succulents & Cacti', slug: 'succulents-cacti' }
  },
  {
    id: 'mock-4',
    name: 'Calathea Orbifolia',
    slug: 'calathea-orbifolia',
    price: 1299,
    sale_price: null,
    stock: 8,
    featured: true,
    care_level: 'Expert',
    light_requirement: 'Medium',
    water_requirement: 'High',
    pet_friendly: true,
    air_purifying: true,
    image_url: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&q=80',
    categories: { name: 'Pet Friendly', slug: 'pet-friendly' }
  },
  {
    id: 'mock-5',
    name: 'Peace Lily Sensational',
    slug: 'peace-lily-sensational',
    price: 999,
    sale_price: null,
    stock: 15,
    featured: false,
    care_level: 'Easy',
    light_requirement: 'Low',
    water_requirement: 'Moderate',
    pet_friendly: false,
    air_purifying: true,
    image_url: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?w=800&q=80',
    categories: { name: 'Air Purifiers', slug: 'air-purifiers' }
  },
  {
    id: 'mock-6',
    name: 'Pothos Golden',
    slug: 'pothos-golden',
    price: 599,
    sale_price: null,
    stock: 25,
    featured: false,
    care_level: 'Easy',
    light_requirement: 'Low',
    water_requirement: 'Low',
    pet_friendly: false,
    air_purifying: true,
    image_url: 'https://images.unsplash.com/photo-1597055181300-e3633a207518?w=800&q=80',
    categories: { name: 'Indoor Plants', slug: 'indoor-plants' }
  }
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Query state derived from searchParams
  const search = searchParams.get('search') || ''
  const selectedCategory = searchParams.get('category') || ''
  const selectedCare = searchParams.get('care') || ''
  const sort = searchParams.get('sort') || 'created_at'
  const order = searchParams.get('order') || 'desc'
  const featuredOnly = searchParams.get('featured') === 'true'
  const inStockOnly = searchParams.get('instock') === 'true'
  const maxPrice = Number(searchParams.get('maxPrice') || 5000)

  // Fetch Categories
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {
        setCategories([
          { id: '1', name: 'Indoor Plants', slug: 'indoor-plants' },
          { id: '2', name: 'Succulents & Cacti', slug: 'succulents-cacti' },
          { id: '3', name: 'Pet Friendly', slug: 'pet-friendly' },
          { id: '4', name: 'Air Purifiers', slug: 'air-purifiers' }
        ])
      })
  }, [])

  // Fetch Products
  useEffect(() => {
    setLoading(true)
    getProducts({
      search,
      category: selectedCategory || null,
      careLevel: selectedCare || null,
      featured: featuredOnly ? true : null,
      sort,
      order,
    })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setProducts(data)
          setUsingFallback(false)
        } else if (!search && !selectedCategory && !selectedCare) {
          // If DB returned empty list without filters, fallback to mock data
          setProducts(MOCK_FALLBACK_PRODUCTS)
          setUsingFallback(true)
        } else {
          setProducts([])
          setUsingFallback(false)
        }
      })
      .catch((err) => {
        console.warn('Database offline or credentials missing, using fallback dataset:', err)
        setProducts(MOCK_FALLBACK_PRODUCTS)
        setUsingFallback(true)
      })
      .finally(() => setLoading(false))
  }, [search, selectedCategory, selectedCare, featuredOnly, sort, order])

  // Local client-side filtering for fine-grained maxPrice and inStock toggles
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const price = p.sale_price ?? p.price
      if (price > maxPrice) return false
      if (inStockOnly && p.stock === 0) return false
      return true
    })
  }, [products, maxPrice, inStockOnly])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    setSearchParams(next)
  }

  const resetFilters = () => {
    setSearchParams({})
  }

  return (
    <div className="section-padding" style={{ background: 'var(--color-cream)' }}>
      <div className="container">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-label text-sage block mb-3">Botanical Collection</span>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-forest leading-tight mb-4">
            Explore All Plants
          </h1>
          <p className="text-charcoal-light text-base">
            Hand-curated green companions cultivated for indoor wellness and aesthetic perfection.
          </p>
        </div>

        {usingFallback && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-amber-600 flex-shrink-0" />
              <span>Viewing offline demonstration catalogue. Configure Supabase keys to connect live backend.</span>
            </div>
          </div>
        )}

        {/* Top Controls Bar */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md border border-border/50 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => updateParam('search', e.target.value)}
              placeholder="Search plants by name..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-cream/20 text-sm text-charcoal outline-none focus:ring-2 ring-forest"
            />
            {search && (
              <button
                onClick={() => updateParam('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 py-2.5 px-4 rounded-xl border border-border text-sm font-medium text-forest"
            >
              <Filter size={16} /> Filters
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={16} className="text-muted hidden sm:block" />
              <select
                value={`${sort}-${order}`}
                onChange={(e) => {
                  const [s, o] = e.target.value.split('-')
                  const next = new URLSearchParams(searchParams)
                  next.set('sort', s)
                  next.set('order', o)
                  setSearchParams(next)
                }}
                className="py-2.5 px-4 rounded-xl border border-border bg-cream/20 text-sm font-medium text-charcoal outline-none focus:ring-2 ring-forest"
              >
                <option value="created_at-desc">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical: A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid & Filters Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block space-y-6 bg-white p-6 rounded-2xl border border-border/50 shadow-sm h-fit">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="font-serif font-bold text-forest text-lg flex items-center gap-2">
                <SlidersHorizontal size={18} /> Filters
              </h3>
              {(selectedCategory || selectedCare || search || featuredOnly || inStockOnly) && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-terracotta hover:underline font-medium flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-3">Categories</h4>
              <div className="space-y-2">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${
                    !selectedCategory ? 'bg-forest text-cream font-medium' : 'text-charcoal-light hover:bg-cream'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateParam('category', cat.slug)}
                    className={`w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${
                      selectedCategory === cat.slug ? 'bg-forest text-cream font-medium' : 'text-charcoal-light hover:bg-cream'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Care Level Filter */}
            <div className="pt-4 border-t border-border">
              <h4 className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-3">Care Level</h4>
              <div className="space-y-1.5">
                {['Easy', 'Moderate', 'Expert'].map((care) => (
                  <button
                    key={care}
                    onClick={() => updateParam('care', selectedCare === care ? '' : care)}
                    className={`w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${
                      selectedCare === care ? 'bg-forest text-cream font-medium' : 'text-charcoal-light hover:bg-cream'
                    }`}
                  >
                    {care} Care
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-charcoal uppercase tracking-wider">Max Price</h4>
                <span className="text-xs font-bold text-forest">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="250"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="w-full accent-forest cursor-pointer"
              />
            </div>

            {/* Toggles */}
            <div className="pt-4 border-t border-border space-y-3">
              <label className="flex items-center gap-3 cursor-pointer text-sm text-charcoal">
                <input
                  type="checkbox"
                  checked={featuredOnly}
                  onChange={(e) => updateParam('featured', e.target.checked ? 'true' : '')}
                  className="w-4 h-4 accent-forest rounded"
                />
                <span>Featured Plants Only</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-sm text-charcoal">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => updateParam('instock', e.target.checked ? 'true' : '')}
                  className="w-4 h-4 accent-forest rounded"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-border/50 shadow-sm">
                <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4 text-muted">
                  <Search size={28} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-forest mb-2">No plants found</h3>
                <p className="text-muted text-sm mb-6 max-w-sm mx-auto">
                  We couldn't find any plants matching your current filter criteria. Try expanding your search.
                </p>
                <button onClick={resetFilters} className="btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 md:hidden"
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 bg-white shadow-2xl md:hidden flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-white">
                <h3 className="font-serif font-bold text-forest text-lg flex items-center gap-2">
                  <SlidersHorizontal size={18} /> Filters
                </h3>
                <button onClick={() => setMobileFilterOpen(false)} className="btn-ghost p-2 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 p-5 space-y-6">
                {(selectedCategory || selectedCare || search || featuredOnly || inStockOnly) && (
                  <button
                    onClick={() => { resetFilters(); setMobileFilterOpen(false) }}
                    className="w-full text-sm text-terracotta border border-terracotta/30 rounded-xl py-2 hover:bg-terracotta/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} /> Reset All Filters
                  </button>
                )}

                <div>
                  <h4 className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-3">Categories</h4>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => { updateParam('category', ''); setMobileFilterOpen(false) }}
                      className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                        !selectedCategory ? 'bg-forest text-cream font-medium' : 'text-charcoal-light hover:bg-cream'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { updateParam('category', cat.slug); setMobileFilterOpen(false) }}
                        className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                          selectedCategory === cat.slug ? 'bg-forest text-cream font-medium' : 'text-charcoal-light hover:bg-cream'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-3">Care Level</h4>
                  <div className="space-y-1.5">
                    {['Easy', 'Moderate', 'Expert'].map((care) => (
                      <button
                        key={care}
                        onClick={() => { updateParam('care', selectedCare === care ? '' : care); setMobileFilterOpen(false) }}
                        className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                          selectedCare === care ? 'bg-forest text-cream font-medium' : 'text-charcoal-light hover:bg-cream'
                        }`}
                      >
                        {care} Care
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-charcoal uppercase tracking-wider">Max Price</h4>
                    <span className="text-xs font-bold text-forest">₹{maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="250"
                    value={maxPrice}
                    onChange={(e) => updateParam('maxPrice', e.target.value)}
                    className="w-full accent-forest cursor-pointer"
                  />
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer text-sm text-charcoal">
                    <input
                      type="checkbox"
                      checked={featuredOnly}
                      onChange={(e) => updateParam('featured', e.target.checked ? 'true' : '')}
                      className="w-4 h-4 accent-forest rounded"
                    />
                    <span>Featured Plants Only</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer text-sm text-charcoal">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => updateParam('instock', e.target.checked ? 'true' : '')}
                      className="w-4 h-4 accent-forest rounded"
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
