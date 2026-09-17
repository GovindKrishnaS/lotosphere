import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getUserOrders } from '@/services/orderService'
import { updateProfile } from '@/services/authService'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, formatOrderId } from '@/utils'
import { User, Package, LogOut, Save, Mail, Phone, MapPin, Building, Compass, CheckCircle2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AccountDashboard() {
  const { user, profile, logout, refreshProfile, isAdmin } = useAuth()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  
  // Profile Form States
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [address, setAddress] = useState(profile?.address || '')
  const [city, setCity] = useState(profile?.city || '')
  const [stateName, setStateName] = useState(profile?.state || '')
  const [pincode, setPincode] = useState(profile?.pincode || '')
  
  const [updating, setUpdating] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user?.id || user?.email) {
      getUserOrders(user?.id, user?.email)
        .then(setOrders)
        .catch(console.error)
        .finally(() => setLoadingOrders(false))
    } else {
      setLoadingOrders(false)
    }
  }, [user])

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setPhone(profile.phone || '')
      setAddress(profile.address || '')
      setCity(profile.city || '')
      setStateName(profile.state || '')
      setPincode(profile.pincode || '')
    }
  }, [profile])

  const validate = () => {
    const newErrors = {}
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    if (phone.trim() && phone.trim().length < 7) {
      newErrors.phone = 'Please enter a valid contact number'
    }
    if (pincode.trim() && pincode.trim().length < 4) {
      newErrors.pincode = 'Please enter a valid postal / PIN code'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('You must be signed in to save profile details.')
      return
    }

    if (!validate()) {
      toast.error('Please resolve the highlighted form errors.')
      return
    }

    setUpdating(true)
    setSaveSuccess(false)
    try {
      const updates = {
        full_name: fullName.trim(),
        email: user.email,
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: stateName.trim(),
        pincode: pincode.trim(),
      }

      await updateProfile(user.id, updates)
      await refreshProfile()
      setSaveSuccess(true)
      toast.success('Customer profile saved successfully!')
      setTimeout(() => setSaveSuccess(false), 4000)
    } catch (err) {
      console.error('Failed to update profile:', err)
      toast.error(err.message || 'Failed to update customer profile.')
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
            <span className="text-label text-sage block mb-2">Member Sanctuary</span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-forest">
              Welcome, {profile?.full_name || user?.email?.split('@')[0] || 'Plant Parent'}
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
          {/* Complete Customer Profile Form (Left) */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-border/50 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2">
                <User size={20} className="text-sage" /> Customer Details
              </h2>
              {saveSuccess && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 animate-fadeIn">
                  <CheckCircle2 size={13} /> Saved
                </span>
              )}
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4" noValidate>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                      if (errors.fullName) setErrors(prev => ({ ...prev, fullName: null }))
                    }}
                    placeholder="e.g. Eleanor Vance"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-cream/20 text-charcoal text-sm outline-none transition-all focus:ring-2 ring-forest ${
                      errors.fullName ? 'border-red-500 bg-red-50/20' : 'border-border'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={user?.email || profile?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-gray-100/80 text-muted text-sm cursor-not-allowed select-none"
                  />
                </div>
                <p className="text-[11px] text-muted mt-1">Authentication email linked to your account.</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="tel"
                    name="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: null }))
                    }}
                    placeholder="+91 98765 43210"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-cream/20 text-charcoal text-sm outline-none transition-all focus:ring-2 ring-forest ${
                      errors.phone ? 'border-red-500 bg-red-50/20' : 'border-border'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                  Shipping Address
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-3 text-muted" />
                  <textarea
                    rows={2}
                    name="street-address"
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Apartment, building, street name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-cream/20 text-charcoal text-sm outline-none focus:ring-2 ring-forest resize-none"
                  />
                </div>
              </div>

              {/* City & State (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                    City
                  </label>
                  <div className="relative">
                    <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      name="city"
                      autoComplete="address-level2"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Kochi"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-cream/20 text-charcoal text-sm outline-none focus:ring-2 ring-forest"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                    State
                  </label>
                  <div className="relative">
                    <Compass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      name="state"
                      autoComplete="address-level1"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="e.g. Kerala"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-cream/20 text-charcoal text-sm outline-none focus:ring-2 ring-forest"
                    />
                  </div>
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                  Pincode / Postal Code
                </label>
                <input
                  type="text"
                  name="postal-code"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value)
                    if (errors.pincode) setErrors(prev => ({ ...prev, pincode: null }))
                  }}
                  placeholder="e.g. 560001"
                  className={`w-full px-4 py-3 rounded-xl border bg-cream/20 text-charcoal text-sm outline-none focus:ring-2 ring-forest ${
                    errors.pincode ? 'border-red-500 bg-red-50/20' : 'border-border'
                  }`}
                />
                {errors.pincode && (
                  <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full btn-primary py-3.5 justify-center text-sm mt-4 shadow-lg disabled:opacity-50 transition-all font-medium"
              >
                {updating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving Details...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Customer Details
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Recent Orders Overview (Right) */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-border/50 space-y-6">
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
