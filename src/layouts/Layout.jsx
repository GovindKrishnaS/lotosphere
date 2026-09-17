import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import CustomCursor from '@/components/cursor/CustomCursor'
import FallingLeaves from '@/components/layout/FallingLeaves'
import { useScrollReveal } from '@/animations/hooks'
import { pageVariant } from '@/animations/variants'

export default function Layout() {
  useScrollReveal()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-[#050a08] text-[#f5f2eb] relative">
      {/* Background Falling Leaves Animation Layer (GPU accelerated, behind content) */}
      <FallingLeaves />
      <CustomCursor />
      <Navbar />
      <main className={`flex-1 relative z-10 ${isHome ? 'pt-0' : 'pt-[80px]'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
