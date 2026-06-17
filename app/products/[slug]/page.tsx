import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import ProductGallery from '@/components/ProductGallery'
import ReviewSection from '@/components/ReviewSection'
import BuyButton from '@/components/BuyButton'
import { getProductBySlug, getProductReviews, formatPrice, formatCategoryLabel } from '@/lib/products'
import { getUser, syncUser } from '@/lib/auth'
import { dbSelect } from '@/lib/db'

interface ProductDetailProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProductDetailProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Produk Tidak Ditemukan' }
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Raven Store`,
      description: product.description ?? '',
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
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
      <main style={{ background: '#0A0A0A', minHeight: '100vh', paddingTop: '2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.8rem', color: '#555', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <a href="/" style={{ color: '#555', textDecoration: 'none' }}>HOME</a>
            <span>›</span>
            <a href="/products" style={{ color: '#555', textDecoration: 'none' }}>PRODUCTS</a>
            <span>›</span>
            <span style={{ color: '#AAAAAA' }}>{product.name.toUpperCase()}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem' }}>
            <ScrollReveal>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Bangers,cursive', fontSize: '0.8rem', padding: '3px 12px', border: '2px solid #E8E8E0', color: '#E8E8E0', letterSpacing: '0.1em' }}>{categoryLabel.toUpperCase()}</span>
                  {!product.is_active && <span style={{ fontFamily: 'Bangers,cursive', fontSize: '0.8rem', padding: '3px 12px', border: '2px solid #ff4444', color: '#ff4444' }}>UNAVAILABLE</span>}
                </div>

                <h1 style={{ fontFamily: 'Bangers,cursive', fontSize: '3rem', letterSpacing: '0.06em', color: '#F5F5F0', margin: '0 0 1rem', lineHeight: 1.1 }}>{product.name}</h1>

                {product.images && product.images.length > 0 && <ProductGallery images={product.images} />}

                {product.description && (
                  <div style={{ marginTop: '2rem' }}>
                    <h2 style={{ fontFamily: 'Bangers,cursive', fontSize: '1.5rem', letterSpacing: '0.06em', marginBottom: '0.75rem', borderBottom: '3px solid #333', paddingBottom: '0.5rem' }}>DESKRIPSI</h2>
                    <div style={{ color: '#AAAAAA', lineHeight: 1.7, fontFamily: 'Comic Neue,cursive', whiteSpace: 'pre-wrap' }}>{product.description}</div>
                  </div>
                )}

                <div style={{ marginTop: '3rem' }}>
                  <ReviewSection productId={product.id} reviews={reviews} hasPurchased={hasPurchased} userId={user?.id} />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div style={{ position: 'sticky', top: '5rem' }}>
                <div style={{ background: '#1A1A1A', border: '4px solid #E8E8E0', boxShadow: '8px 8px 0 #E8E8E0', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontFamily: 'Bangers,cursive', fontSize: '2.5rem', letterSpacing: '0.06em', color: '#F5F5F0', marginBottom: '1rem' }}>{formattedPrice}</div>
                  <BuyButton product={product} hasPurchased={hasPurchased} userId={user?.id ?? null} />
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '2px solid #333', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                      { label: 'Kategori', value: categoryLabel },
                      { label: 'Ditambahkan', value: new Date(product.created_at).toLocaleDateString('id-ID') },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#555', fontSize: '0.85rem' }}>{label}</span>
                        <span style={{ color: '#AAAAAA', fontSize: '0.85rem', fontFamily: 'JetBrains Mono,monospace' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
