// middleware.ts — Route protection dengan Clerk
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'ravens-nest'

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/products(.*)',
  '/jasa(.*)',
  '/api/auth(.*)',
  '/api/health(.*)',
  '/api/payment-webhook(.*)',
])

export default clerkMiddleware((auth, req) => {
  const { pathname } = req.nextUrl

  // Rute publik — lewatkan saja
  if (isPublicRoute(req)) return NextResponse.next()

  // Semua rute lain butuh login
  auth().protect()

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
