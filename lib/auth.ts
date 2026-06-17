// lib/auth.ts — Auth helpers menggunakan Clerk + local JSON storage
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { dbSelectOne, dbUpsert, dbSelect } from '@/lib/db'

export interface UserProfile {
  id: string
  clerk_id: string
  email: string
  name: string | null
  avatar: string | null
  role: 'member' | 'admin'
  created_at: string
  updated_at: string
}

export async function syncUser(): Promise<UserProfile | null> {
  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? ''
  const name = `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || null
  const avatar = clerkUser.imageUrl ?? null

  const existing = dbSelectOne<UserProfile>('users', { clerk_id: clerkUser.id } as any)
  const user = dbUpsert<UserProfile>(
    'users',
    { clerk_id: clerkUser.id } as any,
    {
      email,
      name: name ?? existing?.name ?? null,
      avatar: avatar ?? existing?.avatar ?? null,
      role: existing?.role ?? 'member',
    } as any
  )
  return user
}

export async function getUser(): Promise<UserProfile | null> {
  const { userId: clerkId } = auth()
  if (!clerkId) return null

  const user = dbSelectOne<UserProfile>('users', { clerk_id: clerkId } as any)
  if (!user) return syncUser()
  return user
}

export async function requireAuth(): Promise<UserProfile> {
  const user = await getUser()
  if (!user) redirect('/login')
  return user
}

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
