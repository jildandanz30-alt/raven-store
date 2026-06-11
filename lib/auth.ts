// lib/auth.ts — Auth helpers using Clerk
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import sql from '@/lib/db'

export interface UserProfile {
  id: string           // UUID di DB kita
  clerk_id: string     // Clerk user ID (user_xxx)
  email: string
  name: string | null
  avatar: string | null
  role: 'member' | 'admin'
  created_at: string
  updated_at: string
}

/**
 * Sync Clerk user ke DB kita, return profile.
 * Dipanggil pertama kali user login (via webhook atau on-demand).
 */
export async function syncUser(): Promise<UserProfile | null> {
  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? ''
  const name = `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || null
  const avatar = clerkUser.imageUrl ?? null

  const [user] = await sql<UserProfile[]>`
    INSERT INTO users (clerk_id, email, name, avatar, role, created_at, updated_at)
    VALUES (${clerkUser.id}, ${email}, ${name}, ${avatar}, 'member', NOW(), NOW())
    ON CONFLICT (clerk_id) DO UPDATE SET
      email      = EXCLUDED.email,
      name       = COALESCE(EXCLUDED.name, users.name),
      avatar     = COALESCE(EXCLUDED.avatar, users.avatar),
      updated_at = NOW()
    RETURNING *
  `
  return user ?? null
}

/**
 * Get current user profile dari DB.
 * Returns null jika tidak login.
 */
export async function getUser(): Promise<UserProfile | null> {
  const { userId: clerkId } = auth()
  if (!clerkId) return null

  const [user] = await sql<UserProfile[]>`
    SELECT * FROM users WHERE clerk_id = ${clerkId} LIMIT 1
  `

  // Jika belum ada di DB (pertama kali), sync dulu
  if (!user) return syncUser()

  return user ?? null
}

/** Require login — redirect ke /login jika tidak */
export async function requireAuth(): Promise<UserProfile> {
  const user = await getUser()
  if (!user) redirect('/login')
  return user
}

/** Require admin — redirect jika bukan admin */
export async function requireAdmin(): Promise<UserProfile> {
  const user = await getUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin') redirect('/dashboard')
  return user
}

export async function isAdmin(): Promise<boolean> {
  const user = await getUser()
  return user?.role === 'admin'
}

export function getAdminPath(): string {
  return process.env.ADMIN_SECRET ?? 'ravens-nest'
}
