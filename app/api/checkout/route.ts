import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUser } from '@/lib/auth'
import { dbSelectOne, dbInsert, dbSelect } from '@/lib/db'
import { sendDiscordNotification } from '@/lib/discord'

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

    const { productId } = await req.json()

    const product = dbSelectOne<any>('products', { id: productId, is_active: true } as any)
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    const existing = dbSelect<any>('orders').find(
      (o: any) => o.user_id === user.id && o.product_id === productId && o.status === 'paid'
    )
    if (existing) return NextResponse.json({ error: 'Already purchased' }, { status: 400 })

    const order = dbInsert<any>('orders', {
      user_id: user.id, product_id: productId, amount: product.price, status: 'pending',
    })

    await sendDiscordNotification({
      title: '🛒 Order Baru!', description: `Order baru dari **${user.email}**`,
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
