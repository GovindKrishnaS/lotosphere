import { useState, useEffect, useCallback } from 'react'
import { Star, MessageSquarePlus, CheckCircle2, MessageCircle, Send, Sparkles } from 'lucide-react'
import { feedbackService } from '@/services/feedbackService'
import { storageService } from '@/services/storageService'
import ImageUploader from '@/components/ui/ImageUploader'
import { formatDate, getWhatsAppUrl } from '@/utils'
import toast from 'react-hot-toast'

export default function PlantReviewList({ product }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Form states
  const [customerName, setCustomerName] = useState('')
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const loadReviews = useCallback(async () => {
    if (!product?.id) return
    setLoading(true)
    try {
      const data = await feedbackService.getPlantReviewsByProductId(product.id)
      setReviews(data || [])
    } catch (err) {
      console.warn('Error loading product reviews:', err)
    } finally {
      setLoading(false)
    }
  }, [product?.id])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  const totalReviews = reviews.length
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / totalReviews).toFixed(1)
    : '5.0'

  const whatsappUrl = getWhatsAppUrl(`Hello Lotosphere! I recently reviewed "${product?.name}" and would like to ask about special offers for my next order.`)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!customerName.trim() || !reviewText.trim()) {
      toast.error('Please fill in your name and review text.')
      return
    }

    setSubmitting(true)
    try {
      let uploadedPhotoUrl = null
      if (photoFile) {
        uploadedPhotoUrl = await storageService.uploadFeedbackPhoto(photoFile)
      }

      await feedbackService.submitPlantReview({
        productId: product.id,
        productName: product.name,
        customerName: customerName.trim(),
        rating,
        review: reviewText.trim(),
        photoUrl: uploadedPhotoUrl,
      })

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
              <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Review Received</p>
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

      setShowForm(false)
      loadReviews()
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-16 pt-12 border-t border-border">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <span className="text-label text-sage block mb-1">Community Feedback</span>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-forest flex items-center gap-3">
            Customer Reviews ({totalReviews})
          </h3>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm)
            setSubmitted(false)
          }}
          className="btn-primary py-2.5 px-5 text-xs flex items-center gap-2 self-start sm:self-auto"
          data-cursor="link"
        >
          <MessageSquarePlus size={16} />
          {showForm ? 'Close Form' : 'Write a Review'}
        </button>
      </div>

      {/* Rating Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-6 rounded-3xl bg-white border border-border/60 shadow-sm mb-10">
        <div className="md:col-span-4 text-center md:text-left md:border-r border-border pr-6">
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="font-serif text-5xl font-bold text-forest">{avgRating}</span>
            <span className="text-muted text-sm font-semibold">out of 5</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 my-2 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                fill={i < Math.round(Number(avgRating)) ? 'currentColor' : 'none'}
                className={i < Math.round(Number(avgRating)) ? 'text-amber-500' : 'text-gray-300'}
              />
            ))}
          </div>
          <p className="text-xs text-muted">Based on {totalReviews} verified plant reviews</p>
        </div>

        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((starCount) => {
            const count = reviews.filter(r => Number(r.rating) === starCount).length
            const percent = totalReviews > 0 ? (count / totalReviews) * 100 : (starCount === 5 ? 100 : 0)
            return (
              <div key={starCount} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-medium text-charcoal flex items-center gap-1">
                  {starCount} <Star size={12} className="fill-amber-400 text-amber-400 inline" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-cream-dark overflow-hidden">
                  <div
                    className="h-full bg-forest rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-right text-muted">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Review Submission Form Drawer */}
      {showForm && (
        <div className="mb-12 p-8 rounded-3xl bg-forest-dark text-[#f5f2eb] border border-emerald-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-950">
            <h4 className="font-serif text-xl font-bold text-[#f5f2eb] flex items-center gap-2">
              <Sparkles size={18} className="text-amber-300" /> Review {product.name}
            </h4>
            <span className="text-xs font-mono text-[#a39e8f]">Moderated by Lotosphere Concierge</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#a39e8f] mb-2">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full px-4 py-3 bg-[#040a07] rounded-xl border border-emerald-900/60 text-sm text-[#f5f2eb] placeholder:text-[#524e44] outline-none focus:border-amber-400 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#a39e8f] mb-2">
                  Rating *
                </label>
                <div className="flex items-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        size={22}
                        fill={s <= rating ? 'currentColor' : 'none'}
                        className={s <= rating ? 'text-amber-400' : 'text-emerald-900'}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-amber-300 ml-2">{rating} / 5 Stars</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#a39e8f] mb-2">
                Your Review Details *
              </label>
              <textarea
                required
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience regarding leaf growth, soil condition, packaging, and thriving state..."
                className="w-full px-4 py-3 bg-[#040a07] rounded-xl border border-emerald-900/60 text-sm text-[#f5f2eb] placeholder:text-[#524e44] outline-none focus:border-amber-400 transition-all font-sans resize-none"
              />
            </div>

            <ImageUploader file={photoFile} onFileChange={setPhotoFile} label="Add a Photo (Optional)" />

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
              data-cursor="link"
            >
              {submitting ? 'Submitting Review...' : 'Submit Plant Review'}
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Review List */}
      {loading ? (
        <div className="text-center py-12 text-muted">Loading product reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-border text-muted">
          No reviews for this plant specimen yet. Be the first to share your botanical experience!
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-6 rounded-3xl bg-white border border-border/60 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-forest/10 border border-forest/20 text-forest font-bold font-serif flex items-center justify-center shrink-0">
                    {r.customer_name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h5 className="font-serif text-sm font-bold text-charcoal flex items-center gap-2">
                      {r.customer_name}
                      {r.is_demo && (
                        <span className="badge bg-stone-100 text-stone-600 text-[9px] uppercase font-mono tracking-wider">
                          Sample Review
                        </span>
                      )}
                    </h5>
                    <p className="text-[11px] text-muted">{formatDate(r.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(r.rating || 5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>

              <p className="text-charcoal-light text-sm leading-relaxed">{r.review}</p>

              {r.photo_url && (
                <div className="pt-2">
                  <img
                    src={r.photo_url}
                    alt={`${r.customer_name}'s plant`}
                    className="w-24 h-24 object-cover rounded-2xl border border-border"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
