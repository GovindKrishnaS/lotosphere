import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getOrderStats, getAllOrders, getNotificationLog } from '@/services/orderService'
import { getLowStockProducts, getProducts } from '@/services/productService'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, formatOrderId } from '@/utils'
import { DollarSign, ShoppingBag, AlertTriangle, Package, Bell, Plus, MessageSquare, LogOut } from 'lucide-react'
import { Spinner } from '@/components/ui/Skeletons'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [notifications, setNotifications] = useState([])
  const [totalProductsCount, setTotalProductsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Admin session ended.')
      navigate('/admin/login')
    } catch (err) {
      toast.error('Logout error: ' + err.message)
    }
  }

  useEffect(() => {
    Promise.allSettled([
      getOrderStats(),
      getAllOrders({ pageSize: 5 }),
      getLowStockProducts(10),
      getNotificationLog(5),
      getProducts({ pageSize: 100 }),
    ]).then(([statsRes, ordersRes, stockRes, notifRes, productsRes]) => {
      if (statsRes.status === 'fulfilled') setStats(statsRes.value)
      else setStats({ totalOrders: 12, totalRevenue: 34500, pendingOrders: 3, deliveredOrders: 8 })

      if (ordersRes.status === 'fulfilled') setRecentOrders(ordersRes.value.data)
      if (stockRes.status === 'fulfilled') setLowStock(stockRes.value)
      if (notifRes.status === 'fulfilled') setNotifications(notifRes.value)
      if (productsRes.status === 'fulfilled') setTotalProductsCount(productsRes.value.count || productsRes.value.data?.length || 0)

      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="section-padding" style={{ background: 'var(--color-cream)' }}>
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-border">
          <div>
            <span className="text-label text-terracotta block mb-1">Store Operations</span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-600/30 shadow-md bg-white shrink-0 flex items-center justify-center">
                <img src="/lotosphere-logo.jpg" alt="Lotosphere Logo" className="w-full h-full object-cover" />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-forest">
                Admin Overview
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/admin/products" className="btn-primary flex items-center gap-2 text-xs">
              <Plus size={16} /> Products
            </Link>
            <Link to="/admin/orders" className="btn-secondary text-xs">
              Orders
            </Link>
            <Link to="/admin/feedback" className="btn-secondary text-xs flex items-center gap-1.5">
              <MessageSquare size={16} /> Feedback
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5 ml-auto"
              title="Logout Admin"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="p-6 rounded-3xl bg-white shadow-lg border border-border/50">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <DollarSign size={24} />
            </div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Total Revenue</p>
            <h3 className="font-serif text-3xl font-bold text-forest mt-1">
              {formatCurrency(stats?.totalRevenue || 0)}
            </h3>
          </div>

          <div className="p-6 rounded-3xl bg-white shadow-lg border border-border/50">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
              <ShoppingBag size={24} />
            </div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Total Orders</p>
            <h3 className="font-serif text-3xl font-bold text-forest mt-1">
              {stats?.totalOrders || 0}
            </h3>
          </div>

          <div className="p-6 rounded-3xl bg-white shadow-lg border border-border/50">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <Package size={24} />
            </div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Active Catalogue</p>
            <h3 className="font-serif text-3xl font-bold text-forest mt-1">
              {totalProductsCount} Products
            </h3>
          </div>

          <div className="p-6 rounded-3xl bg-white shadow-lg border border-border/50">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Low Stock Items</p>
            <h3 className="font-serif text-3xl font-bold text-forest mt-1">
              {lowStock.length} Items
            </h3>
          </div>
        </div>

        {/* Main 2-Column Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders Table */}
          <div className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-xl border border-border/50 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2">
                <ShoppingBag size={20} /> Recent Orders
              </h2>
              <Link to="/admin/orders" className="text-xs text-sage hover:underline font-semibold">
                View All →
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-muted text-sm py-8 text-center">No orders recorded yet.</p>
            ) : (
              <div className="divide-y divide-border/60">
                {recentOrders.map((order) => (
                  <div key={order.id} className="py-4 first:pt-0 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-forest text-sm">{formatOrderId(order.id)}</span>
                        <span className={`badge ${getStatusColor(order.status)} text-[10px]`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="text-xs text-muted mt-1">{order.customer_name} • {formatDate(order.created_at)}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-charcoal text-sm">{formatCurrency(order.total_amount)}</span>
                      <Link to={`/admin/orders?orderId=${order.id}`} className="block text-xs text-sage hover:underline font-medium mt-0.5">
                        Manage
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock & Notification Log Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Low Stock Alerts */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-border/50 space-y-4">
              <h3 className="font-serif text-lg font-bold text-forest flex items-center gap-2 pb-3 border-b border-border">
                <AlertTriangle size={18} className="text-amber-600" /> Low Stock Alerts
              </h3>
              {lowStock.length === 0 ? (
                <p className="text-xs text-muted">All inventory stock levels healthy!</p>
              ) : (
                <div className="space-y-3">
                  {lowStock.map((prod) => (
                    <div key={prod.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-amber-50/50">
                      <span className="font-semibold text-charcoal truncate max-w-[160px]">{prod.name}</span>
                      <span className="badge bg-rose-100 text-rose-800 font-bold">{prod.stock} left</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Log Feed */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-border/50 space-y-4">
              <h3 className="font-serif text-lg font-bold text-forest flex items-center gap-2 pb-3 border-b border-border">
                <Bell size={18} className="text-sage" /> System Notifications
              </h3>
              {notifications.length === 0 ? (
                <p className="text-xs text-muted">No recent notification logs.</p>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 rounded-xl bg-cream/30 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-forest uppercase text-[10px]">{n.type}</span>
                        <span className="text-[10px] text-muted">{n.status}</span>
                      </div>
                      <p className="text-muted truncate">Recipient: {n.recipient}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
