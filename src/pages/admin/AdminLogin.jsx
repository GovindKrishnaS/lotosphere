import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getProfile } from '@/services/authService'
import { ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { login, logout, user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/admin'

  // Auto-redirect if already logged in as admin
  if (user && isAdmin) {
    navigate('/admin', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter administrator credentials.')
      return
    }

    setSubmitting(true)
    try {
      const data = await login(email, password)
      const userId = data?.user?.id || data?.session?.user?.id

      if (!userId) {
        throw new Error('Authentication succeeded but user identity is missing.')
      }

      // Check admin status explicitly from DB profile
      const prof = await getProfile(userId)
      if (!prof?.is_admin) {
        await logout()
        toast.error('Access Denied: Account is not an administrator.')
        return
      }

      toast.success('Admin authentication verified. Welcome!')
      navigate(from, { replace: true })
    } catch (err) {
      console.error('Admin login error:', err)
      toast.error(err.message || 'Invalid admin credentials or network error.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-[#030906]">
      <div className="w-full max-w-md bg-[#081510] border border-emerald-500/30 rounded-3xl p-8 md:p-10 shadow-2xl shadow-emerald-950/50 text-[#f5f2eb]">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-lg">
            <ShieldCheck size={32} />
          </div>
          <span className="badge bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[10px] uppercase tracking-widest px-3 py-1 mb-2 inline-block">
            Restricted Access
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#f5f2eb] mt-1">
            Lotosphere Admin
          </h1>
          <p className="text-xs text-[#a39e8f] mt-1">
            Authorized personnel login for store operations & management
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#a39e8f] mb-2">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/70" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@lotosphere.com"
                className="w-full pl-11 pr-4 py-3.5 bg-[#040a07] rounded-xl border border-emerald-900/60 text-sm text-[#f5f2eb] placeholder:text-[#524e44] outline-none focus:border-amber-400 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#a39e8f] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/70" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full pl-11 pr-12 py-3.5 bg-[#040a07] rounded-xl border border-emerald-900/60 text-sm text-[#f5f2eb] placeholder:text-[#524e44] outline-none focus:border-amber-400 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c887b] hover:text-[#f5f2eb] transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-950/30 disabled:opacity-50 mt-6"
            data-cursor="link"
          >
            {submitting ? 'Authenticating...' : 'Authenticate Admin'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-emerald-950 flex items-center gap-2 text-[11px] text-[#6a6659] justify-center">
          <AlertCircle size={14} className="text-amber-400 flex-shrink-0" />
          <span>Protected by Supabase Auth & Row Level Security</span>
        </div>
      </div>
    </div>
  )
}
