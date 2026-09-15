import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote, MessageSquarePlus, Sparkles } from 'lucide-react'
import { feedbackService } from '@/services/feedbackService'
import FeedbackModal from '@/components/feedback/FeedbackModal'
import SideBranch from './SideBranch'

export default function Testimonials() {
  const [reviews, setReviews] = useState([])
  const [current, setCurrent] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await feedbackService.getFeaturedPlantReviews()
        if (data && data.length > 0) {
          setReviews(data)
        }
      } catch (e) {
        console.error('Error fetching testimonials:', e)
      }
    }
    loadReviews()
  }, [])

  const next = () => setCurrent((prev) => (prev + 1) % (reviews.length || 1))
  const prev = () => setCurrent((prev) => (prev - 1 + (reviews.length || 1)) % (reviews.length || 1))

  const item = reviews[current] || {
    customer_name: 'Elena Vance',
    rating: 5,
    review: 'The split leaves on this Monstera are breathtaking. Arrived in pristine condition and rooted immediately!',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    products: { name: 'Monstera Deliciosa' },
  }

  return (
    <section className="relative py-24 bg-[#060d09] text-[#f5f2eb] overflow-hidden">
      {/* Side Branch Framing from Left */}
      <SideBranch direction="left" className="top-10 -left-4" />

      {/* Atmospheric Glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-emerald-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-5 sm:px-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-3 backdrop-blur-sm">
              <Sparkles size={12} className="text-amber-400" />
              <span>Reviews</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#f5f2eb] font-display">
              Customer Experiences
            </h2>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-xs font-mono uppercase tracking-wider transition-all self-start md:self-auto shadow-lg"
            data-cursor="link"
          >
            <MessageSquarePlus size={14} className="text-amber-300" />
            <span>Leave Feedback</span>
          </button>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto bg-[#0a1510]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-emerald-900/50 relative">
          <Quote size={40} className="absolute top-6 right-8 text-emerald-800/20 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={item.id || current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row items-center gap-6 sm:gap-8"
            >
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-xl">
                  <img
                    src={item.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80'}
                    alt={item.customer_name}
                    className="w-full h-full object-cover filter brightness-95"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white text-[9px] uppercase font-mono tracking-widest py-0.5 px-2 rounded-full border border-emerald-400">
                  Verified
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-1 mb-2.5">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-base sm:text-lg md:text-xl text-[#f5f2eb] leading-relaxed mb-4 font-light">
                  "{item.review}"
                </p>

                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-amber-200 font-display">{item.customer_name}</h4>
                  <p className="text-xs font-mono text-[#8c887b] mt-0.5">
                    Specimen: <span className="text-emerald-400">{item.products?.name || item.product_name || 'Monstera Deliciosa'}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-emerald-950">
            <div className="flex items-center gap-2">
              {(reviews.length > 0 ? reviews : [0]).map((t, idx) => (
                <button
                  key={t.id || idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === current ? 'w-6 bg-emerald-400' : 'w-2 bg-emerald-950 hover:bg-emerald-800'
                  }`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="p-2 rounded-xl border border-emerald-900/60 hover:border-emerald-500/50 text-[#f5f2eb] hover:bg-emerald-950 transition-all"
                aria-label="Previous review"
                data-cursor="link"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                className="p-2 rounded-xl border border-emerald-900/60 hover:border-emerald-500/50 text-[#f5f2eb] hover:bg-emerald-950 transition-all"
                aria-label="Next review"
                data-cursor="link"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}
