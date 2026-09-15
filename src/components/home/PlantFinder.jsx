import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sun, Droplets, Maximize, Heart, ShieldCheck, Sparkles, ShoppingBag, Eye, RotateCcw } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils'
import SideBranch from './SideBranch'

const QUESTIONS = [
  {
    id: 'light',
    icon: Sun,
    question: 'How much natural light enters your space?',
    options: [
      { value: 'Low', label: 'Low / Dim Light', description: 'North window or interior room' },
      { value: 'Medium', label: 'Filtered Light', description: 'East window with gentle morning glow' },
      { value: 'Bright Indirect', label: 'Bright Indirect', description: 'Near large windows with sheer filter' },
      { value: 'Full Sun', label: 'Direct Sunlight', description: 'Bright south-facing exposure' },
    ],
  },
  {
    id: 'water',
    icon: Droplets,
    question: 'What is your watering routine?',
    options: [
      { value: 'Low', label: 'Every 2–3 Weeks', description: 'Minimalist low-maintenance care' },
      { value: 'Moderate', label: 'Weekly Ritual', description: 'Regular weekend soil checks' },
      { value: 'High', label: 'Frequent Care', description: 'Enjoys frequent misting & care' },
    ],
  },
  {
    id: 'space',
    icon: Maximize,
    question: 'Where will your plant live?',
    options: [
      { value: 'small', label: 'Desk / Shelf', description: 'Compact display space' },
      { value: 'medium', label: 'Table / Stand', description: 'Mid-sized tabletop accent' },
      { value: 'large', label: 'Floor Planter', description: 'Prominent floor statement' },
    ],
  },
  {
    id: 'pets',
    icon: ShieldCheck,
    question: 'Do you have pets?',
    options: [
      { value: 'safe', label: '100% Pet-Safe Only', description: 'Non-toxic for cats & dogs' },
      { value: 'any', label: 'Any Variety', description: 'Open to all botanical species' },
    ],
  },
  {
    id: 'personality',
    icon: Heart,
    question: 'What botanical style fits you?',
    options: [
      { value: 'dramatic', label: 'Sculptural & Bold', description: 'Iconic split fenestrated leaves' },
      { value: 'calm', label: 'Tranquil & Serene', description: 'Glossy leaves with quiet blooms' },
      { value: 'survivor', label: 'Minimal & Hardy', description: 'Upright geometric architectural form' },
    ],
  },
]

const SOULMATES = [
  {
    id: 'feat-1',
    name: 'Monstera Deliciosa',
    tagline: 'The Architectural Sculptor',
    description: 'Iconic split leaves that bring a calm tropical presence to any room.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80',
    slug: 'monstera-deliciosa',
    care_level: 'Easy',
  },
  {
    id: 'feat-4',
    name: 'Snake Plant Laurentii',
    tagline: 'The Silent Guardian',
    description: 'Purifies air silently while requiring minimal light and water.',
    price: 749,
    image: 'https://images.unsplash.com/photo-1599598425947-020645558055?w=800&q=80',
    slug: 'snake-plant-laurentii',
    care_level: 'Easy',
  },
  {
    id: 'feat-5',
    name: 'Peace Lily Sensational',
    tagline: 'The Tranquil Purifier',
    description: 'Deep glossy foliage with pristine white blooms indicating water needs.',
    price: 999,
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?w=800&q=80',
    slug: 'peace-lily-sensational',
    care_level: 'Easy',
  },
]

export default function PlantFinder() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)
  const { addItem } = useCart()

  const currentQ = QUESTIONS[step]

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQ.id]: value }
    setAnswers(newAnswers)

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      setDone(true)
    }
  }

  const reset = () => {
    setStep(0)
    setAnswers({})
    setDone(false)
  }

  const recommendedIndex =
    answers.personality === 'survivor' ? 1 : answers.personality === 'calm' ? 2 : 0
  const soulmate = SOULMATES[recommendedIndex]

  const handleAddToCart = async () => {
    await addItem({
      id: soulmate.id,
      name: soulmate.name,
      price: soulmate.price,
      image_url: soulmate.image,
      slug: soulmate.slug,
    }, 1)
  }

  const Icon = currentQ?.icon

  return (
    <section
      id="plant-finder"
      className="relative py-24 bg-[#040806] text-[#f5f2eb] overflow-hidden"
    >
      {/* Side Branch Framing from Left */}
      <SideBranch direction="left" className="top-12 -left-4" />

      {/* Atmospheric Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-5 sm:px-8 max-w-4xl">
        <div className="text-center">
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-3 backdrop-blur-sm">
              <Sparkles size={12} className="text-amber-400" />
              <span>Plant Quiz</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#f5f2eb] tracking-tight font-display">
              Find Your Plant Match
            </h2>
            <p className="text-[#a39e8f] text-sm sm:text-base max-w-md mx-auto mt-2 font-light">
              Answer a few questions to find the ideal specimen for your space.
            </p>
          </div>

          {/* Progress Indicators */}
          {!done && (
            <div className="flex gap-2 justify-center mb-8 max-w-xs mx-auto">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: i === step ? '32px' : '8px',
                    background: i <= step ? '#10b981' : 'rgba(255,255,255,0.15)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Interactive Question / Results Card */}
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-[#0b1410]/90 backdrop-blur-xl border border-emerald-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl"
              >
                <div className="flex items-center justify-center mb-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center shadow-inner">
                    {Icon && <Icon size={20} className="text-amber-300" />}
                  </div>
                </div>

                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-2 font-medium">
                  STEP {step + 1} OF {QUESTIONS.length}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-6 text-[#f5f2eb] font-display">
                  {currentQ.question}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value)}
                      className="p-4 rounded-xl text-left transition-all duration-300 border bg-[#060c09]/60 border-emerald-950 hover:border-emerald-500/50 hover:bg-emerald-950/40 group"
                      data-cursor="link"
                    >
                      <p className="font-medium text-sm mb-1 text-[#f5f2eb] group-hover:text-amber-200 transition-colors flex items-center justify-between">
                        <span>{opt.label}</span>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                      </p>
                      <p className="text-xs text-[#a39e8f] leading-relaxed font-light">{opt.description}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Match Reveal Card */
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-[#0b1410]/95 backdrop-blur-xl border border-amber-400/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden"
              >
                <div className="inline-block px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-[11px] uppercase tracking-widest mb-3">
                  ✨ Match Identified
                </div>

                <h3 className="text-2xl sm:text-3xl font-semibold text-[#f5f2eb] mb-1 font-display">
                  Your Plant Soulmate
                </h3>
                <p className="text-xs text-[#a39e8f] font-light mb-6">
                  Recommended based on your lighting and routine.
                </p>

                {/* Match Result Plant Showcase */}
                <div className="max-w-sm mx-auto bg-[#070e0a] rounded-2xl p-5 border border-emerald-900/50 mb-6 flex flex-col items-center">
                  <div className="w-40 h-40 rounded-xl overflow-hidden mb-3.5 shadow-2xl border border-emerald-800/40">
                    <img
                      src={soulmate.image}
                      alt={soulmate.name}
                      className="w-full h-full object-cover filter brightness-95"
                    />
                  </div>
                  <h4 className="text-xl font-semibold text-[#f5f2eb] font-display">{soulmate.name}</h4>
                  <span className="text-xs font-mono text-amber-400 mb-2">{soulmate.tagline}</span>
                  <p className="text-xs text-[#a39e8f] text-center font-light mb-4">{soulmate.description}</p>
                  <div className="text-xl font-semibold text-[#f5f2eb] mb-4 font-display">
                    {formatCurrency(soulmate.price)}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 w-full justify-center">
                    <Link
                      to={`/products/${soulmate.slug}`}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-[#f5f2eb] text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-emerald-700/40"
                      data-cursor="link"
                    >
                      <Eye size={14} />
                      <span>View Details</span>
                    </Link>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
                      data-cursor="link"
                    >
                      <ShoppingBag size={14} />
                      <span>Add to Basket</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 text-xs text-[#a39e8f] hover:text-[#f5f2eb] font-mono uppercase tracking-wider transition-colors"
                >
                  <RotateCcw size={12} />
                  <span>Retake Quiz</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
