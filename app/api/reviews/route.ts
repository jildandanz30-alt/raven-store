import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUser } from '@/lib/auth'
import sql from '@/lib/db'

export async function GET() {
  const { userId: clerkId } = auth()
  if (!clerkId) return NextResponse.json({ reviews: [] })
  const user = await getUser()
  if (!user) return NextResponse.json({ reviews: [] })

  const reviews = await sql`
    SELECT r.*, p.name AS product_name, p.category AS product_category, p.images AS product_images
    FROM reviews r LEFT JOIN products p ON p.id=r.product_id
    WHERE r.user_id=${user.id} ORDER BY r.created_at DESC
  `
  return NextResponse.json({ reviews })
}

export async function POST(req: NextRequest) {
  const { userId: clerkId } = auth()
  if (!clerkId) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  const user = await getUser()
  if (!user) return NextResponse.json({ error:'User not found' }, { status:401 })

  const { product_id, rating, comment } = await req.json()
  if (!product_id || !rating) return NextResponse.json({ error:'product_id dan rating wajib' }, { status:400 })
  if (rating < 1 || rating > 5) return NextResponse.json({ error:'Rating 1-5' }, { status:400 })

  // Hanya bisa review kalau sudah beli
  const [purchased] = await sql`
    SELECT 1 FROM orders WHERE user_id=${user.id} AND product_id=${product_id} AND status IN ('paid','completed') LIMIT 1
  `
  if (!purchased) return NextResponse.json({ error:'Kamu belum memiliki produk ini' }, { status:403 })

  const [existing] = await sql`SELECT 1 FROM reviews WHERE user_id=${user.id} AND product_id=${product_id} LIMIT 1`
  if (existing) return NextResponse.json({ error:'Sudah review produk ini' }, { status:400 })

  const [review] = await sql`
    INSERT INTO reviews (user_id, product_id, rating, comment, created_at)
    VALUES (${user.id}, ${product_id}, ${rating}, ${comment??null}, NOW())
    RETURNING *
  `
  return NextResponse.json({ review })
}
