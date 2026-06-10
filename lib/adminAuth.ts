import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export const COOKIE_NAME = 'raven_admin_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'ravens-nest'

export function verifyAdminPassword(password: string): boolean {
  return password === (process.env.ADMIN_PASSWORD ?? 'admin123')
}

export function verifyAdminSession(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value
  return token === (process.env.ADMIN_PASSWORD ?? 'admin123')
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return token === (process.env.ADMIN_PASSWORD ?? 'admin123')
}

export function buildAdminSessionCookie(value: string): string {
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_MAX_AGE}`
}

export function getAdminPath(): string {
  return ADMIN_SECRET
}
