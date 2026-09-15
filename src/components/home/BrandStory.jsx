import { Link as RouterLink } from 'react-router-dom'
import { ShieldCheck, Sparkles, Sprout, ArrowRight } from 'lucide-react'
import SideBranch from './SideBranch'

export default function BrandStory() {
  return (
    <section className="relative py-24 bg-[#040806] text-[#f5f2eb] overflow-hidden">
      {/* Side Branch Framing from Left */}
      <SideBranch direction="left" className="top-10 -left-4" />

      {/* Atmospheric Glow */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-emerald-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-5 sm:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Images Grid */}
          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-w-md mx-auto lg:max-w-none border border-emerald-900/40">
              <img
                src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1000&q=85"
                alt="Lotosphere greenhouse studio"
                className="w-full h-full object-cover filter brightness-90 contrast-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040806] via-transparent to-transparent opacity-60" />
            </div>

            {/* Secondary Floating Image */}
            <div className="absolute -bottom-6 -right-4 lg:-right-6 z-20 w-44 sm:w-52 aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500/30 hidden sm:block">
              <img
                src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=500&q=80"
                alt="Artisanal terracotta potting"
                className="w-full h-full object-cover filter brightness-90"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-3 backdrop-blur-sm">
              <Sparkles size={12} className="text-amber-400" />
              <span>Our Philosophy</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#f5f2eb] tracking-tight leading-tight mb-4 font-display">
              Crafted for Modern Spaces
            </h2>

            <p className="text-[#a39e8f] leading-relaxed mb-6 text-sm sm:text-base font-light">
              Lotosphere pairs resilient living botanicals with architectural mineral planters. Sourced from sustainable solar nurseries and delivered in climate-safe packaging.
            </p>

            {/* Feature pillars */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-[#091510] border border-emerald-950">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-2">
                  <ShieldCheck size={16} />
                </div>
                <h4 className="font-semibold text-[#f5f2eb] text-sm font-display">30-Day Guarantee</h4>
                <p className="text-[11px] text-[#8c887b] mt-0.5">Free replacement if your plant struggles.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#091510] border border-emerald-950">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 text-amber-400 flex items-center justify-center mb-2">
                  <Sprout size={16} />
                </div>
                <h4 className="font-semibold text-[#f5f2eb] text-sm font-display">Eco Cultivated</h4>
                <p className="text-[11px] text-[#8c887b] mt-0.5">Solar nurseries with organic soil blends.</p>
              </div>
            </div>

            <RouterLink
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-mono uppercase tracking-wider bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 transition-all shadow-lg"
              data-cursor="link"
            >
              <span>Read Our Story</span>
              <ArrowRight size={14} />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  )
}
