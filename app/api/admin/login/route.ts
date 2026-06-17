import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminPassword, buildAdminSessionCookie, COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/adminAuth'
import { sendAdminAlert } from '@/lib/discord'

export async function POST(req: NextRequest) {
  const { password, adminSecret } = await req.json()

  // Validate the URL segment matches env
  const expectedSecret = process.env.ADMIN_SECRET_PATH ?? 'superadmin'
  if (adminSecret !== expectedSecret) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (!verifyAdminPassword(password)) {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    await sendAdminAlert(
      '⚠️ Failed admin login attempt',
      `IP: ${ip} — wrong password entered`
    )
    return NextResponse.json({ error: 'Password salah.' }, { status: 401 })
  }

  const token = buildAdminSessionCookie()

  const res = NextResponse.json({ success: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })

  return res
}
