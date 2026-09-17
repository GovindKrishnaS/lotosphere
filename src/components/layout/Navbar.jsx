import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, User, Menu, X, Leaf } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop Specimens', to: '/shop' },
  { label: 'Biomes', to: '/shop?view=collections' },
  { label: 'Plant Care', to: '/plant-care' },
  { label: 'Heritage', to: '/about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { itemCount, setIsOpen } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let ticking = false
    const handler = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
          ticking = false
        })
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 h-20 transition-all duration-300 ${
          scrolled
            ? 'bg-[#050c08]/85 backdrop-blur-xl border-b border-emerald-900/30 shadow-2xl shadow-black/40'
            : 'bg-gradient-to-b from-[#050c08]/80 to-transparent'
        }`}
      >
        <div className="container h-full mx-auto px-5 sm:px-8 max-w-7xl flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            data-cursor="link"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-emerald-500/40 transition-transform duration-300 group-hover:scale-105 shadow-lg bg-white/10 shrink-0 flex items-center justify-center">
              <img src="/lotosphere-logo.jpg" alt="Lotosphere Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-serif text-2xl font-medium tracking-tight text-[#f5f2eb]">
              Lotosphere
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                data-cursor="link"
                className={({ isActive }) =>
                  `text-xs font-mono uppercase tracking-widest transition-colors duration-200 relative group py-1 ${
                    isActive
                      ? 'text-amber-300 font-medium'
                      : 'text-[#a39e8f] hover:text-[#f5f2eb]'
                  }`
                }
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-gradient-to-r from-emerald-400 to-amber-300 transition-all duration-300 group-hover:w-full" />
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#f5f2eb] transition-all border border-white/5 hover:border-emerald-500/30"
              aria-label="Search"
              data-cursor="link"
            >
              <Search size={18} />
            </button>

            {/* Account (Always routes to member account/login, no public admin exposure) */}
            <Link
              to={user ? '/account' : '/auth/login'}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#f5f2eb] transition-all border border-white/5 hover:border-emerald-500/30 hidden sm:flex"
              aria-label={user ? 'Account' : 'Login'}
              data-cursor="link"
            >
              <User size={18} />
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="p-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-[#f5f2eb] transition-all border border-emerald-500/30 relative"
              aria-label={`Cart (${itemCount} items)`}
              data-cursor="link"
            >
              <ShoppingBag size={18} className="text-amber-300" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-mono font-bold bg-emerald-500 text-black flex items-center justify-center shadow-md shadow-emerald-950"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2.5 rounded-xl bg-white/5 text-[#f5f2eb] lg:hidden border border-white/5"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 sm:w-80 bg-[#060e0a] border-l border-emerald-900/40 shadow-2xl lg:hidden flex flex-col p-6"
            >
              <div className="flex items-center justify-between pb-6 border-b border-emerald-950">
                <span className="font-serif text-xl font-medium text-[#f5f2eb]">Lotosphere</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl bg-white/5 text-[#f5f2eb]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 flex flex-col py-6 gap-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <NavLink
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors ${
                          isActive
                            ? 'bg-emerald-950 text-amber-300 border border-emerald-500/40'
                            : 'text-[#a39e8f] hover:bg-emerald-950/40 hover:text-white'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}

                <div className="mt-6 pt-6 border-t border-emerald-950">
                  <Link
                    to={user ? '/account' : '/auth/login'}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider text-[#a39e8f] hover:bg-emerald-950/40 hover:text-white transition-colors"
                  >
                    <User size={16} />
                    {user ? 'My Sanctuary Account' : 'Member Login'}
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 z-50 w-full max-w-xl px-4"
              style={{ transform: 'translateX(-50%)' }}
            >
              <form onSubmit={handleSearch} className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search 200+ botanical specimens..."
                  className="w-full pl-12 pr-12 py-4 bg-[#081510] rounded-2xl shadow-2xl text-sm font-mono text-[#f5f2eb] border border-emerald-500/40 outline-none focus:border-amber-400 placeholder:text-[#6a6659]"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a39e8f] hover:text-white"
                >
                  <X size={18} />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
