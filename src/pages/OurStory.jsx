import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Sprout, ShieldCheck, Heart, Compass, Leaf } from 'lucide-react'
import SideBranch from '@/components/home/SideBranch'

export default function OurStory() {
  return (
    <div className="bg-[#030805] text-[#f5f2eb] min-h-screen relative overflow-hidden font-sans">
      {/* Side Branch Framing */}
      <SideBranch direction="left" className="top-24 -left-4" />
      <SideBranch direction="right" className="top-[40%] -right-4" />

      {/* Atmospheric Background Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[60%] right-10 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation Bar Link */}
      <div className="container mx-auto px-5 sm:px-8 max-w-6xl pt-8 relative z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#a39e8f] hover:text-amber-300 transition-colors py-2"
          data-cursor="link"
        >
          <ArrowLeft size={16} /> Return to Home
        </Link>
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-24 px-5 sm:px-8">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-widest backdrop-blur-md"
          >
            <Sparkles size={13} className="text-amber-400" />
            <span>Our Origin & Philosophy</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#f5f2eb] leading-[1.1]"
          >
            Our Story
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-[#c4bfb1] font-light max-w-2xl mx-auto leading-relaxed"
          >
            Reconnecting human living spaces with real, tactile, living nature in an increasingly digital and mobile era.
          </motion.p>
        </div>
      </section>

      {/* Hero Visual Image Banner */}
      <section className="relative z-10 px-5 sm:px-8 mb-28">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden border border-emerald-900/50 shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1600&q=85"
              alt="Lotosphere Organic Greenhouse Studio"
              className="w-full h-full object-cover filter brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030805] via-transparent to-transparent opacity-80" />
          </motion.div>
        </div>
      </section>

      {/* SECTION 1: THE WORLD AROUND US */}
      <section className="relative z-10 py-20 px-5 sm:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-amber-300/90 block">
                01 • The World Around Us
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#f5f2eb] leading-tight">
                Surrounded by Screens, Longing for Life
              </h2>
              <p className="text-[#a39e8f] text-base leading-relaxed font-light">
                Modern life moves at the speed of glowing glass and digital notifications. We spend our days navigating virtual environments, moving seamlessly from phone displays to laptop monitors, detached from physical soil, seasons, and organic rhythm.
              </p>
              <p className="text-[#a39e8f] text-base leading-relaxed font-light">
                Yet beneath our busy digital schedules lies an instinctual desire for something real—something that grows slowly, responds to sunlight, and stays quietly grounded.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-emerald-900/40 shadow-xl max-w-md mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1545241047-6083a3684587?w=900&q=80"
                  alt="Modern studio filled with living plants"
                  className="w-full h-full object-cover filter brightness-95"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SOMETHING LIVING */}
      <section className="relative z-10 py-20 px-5 sm:px-8 bg-[#050e09] border-y border-emerald-950/60">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 order-2 lg:order-1"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-emerald-900/40 shadow-xl max-w-md mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=900&q=80"
                  alt="Tangible organic botanical specimen"
                  className="w-full h-full object-cover filter brightness-95"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 order-1 lg:order-2 space-y-6"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block">
                02 • Something Living
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#f5f2eb] leading-tight">
                A Physical Anchor in a Virtual Era
              </h2>
              <p className="text-[#a39e8f] text-base leading-relaxed font-light">
                Plants bring something uniquely tangible into our homes. They are living organisms with distinct personalities, unfurling new fenestrated leaves, turning gently toward light, and anchoring our rooms with natural grace.
              </p>
              <p className="text-[#a39e8f] text-base leading-relaxed font-light">
                Watering a plant or checking its soil provides a moment of stillness—a quiet pause in the day to step away from screens and connect with something alive.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHY LOTOSPHERE EXISTS */}
      <section className="relative z-10 py-24 px-5 sm:px-8">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-4"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-amber-300 block">
              03 • Why Lotosphere Exists
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#f5f2eb] leading-tight">
              Beyond Commerce: Building a Meaningful Connection
            </h2>
            <p className="text-[#c4bfb1] text-lg sm:text-xl font-light leading-relaxed max-w-3xl mx-auto">
              Lotosphere was founded not simply to ship plants in boxes, but to foster personal, long-lasting relationships between people and living specimens.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left pt-6"
          >
            <div className="p-6 rounded-2xl bg-[#07130c] border border-emerald-900/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Compass size={20} />
              </div>
              <h4 className="font-serif text-lg font-semibold text-[#f5f2eb]">Curated Guidance</h4>
              <p className="text-xs text-[#a39e8f] leading-relaxed font-light">
                We pair each specimen with clear, honest care guidelines so plant parenting feels effortless and fulfilling.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#07130c] border border-emerald-900/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 text-amber-300 flex items-center justify-center">
                <Sprout size={20} />
              </div>
              <h4 className="font-serif text-lg font-semibold text-[#f5f2eb]">Nurtured with Care</h4>
              <p className="text-xs text-[#a39e8f] leading-relaxed font-light">
                Sourced from organic solar nurseries and potted in mineral containers designed to support long-term root health.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#07130c] border border-emerald-900/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Heart size={20} />
              </div>
              <h4 className="font-serif text-lg font-semibold text-[#f5f2eb]">Personal Touch</h4>
              <p className="text-xs text-[#a39e8f] leading-relaxed font-light">
                Every plant carries a story, ready to adapt to your windowsill, workspace, or living room sanctuary.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: MORE THAN A PLANT */}
      <section className="relative z-10 py-20 px-5 sm:px-8 bg-[#050e09] border-t border-emerald-950/60">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block">
                04 • More Than a Plant
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#f5f2eb] leading-tight">
                Part of Your Space, Routine & Memories
              </h2>
              <p className="text-[#a39e8f] text-base leading-relaxed font-light">
                Over time, a plant becomes far more than home décor. It marks the passage of seasons, marks quiet mornings with coffee, and grows alongside your life events.
              </p>
              <p className="text-[#a39e8f] text-base leading-relaxed font-light">
                By welcoming a botanical companion into your room, you create a personal sanctuary—a reminder that growth takes time, patience, and gentle attention.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-emerald-900/40 shadow-xl max-w-md mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=900&q=80"
                  alt="Monstera leaf fenestration in sunlight"
                  className="w-full h-full object-cover filter brightness-95"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FINAL SECTION: STAY CONNECTED */}
      <section className="relative z-10 py-28 px-5 sm:px-8 text-center">
        <div className="container mx-auto max-w-3xl space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl"
          >
            <Leaf size={32} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-4"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-amber-300 block">
              05 • Stay Connected
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#f5f2eb]">
              Make Space for Something Living
            </h2>
            <p className="text-[#a39e8f] text-base sm:text-lg font-light leading-relaxed max-w-xl mx-auto">
              Explore our curated catalogue of indoor specimens and discover a botanical companion for your space today.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/shop"
              className="px-8 py-4 rounded-xl font-mono text-xs uppercase tracking-wider font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-xl shadow-amber-950/30"
              data-cursor="link"
            >
              Explore Living Catalogue
            </Link>
            <Link
              to="/"
              className="px-8 py-4 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold text-[#f5f2eb] bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              Back to Sanctuary
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
