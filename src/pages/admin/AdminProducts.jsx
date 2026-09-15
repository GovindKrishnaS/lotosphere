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

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    sale_price: '',
    stock: '',
    category_id: '',
    description: '',
    image_url: '',
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
    setFormData({
      name: '',
      slug: '',
      price: '',
      sale_price: '',
      stock: '10',
      category_id: categories[0]?.id || '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80',
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
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      price: product.price || '',
      sale_price: product.sale_price || '',
      stock: product.stock || 0,
      category_id: product.category_id || '',
      description: product.description || '',
      image_url: product.image_url || '',
      featured: product.featured || false,
      care_level: product.care_level || 'Easy',
      light_requirement: product.light_requirement || 'Bright Indirect',
      water_requirement: product.water_requirement || 'Moderate',
      pet_friendly: product.pet_friendly || false,
      air_purifying: product.air_purifying || false,
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
    if (!formData.name || !formData.price) {
      toast.error('Name and Price are required')
      return
    }

    const payload = {
      ...formData,
      slug: formData.slug || slugify(formData.name),
      price: Number(formData.price),
      sale_price: formData.sale_price ? Number(formData.sale_price) : null,
      stock: Number(formData.stock),
      category_id: formData.category_id || null,
    }

    try {
      if (editingId) {
        await updateProduct(editingId, payload)
        toast.success('Product updated!')
      } else {
        await createProduct(payload)
        toast.success('Product created!')
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
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border">
              <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                <h3 className="font-serif text-2xl font-bold text-forest">
                  {editingId ? 'Edit Plant Details' : 'Add New Plant'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-cream">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full p-3 rounded-xl border border-border text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Category</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full p-3 rounded-xl border border-border text-sm"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="w-full p-3 rounded-xl border border-border text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Sale Price (₹)</label>
                    <input
                      type="number"
                      value={formData.sale_price}
                      onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                      className="w-full p-3 rounded-xl border border-border text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Stock *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                      className="w-full p-3 rounded-xl border border-border text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full p-3 rounded-xl border border-border text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full p-3 rounded-xl border border-border text-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Care Level</label>
                    <select
                      value={formData.care_level}
                      onChange={(e) => setFormData({ ...formData, care_level: e.target.value })}
                      className="w-full p-3 rounded-xl border border-border text-sm"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Light</label>
                    <select
                      value={formData.light_requirement}
                      onChange={(e) => setFormData({ ...formData, light_requirement: e.target.value })}
                      className="w-full p-3 rounded-xl border border-border text-sm"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="Bright Indirect">Bright Indirect</option>
                      <option value="Full Sun">Full Sun</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Water</label>
                    <select
                      value={formData.water_requirement}
                      onChange={(e) => setFormData({ ...formData, water_requirement: e.target.value })}
                      className="w-full p-3 rounded-xl border border-border text-sm"
                    >
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="accent-forest"
                    />
                    <span>Featured</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.pet_friendly}
                      onChange={(e) => setFormData({ ...formData, pet_friendly: e.target.checked })}
                      className="accent-forest"
                    />
                    <span>Pet Safe</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.air_purifying}
                      onChange={(e) => setFormData({ ...formData, air_purifying: e.target.checked })}
                      className="accent-forest"
                    />
                    <span>Air Purifying</span>
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-border">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary py-2.5">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary py-2.5">
                    Save Product
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
