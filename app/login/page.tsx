// app/login/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import LoginClient from './LoginClient'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string }
}) {
  const { userId } = auth()
  if (userId) redirect(searchParams.redirectTo ?? '/dashboard')

  return <LoginClient redirectTo={searchParams.redirectTo} />
}
