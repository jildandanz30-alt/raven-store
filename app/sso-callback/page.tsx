// app/sso-callback/page.tsx
// Clerk OAuth callback handler
'use client'
import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

export default function SSOCallbackPage() {
  return <AuthenticateWithRedirectCallback />
}
