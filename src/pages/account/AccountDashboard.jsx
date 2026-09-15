import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getUserOrders } from '@/services/orderService'
import { updateProfile } from '@/services/authService'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, formatOrderId } from '@/utils'
import { User, Package, LogOut, ShieldCheck, Save, Mail, Phone, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AccountDashboard() {
  const { user, profile, logout, refreshProfile, isAdmin } = useAuth()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (user?.id) {
      getUserOrders(user.id)
        .then(setOrders)
        .catch(console.error)
        .finally(() => setLoadingOrders(false))
    }
  }, [user])

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setPhone(profile.phone || '')
    }
  }, [profile])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!user) return
    setUpdating(true)
    try {
      await updateProfile(user.id, { full_name: fullName, phone })
      await refreshProfile()
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error('Failed to update profile.')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="section-padding" style={{ background: 'var(--color-cream)' }}>
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-border">
          <div>
            <span className="text-label text-sage block mb-2">User Portal</span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-forest">
              Welcome, {profile?.full_name || user?.email || 'Plant Parent'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link to="/admin" className="btn-secondary text-terracotta border-terracotta/40 hover:bg-terracotta hover:text-white">
                Admin Dashboard
              </Link>
            )}
            <button onClick={logout} className="btn-ghost border border-border flex items-center gap-2 text-sm text-charcoal hover:bg-red-50 hover:text-red-700">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile Form (Left) */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-xl border border-border/50 space-y-6">
            <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2 pb-4 border-b border-border">
              <User size={20} /> Personal Profile
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-cream/20 text-charcoal text-sm outline-none focus:ring-2 ring-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-gray-50 text-muted text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-cream/20 text-charcoal text-sm outline-none focus:ring-2 ring-forest"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full btn-primary py-3 justify-center text-sm mt-4 shadow-md disabled:opacity-50"
              >
                <Save size={16} /> Save Changes
              </button>
            </form>
          </div>

          {/* Recent Orders Overview (Right) */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-xl border border-border/50 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2">
                <Package size={20} /> My Orders
              </h2>
              <Link to="/account/orders" className="text-xs text-sage hover:underline font-semibold">
                View All Orders →
              </Link>
            </div>

            {loadingOrders ? (
              <p className="text-muted text-sm py-8 text-center">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package size={36} className="text-muted mx-auto mb-3" />
                <p className="text-muted text-sm mb-4">You haven't placed any botanical orders yet.</p>
                <Link to="/shop" className="btn-primary inline-flex">
                  Explore Plants
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="p-5 rounded-2xl bg-cream/30 border border-border/60 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono font-bold text-forest text-sm">{formatOrderId(order.id)}</span>
                        <span className={`badge ${getStatusColor(order.status)} text-[10px] py-0.5`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        {formatDate(order.created_at)} • {order.customer_name}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-forest text-sm">{formatCurrency(order.total_amount)}</p>
                      <Link to={`/account/orders/${order.id}`} className="text-xs text-sage hover:underline font-semibold">
                        Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
