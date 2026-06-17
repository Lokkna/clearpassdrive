import { createClient } from '@supabase/supabase-js'

const authClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)
}

// Verifies the bearer token against Supabase auth, then checks the email
// against the server-side ADMIN_EMAILS allowlist. Nothing about "admin"
// status is ever trusted from the client — this is the only check that
// matters, and every /api/admin/* route must call it first.
export async function requireAdmin(req: Request): Promise<{ email: string; userId: string } | null> {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return null

  const { data: { user }, error } = await authClient.auth.getUser(token)
  if (error || !user || !user.email) return null

  const adminEmails = getAdminEmails()
  if (adminEmails.length === 0) return null // fail closed if not configured
  if (!adminEmails.includes(user.email.toLowerCase())) return null

  return { email: user.email, userId: user.id }
}
