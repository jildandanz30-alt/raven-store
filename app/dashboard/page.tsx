import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/auth'
import { dbSelect } from '@/lib/db'
import { ShoppingBag, Download, Star, ArrowRight, User as UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    .slice(0, 5)
    .map((o: any) => {
      const p = products.find((p: any) => p.id === o.product_id)
      return { ...o, product_name: p?.name ?? 'Produk Dihapus' }
    })

  const stats = [
    { label: 'Total Orders', value: ordersCount, icon: <ShoppingBag size={24} />, href: '/dashboard/orders', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Downloads', value: downloadsCount, icon: <Download size={24} />, href: '/dashboard/downloads', color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Reviews', value: reviewsCount, icon: <Star size={24} />, href: '/dashboard/reviews', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  ]

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    pending:   { label: 'PENDING',   color: 'text-amber-500', bg: 'bg-amber-500/10' },
    paid:      { label: 'PAID',      color: 'text-green-500', bg: 'bg-green-500/10' },
    completed: { label: 'DONE',      color: 'text-blue-500',  bg: 'bg-blue-500/10' },
    cancelled: { label: 'CANCELLED', color: 'text-red-500',   bg: 'bg-red-500/10' },
  }

  return (
    <div className="space-y-10">
      {/* User Profile Header */}
      <div className="glass-card p-8 bg-zinc-900/40 border-white/5 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name ?? ''} className="w-24 h-24 rounded-3xl border-2 border-white/10 object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-3xl border-2 border-white/10 bg-zinc-800 flex items-center justify-center text-zinc-500">
              <UserIcon size={40} />
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full border-4 border-black flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <p className="text-accent-light font-bold tracking-[0.2em] text-[10px] uppercase mb-1">WELCOME BACK</p>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            {user.name ?? user.email.split('@')[0]}
          </h1>
          <p className="text-zinc-500 text-sm font-medium">{user.email}</p>
        </div>

        <div className="flex gap-3">
          <Link href="/products" className="btn-elegant btn-primary py-3 px-6 text-xs">
            Browse Store
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(s => (
          <Link key={s.href} href={s.href} className="glass-card p-6 bg-zinc-900/40 border-white/5 hover:border-white/20 transition-all group">
            <div className={cn("p-3 w-fit rounded-xl mb-6 transition-transform group-hover:scale-110", s.bg, s.color)}>
              {s.icon}
            </div>
            <div className="text-3xl font-black text-white mb-1">{s.value}</div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="glass-card bg-zinc-900/40 border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <ShoppingBag className="text-accent-light" size={20} />
            Order Terbaru
          </h2>
          <Link href="/dashboard/orders" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
            LIHAT SEMUA <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="divide-y divide-white/5">
          {recentOrders.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-zinc-600 font-medium">Belum ada aktivitas order.</p>
            </div>
          ) : (
            recentOrders.map((o: any) => {
              const config = statusConfig[o.status] ?? { label: o.status.toUpperCase(), color: 'text-zinc-500', bg: 'bg-zinc-500/10' }
              return (
                <div key={o.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-500">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-0.5">{o.product_name}</h4>
                      <p className="text-xs text-zinc-600 font-medium">{new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border border-current/10", config.bg, config.color)}>
                      {config.label}
                    </span>
                    <span className="text-lg font-black text-white">{formatPrice(o.amount)}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
