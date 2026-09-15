import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Upload, CheckCircle2, MessageSquareHeart } from 'lucide-react'
import { feedbackService } from '@/services/feedbackService'
import toast from 'react-hot-toast'

export default function FeedbackModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('plant') // 'plant' or 'company'
  const [customerName, setCustomerName] = useState('')
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!customerName || !review) {
      toast.error('Please fill in your name and review details.')
      return
    }

    setSubmitting(true)
    try {
      if (activeTab === 'plant') {
        await feedbackService.submitPlantReview({
          customerName,
          rating,
          review,
          photoUrl,
        })
      } else {
        await feedbackService.submitCompanyFeedback({
          customerName,
          rating,
          feedback: review,
        })
      }
      setSubmitted(true)
      toast.success('Thank you! Your feedback has been submitted for moderation.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setCustomerName('')
    setRating(5)
    setReview('')
    setPhotoUrl('')
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-forest-dark border border-cream/20 rounded-3xl p-6 md:p-8 shadow-2xl text-cream overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-forest/60 hover:bg-forest text-cream/70 hover:text-cream transition-all"
          >
            <X size={18} />
          </button>

          {!submitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-terracotta/20 border border-terracotta/40 flex items-center justify-center mx-auto mb-3 text-terracotta">
                  <MessageSquareHeart size={24} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-cream">Share Your Feedback</h3>
                <p className="text-xs text-cream/70 mt-1">Help our botanical community flourish</p>
              </div>

              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-forest/60 border border-cream/10 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('plant')}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'plant' ? 'bg-terracotta text-cream shadow-md' : 'text-cream/60 hover:text-cream'
                  }`}
                >
                  Plant Review
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('company')}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'company' ? 'bg-terracotta text-cream shadow-md' : 'text-cream/60 hover:text-cream'
                  }`}
                >
                  Company Experience
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-cream/80 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-4 py-3 rounded-xl bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 text-sm focus:outline-none focus:border-terracotta"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-cream/80 uppercase tracking-wider mb-1.5">
                    Star Rating
                  </label>
                  <div className="flex gap-2 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-terracotta hover:scale-110 transition-transform"
                      >
                        <Star
                          size={24}
                          fill={star <= rating ? 'currentColor' : 'none'}
                          className={star <= rating ? 'text-terracotta' : 'text-cream/30'}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold ml-2 text-cream/80">{rating} / 5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-cream/80 uppercase tracking-wider mb-1.5">
                    {activeTab === 'plant' ? 'Plant Review Details' : 'Company Feedback & Suggestions'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder={
                      activeTab === 'plant'
                        ? 'Describe how your plant is thriving, packing quality, leaves, etc.'
                        : 'Share your thoughts on website speed, delivery, customer support, or packaging...'
                    }
                    className="w-full px-4 py-3 rounded-xl bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 text-sm focus:outline-none focus:border-terracotta resize-none"
                  />
                </div>

                {activeTab === 'plant' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-cream/80 uppercase tracking-wider mb-1.5">
                      Optional Photo URL
                    </label>
                    <div className="relative">
                      <Upload size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
                      <input
                        type="url"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 text-xs focus:outline-none focus:border-terracotta"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-medium text-cream bg-terracotta hover:bg-terracotta/90 transition-all shadow-lg text-sm mt-2 disabled:opacity-50"
                  data-cursor="link"
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </>
          ) : (
            <div className="py-8 text-center space-y-4">
              <CheckCircle2 size={48} className="text-sage mx-auto animate-bounce" />
              <h4 className="font-serif text-2xl font-bold text-cream">Feedback Submitted!</h4>
              <p className="text-xs text-cream/70 max-w-xs mx-auto">
                Thank you for contributing to Lotosphere. Our team reviews all submissions before showcasing them in our botanical community.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-forest-light text-cream font-medium text-xs hover:bg-forest-light/80 transition-all"
              >
                Close Window
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
