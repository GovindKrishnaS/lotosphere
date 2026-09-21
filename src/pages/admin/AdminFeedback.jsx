import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Star, CheckCircle, XCircle, Trash2, LayoutDashboard, Package,
  ShoppingCart, MessageSquare, ArrowLeft, Filter, Sparkles, Edit2, X,
  Check, Eye, EyeOff, AlertCircle, Image as ImageIcon
} from 'lucide-react'
import { feedbackService } from '@/services/feedbackService'
import { storageService } from '@/services/storageService'
import { getProducts } from '@/services/productService'
import { formatDate } from '@/utils'
import toast from 'react-hot-toast'
import { Spinner } from '@/components/ui/Skeletons'

export default function AdminFeedback() {
  const [activeTab, setActiveTab] = useState('plant') // 'plant', 'company_review', 'feedback'
  const [plantReviews, setPlantReviews] = useState([])
  const [companyReviews, setCompanyReviews] = useState([])
  const [companyFeedback, setCompanyFeedback] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState(null)

  // Filters for Plant Reviews
  const [productFilter, setProductFilter] = useState('ALL')
  const [ratingFilter, setRatingFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Edit Modal state for Company Reviews
  const [editingCompanyReview, setEditingCompanyReview] = useState(null)
  const [editFormData, setEditFormData] = useState({
    customer_name: '',
    customer_title: '',
    rating: 5,
    review: '',
    photo_url: '',
    status: 'approved',
    is_featured: false,
  })
  const [updating, setUpdating] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const [fbData, prodData] = await Promise.all([
        feedbackService.getAllReviewsAndFeedbackAdmin(),
        getProducts({ pageSize: 100 }).catch(() => ({ data: [] })),
      ])

      setPlantReviews(fbData.plantReviews || [])
      setCompanyReviews(fbData.companyReviews || [])
      setCompanyFeedback(fbData.companyFeedback || [])
      setProducts(prodData.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load feedback records.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Metrics counts
  const pendingPlantCount = plantReviews.filter(r => r.status === 'pending').length
  const publishedPlantCount = plantReviews.filter(r => r.status === 'approved' || r.status === 'featured').length
  const totalCompanyRevCount = companyReviews.length
  const unreadFeedbackCount = companyFeedback.filter(f => f.status === 'pending').length

  // Filtered Plant Reviews
  const filteredPlantReviews = useMemo(() => {
    return plantReviews.filter(r => {
      if (productFilter !== 'ALL' && r.product_id !== productFilter) return false
      if (ratingFilter !== 'ALL' && Number(r.rating) !== Number(ratingFilter)) return false
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false
      return true
    })
  }, [plantReviews, productFilter, ratingFilter, statusFilter])

  // Plant Review Actions
  const handlePlantStatusChange = async (id, status) => {
    try {
      await feedbackService.updatePlantReviewStatus(id, status)
      toast.success(`Plant review status set to ${status}`)
      loadData()
    } catch (err) {
      toast.error(err.message || 'Failed to update review status')
    }
  }

  // Company Review Actions
  const handleCompanyStatusChange = async (id, status, is_featured = false) => {
    try {
      await feedbackService.updateCompanyReview(id, { status, is_featured })
      toast.success(`Company review updated (${status})`)
      loadData()
    } catch (err) {
      toast.error(err.message || 'Failed to update company review')
    }
  }

  const handleOpenEditCompanyReview = (rev) => {
    setEditingCompanyReview(rev)
    setEditFormData({
      customer_name: rev.customer_name || '',
      customer_title: rev.customer_title || '',
      rating: rev.rating || 5,
      review: rev.review || '',
      photo_url: rev.photo_url || '',
      status: rev.status || 'approved',
      is_featured: Boolean(rev.is_featured || rev.status === 'featured'),
    })
  }

  const handleSaveCompanyReview = async (e) => {
    e.preventDefault()
    if (!editingCompanyReview) return
    setUpdating(true)
    try {
      await feedbackService.updateCompanyReview(editingCompanyReview.id, editFormData)
      toast.success('Company review updated successfully!')
      setEditingCompanyReview(null)
      loadData()
    } catch (err) {
      toast.error(err.message || 'Failed to save review changes')
    } finally {
      setUpdating(false)
    }
  }

  // Company Feedback Actions
  const handleFeedbackStatusChange = async (id, status) => {
    try {
      await feedbackService.updateCompanyFeedbackStatus(id, status)
      toast.success(`Feedback marked as ${status}`)
      loadData()
    } catch (err) {
      toast.error(err.message || 'Failed to update feedback status')
    }
  }

  // Generic Delete Action
  const handleDelete = async (type, id, photoUrl = null) => {
    if (!window.confirm('Are you sure you want to permanently delete this item?')) return
    try {
      if (photoUrl) {
        await storageService.deleteFeedbackPhoto(photoUrl)
      }
      await feedbackService.deleteItem(type, id)
      toast.success('Record deleted successfully')
      loadData()
    } catch (err) {
      toast.error(err.message || 'Failed to delete item')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 px-4 md:px-8" style={{ background: 'var(--color-cream)' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted mb-2">
              <Link to="/admin" className="hover:text-forest flex items-center gap-1 font-semibold">
                <ArrowLeft size={14} /> Back to Dashboard
              </Link>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-forest">
              Reviews & Feedback Operations
            </h1>
            <p className="text-xs md:text-sm text-muted mt-1">
              Manage product reviews, homepage testimonials, and private customer feedback.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link to="/admin" className="btn-secondary text-xs flex items-center gap-1.5">
              <LayoutDashboard size={15} /> Overview
            </Link>
            <Link to="/admin/products" className="btn-secondary text-xs flex items-center gap-1.5">
              <Package size={15} /> Products
            </Link>
            <Link to="/admin/orders" className="btn-secondary text-xs flex items-center gap-1.5">
              <ShoppingCart size={15} /> Orders
            </Link>
          </div>
        </div>

        {/* Top Summary Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white shadow-lg border border-border/50">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">Pending Plant Reviews</p>
            <h3 className="font-serif text-3xl font-bold text-amber-600 mt-2">
              {pendingPlantCount}
            </h3>
          </div>

          <div className="p-6 rounded-3xl bg-white shadow-lg border border-border/50">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">Published Plant Reviews</p>
            <h3 className="font-serif text-3xl font-bold text-forest mt-2">
              {publishedPlantCount}
            </h3>
          </div>

          <div className="p-6 rounded-3xl bg-white shadow-lg border border-border/50">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">Company Reviews</p>
            <h3 className="font-serif text-3xl font-bold text-blue-700 mt-2">
              {totalCompanyRevCount}
            </h3>
          </div>

          <div className="p-6 rounded-3xl bg-white shadow-lg border border-border/50">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">Unread Feedback</p>
            <h3 className="font-serif text-3xl font-bold text-rose-700 mt-2">
              {unreadFeedbackCount}
            </h3>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-4 border-b border-border pb-1">
          <button
            onClick={() => setActiveTab('plant')}
            className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'plant'
                ? 'border-forest text-forest font-bold'
                : 'border-transparent text-muted hover:text-charcoal'
            }`}
          >
            <MessageSquare size={16} />
            <span>Plant Reviews ({plantReviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('company_review')}
            className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'company_review'
                ? 'border-forest text-forest font-bold'
                : 'border-transparent text-muted hover:text-charcoal'
            }`}
          >
            <Sparkles size={16} />
            <span>Company Reviews ({companyReviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'feedback'
                ? 'border-forest text-forest font-bold'
                : 'border-transparent text-muted hover:text-charcoal'
            }`}
          >
            <AlertCircle size={16} />
            <span>Customer Feedback ({companyFeedback.length})</span>
          </button>
        </div>

        {/* TAB 1: PLANT REVIEWS */}
        {activeTab === 'plant' && (
          <div className="space-y-6">
            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-border/60 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2 text-forest font-bold uppercase tracking-wider">
                <Filter size={15} /> Filters:
              </div>

              {/* Product Filter */}
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-cream/20 text-charcoal outline-none font-medium"
              >
                <option value="ALL">All Plants</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              {/* Rating Filter */}
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-cream/20 text-charcoal outline-none font-medium"
              >
                <option value="ALL">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-cream/20 text-charcoal outline-none font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="featured">Featured</option>
                <option value="rejected">Rejected</option>
              </select>

              {(productFilter !== 'ALL' || ratingFilter !== 'ALL' || statusFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setProductFilter('ALL')
                    setRatingFilter('ALL')
                    setStatusFilter('ALL')
                  }}
                  className="text-sage hover:underline font-semibold ml-auto"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Plant Reviews Table */}
            {filteredPlantReviews.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-border text-muted">
                No plant reviews match the selected filter criteria.
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-border/60 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-cream/40 text-charcoal uppercase font-bold tracking-wider border-b border-border">
                        <th className="py-4 px-6">Customer</th>
                        <th className="py-4 px-6">Target Plant</th>
                        <th className="py-4 px-6">Rating</th>
                        <th className="py-4 px-6">Review Comment</th>
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredPlantReviews.map((r) => (
                        <tr key={r.id} className="hover:bg-cream/20 transition-colors">
                          <td className="py-4 px-6 font-semibold text-charcoal">
                            {r.customer_name}
                            {r.is_demo && (
                              <span className="block text-[9px] uppercase font-mono text-stone-500 mt-0.5">
                                Demo Record
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 font-medium text-forest">
                            {r.products?.name || r.product_name || 'Monstera Deliciosa'}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-0.5 text-amber-500">
                              {[...Array(r.rating || 5)].map((_, i) => (
                                <Star key={i} size={13} fill="currentColor" />
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-6 max-w-xs text-charcoal/80">
                            "{r.review}"
                            {r.photo_url && (
                              <a href={r.photo_url} target="_blank" rel="noopener noreferrer" className="block text-[10px] text-sage hover:underline mt-1 font-mono">
                                [View Photo]
                              </a>
                            )}
                          </td>
                          <td className="py-4 px-6 text-muted font-mono">
                            {formatDate(r.created_at)}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-block text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
                                r.status === 'featured'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : r.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : r.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-stone-100 text-stone-700'
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handlePlantStatusChange(r.id, 'approved')}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-[11px]"
                                title="Approve"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handlePlantStatusChange(r.id, 'featured')}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold text-[11px]"
                                title="Feature"
                              >
                                Feature
                              </button>
                              <button
                                onClick={() => handlePlantStatusChange(r.id, 'rejected')}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-800 hover:bg-rose-100 font-semibold text-[11px]"
                                title="Reject"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleDelete('plant', r.id)}
                                className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50"
                                title="Delete"
                              >
                                <Trash2 size={15} />
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
          </div>
        )}

        {/* TAB 2: COMPANY REVIEWS (Homepage Testimonials) */}
        {activeTab === 'company_review' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-cream/40 text-charcoal uppercase font-bold tracking-wider border-b border-border">
                      <th className="py-4 px-6">Customer & Title</th>
                      <th className="py-4 px-6">Rating</th>
                      <th className="py-4 px-6">Testimonial</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Status / Featured</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {companyReviews.map((cr) => (
                      <tr key={cr.id} className="hover:bg-cream/20 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-bold text-charcoal block">{cr.customer_name}</span>
                          <span className="text-[11px] text-muted font-mono block">{cr.customer_title || 'Verified Customer'}</span>
                          {cr.is_demo && (
                            <span className="inline-block text-[9px] uppercase font-mono text-stone-500 mt-1">
                              Demo Record
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {[...Array(cr.rating || 5)].map((_, i) => (
                              <Star key={i} size={13} fill="currentColor" />
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6 max-w-sm text-charcoal/80">
                          "{cr.review}"
                        </td>
                        <td className="py-4 px-6 text-muted font-mono">
                          {formatDate(cr.created_at)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full w-fit ${
                                cr.status === 'approved' || cr.status === 'featured'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-100 text-stone-700'
                              }`}
                            >
                              {cr.status}
                            </span>
                            {cr.is_featured && (
                              <span className="inline-block text-[9px] uppercase font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full w-fit">
                                Featured on Homepage
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleCompanyStatusChange(cr.id, 'featured', true)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold text-[11px]"
                              title="Feature on Homepage"
                            >
                              Feature
                            </button>
                            <button
                              onClick={() => handleCompanyStatusChange(cr.id, 'approved', false)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-[11px]"
                              title="Approve"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleOpenEditCompanyReview(cr)}
                              className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50"
                              title="Edit Review"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete('company_review', cr.id)}
                              className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER FEEDBACK */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-cream/40 text-charcoal uppercase font-bold tracking-wider border-b border-border">
                      <th className="py-4 px-6">Customer & Contact</th>
                      <th className="py-4 px-6">Rating</th>
                      <th className="py-4 px-6">Feedback Text</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {companyFeedback.map((fb) => (
                      <tr key={fb.id} className="hover:bg-cream/20 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-bold text-charcoal block">{fb.customer_name}</span>
                          {fb.email && <span className="text-[11px] text-muted font-mono block">{fb.email}</span>}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {[...Array(fb.rating || 5)].map((_, i) => (
                              <Star key={i} size={13} fill="currentColor" />
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6 max-w-sm text-charcoal/80">
                          "{fb.feedback}"
                        </td>
                        <td className="py-4 px-6 text-muted font-mono">
                          {formatDate(fb.created_at)}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
                              fb.status === 'resolved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : fb.status === 'reviewed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {fb.status || 'pending'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleFeedbackStatusChange(fb.id, 'reviewed')}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 font-semibold text-[11px]"
                              title="Mark Reviewed"
                            >
                              Mark Reviewed
                            </button>
                            <button
                              onClick={() => handleFeedbackStatusChange(fb.id, 'resolved')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-[11px]"
                              title="Mark Resolved"
                            >
                              Mark Resolved
                            </button>
                            <button
                              onClick={() => handleDelete('feedback', fb.id)}
                              className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EDIT MODAL FOR COMPANY REVIEWS */}
      {editingCompanyReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-border space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="font-serif text-xl font-bold text-forest">Edit Company Review</h3>
              <button onClick={() => setEditingCompanyReview(null)} className="p-1.5 rounded-xl hover:bg-cream text-muted">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCompanyReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.customer_name}
                  onChange={(e) => setEditFormData({ ...editFormData, customer_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/20 text-charcoal outline-none focus:ring-2 ring-forest"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">Customer Title / City</label>
                <input
                  type="text"
                  value={editFormData.customer_title}
                  onChange={(e) => setEditFormData({ ...editFormData, customer_title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/20 text-charcoal outline-none focus:ring-2 ring-forest"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">Rating (1-5)</label>
                <select
                  value={editFormData.rating}
                  onChange={(e) => setEditFormData({ ...editFormData, rating: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/20 text-charcoal outline-none focus:ring-2 ring-forest font-semibold"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">Testimonial Content</label>
                <textarea
                  rows={3}
                  required
                  value={editFormData.review}
                  onChange={(e) => setEditFormData({ ...editFormData, review: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/20 text-charcoal outline-none focus:ring-2 ring-forest resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFormData.is_featured}
                    onChange={(e) => setEditFormData({ ...editFormData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-forest rounded focus:ring-forest"
                  />
                  <span className="font-semibold text-charcoal">Feature on Homepage</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingCompanyReview(null)}
                  className="btn-secondary py-2 px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-primary py-2 px-5 text-xs disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX PHOTO PREVIEW MODAL */}
      {previewPhotoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setPreviewPhotoUrl(null)}
        >
          <div className="relative max-w-2xl w-full bg-[#081510] p-4 rounded-3xl border border-emerald-500/40 shadow-2xl text-center space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-950">
              <span className="font-mono text-xs text-amber-300 font-bold uppercase tracking-wider">
                Feedback Uploaded Photo
              </span>
              <button
                onClick={() => setPreviewPhotoUrl(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-hidden rounded-2xl border border-emerald-900/50 bg-black flex items-center justify-center">
              <img
                src={previewPhotoUrl}
                alt="Uploaded feedback preview"
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setPreviewPhotoUrl(null)}
                className="px-5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-mono text-xs uppercase tracking-wider"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
