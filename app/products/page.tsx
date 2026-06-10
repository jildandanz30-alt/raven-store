import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ComicCard from '@/components/ComicCard'
import ScrollReveal from '@/components/ScrollReveal'
import ProductsFilter from '@/components/ProductsFilter'
import { getProducts } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Semua Produk',
  description: 'Browse plugin premium, asset ItemAdder/Oraxen, dan jasa untuk server Minecraft.',
}

interface ProductsPageProps {
  searchParams: { category?: string }
}

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
      <main style={{ minHeight: '80vh', padding: '4rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <ScrollReveal>
          <div style={{ marginBottom: '3rem' }}>
            <p style={{ color: '#AAAAAA', letterSpacing: '0.15em', fontSize: '0.85rem', marginBottom: 4 }}>
              🛒 BROWSE CATALOG
            </p>
            <h1
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                letterSpacing: '0.06em',
                lineHeight: 1,
              }}
            >
              Semua{' '}
              <span
                style={{
                  background: '#F5F5F0',
                  color: '#0A0A0A',
                  padding: '0 8px',
                  border: '3px solid #E8E8E0',
                  boxShadow: '5px 5px 0 #E8E8E0',
                }}
              >
                Produk
              </span>
            </h1>
          </div>
        </ScrollReveal>

        {/* Filter bar */}
        <ScrollReveal delay={0.05}>
          <ProductsFilter active={category} />
        </ScrollReveal>

        {/* Results header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            marginTop: '2rem',
            paddingBottom: '0.8rem',
            borderBottom: '2px solid #333',
          }}
        >
          <p style={{ color: '#AAAAAA', fontSize: '0.9rem' }}>
            <span style={{ color: '#F5F5F0', fontFamily: 'Bangers, cursive', fontSize: '1.1rem' }}>
              {products.length}
            </span>{' '}
            produk ditemukan
            {category !== 'all' && (
              <span>
                {' '}
                dalam kategori{' '}
                <span style={{ color: '#F5F5F0' }}>{categoryLabels[category]}</span>
              </span>
            )}
          </p>
        </div>

        {/* Product grid */}
        {products.length === 0 ? (
          <div
            style={{
              border: '3px solid #E8E8E0',
              boxShadow: '5px 5px 0 #E8E8E0',
              background: '#1A1A1A',
              padding: '5rem 2rem',
              textAlign: 'center',
            }}
          >
            <p style={{ fontFamily: 'Bangers, cursive', fontSize: '2rem', color: '#555' }}>
              Belum ada produk di kategori ini.
            </p>
            <p style={{ color: '#AAAAAA', marginTop: 8 }}>Coba kategori lain atau cek lagi nanti.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
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
