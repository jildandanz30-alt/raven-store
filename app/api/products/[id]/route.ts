import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const [product] = await sql`SELECT * FROM products WHERE id=${params.id} AND is_active=true LIMIT 1`
  if (!product) return NextResponse.json({ error:'Not found' }, { status:404 })
  return NextResponse.json({ product })
}
