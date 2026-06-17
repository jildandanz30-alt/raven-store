import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/auth'
import { dbSelect } from '@/lib/db'

function formatPrice(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const statusConfig: Record<string, { label: string; color: string; icon: string; desc: string }> = {
  pending:   { label: 'PENDING',   color: '#f0a500', icon: '⏳', desc: 'Menunggu pembayaran' },
  paid:      { label: 'PAID',      color: '#44dd88', icon: '✅', desc: 'Pembayaran terkonfirmasi' },
  completed: { label: 'COMPLETED', color: '#44aaff', icon: '🎉', desc: 'Order selesai' },
  cancelled: { label: 'CANCELLED', color: '#ff4444', icon: '❌', desc: 'Order dibatalkan' },
}

export default async function OrdersPage() {
  const { userId: clerkId } = auth()
  if (!clerkId) redirect('/login')
  const user = await getUser()
  if (!user) redirect('/login')

  const allOrders = dbSelect<any>('orders', { user_id: user.id } as any)
    .sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))
  const products = dbSelect<any>('products')

  const orders = allOrders.map((o: any) => {
    const p = products.find((p: any) => p.id === o.product_id)
    return {
      ...o,
      product_name: p?.name ?? null,
      product_category: p?.category ?? null,
      product_images: p?.images ?? [],
      download_url: p?.download_url ?? null,
    }
  })

  const counts = orders.reduce((acc: Record<string, number>, o: any) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1; return acc
  }, {})

  const panel: React.CSSProperties = {
    border: '3px solid #2a2a2a', background: '#141414', marginBottom: '1.2rem', overflow: 'hidden'
  }

  return (
    <div style={{ color: '#F5F5F0', fontFamily: 'Comic Neue,cursive' }}>
      <h1 style={{ fontFamily: 'Bangers,cursive', fontSize: '2rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>MY ORDERS</h1>
      <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{orders.length} order total</p>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '6px 14px', background: '#1a1a1a', border: '2px solid #2a2a2a' }}>
            <span style={{ fontFamily: 'Bangers,cursive', fontSize: '0.75rem', padding: '1px 8px', border: `2px solid ${cfg.color}`, color: cfg.color }}>{cfg.label}</span>
            <span style={{ fontFamily: 'Bangers,cursive', fontSize: '1.3rem', color: '#F5F5F0' }}>{counts[key] ?? 0}</span>
          </div>
        ))}
      </div>

      {orders.length === 0 ? (
        <div style={{ ...panel, textAlign: 'center', padding: '3rem', border: '3px solid #E8E8E0', boxShadow: '5px 5px 0 #E8E8E0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📋</div>
          <div style={{ fontFamily: 'Bangers,cursive', fontSize: '1.5rem', letterSpacing: '0.08em' }}>NO ORDERS YET!</div>
          <p style={{ color: '#666', marginBottom: '1rem' }}>Belum ada order.</p>
          <Link href="/products" style={{ fontFamily: 'Bangers,cursive', padding: '8px 20px', border: '3px solid #E8E8E0', boxShadow: '3px 3px 0 #E8E8E0', color: '#F5F5F0', textDecoration: 'none', letterSpacing: '0.08em' }}>
            BELANJA SEKARANG
          </Link>
        </div>
      ) : (
        orders.map((o: any) => {
          const s = statusConfig[o.status] ?? statusConfig.pending
          const imgs = o.product_images ?? []
          return (
            <div key={o.id} style={panel}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '2px solid #2a2a2a', background: '#111' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.75rem', color: '#555', letterSpacing: '0.15em' }}>ORDER</span>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.85rem', color: '#888', fontWeight: 700 }}>#{o.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontFamily: 'Bangers,cursive', fontSize: '0.8rem', padding: '2px 10px', border: `2px solid ${s.color}`, color: s.color }}>{s.icon} {s.label}</span>
                  <span style={{ color: '#555', fontSize: '0.8rem' }}>{formatDate(o.created_at)}</span>
                </div>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {imgs[0] ? (
                  <img src={imgs[0]} alt={o.product_name} style={{ width: 48, height: 48, objectFit: 'cover', border: '2px solid #333', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222', border: '2px solid #333', fontSize: '1.3rem', flexShrink: 0 }}>📦</div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Bangers,cursive', letterSpacing: '0.06em', fontSize: '1.1rem' }}>{o.product_name ?? 'Produk'}</div>
                  <div style={{ color: '#555', fontSize: '0.75rem', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono,monospace' }}>{o.product_category?.toUpperCase()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Bangers,cursive', fontSize: '1.2rem' }}>{formatPrice(o.amount)}</div>
                  {o.payment_method && <div style={{ color: '#555', fontSize: '0.75rem' }}>via {o.payment_method}</div>}
                </div>
              </div>
              <div style={{ padding: '10px 16px', borderTop: '1px dashed #222', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <span style={{ color: '#444', fontSize: '0.75rem', alignSelf: 'center' }}>{s.desc}</span>
                {o.status === 'completed' && o.download_url && (
                  <a href={o.download_url} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: 'Bangers,cursive', fontSize: '0.85rem', padding: '5px 14px', background: '#44dd88', color: '#0D0D0D', border: '2px solid #44dd88', textDecoration: 'none', letterSpacing: '0.06em' }}>
                    ⬇ DOWNLOAD
                  </a>
                )}
                {o.status === 'pending' && (
                  <Link href="/dashboard/orders"
                    style={{ fontFamily: 'Bangers,cursive', fontSize: '0.85rem', padding: '5px 14px', border: '2px solid #f0a500', color: '#f0a500', textDecoration: 'none', letterSpacing: '0.06em' }}>
                    💳 BAYAR
                  </Link>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
