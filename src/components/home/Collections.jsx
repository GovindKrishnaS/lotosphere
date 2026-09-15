import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowUpRight } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/animations/variants'
import SideBranch from './SideBranch'

const COLLECTIONS = [
  {
    name: 'Indoor Sanctuary',
    slug: 'indoor-plants',
    tagline: 'LUSH CANOPY',
    description: 'Lush tropical foliage for vibrant interior spaces.',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=1000&q=80',
    span: 'lg:col-span-2 lg:row-span-2',
    textSize: 'text-2xl sm:text-3xl lg:text-4xl',
  },
  {
    name: 'Architectural Specimens',
    slug: 'statement-plants',
    tagline: 'SCULPTURAL',
    description: 'Striking silhouettes that anchor room architecture.',
    image: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=800&q=80',
    span: '',
    textSize: 'text-xl sm:text-2xl',
  },
  {
    name: 'Clean Air Purifiers',
    slug: 'air-purifying',
    tagline: 'OXYGEN RICH',
    description: 'Natural air-cleaning varieties for fresh airflow.',
    image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80',
    span: '',
    textSize: 'text-xl sm:text-2xl',
  },
  {
    name: 'Pet Safe Botanicals',
    slug: 'pet-friendly',
    tagline: 'NON-TOXIC',
    description: 'Non-toxic species safe for curious cats and dogs.',
    image: 'https://images.unsplash.com/photo-1603912699214-92627f304eb6?w=800&q=80',
    span: '',
    textSize: 'text-xl sm:text-2xl',
  },
  {
    name: 'Minimalist & Hardy',
    slug: 'succulents-cacti',
    tagline: 'LOW EFFORT',
    description: 'Resilient varieties requiring minimal watering.',
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=800&q=80',
    span: '',
    textSize: 'text-xl sm:text-2xl',
  },
]

export default function Collections() {
  return (
    <section className="relative py-24 bg-[#050a08] text-[#f5f2eb] overflow-hidden">
      {/* Side Branch Framing from Right */}
      <SideBranch direction="right" className="top-10 -right-4" />

      {/* Atmospheric Glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-emerald-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-5 sm:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-3 backdrop-blur-sm">
            <Sparkles size={12} className="text-amber-400" />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#f5f2eb] tracking-tight mb-3 font-display">
            Curated Plant Biomes
          </h2>
          <p className="text-sm sm:text-base text-[#a39e8f] font-light">
            Explore living species grouped by light, space, and care routine.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          style={{ gridAutoRows: '280px' }}
        >
          {COLLECTIONS.map((col) => (
            <motion.div
              key={col.name}
              variants={staggerItem}
              className={`relative rounded-2xl overflow-hidden group border border-emerald-900/30 hover:border-emerald-500/50 transition-all duration-500 ${col.span}`}
              data-cursor="view"
            >
              <Link to={`/shop?category=${col.slug}`} className="block w-full h-full relative">
                {/* Image */}
                <img
                  src={col.image}
                  alt={col.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-85 contrast-110"
                  loading="lazy"
                />
                
                {/* Dark atmospheric overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050a08] via-[#050a08]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Top badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/60 text-amber-300 border border-amber-400/20 backdrop-blur-sm">
                    {col.tagline}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight size={16} />
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 z-10">
                  <h3 className={`font-semibold text-[#f5f2eb] group-hover:text-amber-200 transition-colors duration-300 mb-1.5 font-display ${col.textSize}`}>
                    {col.name}
                  </h3>
                  <p className="text-[#c9c4b7] text-xs sm:text-sm font-light line-clamp-2">
                    {col.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
