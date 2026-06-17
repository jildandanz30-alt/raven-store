import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import ProductGallery from '@/components/ProductGallery'
import ReviewSection from '@/components/ReviewSection'
import BuyButton from '@/components/BuyButton'
import { getProductBySlug, getProductReviews, formatPrice, formatCategoryLabel } from '@/lib/products'
import { getUser, syncUser } from '@/lib/auth'
import { dbSelect } from '@/lib/db'
import { ChevronRight, ShieldCheck, Clock, Download } from 'lucide-react'
import Link from 'next/link'

interface ProductDetailProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProductDetailProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Produk Tidak Ditemukan' }
  return {
    title: `${product.name} | Raven Store`,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()

  const reviews = await getProductReviews(product.id)

  const { userId: clerkId } = auth()
  let user = null
  let hasPurchased = false

  if (clerkId) {
    user = await getUser()
    if (!user) user = await syncUser()
    if (user) {
      const orders = dbSelect<any>('orders')
      hasPurchased = orders.some(
        (o: any) => o.user_id === user!.id && o.product_id === product.id && ['paid','completed'].includes(o.status)
      )
    }
  }

  const categoryLabel = formatCategoryLabel(product.category)
  const formattedPrice = formatPrice(product.price)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-12">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <ChevronRight size={12} />
          <span className="text-zinc-400">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Media & Description */}
          <div className="lg:col-span-8 space-y-12">
            <ScrollReveal>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 rounded-full bg-accent-soft border border-accent/20 text-accent-light text-[10px] font-bold uppercase tracking-widest">
                    {categoryLabel}
                  </span>
                  {!product.is_active && (
                    <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest">
                      UNAVAILABLE
                    </span>
                  )}
                </div>
                
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                  {product.name}
                </h1>

                {product.images && product.images.length > 0 && (
                  <div className="rounded-3xl overflow-hidden border border-white/5 bg-zinc-900/40">
                    <ProductGallery images={product.images} />
                  </div>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="glass-card p-10 bg-zinc-900/40 border-white/5">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-1 h-6 bg-accent-light rounded-full" />
                  DESKRIPSI PRODUK
                </h2>
                <div className="text-zinc-400 leading-relaxed text-lg whitespace-pre-wrap">
                  {product.description}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="pt-12 border-t border-white/5">
                <ReviewSection productId={product.id} reviews={reviews} hasPurchased={hasPurchased} userId={user?.id} />
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Pricing & Purchase */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <ScrollReveal delay={0.3}>
                <div className="glass-card p-8 bg-zinc-900/40 border-white/5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
                  <div className="mb-8">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Harga Sekarang</p>
                    <div className="text-4xl font-black text-white tracking-tight">{formattedPrice}</div>
                  </div>
                  
                  <BuyButton product={product} hasPurchased={hasPurchased} userId={user?.id ?? null} />
                  
                  <div className="mt-8 space-y-4 pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <ShieldCheck size={16} />
                        <span className="text-xs font-medium">Keamanan</span>
                      </div>
                      <span className="text-xs text-zinc-300 font-bold">Terverifikasi</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Clock size={16} />
                        <span className="text-xs font-medium">Update Terakhir</span>
                      </div>
                      <span className="text-xs text-zinc-300 font-bold">{new Date(product.updated_at).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Download size={16} />
                        <span className="text-xs font-medium">Tipe File</span>
                      </div>
                      <span className="text-xs text-zinc-300 font-bold uppercase">{product.category === 'plugin' ? '.jar' : '.zip'}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <div className="glass-card p-6 bg-accent-soft/30 border-accent/10">
                <p className="text-accent-light text-[10px] font-bold uppercase tracking-widest mb-2">Support 24/7</p>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Butuh bantuan instalasi? Tim kami siap membantu via Discord setelah pembelian.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
