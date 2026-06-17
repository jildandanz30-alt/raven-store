import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { getAdminStats, getWeeklyOrderData } from '@/lib/adminData'
import WeeklyChart from '@/components/admin/WeeklyChart'
import { TrendingUp, ShoppingBag, Users, Package, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

function StatCard({
  icon, label, value, sub,
}: {
  icon: React.ReactNode; label: string; value: string; sub?: string
}) {
  return (
    <div className="glass-card p-6 bg-zinc-900/40 border-white/5">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-white/5 rounded-xl text-accent-light border border-white/5">
          {icon}
        </div>
        <div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{label}</p>
          <h3 className="text-2xl font-black text-white">{value}</h3>
        </div>
      </div>
      {sub && (
        <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest pt-3 border-t border-white/5">
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

  const adminBase = `/${params.adminSecret}/admin`

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft border border-accent/20 text-accent-light text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
          <TrendingUp size={12} />
          OVERVIEW
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter">
          DASHBOARD
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<TrendingUp size={24} />}
          label="Total Revenue"
          value={formatRp(stats.totalRevenue)}
          sub="paid + completed orders"
        />
        <StatCard
          icon={<ShoppingBag size={24} />}
          label="Total Orders"
          value={stats.totalOrders.toString()}
          sub={`${stats.pendingOrders} pending`}
        />
        <StatCard
          icon={<Users size={24} />}
          label="Total Users"
          value={stats.totalUsers.toString()}
          sub="registered via clerk"
        />
        <StatCard
          icon={<Package size={24} />}
          label="Produk Aktif"
          value={stats.activeProducts.toString()}
          sub="available in catalog"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly chart */}
        <div className="lg:col-span-2 glass-card p-8 bg-zinc-900/40 border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="text-accent-light" size={20} />
              Order 7 Hari Terakhir
            </h2>
          </div>
          <div className="h-[300px] w-full">
            <WeeklyChart data={weeklyData} />
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-6">Akses Cepat</h2>
          {[
            { href: `${adminBase}/products`, label: 'Kelola Produk', icon: <Package size={24} />, desc: `${stats.activeProducts} produk aktif`, color: 'text-blue-400' },
            {
              href: `${adminBase}/orders`,
              label: 'Lihat Orders',
              icon: <ShoppingBag size={24} />,
              desc: `${stats.pendingOrders} order tertunda`,
              color: 'text-amber-400'
            },
          ].map(({ href, label, icon, desc, color }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-5 p-5 glass-card bg-zinc-900/40 border-white/5 hover:border-white/20 group transition-all"
            >
              <div className={`p-3 bg-white/5 rounded-xl border border-white/5 ${color} group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white group-hover:text-accent-light transition-colors">{label}</h3>
                <p className="text-xs text-zinc-500 font-medium">{desc}</p>
              </div>
              <ArrowUpRight className="text-zinc-700 group-hover:text-white transition-colors" size={20} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
