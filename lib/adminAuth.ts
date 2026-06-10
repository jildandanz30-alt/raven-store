// lib/adminAuth.ts
// Admin pakai cookie session terpisah (bukan Clerk — untuk panel admin tersembunyi)
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123'
const SESSION_KEY = 'raven_admin_session'
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'ravens-nest'

export function verifyAdminSession(req: NextRequest): boolean {
  const token = req.cookies.get(SESSION_KEY)?.value
  return token === ADMIN_PASSWORD
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = cookies()
  const token = cookieStore.get(SESSION_KEY)?.value
  return token === ADMIN_PASSWORD
}

export function getAdminPath(): string {
  return ADMIN_SECRET
}
