import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUser } from '@/lib/auth'
import sql from '@/lib/db'

export async function GET() {
  const { userId: clerkId } = auth()
  if (!clerkId) return NextResponse.json({ products: [] })
  const user = await getUser()
  if (!user) return NextResponse.json({ products: [] })

  const products = await sql`
    SELECT DISTINCT o.product_id, p.name AS product_name, p.category AS product_category, p.images AS product_images
    FROM orders o LEFT JOIN products p ON p.id=o.product_id
    WHERE o.user_id=${user.id} AND o.status IN ('paid','completed')
      AND NOT EXISTS (SELECT 1 FROM reviews r WHERE r.user_id=o.user_id AND r.product_id=o.product_id)
  `
  return NextResponse.json({ products: products.map((p: any) => ({ ...p, product_image: p.product_images?.[0] ?? null })) })
}
