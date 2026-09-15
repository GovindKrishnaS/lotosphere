import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Leaf, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import PlantCharacter from '@/components/auth/PlantCharacter'

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeField, setActiveField] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password || !fullName) {
      toast.error('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setSubmitting(true)
    try {
      await register(email, password, fullName)
      toast.success('Account created successfully!')
      navigate('/account', { replace: true })
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to create account.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value)
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 500)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4" style={{ background: 'var(--color-cream)' }}>
      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-border/50">
        
        {/* Animated Plant Character Mascot */}
        <PlantCharacter
          activeField={activeField}
          isTyping={isTyping}
          isPasswordVisible={showPassword}
        />

        <div className="text-center mb-6">
          <h1 className="font-serif text-3xl font-bold text-forest">Create Account</h1>
          <p className="text-sm text-muted mt-1">Join the Lotosphere botanical community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={fullName}
                onFocus={() => setActiveField('name')}
                onBlur={() => setActiveField(null)}
                onChange={handleInputChange(setFullName)}
                required
                placeholder="Jane Doe"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-cream/30 text-charcoal placeholder:text-muted outline-none focus:ring-2 ring-forest transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                value={email}
                onFocus={() => setActiveField('email')}
                onBlur={() => setActiveField(null)}
                onChange={handleInputChange(setEmail)}
                required
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-cream/30 text-charcoal placeholder:text-muted outline-none focus:ring-2 ring-forest transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onFocus={() => setActiveField('password')}
                onBlur={() => setActiveField(null)}
                onChange={handleInputChange(setPassword)}
                required
                placeholder="At least 6 characters"
                className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-border bg-cream/30 text-charcoal placeholder:text-muted outline-none focus:ring-2 ring-forest transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-forest transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl font-medium text-cream bg-forest hover:bg-forest-light transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            data-cursor="link"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-forest font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
