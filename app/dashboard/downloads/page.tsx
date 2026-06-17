import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { dbSelect } from '@/lib/db'

export default async function DownloadsPage() {
  const { userId: clerkId } = auth()
  if (!clerkId) redirect('/login')
  const user = await getUser()
  if (!user) redirect('/login')

  const allOrders = dbSelect<any>('orders', { user_id: user.id } as any)
    .filter((o: any) => ['paid', 'completed'].includes(o.status))
    .sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))
  const products = dbSelect<any>('products')

  const orders = allOrders.map((o: any) => {
    const p = products.find((p: any) => p.id === o.product_id)
    return {
      ...o,
      product_name: p?.name ?? null,
      product_category: p?.category ?? null,
      product_slug: p?.slug ?? null,
      product_images: p?.images ?? [],
      download_url: p?.download_url ?? null,
    }
  })

  const panel: React.CSSProperties = { border: '3px solid #E8E8E0', boxShadow: '5px 5px 0 #E8E8E0', background: '#1A1A1A', padding: '1.2rem', marginBottom: '1rem' }

  return (
    <div>
      <h1 style={{ fontFamily: 'Bangers,cursive', fontSize: '2rem', color: '#F5F5F0', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>📥 DOWNLOAD SAYA</h1>
      {orders.length === 0 && (
        <div style={{ ...panel, color: '#AAAAAA', fontFamily: 'Comic Neue,cursive', textAlign: 'center', padding: '2.5rem' }}>
          Belum ada produk yang bisa didownload. Beli dulu, tunggu konfirmasi admin, lalu link akan muncul di sini.
        </div>
      )}
      {orders.map((o: any) => (
        <div key={o.id} style={panel}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {o.product_images?.[0] && (
              <img src={o.product_images[0]} alt={o.product_name} style={{ width: 80, height: 80, objectFit: 'cover', border: '2px solid #333', flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Bangers,cursive', fontSize: '1.3rem', color: '#F5F5F0', letterSpacing: '0.06em', marginBottom: 4 }}>{o.product_name}</div>
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem' }}>
                <span style={{ fontFamily: 'Bangers,cursive', fontSize: '0.78rem', padding: '2px 8px', border: '2px solid #555', color: '#AAAAAA' }}>{o.product_category?.toUpperCase()}</span>
                <span style={{ fontFamily: 'Bangers,cursive', fontSize: '0.78rem', padding: '2px 8px', border: '2px solid #44ff88', color: '#44ff88' }}>{o.status.toUpperCase()}</span>
              </div>
              <div style={{ fontFamily: 'Comic Neue,cursive', color: '#AAAAAA', fontSize: '0.82rem', marginBottom: '0.8rem' }}>
                Rp{(o.amount ?? 0).toLocaleString('id-ID')} · {new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              {o.download_url ? (
                <a href={o.download_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-block', padding: '6px 16px', background: '#44ff88', color: '#0D0D0D', fontFamily: 'Bangers,cursive', letterSpacing: '0.08em', border: '2px solid #44ff88', textDecoration: 'none' }}>
                  ⬇ DOWNLOAD
                </a>
              ) : (
                <span style={{ color: '#666', fontSize: '0.82rem', fontFamily: 'Comic Neue,cursive' }}>Link belum tersedia</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
