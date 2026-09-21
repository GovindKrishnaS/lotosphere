import { supabase } from '@/lib/supabase'

// Fallback datasets for offline mode & local demo state
let localPlantReviews = [
  {
    id: 'rev-1',
    customer_name: 'Elena Vance',
    product_id: 'd1000000-0000-0000-0000-000000000001',
    product_name: 'Monstera Deliciosa',
    rating: 5,
    review: 'The split leaves on this Monstera are breathtaking. Arrived in pristine condition with lush aerial roots!',
    photo_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
    status: 'featured',
    is_demo: true,
    created_at: '2026-03-10T10:00:00Z',
  },
  {
    id: 'rev-2',
    customer_name: 'Marcus Thorne',
    product_id: 'd1000000-0000-0000-0000-000000000001',
    product_name: 'Monstera Deliciosa',
    rating: 5,
    review: 'Thriving impeccably in my living room corner! New fenestrated leaves unfurled within two weeks.',
    photo_url: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bac?auto=format&fit=crop&w=600&q=80',
    status: 'approved',
    is_demo: true,
    created_at: '2026-03-12T14:30:00Z',
  },
  {
    id: 'rev-3',
    customer_name: 'Sophia Chen',
    product_id: 'd1000000-0000-0000-0000-000000000001',
    product_name: 'Monstera Deliciosa',
    rating: 5,
    review: 'Pure botanical elegance. The stark dark green foliage brings calm tranquility to my home studio.',
    photo_url: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=600&q=80',
    status: 'featured',
    is_demo: true,
    created_at: '2026-03-14T09:15:00Z',
  },
]

let localCompanyReviews = [
  {
    id: 'crev-1',
    customer_name: 'Julian Sterling',
    customer_title: 'Landscape Architect, Kochi',
    rating: 5,
    review: 'Lotosphere has redefined how I interact with living spaces. Packaging was eco-friendly and 100% plastic-free with pristine healthy specimens.',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    status: 'featured',
    is_featured: true,
    is_demo: true,
    created_at: '2026-03-01T11:20:00Z',
  },
  {
    id: 'crev-2',
    customer_name: 'Amara Okafor',
    customer_title: 'Interior Designer, Mumbai',
    rating: 5,
    review: 'The plant soulmate quiz matched me with a Calathea that thrives in my low-light apartment. Phenomenal customer support and botanical quality!',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    status: 'featured',
    is_featured: true,
    is_demo: true,
    created_at: '2026-03-05T16:45:00Z',
  },
  {
    id: 'crev-3',
    customer_name: 'David Vance',
    customer_title: 'Botanical Enthusiast, Bengaluru',
    rating: 5,
    review: 'Exceptional specimens delivered straight from solar nurseries. Each plant comes in mineral pots with tailored care guides.',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
    status: 'featured',
    is_featured: true,
    is_demo: true,
    created_at: '2026-03-08T12:00:00Z',
  },
]

let localCompanyFeedback = [
  {
    id: 'fb-1',
    customer_name: 'Ananya Sharma',
    email: 'ananya@example.com',
    rating: 5,
    feedback: 'Loved the fast delivery, but would appreciate more pet-friendly plant guides in the mobile care section.',
    status: 'pending',
    is_demo: true,
    created_at: '2026-03-15T08:30:00Z',
  },
  {
    id: 'fb-2',
    customer_name: 'Vikram Mehta',
    email: 'vikram@example.com',
    rating: 4,
    feedback: 'The bio-degradable planter packaging was excellent. Could you add WhatsApp order tracking updates?',
    status: 'reviewed',
    is_demo: true,
    created_at: '2026-03-18T14:10:00Z',
  },
]

export const feedbackService = {
  // ── 1. PLANT REVIEWS (Product-specific) ───────────────────────────
  
  async getPlantReviewsByProductId(productId) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('plant_reviews')
          .select('*, products(name)')
          .eq('product_id', productId)
          .in('status', ['approved', 'featured'])
          .order('created_at', { ascending: false })

        if (!error && data) {
          return data
        }
      } catch (err) {
        console.warn('Supabase plant reviews query failed:', err.message)
      }
    }
    return localPlantReviews.filter(
      r => r.product_id === productId && (r.status === 'approved' || r.status === 'featured')
    )
  },

  async submitPlantReview(reviewData) {
    if (!reviewData.productId) {
      throw new Error('Product ID is required to submit a plant review')
    }

    const payload = {
      customer_name: reviewData.customerName,
      product_id: reviewData.productId,
      rating: Number(reviewData.rating) || 5,
      review: reviewData.review,
      photo_url: reviewData.photoUrl || null,
      status: 'pending',
      is_demo: false,
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('plant_reviews')
        .insert([payload])
        .select('*, products(name)')
        .single()

      if (error) throw error
      if (data) return data
    }

    const localItem = {
      id: `rev-${Date.now()}`,
      ...payload,
      product_name: reviewData.productName || 'Plant Specimen',
      created_at: new Date().toISOString(),
    }
    localPlantReviews.unshift(localItem)
    return localItem
  },

  // ── 2. COMPANY REVIEWS (Homepage Testimonials) ────────────────────

  async getFeaturedCompanyReviews() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('company_reviews')
          .select('*')
          .in('status', ['approved', 'featured'])
          .order('created_at', { ascending: false })

        if (!error && data && data.length > 0) {
          return data
        }
      } catch (err) {
        console.warn('Supabase company reviews query failed:', err.message)
      }
    }
    return localCompanyReviews.filter(
      r => r.status === 'approved' || r.status === 'featured' || r.is_featured
    )
  },

  async submitCompanyReview(reviewData) {
    const payload = {
      customer_name: reviewData.customerName,
      customer_title: reviewData.customerTitle || 'Verified Customer',
      rating: Number(reviewData.rating) || 5,
      review: reviewData.review,
      photo_url: reviewData.photoUrl || null,
      status: 'pending',
      is_featured: false,
      is_demo: false,
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('company_reviews')
        .insert([payload])
        .select()
        .single()

      if (error) throw error
      if (data) return data
    }

    const localItem = {
      id: `crev-${Date.now()}`,
      ...payload,
      created_at: new Date().toISOString(),
    }
    localCompanyReviews.unshift(localItem)
    return localItem
  },

  // ── 3. COMPANY FEEDBACK (Private Customer Service) ────────────────

  async submitCompanyFeedback(feedbackData) {
    const payload = {
      customer_name: feedbackData.customerName,
      email: feedbackData.email || null,
      rating: Number(feedbackData.rating) || 5,
      feedback: feedbackData.feedback,
      status: 'pending',
      is_demo: false,
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('company_feedback')
        .insert([payload])
        .select()
        .single()

      if (error) throw error
      if (data) return data
    }

    const localItem = {
      id: `fb-${Date.now()}`,
      ...payload,
      created_at: new Date().toISOString(),
    }
    localCompanyFeedback.unshift(localItem)
    return localItem
  },

  // ── 4. ADMIN MANAGEMENT METHODS ────────────────────────────────────

  async getAllReviewsAndFeedbackAdmin() {
    let plantRevs = []
    let compRevs = []
    let compFb = []

    if (supabase) {
      try {
        const [pRes, cRes, fRes] = await Promise.all([
          supabase.from('plant_reviews').select('*, products(name, slug)').order('created_at', { ascending: false }),
          supabase.from('company_reviews').select('*').order('created_at', { ascending: false }),
          supabase.from('company_feedback').select('*').order('created_at', { ascending: false }),
        ])

        if (!pRes.error) plantRevs = pRes.data || []
        if (!cRes.error) compRevs = cRes.data || []
        if (!fRes.error) compFb = fRes.data || []

        if (!pRes.error || !cRes.error || !fRes.error) {
          return {
            plantReviews: plantRevs.length ? plantRevs : localPlantReviews,
            companyReviews: compRevs.length ? compRevs : localCompanyReviews,
            companyFeedback: compFb.length ? compFb : localCompanyFeedback,
          }
        }
      } catch (err) {
        console.warn('Admin reviews fetch exception:', err.message)
      }
    }

    return {
      plantReviews: [...localPlantReviews],
      companyReviews: [...localCompanyReviews],
      companyFeedback: [...localCompanyFeedback],
    }
  },

  async updatePlantReviewStatus(id, status) {
    if (supabase) {
      const { error } = await supabase
        .from('plant_reviews')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      return true
    }
    localPlantReviews = localPlantReviews.map(item => item.id === id ? { ...item, status } : item)
    return true
  },

  async updateCompanyReview(id, updates) {
    if (supabase) {
      const { error } = await supabase
        .from('company_reviews')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      return true
    }
    localCompanyReviews = localCompanyReviews.map(item => item.id === id ? { ...item, ...updates } : item)
    return true
  },

  async updateCompanyFeedbackStatus(id, status) {
    if (supabase) {
      const { error } = await supabase
        .from('company_feedback')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      return true
    }
    localCompanyFeedback = localCompanyFeedback.map(item => item.id === id ? { ...item, status } : item)
    return true
  },

  async deleteItem(type, id) {
    const tableMap = {
      plant: 'plant_reviews',
      company_review: 'company_reviews',
      feedback: 'company_feedback',
    }
    const table = tableMap[type]

    if (supabase && table) {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
      return true
    }

    if (type === 'plant') {
      localPlantReviews = localPlantReviews.filter(item => item.id !== id)
    } else if (type === 'company_review') {
      localCompanyReviews = localCompanyReviews.filter(item => item.id !== id)
    } else {
      localCompanyFeedback = localCompanyFeedback.filter(item => item.id !== id)
    }
    return true
  },
}
