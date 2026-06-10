import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUser } from '@/lib/auth'
import sql from '@/lib/db'
import { sendDiscordEmbed } from '@/lib/discord'

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

    const { product_id, payment_method, notes } = await req.json()
    if (!product_id || !payment_method)
      return NextResponse.json({ error: 'product_id dan payment_method wajib diisi' }, { status: 400 })

    const [product] = await sql`SELECT * FROM products WHERE id = ${product_id} AND is_active = true LIMIT 1`
    if (!product) return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 })

    const [order] = await sql`
      INSERT INTO orders (user_id, product_id, amount, status, payment_method, notes, created_at, updated_at)
      VALUES (${user.id}, ${product.id}, ${product.price}, 'pending', ${payment_method}, ${notes??null}, NOW(), NOW())
      RETURNING *
    `

    await sendDiscordEmbed({
      title: '🛒 Order Baru Masuk!',
      description: `Order baru menunggu konfirmasi pembayaran.`,
      color: 0xFFD700,
      fields: [
        { name: '🛒 Produk', value: product.name, inline: true },
        { name: '💰 Harga', value: `Rp${product.price.toLocaleString('id-ID')}`, inline: true },
        { name: '📧 Pembeli', value: user.email, inline: true },
        { name: '💳 Metode Bayar', value: payment_method.toUpperCase(), inline: true },
        { name: '🆔 Order ID', value: `\`${order.id}\``, inline: false },
      ],
    })

    return NextResponse.json({
      success: true, order_id: order.id,
      payment_info: getPaymentInfo(payment_method),
    })
  } catch (err) {
    console.error('[payment/create]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getPaymentInfo(method: string) {
  const map: Record<string, { name: string; number: string; holder: string }> = {
    dana:  { name:'Dana',  number:process.env.PAYMENT_DANA??'',  holder:process.env.PAYMENT_HOLDER_NAME??'' },
    gopay: { name:'GoPay', number:process.env.PAYMENT_GOPAY??'', holder:process.env.PAYMENT_HOLDER_NAME??'' },
    qris:  { name:'QRIS',  number:process.env.PAYMENT_QRIS_URL??'', holder:process.env.PAYMENT_HOLDER_NAME??'' },
  }
  return map[method] ?? map['dana']
}
