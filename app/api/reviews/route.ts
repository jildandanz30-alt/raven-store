import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUser } from '@/lib/auth'
import { dbSelect, dbInsert } from '@/lib/db'

export async function GET() {
  const { userId: clerkId } = auth()
  if (!clerkId) return NextResponse.json({ reviews: [] })
  const user = await getUser()
  if (!user) return NextResponse.json({ reviews: [] })

  const reviews = dbSelect<any>('reviews', { user_id: user.id } as any)
    .sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))
  const products = dbSelect<any>('products')

  const result = reviews.map((r: any) => {
    const p = products.find((p: any) => p.id === r.product_id)
    return {
      ...r,
      product_name: p?.name ?? null,
      product_category: p?.category ?? null,
      product_images: p?.images ?? [],
    }
  })
  return NextResponse.json({ reviews: result })
}

export async function POST(req: NextRequest) {
  const { userId: clerkId } = auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

  const { product_id, rating, comment } = await req.json()
  if (!product_id || !rating) return NextResponse.json({ error: 'product_id dan rating wajib' }, { status: 400 })
  if (rating < 1 || rating > 5) return NextResponse.json({ error: 'Rating 1-5' }, { status: 400 })

  const orders = dbSelect<any>('orders')
  const purchased = orders.find(
    (o: any) => o.user_id === user.id && o.product_id === product_id && ['paid','completed'].includes(o.status)
  )
  if (!purchased) return NextResponse.json({ error: 'Kamu belum memiliki produk ini' }, { status: 403 })

  const reviews = dbSelect<any>('reviews')
  const existing = reviews.find((r: any) => r.user_id === user.id && r.product_id === product_id)
  if (existing) return NextResponse.json({ error: 'Sudah review produk ini' }, { status: 400 })

  const review = dbInsert<any>('reviews', {
    user_id: user.id, product_id, rating, comment: comment ?? null,
  })
  return NextResponse.json({ review })
}
