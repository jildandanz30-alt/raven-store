import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that don't need Clerk auth
const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/products(.*)',
  '/jasa(.*)',
  '/api/products(.*)',
  '/api/reviews(.*)',
  '/api/admin/(.*)',      // Admin APIs use password auth
  '/sso-callback(.*)',
  '/(.*)/admin(.*)',      // Hidden admin routes use password auth
])

export default clerkMiddleware((auth, req) => {
  // If it's not a public route, protect it with Clerk
  if (!isPublicRoute(req)) {
    auth().protect()
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
