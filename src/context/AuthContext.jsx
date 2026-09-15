import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { getProfile, signIn, signOut, signUp } from '@/services/authService'
import { mergeGuestCartToDb } from '@/services/cartService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (userId) => {
    try {
      const p = await getProfile(userId)
      setProfile(p)
    } catch {
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      setLoading(false)
    })

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const newUser = session?.user ?? null
        setUser(newUser)
        if (newUser) {
          await loadProfile(newUser.id)
          if (event === 'SIGNED_IN') {
            // Merge any guest cart items
            mergeGuestCartToDb(newUser.id).catch(() => {})
          }
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [loadProfile])

  const login = useCallback(async (email, password) => {
    const data = await signIn({ email, password })
    return data
  }, [])

  const register = useCallback(async (email, password, fullName) => {
    const data = await signUp({ email, password, fullName })
    return data
  }, [])

  const logout = useCallback(async () => {
    await signOut()
    setUser(null)
    setProfile(null)
  }, [])

  const refreshProfile = useCallback(() => {
    if (user) return loadProfile(user.id)
  }, [user, loadProfile])

  const isAdmin = profile?.is_admin === true

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isAdmin,
      login,
      register,
      logout,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
