import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrderById } from '@/services/orderService'
import { formatCurrency, formatDate, formatOrderId, getStatusColor, getStatusLabel } from '@/utils'
import { ArrowLeft, Package, MapPin, User, Calendar, Phone, Mail } from 'lucide-react'
import { Spinner } from '@/components/ui/Skeletons'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrderById(id)
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="section-padding container text-center">
        <h2 className="font-serif text-2xl font-bold text-forest mb-4">Order Not Found</h2>
        <Link to="/account/orders" className="btn-primary">
          Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="section-padding" style={{ background: 'var(--color-cream)' }}>
      <div className="container max-w-4xl">
        <Link to="/account/orders" className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Order History
        </Link>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-border/50 space-y-8">
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div>
              <span className="text-xs text-muted block mb-1">Order Details</span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-forest">
                {formatOrderId(order.id)}
              </h1>
              <p className="text-xs text-muted mt-1 flex items-center gap-2">
                <Calendar size={14} /> Placed on {formatDate(order.created_at)}
              </p>
            </div>

            <div>
              <span className={`badge ${getStatusColor(order.status)} text-sm px-4 py-1.5 font-bold`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-cream/30 border border-border/60">
            <div>
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3 flex items-center gap-2">
                <User size={16} className="text-sage" /> Customer Details
              </h4>
              <p className="font-bold text-forest text-sm">{order.customer_name}</p>
              <p className="text-xs text-muted flex items-center gap-1.5 mt-1">
                <Mail size={12} /> {order.email}
              </p>
              <p className="text-xs text-muted flex items-center gap-1.5 mt-1">
                <Phone size={12} /> {order.phone}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-sage" /> Shipping Address
              </h4>
              <p className="text-xs text-charcoal-light leading-relaxed">
                {order.address},<br />
                {order.city}, {order.state} - {order.pincode}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <h3 className="font-serif text-lg font-bold text-forest mb-4">Items Ordered</h3>
            <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border">
              {order.order_items?.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4 bg-white">
                  <div>
                    <h4 className="font-bold text-sm text-charcoal">{item.product_name}</h4>
                    <p className="text-xs text-muted">Quantity: {item.quantity} × {formatCurrency(item.unit_price)}</p>
                  </div>
                  <span className="font-bold text-forest text-sm">
                    {formatCurrency(item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Calculation */}
          <div className="pt-4 border-t border-border flex justify-between items-center text-lg font-bold text-forest">
            <span>Total Amount Paid</span>
            <span>{formatCurrency(order.total_amount)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
