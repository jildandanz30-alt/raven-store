import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUser } from '@/lib/auth'
import { dbSelect } from '@/lib/db'

export async function GET() {
  const { userId: clerkId } = auth()
  if (!clerkId) return NextResponse.json({ products: [] })
  const user = await getUser()
  if (!user) return NextResponse.json({ products: [] })

  const orders = dbSelect<any>('orders').filter(
    (o: any) => o.user_id === user.id && ['paid','completed'].includes(o.status)
  )
  const reviews = dbSelect<any>('reviews', { user_id: user.id } as any)
  const reviewedIds = new Set(reviews.map((r: any) => r.product_id))
  const products = dbSelect<any>('products')

  const result = orders
    .filter((o: any) => !reviewedIds.has(o.product_id))
    .map((o: any) => {
      const p = products.find((p: any) => p.id === o.product_id)
      return {
        product_id: o.product_id,
        product_name: p?.name ?? null,
        product_category: p?.category ?? null,
        product_images: p?.images ?? [],
        product_image: p?.images?.[0] ?? null,
      }
    })
    .filter((p: any, i: number, arr: any[]) => arr.findIndex((x: any) => x.product_id === p.product_id) === i)

  return NextResponse.json({ products: result })
}
