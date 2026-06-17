import { NextRequest, NextResponse } from 'next/server'
import { dbInsert } from '@/lib/db'
import { sendDiscordNotification } from '@/lib/discord'

export async function POST(req: NextRequest) {
  try {
    const { service_type, server_name, needs, discord_contact } = await req.json()
    if (!service_type || !server_name || !needs || !discord_contact)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const data = dbInsert<any>('jasa_orders', {
      service_type, server_name, needs, discord_contact, status: 'pending',
    })

    const labels: Record<string, string> = {
      addon: 'Pasang Add-on', resourcepack: 'Pasang Resource Pack',
      itemadder: 'Setup ItemAdder/Oraxen', website: 'Buat Website Store',
    }
    await sendDiscordNotification({
      title: '🛠 Order Jasa Baru!',
      description: `Order jasa dari **${discord_contact}**`,
      color: 0xffffff,
      fields: [
        { name: 'Jenis Jasa', value: labels[service_type] ?? service_type, inline: true },
        { name: 'Server', value: server_name, inline: true },
        { name: 'Discord', value: discord_contact, inline: true },
        { name: 'Kebutuhan', value: needs.slice(0, 500) },
        { name: 'Order ID', value: data.id, inline: true },
      ],
    })
    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('Jasa order error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
