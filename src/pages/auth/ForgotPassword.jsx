import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resetPassword } from '@/services/authService'
import { Leaf, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setSubmitting(true)
    try {
      await resetPassword(email)
      setSent(true)
      toast.success('Password reset link sent to your email!')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to send reset link.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4" style={{ background: 'var(--color-cream)' }}>
      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-border/50">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-emerald-600/30 mx-auto mb-4 shadow-md bg-white shrink-0 flex items-center justify-center">
            <img src="/lotosphere-logo.jpg" alt="Lotosphere Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-forest">Reset Password</h1>
          <p className="text-sm text-muted mt-2">Enter your email to receive a password reset link</p>
        </div>

        {sent ? (
          <div className="text-center py-6">
            <CheckCircle2 size={48} className="text-forest mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-forest mb-2">Check Your Email</h3>
            <p className="text-sm text-muted mb-6">
              We've sent password reset instructions to <strong>{email}</strong>.
            </p>
            <Link to="/auth/login" className="btn-primary w-full justify-center">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-cream/30 text-charcoal placeholder:text-muted outline-none focus:ring-2 ring-forest transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl font-medium text-cream bg-forest hover:bg-forest-light transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              data-cursor="link"
            >
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-border text-center">
          <Link to="/auth/login" className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest transition-colors">
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
