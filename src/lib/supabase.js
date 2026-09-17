import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Safe diagnostic logging (never exposes complete keys or secrets)
const hasUrl = Boolean(supabaseUrl && !supabaseUrl.includes('placeholder'))
const hasAnonKey = Boolean(supabaseAnonKey && !supabaseAnonKey.includes('placeholder'))
let hostname = 'not configured (using placeholder)'

if (hasUrl) {
  try {
    hostname = new URL(supabaseUrl).hostname
  } catch {
    hostname = 'invalid URL format'
  }
}

if (import.meta.env.DEV || !hasUrl || !hasAnonKey) {
  console.info('🌿 [Lotosphere Diagnostic] Supabase Configuration Status:', {
    urlConfigured: hasUrl,
    anonKeyConfigured: hasAnonKey,
    supabaseHost: hostname,
  })
}

if (!hasUrl || !hasAnonKey) {
  console.warn(
    '⚠️ [Lotosphere] Supabase production environment variables missing or incomplete.\n' +
    'Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your hosting environment (e.g. Vercel Project Settings) and redeploy.'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

/**
 * Safe connection diagnostic utility to test read and capture exact PostgREST errors.
 */
export async function diagnoseSupabaseConnection() {
  const result = {
    urlConfigured: hasUrl,
    anonKeyConfigured: hasAnonKey,
    supabaseHost: hostname,
    authStatus: 'checking...',
    readStatus: 'checking...',
  }

  try {
    const { data: { session }, error: authErr } = await supabase.auth.getSession()
    if (authErr) {
      result.authStatus = `Auth Error: [${authErr.code || 'UNKNOWN'}] ${authErr.message}`
    } else {
      result.authStatus = session?.user ? `Authenticated (${session.user.id.slice(0, 8)}...)` : 'Guest (Unauthenticated)'
    }
  } catch (e) {
    result.authStatus = `Auth Exception: ${e.message}`
  }

  try {
    const { data, error, count } = await supabase
      .from('categories')
      .select('id, name', { count: 'exact', head: true })

    if (error) {
      result.readStatus = `Read Failed: [${error.code || 'UNKNOWN'}] ${error.message} (details: ${error.details || 'none'}, hint: ${error.hint || 'none'})`
    } else {
      result.readStatus = `Read Success (${count ?? data?.length ?? 0} categories found)`
    }
  } catch (e) {
    result.readStatus = `Read Exception: ${e.message}`
  }

  return result
}
