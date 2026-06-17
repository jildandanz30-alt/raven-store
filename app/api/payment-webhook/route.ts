import { NextRequest, NextResponse } from 'next/server'
import { dbUpdate, dbSelectOne, dbSelect } from '@/lib/db'
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

    const order = dbUpdate<any>('orders', order_id, { status: 'paid' })
    const products = dbSelect<any>('products')
    const product = order?.product_id ? products.find((p: any) => p.id === order.product_id) : null

    await sendDiscordNotification({
      title: '✅ Pembayaran Berhasil!',
      description: `Order **${order_id}** sudah dibayar.`,
      color: 0x00ff00,
      fields: [
        { name: 'Produk', value: product?.name ?? '-', inline: true },
        { name: 'Amount', value: `Rp${parseInt(gross_amount).toLocaleString('id-ID')}`, inline: true },
      ],
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
