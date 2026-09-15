import { motion } from 'framer-motion'
import { Sparkles, Shield, Wind, RefreshCw, SunMedium } from 'lucide-react'
import SideBranch from './SideBranch'

const ENVIRONMENT_PILLARS = [
  {
    icon: Wind,
    title: 'Biophilic Air',
    description: 'Natural indoor air purification for modern living spaces.',
  },
  {
    icon: Shield,
    title: '30-Day Guarantee',
    description: 'Full health replacement support on every plant.',
  },
  {
    icon: RefreshCw,
    title: 'Mineral Planters',
    description: 'Porous earthenware designed for optimal root respiration.',
  },
  {
    icon: SunMedium,
    title: 'Organic Nurseries',
    description: 'Sustainably cultivated in solar greenhouses without harsh chemicals.',
  },
]

export default function LivingWorld() {
  return (
    <section className="relative py-24 bg-[#040907] text-[#f5f2eb] overflow-hidden">
      {/* Side Branch Framing from Left */}
      <SideBranch direction="left" className="top-10 -left-4" />

      {/* Atmospheric Glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-emerald-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-5 sm:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-3 backdrop-blur-sm">
            <Sparkles size={12} className="text-amber-400" />
            <span>Botanical Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#f5f2eb] font-display">
            Designed to Thrive Indoors
          </h2>
          <p className="text-[#a39e8f] text-sm sm:text-base mt-3 font-light leading-relaxed">
            Curated for cleaner air, natural humidity balance, and calm.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {ENVIRONMENT_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-[#09140f]/70 backdrop-blur-md rounded-2xl p-6 border border-emerald-900/40 hover:border-emerald-500/50 hover:bg-[#0c1a14] transition-all duration-300 group shadow-lg shadow-black/40"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center mb-4 text-amber-300 group-hover:scale-105 transition-transform">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-semibold text-[#f5f2eb] mb-1.5 group-hover:text-amber-200 transition-colors font-display">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#a39e8f] leading-relaxed font-light">
                  {pillar.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
