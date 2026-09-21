import { supabase } from '@/lib/supabase'

const BUCKET_NAME = 'feedback-photos'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const storageService = {
  /**
   * Upload a customer feedback/review photo to Supabase Storage.
   * Returns the public URL of the uploaded image.
   */
  async uploadFeedbackPhoto(file) {
    if (!file) return null

    // 1. Validate File Format
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      throw new Error("This image format isn't supported. Please use JPG, PNG, or WEBP.")
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("This image is too large. Maximum allowed file size is 5MB.")
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    const filePath = `reviews/${fileName}`

    if (supabase) {
      try {
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath)

          if (publicUrlData?.publicUrl) {
            return publicUrlData.publicUrl
          }
        } else if (error) {
          console.warn('Supabase storage upload warning:', error.message)
        }
      } catch (err) {
        console.warn('Storage upload exception, using local data fallback:', err.message)
      }
    }

    // Fallback: Convert file to Data URL for seamless client experience if DB storage is offline
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to read image file.'))
      reader.readAsDataURL(file)
    })
  },

  /**
   * Delete a photo from Supabase Storage given its public URL
   */
  async deleteFeedbackPhoto(photoUrl) {
    if (!photoUrl || !supabase || !photoUrl.includes(BUCKET_NAME)) return false

    try {
      // Extract path after bucket name
      const parts = photoUrl.split(`${BUCKET_NAME}/`)
      if (parts.length > 1) {
        const filePath = parts[1]
        const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])
        if (!error) return true
      }
    } catch (err) {
      console.warn('Storage delete exception:', err.message)
    }
    return false
  },
}
