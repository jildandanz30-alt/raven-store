// Clerk menangani OAuth di /sso-callback
// File ini hanya untuk backward compat
import { NextRequest, NextResponse } from 'next/server'
export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/dashboard', req.url))
}
