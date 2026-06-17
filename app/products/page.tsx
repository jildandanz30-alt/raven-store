import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/Footer'
import ComicCard from '@/components/ComicCard'
import ScrollReveal from '@/components/ScrollReveal'
import ProductsFilter from '@/components/ProductsFilter'
import { getProducts } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Semua Produk | Raven Store',
  description: 'Browse plugin premium, asset ItemAdder/Oraxen, dan jasa untuk server Minecraft.',
}

interface ProductsPageProps {
  searchParams: { category?: string }
}

export const dynamic = 'force-dynamic'

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = searchParams.category ?? 'all'
  const products = await getProducts(category === 'all' ? undefined : category)

  const categoryLabels: Record<string, string> = {
    all: 'Semua',
    plugin: 'Plugin',
    asset: 'Asset',
    jasa: 'Jasa',
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-16">
            <p className="text-accent-light font-bold tracking-[0.2em] text-xs mb-3 uppercase">
              🛒 BROWSE CATALOG
            </p>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
              SEMUA <span className="text-zinc-500">PRODUK</span>
            </h1>
          </div>
        </ScrollReveal>

        {/* Filter bar */}
        <ScrollReveal delay={0.05}>
          <div className="mb-12">
            <ProductsFilter active={category} />
          </div>
        </ScrollReveal>

        {/* Results header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
          <p className="text-zinc-500 text-sm font-medium">
            Menampilkan <span className="text-white font-bold">{products.length}</span> produk
            {category !== 'all' && (
              <span> dalam kategori <span className="text-accent-light">{categoryLabels[category]}</span></span>
            )}
          </p>
        </div>

        {/* Product grid */}
        {products.length === 0 ? (
          <div className="glass-card p-24 text-center border-dashed border-2">
            <p className="text-zinc-500 text-2xl font-bold mb-2">
              Belum ada produk di kategori ini.
            </p>
            <p className="text-zinc-600">Coba kategori lain atau cek lagi nanti.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 0.05}>
                <ComicCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
