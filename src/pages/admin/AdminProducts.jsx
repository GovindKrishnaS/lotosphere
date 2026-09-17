import { useState, useEffect } from 'react'
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '@/services/productService'
import { formatCurrency, slugify } from '@/utils'
import { Plus, Edit2, Trash2, X, Check, Search, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Spinner } from '@/components/ui/Skeletons'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formErrors, setFormErrors] = useState({})

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    sale_price: '',
    stock: '',
    category_id: '',
    description: '',
    image_url: '',
    additional_images_text: '',
    featured: false,
    care_level: 'Easy',
    light_requirement: 'Bright Indirect',
    water_requirement: 'Moderate',
    pet_friendly: false,
    air_purifying: false,
  })

  const loadData = () => {
    setLoading(true)
    Promise.all([getProducts({ pageSize: 100 }), getCategories()])
      .then(([{ data }, catData]) => {
        setProducts(data || [])
        setCategories(catData || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenCreate = () => {
    setEditingId(null)
    setFormErrors({})
    setFormData({
      name: '',
      slug: '',
      price: '',
      sale_price: '',
      stock: '10',
      category_id: categories[0]?.id || '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80',
      additional_images_text: '',
      featured: false,
      care_level: 'Easy',
      light_requirement: 'Bright Indirect',
      water_requirement: 'Moderate',
      pet_friendly: false,
      air_purifying: false,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (product) => {
    setEditingId(product.id)
    setFormErrors({})
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      price: product.price !== undefined ? String(product.price) : '',
      sale_price: product.sale_price !== null && product.sale_price !== undefined ? String(product.sale_price) : '',
      stock: product.stock !== undefined ? String(product.stock) : '0',
      category_id: product.category_id || '',
      description: product.description || '',
      image_url: product.image_url || '',
      additional_images_text: Array.isArray(product.additional_images) ? product.additional_images.join('\n') : '',
      featured: Boolean(product.featured),
      care_level: product.care_level || 'Easy',
      light_requirement: product.light_requirement || 'Bright Indirect',
      water_requirement: product.water_requirement || 'Moderate',
      pet_friendly: Boolean(product.pet_friendly),
      air_purifying: Boolean(product.air_purifying),
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return
    try {
      await deleteProduct(id)
      toast.success('Product deleted')
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      toast.error('Failed to delete product')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = {}
    if (!formData.name.trim()) errors.name = 'Plant Name is required.'
    if (!formData.category_id) errors.category_id = 'Please select a category.'
    if (formData.price === '' || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      errors.price = 'Regular Price (₹) is required and must be 0 or greater.'
    }
    if (formData.sale_price !== '' && (isNaN(Number(formData.sale_price)) || Number(formData.sale_price) < 0)) {
      errors.sale_price = 'Sale Price cannot be negative.'
    }
    if (formData.sale_price !== '' && Number(formData.sale_price) >= Number(formData.price)) {
      errors.sale_price = 'Sale Price must be lower than Regular Price.'
    }
    if (formData.stock === '' || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      errors.stock = 'Stock Quantity is required and must be 0 or greater.'
    }
    if (!formData.image_url.trim()) errors.image_url = 'Main Plant Image URL is required.'

    setFormErrors(errors)
    if (Object.keys(errors).length > 0) {
      toast.error('Please resolve highlighted form errors.')
      return
    }

    const additionalImages = formData.additional_images_text
      ? formData.additional_images_text.split(/[\n,]/).map((s) => s.trim()).filter(Boolean)
      : []

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug || slugify(formData.name),
      price: Number(formData.price),
      sale_price: formData.sale_price !== '' ? Number(formData.sale_price) : null,
      stock: Number(formData.stock),
      category_id: formData.category_id || null,
      description: formData.description.trim(),
      image_url: formData.image_url.trim(),
      additional_images: additionalImages,
      featured: Boolean(formData.featured),
      care_level: formData.care_level,
      light_requirement: formData.light_requirement,
      water_requirement: formData.water_requirement,
      pet_friendly: Boolean(formData.pet_friendly),
      air_purifying: Boolean(formData.air_purifying),
    }

    try {
      if (editingId) {
        await updateProduct(editingId, payload)
        toast.success('Plant updated successfully!')
      } else {
        await createProduct(payload)
        toast.success('Plant added successfully!')
      }
      setIsModalOpen(false)
      loadData()
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Operation failed')
    }
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="section-padding" style={{ background: 'var(--color-cream)' }}>
      <div className="container">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest mb-6">
          <ArrowLeft size={16} /> Back to Overview
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-forest">Product Management</h1>
            <p className="text-sm text-muted">Add, edit, or delete items in the botanical catalogue.</p>
          </div>

          <button onClick={handleOpenCreate} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add New Plant
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-border mb-6 flex items-center gap-3">
          <Search size={18} className="text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog by product name..."
            className="w-full text-sm outline-none text-charcoal"
          />
        </div>

        {/* Product Table */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-charcoal">
                <thead className="bg-cream/40 text-xs font-semibold text-charcoal-light uppercase border-b border-border">
                  <tr>
                    <th className="p-4">Plant</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-cream/20 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-border bg-cream-dark" />
                        <div>
                          <p className="font-bold text-forest">{p.name}</p>
                          <p className="text-xs text-muted font-mono">{p.slug}</p>
                        </div>
                      </td>
                      <td className="p-4 text-muted">{p.categories?.name || 'Unassigned'}</td>
                      <td className="p-4 font-semibold">
                        {formatCurrency(p.sale_price ?? p.price)}
                        {p.sale_price && <span className="text-xs text-muted line-through ml-1.5">{formatCurrency(p.price)}</span>}
                      </td>
                      <td className="p-4">
                        <span className={`badge ${p.stock <= 5 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        {p.featured ? <span className="badge badge-forest text-[10px]">Yes</span> : <span className="text-muted">No</span>}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenEdit(p)} className="p-2 rounded-lg hover:bg-cream text-forest">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(p.id, p.name)} className="p-2 rounded-lg hover:bg-red-50 text-rose-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-border space-y-8 animate-fadeIn">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <span className="text-xs font-semibold text-sage uppercase tracking-wider block mb-1">
                    Botanical Catalogue Management
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                    {editingId ? 'Edit Plant Details' : 'Add New Plant'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2.5 rounded-full hover:bg-cream text-charcoal-light hover:text-forest transition-colors"
                  title="Close Modal"
                >
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                {/* SECTION 1: BASIC INFORMATION */}
                <div className="p-6 rounded-2xl bg-cream/30 border border-border/70 space-y-5">
                  <div className="border-b border-border/60 pb-3">
                    <h4 className="font-serif text-lg font-bold text-forest">Basic Information</h4>
                    <p className="text-xs text-muted">Primary name, category, and overview of the plant.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Plant Name */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                        Plant Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value })
                          if (formErrors.name) setFormErrors({ ...formErrors, name: null })
                        }}
                        placeholder="e.g. Monstera Deliciosa"
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-charcoal text-sm outline-none transition-all focus:ring-2 ring-forest ${
                          formErrors.name ? 'border-red-500 bg-red-50/20' : 'border-border'
                        }`}
                      />
                      <p className="text-[11px] text-muted mt-1">The primary plant name shown to customers.</p>
                      {formErrors.name && (
                        <p className="text-xs text-red-600 font-medium mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category_id}
                        onChange={(e) => {
                          setFormData({ ...formData, category_id: e.target.value })
                          if (formErrors.category_id) setFormErrors({ ...formErrors, category_id: null })
                        }}
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-charcoal text-sm outline-none transition-all focus:ring-2 ring-forest ${
                          formErrors.category_id ? 'border-red-500 bg-red-50/20' : 'border-border'
                        }`}
                      >
                        <option value="">Select a category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-muted mt-1">Groups this plant under shop filters.</p>
                      {formErrors.category_id && (
                        <p className="text-xs text-red-600 font-medium mt-1">{formErrors.category_id}</p>
                      )}
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                      Short Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      placeholder="Briefly describe this plant..."
                      className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm outline-none transition-all focus:ring-2 ring-forest resize-none"
                    />
                    <p className="text-[11px] text-muted mt-1">Summary of leaf aesthetics, origins, and plant charm.</p>
                  </div>
                </div>

                {/* SECTION 2: PRICING & STOCK */}
                <div className="p-6 rounded-2xl bg-cream/30 border border-border/70 space-y-5">
                  <div className="border-b border-border/60 pb-3">
                    <h4 className="font-serif text-lg font-bold text-forest">Pricing & Stock</h4>
                    <p className="text-xs text-muted">Set retail price, sale discount, and available quantity.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Regular Price */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                        Regular Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => {
                          setFormData({ ...formData, price: e.target.value })
                          if (formErrors.price) setFormErrors({ ...formErrors, price: null })
                        }}
                        placeholder="e.g. 799"
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-charcoal text-sm outline-none transition-all focus:ring-2 ring-forest ${
                          formErrors.price ? 'border-red-500 bg-red-50/20' : 'border-border'
                        }`}
                      />
                      <p className="text-[11px] text-muted mt-1">Base price in INR.</p>
                      {formErrors.price && (
                        <p className="text-xs text-red-600 font-medium mt-1">{formErrors.price}</p>
                      )}
                    </div>

                    {/* Sale Price */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                        Sale Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.sale_price}
                        onChange={(e) => {
                          setFormData({ ...formData, sale_price: e.target.value })
                          if (formErrors.sale_price) setFormErrors({ ...formErrors, sale_price: null })
                        }}
                        placeholder="Optional"
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-charcoal text-sm outline-none transition-all focus:ring-2 ring-forest ${
                          formErrors.sale_price ? 'border-red-500 bg-red-50/20' : 'border-border'
                        }`}
                      />
                      <p className="text-[11px] text-muted mt-1">Discounted price if on offer.</p>
                      {formErrors.sale_price && (
                        <p className="text-xs text-red-600 font-medium mt-1">{formErrors.sale_price}</p>
                      )}
                    </div>

                    {/* Stock Quantity */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                        Stock Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => {
                          setFormData({ ...formData, stock: e.target.value })
                          if (formErrors.stock) setFormErrors({ ...formErrors, stock: null })
                        }}
                        placeholder="e.g. 25"
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-charcoal text-sm outline-none transition-all focus:ring-2 ring-forest ${
                          formErrors.stock ? 'border-red-500 bg-red-50/20' : 'border-border'
                        }`}
                      />
                      <p className="text-[11px] text-muted mt-1">Units available in nursery.</p>
                      {formErrors.stock && (
                        <p className="text-xs text-red-600 font-medium mt-1">{formErrors.stock}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION 3: PLANT SPECIFICATIONS */}
                <div className="p-6 rounded-2xl bg-cream/30 border border-border/70 space-y-5">
                  <div className="border-b border-border/60 pb-3">
                    <h4 className="font-serif text-lg font-bold text-forest">Plant Specifications</h4>
                    <p className="text-xs text-muted">Care requirements, lighting conditions, and botanical features.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Care Level */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                        Care Level
                      </label>
                      <select
                        value={formData.care_level}
                        onChange={(e) => setFormData({ ...formData, care_level: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm outline-none focus:ring-2 ring-forest"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Expert">Expert</option>
                      </select>
                      <p className="text-[11px] text-muted mt-1">Maintenance experience level required.</p>
                    </div>

                    {/* Light Requirement */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                        Light Requirement
                      </label>
                      <select
                        value={formData.light_requirement}
                        onChange={(e) => setFormData({ ...formData, light_requirement: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm outline-none focus:ring-2 ring-forest"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="Bright Indirect">Bright Indirect</option>
                        <option value="Full Sun">Full Sun</option>
                      </select>
                      <p className="text-[11px] text-muted mt-1">Sunlight needs for growth.</p>
                    </div>

                    {/* Water Requirement */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                        Water Requirement
                      </label>
                      <select
                        value={formData.water_requirement}
                        onChange={(e) => setFormData({ ...formData, water_requirement: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm outline-none focus:ring-2 ring-forest"
                      >
                        <option value="Low">Low</option>
                        <option value="Moderate">Moderate</option>
                        <option value="High">High</option>
                      </select>
                      <p className="text-[11px] text-muted mt-1">Frequency of watering.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    {/* Pet Friendly */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                        Pet Friendly
                      </label>
                      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-border">
                        <select
                          value={formData.pet_friendly ? 'Yes' : 'No'}
                          onChange={(e) => setFormData({ ...formData, pet_friendly: e.target.value === 'Yes' })}
                          className="w-full text-sm font-semibold bg-transparent text-charcoal outline-none cursor-pointer"
                        >
                          <option value="No">No (Non-pet safe)</option>
                          <option value="Yes">Yes (Safe for cats & dogs)</option>
                        </select>
                      </div>
                      <p className="text-[11px] text-muted mt-1">Indicates if non-toxic to household pets.</p>
                    </div>

                    {/* Air Purifying */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                        Air Purifying
                      </label>
                      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-border">
                        <select
                          value={formData.air_purifying ? 'Yes' : 'No'}
                          onChange={(e) => setFormData({ ...formData, air_purifying: e.target.value === 'Yes' })}
                          className="w-full text-sm font-semibold bg-transparent text-charcoal outline-none cursor-pointer"
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes (Filters airborne toxins)</option>
                        </select>
                      </div>
                      <p className="text-[11px] text-muted mt-1">Indicates active air purification features.</p>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: IMAGES */}
                <div className="p-6 rounded-2xl bg-cream/30 border border-border/70 space-y-5">
                  <div className="border-b border-border/60 pb-3">
                    <h4 className="font-serif text-lg font-bold text-forest">Images</h4>
                    <p className="text-xs text-muted">Primary display photo and optional secondary gallery photos.</p>
                  </div>

                  <div>
                    {/* Main Plant Image URL */}
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                      Main Plant Image URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => {
                        setFormData({ ...formData, image_url: e.target.value })
                        if (formErrors.image_url) setFormErrors({ ...formErrors, image_url: null })
                      }}
                      placeholder="Paste the main image URL"
                      className={`w-full px-4 py-3 rounded-xl border bg-white text-charcoal text-sm outline-none transition-all focus:ring-2 ring-forest ${
                        formErrors.image_url ? 'border-red-500 bg-red-50/20' : 'border-border'
                      }`}
                    />
                    <p className="text-[11px] text-muted mt-1">Primary image displayed in store grid and product cards.</p>
                    {formErrors.image_url && (
                      <p className="text-xs text-red-600 font-medium mt-1">{formErrors.image_url}</p>
                    )}

                    {/* Thumbnail Preview */}
                    {formData.image_url && (
                      <div className="mt-3 flex items-center gap-3 p-2 bg-white rounded-xl border border-border/60 w-fit">
                        <img
                          src={formData.image_url}
                          alt="Main Preview"
                          className="w-14 h-14 object-cover rounded-lg border border-border bg-cream-dark"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                        <span className="text-xs text-muted font-medium pr-2">Main Image Preview</span>
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Additional Image URLs */}
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                      Additional Image URLs (Optional)
                    </label>
                    <textarea
                      value={formData.additional_images_text}
                      onChange={(e) => setFormData({ ...formData, additional_images_text: e.target.value })}
                      rows={2}
                      placeholder="Paste additional image URLs (one per line or comma-separated)..."
                      className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm outline-none transition-all focus:ring-2 ring-forest resize-none"
                    />
                    <p className="text-[11px] text-muted mt-1">
                      Optional extra photos for the product detail image gallery (e.g. roots, leaves, planters).
                    </p>
                  </div>
                </div>

                {/* SECTION 5: FEATURED */}
                <div className="p-6 rounded-2xl bg-cream/30 border border-border/70">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-serif text-base font-bold text-forest">Featured Plant</h4>
                      <p className="text-xs text-muted mt-0.5">Show this plant in the Featured Plants section.</p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest"></div>
                    </label>
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary py-3 px-6 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary py-3 px-8 text-sm shadow-lg"
                  >
                    {editingId ? 'Save Changes' : 'Add Plant to Catalogue'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
