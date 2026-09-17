import { supabase } from '@/lib/supabase'

export async function signUp({ email, password, fullName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  if (error) throw error
  return data
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/account/reset-password`,
  })
  if (error) throw error
}

export async function getProfile(userId) {
  if (!userId) return null

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.warn('Supabase getProfile warning:', error.message)
    }

    if (data) {
      try {
        localStorage.setItem(`lotosphere_profile_${userId}`, JSON.stringify(data))
      } catch {}
      return data
    }
  } catch (err) {
    console.warn('Error fetching profile from Supabase:', err)
  }

  // Local storage fallback for seamless persistence
  try {
    const saved = localStorage.getItem(`lotosphere_profile_${userId}`)
    if (saved) return JSON.parse(saved)
  } catch {}

  return null
}

export async function updateProfile(userId, updates) {
  if (!userId) throw new Error('User ID is required to update profile')

  const profilePayload = {
    id: userId,
    ...updates,
    updated_at: new Date().toISOString(),
  }

  let dbData = null
  let dbError = null

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profilePayload)
      .select()
      .maybeSingle()

    if (error) {
      dbError = error
      console.error('🌿 [Supabase updateProfile Error]:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        table: 'profiles',
        userId,
      })
    } else if (data) {
      dbData = data
    }
  } catch (err) {
    dbError = err
    console.error('Exception during profile upsert:', {
      code: err.code || 'ERR_PROFILE_WRITE',
      message: err.message,
      details: err.details || null,
      hint: err.hint || null,
    })
  }

  // Sync to local storage for instant UI state and fallback resilience
  try {
    const existing = JSON.parse(localStorage.getItem(`lotosphere_profile_${userId}`) || '{}')
    const merged = { ...existing, ...profilePayload, ...(dbData || {}) }
    localStorage.setItem(`lotosphere_profile_${userId}`, JSON.stringify(merged))
    if (!dbError || (!dbError.message?.includes('JWT') && !dbError.message?.includes('policy'))) {
      return dbData || merged
    }
  } catch {}

  if (dbError && !dbData) {
    throw dbError
  }

  return dbData || profilePayload
}
