import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { sendDiscordNotification } from '@/lib/discord'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { order_id, transaction_status, fraud_status, signature_key, gross_amount, status_code } = body

    const hash = crypto.createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY!}`)
      .digest('hex')
    if (hash !== signature_key) return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })

    const isPaid = transaction_status === 'capture' || transaction_status === 'settlement'
    if (!isPaid || (fraud_status && fraud_status !== 'accept'))
      return NextResponse.json({ message: 'Not completed' })

    const [order] = await sql`UPDATE orders SET status='paid', updated_at=NOW() WHERE id=${order_id} RETURNING *`
    const [product] = order?.product_id ? await sql`SELECT name FROM products WHERE id=${order.product_id} LIMIT 1` : [null]

    await sendDiscordNotification({
      title: '✅ Pembayaran Berhasil!',
      description: `Order **${order_id}** sudah dibayar.`,
      color: 0x00ff00,
      fields: [
        { name:'Produk', value:product?.name??'-', inline:true },
        { name:'Amount', value:`Rp${parseInt(gross_amount).toLocaleString('id-ID')}`, inline:true },
      ],
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
