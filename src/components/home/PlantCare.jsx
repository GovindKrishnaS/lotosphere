import { motion } from 'framer-motion'
import { Droplets, Sun, Wind, RefreshCw, Sparkles } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/animations/variants'
import SideBranch from './SideBranch'

const CARE_CARDS = [
  {
    icon: Droplets,
    title: 'Hydration',
    color: '#38bdf8',
    borderColor: 'border-sky-500/30',
    description: 'Check topsoil moisture before watering. Allow soil to dry slightly between cycles.',
    tips: ['Water at the root base', 'Ensure proper drainage'],
  },
  {
    icon: Sun,
    title: 'Light',
    color: '#fbbf24',
    borderColor: 'border-amber-500/30',
    description: 'Place in bright, filtered light. Avoid harsh direct afternoon rays.',
    tips: ['Rotate for balanced growth', 'Keep leaves free of dust'],
  },
  {
    icon: Wind,
    title: 'Humidity',
    color: '#a78bfa',
    borderColor: 'border-purple-500/30',
    description: 'Tropical varieties flourish with gentle misting and comfortable room airflow.',
    tips: ['Group plants together', 'Shield from cold AC drafts'],
  },
  {
    icon: RefreshCw,
    title: 'Repotting',
    color: '#34d399',
    borderColor: 'border-emerald-500/30',
    description: 'Upgrade planters by 2 inches every spring to encourage healthy root growth.',
    tips: ['Repot in spring season', 'Use airy mineral soil mix'],
  },
]

export default function PlantCare() {
  return (
    <section className="relative py-24 bg-[#050b08] text-[#f5f2eb] overflow-hidden">
      {/* Side Branch Framing from Right */}
      <SideBranch direction="right" className="top-10 -right-4" />

      {/* Atmospheric Glow */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-emerald-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-5 sm:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-3 backdrop-blur-sm">
            <Sparkles size={12} className="text-amber-400" />
            <span>Care Guides</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#f5f2eb] tracking-tight mb-3 font-display">
            Plant Care Essentials
          </h2>
          <p className="text-sm text-[#a39e8f] font-light">
            Simple principles to keep your plants healthy and thriving.
          </p>
        </div>

        {/* Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {CARE_CARDS.map(card => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                variants={staggerItem}
                className={`p-6 rounded-2xl bg-[#091510]/80 backdrop-blur-md border ${card.borderColor} hover:bg-[#0d1d16] transition-all duration-300 shadow-xl group`}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border border-white/10"
                  style={{ background: card.color + '18' }}
                >
                  <Icon size={20} style={{ color: card.color }} className="group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-semibold text-[#f5f2eb] mb-1.5 group-hover:text-amber-200 transition-colors font-display">
                  {card.title}
                </h3>
                <p className="text-xs text-[#a39e8f] leading-relaxed mb-4 font-light">
                  {card.description}
                </p>
                <ul className="space-y-1.5 pt-2 border-t border-emerald-950/80">
                  {card.tips.map(tip => (
                    <li key={tip} className="flex items-center gap-2 text-[11px] text-[#c9c4b7] font-light">
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: card.color }} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
