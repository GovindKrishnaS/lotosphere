import { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getOrderById } from '@/services/orderService'
import { formatCurrency, formatOrderId, formatDate, getStatusColor, getStatusLabel } from '@/utils'
import { CheckCircle2, ArrowRight, Package, MapPin, Calendar, Leaf } from 'lucide-react'
import { Spinner } from '@/components/ui/Skeletons'

export default function OrderSuccess() {
  const { id } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(location.state?.demoOrder || null)
  const [loading, setLoading] = useState(!location.state?.demoOrder)

  useEffect(() => {
    if (!order && id) {
      getOrderById(id)
        .then(setOrder)
        .catch(() => {
          // Demo fallback
          setOrder({
            id,
            customer_name: 'Valued Customer',
            email: 'customer@example.com',
            address: 'Botanical Residency, Garden Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            total_amount: 1499,
            status: 'confirmed',
            created_at: new Date().toISOString(),
            order_items: [
              { id: '1', product_name: 'Monstera Deliciosa', quantity: 1, unit_price: 1499 }
            ]
          })
        })
        .finally(() => setLoading(false))
    }
  }, [id, order])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="section-padding min-h-[85vh] flex items-center justify-center" style={{ background: 'var(--color-cream)' }}>
      <div className="container max-w-2xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-border/50 text-center">
          
          {/* Seed -> Sprout -> Leaf Animated Growth Concept */}
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [0.2, 0.8, 1], opacity: 1 }}
              transition={{ duration: 1.2, times: [0, 0.5, 1], ease: 'easeOut' }}
              className="w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center text-forest"
            >
              <Leaf size={40} className="animate-pulse" />
            </motion.div>
          </div>

          <span className="badge badge-sage text-xs uppercase tracking-widest px-3 py-1 mb-4">
            Order Confirmed
          </span>

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-forest mb-3">
            Thank you for your order! 🌿
          </h1>

          <p className="text-charcoal-light text-sm md:text-base max-w-md mx-auto mb-8">
            Your plants are being carefully inspected and prepared at our botanical nursery.
          </p>

          {/* Order Details Card */}
          {order && (
            <div className="bg-cream/40 rounded-2xl p-6 border border-border/60 text-left space-y-4 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-border">
                <div>
                  <span className="text-xs text-muted block">Order ID</span>
                  <span className="font-mono font-bold text-forest text-sm">
                    {formatOrderId(order.id)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted block">Status</span>
                  <span className={`badge ${getStatusColor(order.status || 'confirmed')} text-xs font-semibold`}>
                    {getStatusLabel(order.status || 'confirmed')}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted block">Total Paid</span>
                  <span className="font-bold text-charcoal text-sm">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>

              {/* Items */}
              {order.order_items && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">Ordered Items</h4>
                  {order.order_items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-charcoal-light">
                      <span>{item.product_name} x {item.quantity}</span>
                      <span className="font-medium text-forest">{formatCurrency(item.unit_price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Delivery Address */}
              <div className="pt-3 border-t border-border flex items-start gap-3 text-xs text-charcoal-light">
                <MapPin size={16} className="text-sage flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-charcoal">{order.customer_name}</p>
                  <p>{order.address}, {order.city}, {order.state} - {order.pincode}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/account/orders" className="btn-primary" data-cursor="link">
              <Package size={16} /> View Order Status
            </Link>
            <Link to="/shop" className="btn-secondary" data-cursor="link">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
