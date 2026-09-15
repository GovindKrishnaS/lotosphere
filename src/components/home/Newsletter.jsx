import { useState } from 'react'
import { Send, CheckCircle2, Leaf, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Please provide a valid email')
      return
    }
    setSubscribed(true)
    toast.success('Welcome to the Lotosphere Botanical Circle!')
  }

  return (
    <section className="relative py-20 bg-[#040805] text-[#f5f2eb] overflow-hidden">
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-5 sm:px-8 max-w-4xl">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Leaf size={18} className="text-amber-300" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-3 backdrop-blur-sm">
            <Sparkles size={12} className="text-amber-400" />
            <span>Botanical Circle</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold text-[#f5f2eb] tracking-tight mb-2.5 font-display">
            Join the Botanical Circle
          </h2>
          <p className="text-[#a39e8f] text-sm sm:text-base mb-6 font-light">
            Receive seasonal plant care tips, rare releases, and 15% off your first order.
          </p>

          {subscribed ? (
            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-5 max-w-md mx-auto flex items-center justify-center gap-3 text-emerald-200">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <span className="font-mono text-xs uppercase tracking-wider">Subscribed. Check your inbox soon.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full py-3 px-4 rounded-xl bg-[#091610] border border-emerald-900/60 text-[#f5f2eb] placeholder:text-[#6a6659] outline-none focus:border-emerald-500 text-xs sm:text-sm font-mono transition-all"
              />
              <button
                type="submit"
                className="w-full sm:w-auto py-3 px-6 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl shadow-emerald-950 border border-emerald-400/30"
                data-cursor="link"
              >
                <span>Subscribe</span>
                <Send size={13} />
              </button>
            </form>
          )}

          <p className="text-[11px] font-mono text-[#6a6659] mt-4">
            Zero spam. Unsubscribe anytime with one click.
          </p>
        </div>
      </div>
    </section>
  )
}
