import { NextRequest, NextResponse } from 'next/server'
import { dbSelectOne } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = dbSelectOne<any>('products', { id: params.id, is_active: true } as any)
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ product })
}
