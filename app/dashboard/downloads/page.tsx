import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { dbSelect } from '@/lib/db'
import { Download, Package, ExternalLink, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

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
      product_name: p?.name ?? 'Produk Dihapus',
      product_category: p?.category ?? 'Unknown',
      product_slug: p?.slug ?? null,
      product_images: p?.images ?? [],
      download_url: p?.download_url ?? null,
    }
  })

  return (
    <div className="space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft border border-accent/20 text-accent-light text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
          <Download size={12} />
          MY ASSETS
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter">
          DOWNLOAD <span className="text-zinc-500">PRODUK</span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium mt-2">Akses semua produk digital yang telah Anda beli.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.length === 0 ? (
          <div className="md:col-span-2 glass-card p-24 text-center border-dashed border-2 border-white/5">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-700">
              <Download size={40} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Belum ada download.</h3>
            <p className="text-zinc-600 text-sm mb-8 max-w-sm mx-auto">
              Beli produk, tunggu konfirmasi admin, lalu link download akan muncul secara otomatis di sini.
            </p>
            <Link href="/products" className="btn-elegant btn-primary py-4 px-10">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          orders.map((o: any) => (
            <div key={o.id} className="glass-card bg-zinc-900/40 border-white/5 p-6 flex flex-col group hover:border-white/10 transition-all">
              <div className="flex gap-5 mb-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/5 flex-shrink-0 bg-black">
                  {o.product_images?.[0] ? (
                    <img src={o.product_images[0]} alt={o.product_name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-800">
                      <Package size={32} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[8px] font-bold text-zinc-500 uppercase tracking-widest border border-white/5">
                      {o.product_category}
                    </span>
                    <span className="flex items-center gap-1 text-[8px] font-bold text-green-500 uppercase tracking-widest">
                      <ShieldCheck size={10} /> TERVERIFIKASI
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-accent-light transition-colors">{o.product_name}</h3>
                  <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
                    Dibeli pada {new Date(o.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                {o.download_url ? (
                  <a 
                    href={o.download_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full btn-elegant btn-accent py-3 text-xs flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    DOWNLOAD FILE
                  </a>
                ) : (
                  <div className="w-full py-3 px-4 bg-zinc-900/50 rounded-xl border border-white/5 text-center">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center justify-center gap-2">
                      <Clock size={14} /> Link sedang disiapkan
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
