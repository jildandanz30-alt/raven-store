import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/adminAuth'
import sql from '@/lib/db'
import { sendDiscordEmbed } from '@/lib/discord'

export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  const orders = await sql`
    SELECT o.*, p.name AS product_name, p.category AS product_category, p.download_url,
           u.email AS user_email, u.name AS user_name
    FROM orders o LEFT JOIN products p ON p.id=o.product_id LEFT JOIN users u ON u.id=o.user_id
    ORDER BY o.created_at DESC
  `
  return NextResponse.json({ orders })
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdminSession(req)) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  const { orderId, status } = await req.json()
  if (!orderId || !status) return NextResponse.json({ error:'orderId dan status wajib diisi' }, { status:400 })

  const [order] = await sql`
    SELECT o.*, p.name AS product_name, p.download_url, u.email AS user_email
    FROM orders o LEFT JOIN products p ON p.id=o.product_id LEFT JOIN users u ON u.id=o.user_id
    WHERE o.id=${orderId} LIMIT 1
  `
  if (!order) return NextResponse.json({ error:'Order tidak ditemukan' }, { status:404 })

  await sql`UPDATE orders SET status=${status}, updated_at=NOW() WHERE id=${orderId}`

  if (status === 'paid') {
    await sendDiscordEmbed({
      title:'✅ Pembayaran Dikonfirmasi!', description:`Order **${orderId}** telah diapprove.`, color:0x00ff88,
      fields:[
        { name:'🛒 Produk', value:order.product_name??'-', inline:true },
        { name:'💰 Harga', value:`Rp${(order.amount??0).toLocaleString('id-ID')}`, inline:true },
        { name:'📧 Pembeli', value:order.user_email??order.user_id, inline:true },
        { name:'🆔 Order ID', value:`\`${orderId}\``, inline:false },
        ...(order.download_url ? [{ name:'🔗 Download', value:order.download_url, inline:false }] : []),
      ],
    })
  }
  if (status === 'cancelled') {
    await sendDiscordEmbed({
      title:'❌ Order Dibatalkan', description:`Order **${orderId}** dibatalkan.`, color:0xff4444,
      fields:[{ name:'📧 Pembeli', value:order.user_email??order.user_id, inline:true }],
    })
  }
  return NextResponse.json({ success:true, status })
}
