import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/auth'
import { dbSelect } from '@/lib/db'
import { ShoppingBag, Clock, CheckCircle2, Package, XCircle, ChevronRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatPrice(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any; desc: string }> = {
  pending:   { label: 'PENDING',   color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock,        desc: 'Menunggu konfirmasi admin' },
  paid:      { label: 'PAID',      color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle2, desc: 'Pembayaran terkonfirmasi' },
  completed: { label: 'COMPLETED', color: 'text-blue-500',  bg: 'bg-blue-500/10',  icon: Package,      desc: 'Order selesai' },
  cancelled: { label: 'CANCELLED', color: 'text-red-500',   bg: 'bg-red-500/10',   icon: XCircle,      desc: 'Order dibatalkan' },
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
      product_name: p?.name ?? 'Produk Dihapus',
      product_category: p?.category ?? 'Unknown',
      product_images: p?.images ?? [],
      download_url: p?.download_url ?? null,
    }
  })

  return (
    <div className="space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft border border-accent/20 text-accent-light text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
          <ShoppingBag size={12} />
          MY ACTIVITY
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter">
          RIWAYAT <span className="text-zinc-500">ORDER</span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium mt-2">{orders.length} total transaksi</p>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="glass-card p-24 text-center border-dashed border-2 border-white/5">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-700">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Belum ada order.</h3>
            <p className="text-zinc-600 text-sm mb-8">Mulai jelajahi katalog kami dan temukan plugin terbaik untuk servermu!</p>
            <Link href="/products" className="btn-elegant btn-primary py-4 px-10">
              Jelajahi Katalog
            </Link>
          </div>
        ) : (
          orders.map((o: any) => {
            const config = statusConfig[o.status] ?? statusConfig.pending
            const Icon = config.icon
            return (
              <div key={o.id} className="glass-card bg-zinc-900/40 border-white/5 overflow-hidden hover:border-white/10 transition-all group">
                {/* Header */}
                <div className="px-6 py-4 bg-black/40 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">ORDER</span>
                    <span className="text-xs font-mono text-zinc-400 font-bold tracking-wider">#{o.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                      <Clock size={12} />
                      {formatDate(o.created_at)}
                    </div>
                    <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border border-current/10", config.bg, config.color)}>
                      <Icon size={12} />
                      {config.label}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/5 flex-shrink-0">
                    {o.product_images[0] ? (
                      <img src={o.product_images[0]} alt={o.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">
                        <Package size={24} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-1 group-hover:text-accent-light transition-colors">{o.product_name}</h4>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{o.product_category}</p>
                  </div>

                  <div className="flex flex-col md:items-end gap-1">
                    <div className="text-xl font-black text-white tracking-tight">{formatPrice(o.amount)}</div>
                    {o.payment_method && <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">via {o.payment_method}</div>}
                  </div>
                </div>

                {/* Footer / Actions */}
                <div className="px-6 py-4 bg-black/20 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full", config.bg.replace('/10', ''))} />
                    {config.desc}
                  </p>
                  
                  <div className="flex gap-3">
                    {['paid', 'completed'].includes(o.status) && o.download_url && (
                      <a 
                        href={o.download_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-elegant btn-accent py-2 px-6 text-[10px]"
                      >
                        <ExternalLink size={14} className="mr-2" />
                        DOWNLOAD SEKARANG
                      </a >
                    )}
                    {o.status === 'pending' && (
                      <Link 
                        href="/checkout"
                        className="btn-elegant btn-primary py-2 px-6 text-[10px]"
                      >
                        BAYAR SEKARANG
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
