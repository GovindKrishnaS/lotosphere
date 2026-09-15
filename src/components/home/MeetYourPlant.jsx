import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Sun, Droplets, ShieldAlert, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils'
import SideBranch from './SideBranch'

const PLANTS = [
  {
    id: 'feat-1',
    name: 'Monstera Deliciosa',
    title: 'The Dramatic Sculptor',
    description: 'Bold, split foliage that flourishes in bright filtered light.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1000&q=80',
    slug: 'monstera-deliciosa',
    accentColor: '#10b981',
    stats: { light: 'Bright Indirect', water: 'Every 7-10 Days', care: 'Easy-Moderate', humidity: '60%+' },
  },
  {
    id: 'feat-4',
    name: 'Snake Plant Laurentii',
    title: 'The Silent Immortal',
    description: 'Ultra-resilient architectural form requiring minimal attention.',
    price: 749,
    image: 'https://images.unsplash.com/photo-1599598425947-020645558055?auto=format&fit=crop&w=1000&q=80',
    slug: 'snake-plant-laurentii',
    accentColor: '#34d399',
    stats: { light: 'Low to Direct', water: 'Every 2-3 Weeks', care: 'Indestructible', humidity: 'Any' },
  },
  {
    id: 'feat-5',
    name: 'Peace Lily Sensational',
    title: 'The Serene Oracle',
    description: 'Glossy leaves with serene blooms that indicate water needs.',
    price: 999,
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=1000&q=80',
    slug: 'peace-lily-sensational',
    accentColor: '#6ee7b7',
    stats: { light: 'Medium Filtered', water: 'Weekly Ritual', care: 'Easy', humidity: '50%+' },
  },
  {
    id: 'feat-6',
    name: 'Pothos Golden',
    title: 'The Cascading Trailblazer',
    description: 'Fast-growing cascading vine ideal for shelves and planters.',
    price: 599,
    image: 'https://images.unsplash.com/photo-1597055181300-e3633a207518?auto=format&fit=crop&w=1000&q=80',
    slug: 'pothos-golden',
    accentColor: '#fbbf24',
    stats: { light: 'Low to Bright', water: 'Weekly', care: 'Beginner Safe', humidity: 'Adaptive' },
  },
]

export default function MeetYourPlant() {
  const [activeIdx, setActiveIdx] = useState(0)
  const { addItem } = useCart()
  const activePlant = PLANTS[activeIdx]

  const handleAddToCart = async () => {
    await addItem({
      id: activePlant.id,
      name: activePlant.name,
      price: activePlant.price,
      image_url: activePlant.image,
      slug: activePlant.slug,
    }, 1)
  }

  return (
    <section className="relative py-24 bg-[#050c09] text-[#f5f2eb] overflow-hidden">
      {/* Side Branch Framing from Right */}
      <SideBranch direction="right" className="top-10 -right-4" />

      {/* Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-emerald-700/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-5 sm:px-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-3 backdrop-blur-sm">
              <Sparkles size={12} className="text-amber-400" />
              <span>Plant Personality</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#f5f2eb] font-display">
              Plant Personalities
            </h2>
          </div>
          <p className="text-sm text-[#a39e8f] max-w-md mt-3 md:mt-0 font-light">
            Distinct care traits for every living companion.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-10 pb-4 border-b border-emerald-900/40">
          {PLANTS.map((plant, idx) => {
            const isActive = idx === activeIdx
            return (
              <button
                key={plant.id}
                onClick={() => setActiveIdx(idx)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono tracking-wider transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-950 border border-emerald-400'
                    : 'bg-[#0a1611] text-[#a39e8f] hover:bg-emerald-950 hover:text-white border border-emerald-900/40'
                }`}
                data-cursor="link"
              >
                <span>{plant.name}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />}
              </button>
            )
          })}
        </div>

        {/* Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0a1510]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-emerald-900/40 shadow-2xl">
          {/* Left: Plant Image */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="absolute inset-0 rounded-3xl bg-emerald-600/10 blur-2xl transform scale-90" />
            <AnimatePresence mode="wait">
              <motion.div
                key={activePlant.id}
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-2xl border border-emerald-800/40"
              >
                <img
                  src={activePlant.image}
                  alt={activePlant.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 filter brightness-95"
                />
                <div className="absolute top-3.5 right-3.5 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-amber-300 font-mono font-semibold text-sm border border-amber-400/30">
                  {formatCurrency(activePlant.price)}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Breakdown & Specs */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePlant.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-medium">
                  ARCHETYPE
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold mt-1 mb-2 text-[#f5f2eb] font-display">
                  "{activePlant.title}"
                </h3>
                <p className="text-[#c9c4b7] text-sm leading-relaxed font-light mb-6">
                  {activePlant.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
                  <div className="p-3.5 rounded-xl bg-[#060c09] border border-emerald-950">
                    <Sun size={17} className="text-amber-400 mb-1.5" />
                    <div className="text-[10px] font-mono uppercase text-[#8c887b]">Sunlight</div>
                    <div className="text-xs font-medium text-[#f5f2eb] mt-0.5">{activePlant.stats.light}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#060c09] border border-emerald-950">
                    <Droplets size={17} className="text-emerald-400 mb-1.5" />
                    <div className="text-[10px] font-mono uppercase text-[#8c887b]">Watering</div>
                    <div className="text-xs font-medium text-[#f5f2eb] mt-0.5">{activePlant.stats.water}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#060c09] border border-emerald-950">
                    <ShieldAlert size={17} className="text-amber-400 mb-1.5" />
                    <div className="text-[10px] font-mono uppercase text-[#8c887b]">Difficulty</div>
                    <div className="text-xs font-medium text-[#f5f2eb] mt-0.5">{activePlant.stats.care}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#060c09] border border-emerald-950">
                    <Sparkles size={17} className="text-teal-400 mb-1.5" />
                    <div className="text-[10px] font-mono uppercase text-[#8c887b]">Humidity</div>
                    <div className="text-xs font-medium text-[#f5f2eb] mt-0.5">{activePlant.stats.humidity}</div>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={handleAddToCart}
                  className="btn-botanical-primary inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-xs font-mono uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl shadow-emerald-950 border border-emerald-400/30 transition-all duration-300"
                  data-cursor="link"
                >
                  <ShoppingBag size={16} />
                  <span>Adopt Specimen</span>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
