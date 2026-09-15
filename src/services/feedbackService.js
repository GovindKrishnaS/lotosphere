import { supabase } from '@/lib/supabase'

// Initial fallback feedback dataset
let localPlantReviews = [
  {
    id: 'rev-1',
    customer_name: 'Elena Vance',
    product_id: 'prod-1',
    product_name: 'Monstera Deliciosa',
    rating: 5,
    review: 'The split leaves on this Monstera are breathtaking. Arrived in pristine condition with lush aerial roots!',
    photo_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
    status: 'featured',
    created_at: '2026-03-10T10:00:00Z',
  },
  {
    id: 'rev-2',
    customer_name: 'Marcus Thorne',
    product_id: 'prod-2',
    product_name: 'Snake Plant Laurentii',
    rating: 5,
    review: 'Survived 3 weeks while I was on vacation without a single droop. The ultimate indestructible plant.',
    photo_url: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bac?auto=format&fit=crop&w=600&q=80',
    status: 'featured',
    created_at: '2026-03-12T14:30:00Z',
  },
  {
    id: 'rev-3',
    customer_name: 'Sophia Chen',
    product_id: 'prod-3',
    product_name: 'Peace Lily Symphony',
    rating: 5,
    review: 'Pure botanical elegance. The stark white spathes against deep obsidian soil bring serene tranquility to my studio.',
    photo_url: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=600&q=80',
    status: 'featured',
    created_at: '2026-03-14T09:15:00Z',
  },
]

let localCompanyFeedback = [
  {
    id: 'fb-1',
    customer_name: 'Julian Sterling',
    rating: 5,
    feedback: 'Lotosphere has redefined how I interact with living spaces. Packaging was eco-friendly and 100% plastic-free.',
    status: 'featured',
    created_at: '2026-03-01T11:20:00Z',
  },
  {
    id: 'fb-2',
    customer_name: 'Amara Okafor',
    rating: 5,
    feedback: 'The plant soulmate quiz matched me with a Calathea that thrives in my low-light apartment. Phenomenal customer support!',
    status: 'approved',
    created_at: '2026-03-05T16:45:00Z',
  },
]

export const feedbackService = {
  // Public: Get featured & approved plant reviews
  async getFeaturedPlantReviews() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('plant_reviews')
          .select('*, products(name)')
          .in('status', ['approved', 'featured'])
          .order('created_at', { ascending: false })

        if (!error && data && data.length > 0) {
          return data
        }
      } catch (err) {
        console.warn('Supabase fetch failed, fallback to local reviews:', err.message)
      }
    }
    return localPlantReviews.filter(r => r.status === 'approved' || r.status === 'featured')
  },

  // Public: Submit Plant Review
  async submitPlantReview(reviewData) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('plant_reviews')
          .insert([
            {
              customer_name: reviewData.customerName,
              product_id: reviewData.productId || null,
              rating: reviewData.rating,
              review: reviewData.review,
              photo_url: reviewData.photoUrl || null,
              status: 'pending',
            },
          ])
          .select()

        if (!error && data) return data[0]
      } catch (err) {
        console.warn('Supabase insert failed, fallback local store:', err.message)
      }
    }

    const newRev = {
      id: `rev-${Date.now()}`,
      customer_name: reviewData.customerName,
      product_id: reviewData.productId || 'prod-1',
      rating: reviewData.rating,
      review: reviewData.review,
      photo_url: reviewData.photoUrl || null,
      status: 'pending',
      created_at: new Date().toISOString(),
    }
    localPlantReviews.unshift(newRev)
    return newRev
  },

  // Public: Submit Company Feedback
  async submitCompanyFeedback(feedbackData) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('company_feedback')
          .insert([
            {
              customer_name: feedbackData.customerName,
              rating: feedbackData.rating,
              feedback: feedbackData.feedback,
              status: 'pending',
            },
          ])
          .select()

        if (!error && data) return data[0]
      } catch (err) {
        console.warn('Supabase insert failed, fallback local store:', err.message)
      }
    }

    const newFb = {
      id: `fb-${Date.now()}`,
      customer_name: feedbackData.customerName,
      rating: feedbackData.rating,
      feedback: feedbackData.feedback,
      status: 'pending',
      created_at: new Date().toISOString(),
    }
    localCompanyFeedback.unshift(newFb)
    return newFb
  },

  // Admin: Get all feedback (Plant Reviews + Company Feedback)
  async getAllFeedbackAdmin() {
    if (supabase) {
      try {
        const { data: plantRevs, error: pErr } = await supabase
          .from('plant_reviews')
          .select('*, products(name)')
          .order('created_at', { ascending: false })

        const { data: compFb, error: cErr } = await supabase
          .from('company_feedback')
          .select('*')
          .order('created_at', { ascending: false })

        if (!pErr && !cErr && plantRevs && compFb) {
          return { plantReviews: plantRevs, companyFeedback: compFb }
        }
      } catch (err) {
        console.warn('Admin feedback fetch failed, fallback local:', err.message)
      }
    }

    return {
      plantReviews: [...localPlantReviews],
      companyFeedback: [...localCompanyFeedback],
    }
  },

  // Admin: Update feedback status ('approved', 'rejected', 'featured', 'hidden')
  async updateFeedbackStatus(type, id, status) {
    if (supabase) {
      try {
        const table = type === 'plant' ? 'plant_reviews' : 'company_feedback'
        const { error } = await supabase
          .from(table)
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id)

        if (!error) return true
      } catch (err) {
        console.warn('Update feedback status failed:', err.message)
      }
    }

    if (type === 'plant') {
      localPlantReviews = localPlantReviews.map(item => item.id === id ? { ...item, status } : item)
    } else {
      localCompanyFeedback = localCompanyFeedback.map(item => item.id === id ? { ...item, status } : item)
    }
    return true
  },

  // Admin: Delete feedback
  async deleteFeedback(type, id) {
    if (supabase) {
      try {
        const table = type === 'plant' ? 'plant_reviews' : 'company_feedback'
        const { error } = await supabase.from(table).delete().eq('id', id)
        if (!error) return true
      } catch (err) {
        console.warn('Delete feedback failed:', err.message)
      }
    }

    if (type === 'plant') {
      localPlantReviews = localPlantReviews.filter(item => item.id !== id)
    } else {
      localCompanyFeedback = localCompanyFeedback.filter(item => item.id !== id)
    }
    return true
  },
}
