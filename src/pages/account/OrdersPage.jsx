import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getUserOrders } from '@/services/orderService'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, formatOrderId } from '@/utils'
import { Package, ArrowLeft, ChevronRight } from 'lucide-react'
import { Spinner } from '@/components/ui/Skeletons'

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      getUserOrders(user.id)
        .then(setOrders)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="section-padding" style={{ background: 'var(--color-cream)' }}>
      <div className="container max-w-4xl">
        <Link to="/account" className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <h1 className="font-serif text-3xl md:text-4xl font-bold text-forest mb-8 flex items-center gap-3">
          <Package size={32} /> Order History
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-border/50">
            <Package size={48} className="text-muted mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-forest mb-2">No orders found</h3>
            <p className="text-muted text-sm mb-6">You haven't made any purchases yet.</p>
            <Link to="/shop" className="btn-primary">
              Explore Catalogue
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-md border border-border/50 hover:shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-bold text-forest text-base">{formatOrderId(order.id)}</span>
                    <span className={`badge ${getStatusColor(order.status)} text-xs`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <p className="text-xs text-muted">
                    Placed on {formatDate(order.created_at)} • {order.order_items?.length || 1} items
                  </p>
                </div>

                <div className="flex items-center gap-6 justify-between sm:justify-end">
                  <span className="font-serif text-xl font-bold text-charcoal">
                    {formatCurrency(order.total_amount)}
                  </span>

                  <Link
                    to={`/account/orders/${order.id}`}
                    className="btn-ghost p-2 rounded-full border border-border hover:border-forest text-forest"
                  >
                    <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
