import { useState, useEffect } from 'react'
import { getAllOrders, updateOrderStatus, getOrderById } from '@/services/orderService'
import { formatCurrency, formatDate, formatOrderId, getStatusColor, getStatusLabel } from '@/utils'
import { Eye, ArrowLeft, X, Filter } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Spinner } from '@/components/ui/Skeletons'

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchParams] = useSearchParams()

  const loadOrders = () => {
    setLoading(true)
    getAllOrders({ status: statusFilter || null, pageSize: 50 })
      .then(({ data }) => setOrders(data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadOrders()
  }, [statusFilter])

  useEffect(() => {
    const queryOrderId = searchParams.get('orderId')
    if (queryOrderId) {
      handleViewOrder(queryOrderId)
    }
  }, [searchParams])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      toast.success(`Order status updated to ${getStatusLabel(newStatus)}`)
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleViewOrder = async (orderId) => {
    try {
      const data = await getOrderById(orderId)
      setSelectedOrder(data)
    } catch (err) {
      toast.error('Failed to load order details')
    }
  }

  return (
    <div className="section-padding" style={{ background: 'var(--color-cream)' }}>
      <div className="container">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest mb-6">
          <ArrowLeft size={16} /> Back to Overview
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-forest">Order Management</h1>
            <p className="text-sm text-muted">Inspect customer orders, track shipments, and update order statuses.</p>
          </div>

          {/* Filter dropdown */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2.5 px-4 rounded-xl border border-border bg-white text-sm font-medium text-charcoal outline-none focus:ring-2 ring-forest"
            >
              <option value="">All Order Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{getStatusLabel(s)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
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
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-cream/20 transition-colors">
                      <td className="p-4 font-mono font-bold text-forest">{formatOrderId(o.id)}</td>
                      <td className="p-4">
                        <p className="font-semibold">{o.customer_name}</p>
                        <p className="text-xs text-muted">{o.email}</p>
                      </td>
                      <td className="p-4 text-muted text-xs">{formatDate(o.created_at)}</td>
                      <td className="p-4 font-bold">{formatCurrency(o.total_amount)}</td>
                      <td className="p-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className={`text-xs font-semibold py-1 px-3 rounded-full border border-border/60 outline-none cursor-pointer ${getStatusColor(o.status)}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{getStatusLabel(s)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleViewOrder(o.id)}
                          className="btn-ghost p-2 rounded-lg text-forest hover:bg-cream"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Order Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-border space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <h3 className="font-serif text-xl font-bold text-forest">
                    Order {formatOrderId(selectedOrder.id)}
                  </h3>
                  <p className="text-xs text-muted">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-full hover:bg-cream">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-bold text-xs uppercase text-muted mb-1">Customer Info</h4>
                  <p className="font-semibold text-charcoal">{selectedOrder.customer_name}</p>
                  <p className="text-xs text-muted">{selectedOrder.email} • {selectedOrder.phone}</p>
                  <p className="text-xs text-muted mt-1">{selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
                </div>

                <div className="pt-3 border-t border-border">
                  <h4 className="font-bold text-xs uppercase text-muted mb-2">Order Line Items</h4>
                  <div className="divide-y divide-border/40">
                    {selectedOrder.order_items?.map((item) => (
                      <div key={item.id} className="py-2 flex justify-between">
                        <span>{item.product_name} × {item.quantity}</span>
                        <span className="font-semibold">{formatCurrency(item.unit_price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-between font-bold text-lg text-forest">
                  <span>Total Amount</span>
                  <span>{formatCurrency(selectedOrder.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
