import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/auth'
import { dbSelect } from '@/lib/db'

function formatPrice(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

export default async function DashboardPage() {
  const { userId: clerkId } = auth()
  if (!clerkId) redirect('/login')

  const user = await getUser()
  if (!user) redirect('/login')

  const allOrders = dbSelect<any>('orders', { user_id: user.id } as any)
  const allReviews = dbSelect<any>('reviews', { user_id: user.id } as any)
  const products = dbSelect<any>('products')

  const ordersCount = allOrders.length
  const downloadsCount = allOrders.filter((o: any) => ['paid', 'completed'].includes(o.status)).length
  const reviewsCount = allReviews.length

  const recentOrders = allOrders
    .sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))
    .slice(0, 3)
    .map((o: any) => {
      const p = products.find((p: any) => p.id === o.product_id)
      return { ...o, product_name: p?.name ?? null }
    })

  const stats = [
    { label: 'Total Orders', value: ordersCount, icon: '📦', href: '/dashboard/orders', color: '#44aaff' },
    { label: 'Downloads', value: downloadsCount, icon: '⬇️', href: '/dashboard/downloads', color: '#44dd88' },
    { label: 'Reviews', value: reviewsCount, icon: '⭐', href: '/dashboard/reviews', color: '#f0a500' },
  ]

  const badge: Record<string, { label: string; color: string }> = {
    pending:   { label: 'PENDING',   color: '#f0a500' },
    paid:      { label: 'PAID',      color: '#44dd88' },
    completed: { label: 'DONE',      color: '#44aaff' },
    cancelled: { label: 'CANCELLED', color: '#ff4444' },
  }

  return (
    <div style={{ color: '#F5F5F0', fontFamily: 'Comic Neue,cursive' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1.5rem', border: '3px solid #E8E8E0', boxShadow: '5px 5px 0 #E8E8E0', background: '#1A1A1A' }}>
        {user.avatar && <img src={user.avatar} alt={user.name ?? ''} style={{ width: 60, height: 60, borderRadius: '50%', border: '3px solid #E8E8E0' }} />}
        <div>
          <div style={{ fontFamily: 'Bangers,cursive', fontSize: '1.8rem', letterSpacing: '0.08em' }}>
            SELAMAT DATANG, {(user.name ?? user.email).toUpperCase()}!
          </div>
          <div style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>{user.email}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <Link key={s.href} href={s.href} style={{ textDecoration: 'none', padding: '1.2rem', border: `3px solid ${s.color}`, boxShadow: `4px 4px 0 ${s.color}`, background: '#1A1A1A', display: 'block' }}>
            <div style={{ fontSize: '2rem' }}>{s.icon}</div>
            <div style={{ fontFamily: 'Bangers,cursive', fontSize: '2rem', color: s.color }}>{s.value}</div>
            <div style={{ color: '#AAAAAA', fontSize: '0.8rem' }}>{s.label}</div>
          </Link>
        ))}
      </div>

      <div style={{ border: '3px solid #E8E8E0', boxShadow: '5px 5px 0 #E8E8E0', background: '#1A1A1A', padding: '1.2rem' }}>
        <div style={{ fontFamily: 'Bangers,cursive', fontSize: '1.3rem', letterSpacing: '0.08em', marginBottom: '1rem' }}>📦 ORDER TERBARU</div>
        {recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#555' }}>Belum ada order.</div>
        ) : (
          recentOrders.map((o: any) => {
            const b = badge[o.status] ?? { label: o.status.toUpperCase(), color: '#888' }
            return (
              <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #222' }}>
                <div>
                  <div style={{ fontFamily: 'Bangers,cursive', letterSpacing: '0.05em' }}>{o.product_name ?? 'Produk'}</div>
                  <div style={{ color: '#555', fontSize: '0.8rem' }}>{new Date(o.created_at).toLocaleDateString('id-ID')}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Bangers,cursive', fontSize: '0.8rem', padding: '2px 8px', border: `2px solid ${b.color}`, color: b.color }}>{b.label}</span>
                  <span style={{ fontFamily: 'Bangers,cursive' }}>{formatPrice(o.amount)}</span>
                </div>
              </div>
            )
          })
        )}
        <Link href="/dashboard/orders" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: '#AAAAAA', fontSize: '0.85rem', textDecoration: 'none' }}>
          Lihat semua →
        </Link>
      </div>
    </div>
  )
}
