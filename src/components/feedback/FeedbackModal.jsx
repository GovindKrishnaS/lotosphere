import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, CheckCircle2, MessageSquareHeart, MessageCircle } from 'lucide-react'
import { feedbackService } from '@/services/feedbackService'
import { storageService } from '@/services/storageService'
import ImageUploader from '@/components/ui/ImageUploader'
import { getWhatsAppUrl } from '@/utils'
import toast from 'react-hot-toast'

export default function FeedbackModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('company_review') // 'company_review' or 'company_feedback'
  const [customerName, setCustomerName] = useState('')
  const [customerTitle, setCustomerTitle] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const whatsappUrl = getWhatsAppUrl('Hello Lotosphere! I recently left feedback on your website and would like to ask about special offers.')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!customerName.trim() || !review.trim()) {
      toast.error('Please fill in your name and review/feedback details.')
      return
    }

    setSubmitting(true)
    try {
      let uploadedPhotoUrl = null
      if (photoFile && activeTab === 'company_review') {
        uploadedPhotoUrl = await storageService.uploadFeedbackPhoto(photoFile)
      }

      if (activeTab === 'company_review') {
        await feedbackService.submitCompanyReview({
          customerName: customerName.trim(),
          customerTitle: customerTitle.trim() || 'Verified Customer',
          rating,
          review: review.trim(),
          photoUrl: uploadedPhotoUrl,
        })
      } else {
        await feedbackService.submitCompanyFeedback({
          customerName: customerName.trim(),
          email: email.trim() || null,
          rating,
          feedback: review.trim(),
        })
      }

      setSubmitted(true)

      // Mandatory exact Toast message requirement
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-[#081510] border border-emerald-500/40 shadow-2xl rounded-2xl p-4 pointer-events-auto flex flex-col gap-3 text-[#f5f2eb]`}
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 size={24} className="text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Submission Received</p>
              <p className="text-xs text-[#d1ccbf] leading-relaxed">
                Thank you for your review! We really appreciate your feedback. For a special offer on your next purchase, please contact us on WhatsApp.
              </p>
            </div>
          </div>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-md mt-1"
            >
              <MessageCircle size={15} />
              <span>Contact Us on WhatsApp</span>
            </a>
          )}
        </div>
      ), { duration: 6000 })
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to submit feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setCustomerName('')
    setCustomerTitle('')
    setEmail('')
    setRating(5)
    setReview('')
    setPhotoUrl('')
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#070f0b] border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl text-[#f5f2eb] overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#a39e8f] hover:text-white transition-all"
          >
            <X size={18} />
          </button>

          {!submitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3 text-amber-300 shadow-lg">
                  <MessageSquareHeart size={24} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#f5f2eb]">Share Your Experience</h3>
                <p className="text-xs text-[#a39e8f] mt-1">Help our botanical community flourish</p>
              </div>

              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#040a07] border border-emerald-900/60 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('company_review')}
                  className={`py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                    activeTab === 'company_review'
                      ? 'bg-emerald-900/80 text-amber-300 border border-emerald-500/40 shadow-md font-bold'
                      : 'text-[#a39e8f] hover:text-white'
                  }`}
                >
                  Company Review
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('company_feedback')}
                  className={`py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                    activeTab === 'company_feedback'
                      ? 'bg-emerald-900/80 text-amber-300 border border-emerald-500/40 shadow-md font-bold'
                      : 'text-[#a39e8f] hover:text-white'
                  }`}
                >
                  Private Feedback
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#a39e8f] mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-4 py-3 rounded-xl bg-[#040a07] border border-emerald-900/60 text-[#f5f2eb] placeholder:text-[#524e44] text-sm focus:outline-none focus:border-amber-400 font-sans"
                  />
                </div>

                {activeTab === 'company_review' ? (
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#a39e8f] mb-1.5">
                      Your City / Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={customerTitle}
                      onChange={(e) => setCustomerTitle(e.target.value)}
                      placeholder="e.g. Plant Enthusiast, Mumbai"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#040a07] border border-emerald-900/60 text-[#f5f2eb] placeholder:text-[#524e44] text-xs focus:outline-none focus:border-amber-400 font-sans"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#a39e8f] mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="maya@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#040a07] border border-emerald-900/60 text-[#f5f2eb] placeholder:text-[#524e44] text-xs focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#a39e8f] mb-1.5">
                    Star Rating *
                  </label>
                  <div className="flex gap-2 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          size={22}
                          fill={star <= rating ? 'currentColor' : 'none'}
                          className={star <= rating ? 'text-amber-400' : 'text-emerald-950'}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold text-amber-300 ml-2">{rating} / 5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#a39e8f] mb-1.5">
                    {activeTab === 'company_review' ? 'Homepage Testimonial Details *' : 'Feedback & Suggestions *'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder={
                      activeTab === 'company_review'
                        ? 'Share your experience with Lotosphere plant quality, delivery speed, and customer care...'
                        : 'Share suggestions for website features, packaging improvement, or customer support...'
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#040a07] border border-emerald-900/60 text-[#f5f2eb] placeholder:text-[#524e44] text-sm focus:outline-none focus:border-amber-400 resize-none font-sans"
                  />
                </div>

                {activeTab === 'company_review' && (
                  <ImageUploader file={photoFile} onFileChange={setPhotoFile} label="Add a Photo (Optional)" />
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-xl mt-2 disabled:opacity-50"
                  data-cursor="link"
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </>
          ) : (
            <div className="py-8 text-center space-y-4">
              <CheckCircle2 size={48} className="text-emerald-400 mx-auto animate-bounce" />
              <h4 className="font-serif text-2xl font-bold text-[#f5f2eb]">Thank You!</h4>
              <p className="text-xs text-[#a39e8f] max-w-sm mx-auto leading-relaxed">
                Thank you for your review! We really appreciate your feedback. For a special offer on your next purchase, please contact us on WhatsApp.
              </p>
              {whatsappUrl && (
                <div className="pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-lg"
                  >
                    <MessageCircle size={16} />
                    <span>Contact Us on WhatsApp</span>
                  </a>
                </div>
              )}
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#f5f2eb] font-mono text-xs uppercase tracking-wider transition-all"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
