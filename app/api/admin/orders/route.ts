import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/adminAuth'
import { dbSelect, dbUpdate } from '@/lib/db'
import { sendDiscordEmbed } from '@/lib/discord'

export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const orders = dbSelect<any>('orders').sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))
  const products = dbSelect<any>('products')
  const users = dbSelect<any>('users')

  const result = orders.map((o: any) => {
    const p = products.find((p: any) => p.id === o.product_id)
    const u = users.find((u: any) => u.id === o.user_id)
    return {
      ...o,
      product_name: p?.name ?? null,
      product_category: p?.category ?? null,
      download_url: p?.download_url ?? null,
      user_email: u?.email ?? null,
      user_name: u?.name ?? null,
    }
  })
  return NextResponse.json({ orders: result })
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdminSession(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { orderId, status } = await req.json()
  if (!orderId || !status) return NextResponse.json({ error: 'orderId dan status wajib diisi' }, { status: 400 })

  const orders = dbSelect<any>('orders')
  const products = dbSelect<any>('products')
  const users = dbSelect<any>('users')
  const order = orders.find((o: any) => o.id === orderId)
  if (!order) return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })

  dbUpdate<any>('orders', orderId, { status })

  const p = products.find((p: any) => p.id === order.product_id)
  const u = users.find((u: any) => u.id === order.user_id)

  if (status === 'paid') {
    await sendDiscordEmbed({
      title: '✅ Pembayaran Dikonfirmasi!', description: `Order **${orderId}** telah diapprove.`, color: 0x00ff88,
      fields: [
        { name: '🛒 Produk', value: p?.name ?? '-', inline: true },
        { name: '💰 Harga', value: `Rp${(order.amount ?? 0).toLocaleString('id-ID')}`, inline: true },
        { name: '📧 Pembeli', value: u?.email ?? order.user_id, inline: true },
        { name: '🆔 Order ID', value: `\`${orderId}\``, inline: false },
        ...(p?.download_url ? [{ name: '🔗 Download', value: p.download_url, inline: false }] : []),
      ],
    })
  }
  if (status === 'cancelled') {
    await sendDiscordEmbed({
      title: '❌ Order Dibatalkan', description: `Order **${orderId}** dibatalkan.`, color: 0xff4444,
      fields: [{ name: '📧 Pembeli', value: u?.email ?? order.user_id, inline: true }],
    })
  }
  return NextResponse.json({ success: true, status })
}
