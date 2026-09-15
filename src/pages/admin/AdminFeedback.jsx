import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, CheckCircle, XCircle, Trash2, EyeOff, LayoutDashboard, Package, ShoppingCart, MessageSquare, ArrowLeft } from 'lucide-react'
import { feedbackService } from '@/services/feedbackService'
import toast from 'react-hot-toast'

export default function AdminFeedback() {
  const [activeTab, setActiveTab] = useState('plant') // 'plant' or 'company'
  const [plantReviews, setPlantReviews] = useState([])
  const [companyFeedback, setCompanyFeedback] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await feedbackService.getAllFeedbackAdmin()
      setPlantReviews(data.plantReviews || [])
      setCompanyFeedback(data.companyFeedback || [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load feedback.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStatusChange = async (type, id, status) => {
    try {
      await feedbackService.updateFeedbackStatus(type, id, status)
      toast.success(`Feedback status updated to ${status}`)
      loadData()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this feedback item?')) return
    try {
      await feedbackService.deleteFeedback(type, id)
      toast.success('Feedback deleted')
      loadData()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete feedback')
    }
  }

  const list = activeTab === 'plant' ? plantReviews : companyFeedback

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 bg-cream">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted mb-2">
              <Link to="/admin" className="hover:text-forest flex items-center gap-1">
                <ArrowLeft size={14} /> Back to Dashboard
              </Link>
            </div>
            <h1 className="font-serif text-3xl font-bold text-forest">Feedback & Reviews Management</h1>
            <p className="text-sm text-muted mt-1">Approve, feature, hide, or delete community plant reviews and company feedback.</p>
          </div>

          <div className="flex gap-2">
            <Link to="/admin" className="btn-secondary text-xs flex items-center gap-1.5">
              <LayoutDashboard size={16} /> Overview
            </Link>
            <Link to="/admin/products" className="btn-secondary text-xs flex items-center gap-1.5">
              <Package size={16} /> Products
            </Link>
            <Link to="/admin/orders" className="btn-secondary text-xs flex items-center gap-1.5">
              <ShoppingCart size={16} /> Orders
            </Link>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-4 border-b border-border mb-8">
          <button
            onClick={() => setActiveTab('plant')}
            className={`pb-4 px-2 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'plant' ? 'border-forest text-forest' : 'border-transparent text-muted hover:text-charcoal'
            }`}
          >
            <MessageSquare size={16} />
            <span>Plant Reviews ({plantReviews.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`pb-4 px-2 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'company' ? 'border-forest text-forest' : 'border-transparent text-muted hover:text-charcoal'
            }`}
          >
            <MessageSquare size={16} />
            <span>Company Feedback ({companyFeedback.length})</span>
          </button>
        </div>

        {/* Feedback List Table */}
        {loading ? (
          <div className="text-center py-20 text-muted">Loading community feedback...</div>
        ) : list.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-border text-muted">
            No feedback entries found in this category.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-cream/50 text-charcoal uppercase text-[11px] font-bold tracking-wider border-b border-border">
                    <th className="py-4 px-6">Customer</th>
                    {activeTab === 'plant' && <th className="py-4 px-6">Plant Product</th>}
                    <th className="py-4 px-6">Rating</th>
                    <th className="py-4 px-6">Review / Feedback</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {list.map((item) => (
                    <tr key={item.id} className="hover:bg-cream/20 transition-colors">
                      <td className="py-4 px-6 font-semibold text-charcoal">
                        {item.customer_name}
                      </td>
                      {activeTab === 'plant' && (
                        <td className="py-4 px-6 text-forest font-medium">
                          {item.products?.name || item.product_name || 'Monstera Deliciosa'}
                        </td>
                      )}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(item.rating || 5)].map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" />
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 max-w-xs text-charcoal/80 text-xs">
                        "{item.review || item.feedback}"
                      </td>
                      <td className="py-4 px-6 text-xs text-muted">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
                            item.status === 'featured'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : item.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStatusChange(activeTab, item.id, 'featured')}
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-semibold"
                            title="Feature on Homepage"
                          >
                            Feature
                          </button>
                          <button
                            onClick={() => handleStatusChange(activeTab, item.id, 'approved')}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold"
                            title="Approve"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(activeTab, item.id, 'rejected')}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold"
                            title="Reject"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleDelete(activeTab, item.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs"
                            title="Delete"
                          >
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
      </div>
    </div>
  )
}
