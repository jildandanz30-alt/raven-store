// lib/adminAuth.ts
// Admin pakai cookie session terpisah (bukan Clerk — untuk panel admin tersembunyi)
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123'
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'ravens-nest'

export const COOKIE_NAME = 'raven_admin_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 // 24 jam

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export function buildAdminSessionCookie(): string {
  // Dalam sistem sederhana ini, kita gunakan password sebagai token
  // Untuk produksi lebih aman, gunakan JWT atau random string yang disimpan di DB
  return ADMIN_PASSWORD
}

export function verifyAdminSession(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value
  return token === ADMIN_PASSWORD
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return token === ADMIN_PASSWORD
}

export function getAdminPath(): string {
  return ADMIN_SECRET
}
