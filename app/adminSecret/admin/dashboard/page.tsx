import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { getAdminStats, getWeeklyOrderData } from '@/lib/adminData'
import WeeklyChart from '@/components/admin/WeeklyChart'

function StatCard({
  icon, label, value, sub,
}: {
  icon: string; label: string; value: string; sub?: string
}) {
  return (
    <div
      style={{
        border: '3px solid #E8E8E0',
        boxShadow: '5px 5px 0 #E8E8E0',
        background: '#1A1A1A',
        padding: '1.5rem',
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: 8 }}>{icon}</div>
      <div
        style={{
          fontFamily: 'Bangers, cursive',
          fontSize: '2.2rem',
          letterSpacing: '0.04em',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ color: '#AAAAAA', fontSize: '0.85rem', marginTop: 4 }}>{label}</div>
      {sub && (
        <div style={{ color: '#555', fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

export default async function AdminDashboardPage({
  params,
}: {
  params: { adminSecret: string }
}) {
  const authed = await isAdminAuthenticated()
  if (!authed) redirect(`/${params.adminSecret}/admin`)

  const [stats, weeklyData] = await Promise.all([getAdminStats(), getWeeklyOrderData()])

  const formatRp = (n: number) =>
    n >= 1_000_000
      ? `Rp${(n / 1_000_000).toFixed(1)}jt`
      : `Rp${n.toLocaleString('id-ID')}`

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ color: '#555', letterSpacing: '0.15em', fontSize: '0.8rem', marginBottom: 4 }}>
          📊 OVERVIEW
        </p>
        <h1
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '3rem',
            letterSpacing: '0.06em',
          }}
        >
          Dashboard
        </h1>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.2rem',
          marginBottom: '3rem',
        }}
      >
        <StatCard
          icon="💰"
          label="Total Revenue"
          value={formatRp(stats.totalRevenue)}
          sub="paid + completed"
        />
        <StatCard
          icon="🛒"
          label="Total Orders"
          value={stats.totalOrders.toString()}
          sub={`${stats.pendingOrders} pending`}
        />
        <StatCard
          icon="👥"
          label="Total Users"
          value={stats.totalUsers.toString()}
        />
        <StatCard
          icon="📦"
          label="Produk Aktif"
          value={stats.activeProducts.toString()}
        />
      </div>

      {/* Weekly chart */}
      <div
        style={{
          border: '3px solid #E8E8E0',
          boxShadow: '5px 5px 0 #E8E8E0',
          background: '#1A1A1A',
          padding: '2rem',
          marginBottom: '2.5rem',
        }}
      >
        <h2
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '1.6rem',
            letterSpacing: '0.06em',
            marginBottom: '1.5rem',
          }}
        >
          📈 Order 7 Hari Terakhir
        </h2>
        <WeeklyChart data={weeklyData} />
      </div>

      {/* Quick links */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {[
          { href: 'products', label: 'Kelola Produk', icon: '📦', desc: `${stats.activeProducts} produk` },
          {
            href: 'orders',
            label: 'Lihat Orders',
            icon: '🛒',
            desc: `${stats.pendingOrders} pending`,
          },
        ].map(({ href, label, icon, desc }) => (
          <a
            key={href}
            href={href}
            style={{
              display: 'block',
              border: '3px solid #333',
              boxShadow: '4px 4px 0 #333',
              background: '#111',
              padding: '1.5rem',
              textDecoration: 'none',
              transition: 'all 0.15s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#E8E8E0'
              e.currentTarget.style.boxShadow = '5px 5px 0 #E8E8E0'
              e.currentTarget.style.transform = 'translate(-2px,-3px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#333'
              e.currentTarget.style.boxShadow = '4px 4px 0 #333'
              e.currentTarget.style.transform = ''
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{icon}</div>
            <div
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '1.2rem',
                letterSpacing: '0.05em',
                color: '#F5F5F0',
              }}
            >
              {label}
            </div>
            <div style={{ color: '#555', fontSize: '0.82rem', marginTop: 4 }}>{desc}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
