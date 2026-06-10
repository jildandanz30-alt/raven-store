import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUser } from '@/lib/auth'
import sql from '@/lib/db'
import { sendDiscordNotification } from '@/lib/discord'

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

    const { productId } = await req.json()

    const [product] = await sql`SELECT * FROM products WHERE id = ${productId} AND is_active = true LIMIT 1`
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    const [existing] = await sql`
      SELECT id FROM orders WHERE user_id = ${user.id} AND product_id = ${productId} AND status = 'paid' LIMIT 1
    `
    if (existing) return NextResponse.json({ error: 'Already purchased' }, { status: 400 })

    const [order] = await sql`
      INSERT INTO orders (user_id, product_id, amount, status, created_at, updated_at)
      VALUES (${user.id}, ${productId}, ${product.price}, 'pending', NOW(), NOW())
      RETURNING *
    `

    await sendDiscordNotification({
      title: '🛒 Order Baru!',
      description: `Order baru dari **${user.email}**`,
      fields: [
        { name: 'Produk', value: product.name, inline: true },
        { name: 'Harga', value: `Rp${product.price.toLocaleString('id-ID')}`, inline: true },
        { name: 'Order ID', value: order.id, inline: true },
      ],
    })

    return NextResponse.json({ order_id: order.id })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
