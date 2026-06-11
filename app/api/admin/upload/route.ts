import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/adminAuth'

export async function POST(req: NextRequest) {
  const ok = await isAdminAuthenticated()
  if (!ok) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  const { url } = await req.json()
  if (!url?.startsWith('http')) return NextResponse.json({ error:'URL tidak valid' }, { status:400 })
  return NextResponse.json({ url })
}
