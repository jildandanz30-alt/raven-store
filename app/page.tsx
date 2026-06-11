import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import ComicCard from '@/components/ComicCard'
import ScrollReveal from '@/components/ScrollReveal'
import Link from 'next/link'
import { getFeaturedProducts } from '@/lib/products'

export const metadata: Metadata = {
  title: 'MC Store — Premium Minecraft Plugins & Assets',
  description: 'Plugin premium, asset ItemAdder/Oraxen, dan jasa setup terpercaya untuk server Minecraft kamu.',
}

const JASA_LIST = [
  {
    emoji: '🔌',
    title: 'Pasang Add-on',
    price: 'Rp2.000 / add-on',
    desc: 'Install plugin & konfigurasi dasar ke server kamu. Cepat, rapi, dan terjamin.',
  },
  {
    emoji: '📦',
    title: 'Pasang Resource Pack',
    price: 'Rp2.000',
    desc: 'Setup Behavior Pack + Resource Pack (Bedrock) ke server kamu dari nol.',
  },
  {
    emoji: '🌐',
    title: 'Buat Website Store',
    price: 'Custom',
    desc: 'Website toko untuk server Minecraft kamu — desain komik, payment gateway, dan dashboard.',
  },
]

const HOW_TO_BUY = [
  {
    step: '01',
    title: 'Pilih Produk',
    desc: 'Browse katalog plugin, asset, atau jasa yang kamu butuhkan.',
  },
  {
    step: '02',
    title: 'Login & Checkout',
    desc: 'Login pakai Google, lalu bayar via Midtrans — QRIS, transfer, dll.',
  },
  {
    step: '03',
    title: 'Download!',
    desc: 'Setelah pembayaran verified, langsung download dari dashboard kamu.',
  },
]

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const products = await getFeaturedProducts(6)

  return (
    <>
      <Navbar />

      <main>
        {/* HERO */}
        <HeroSection />

        {/* PRODUK UNGGULAN */}
        <section style={{ padding: '5rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
          <ScrollReveal>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '2.5rem',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <p style={{ color: '#AAAAAA', letterSpacing: '0.15em', fontSize: '0.85rem', marginBottom: 4 }}>
                  ★ TERBARU & TERLARIS
                </p>
                <h2
                  style={{
                    fontFamily: 'Bangers, cursive',
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    letterSpacing: '0.06em',
                  }}
                >
                  Produk Unggulan
                </h2>
              </div>
              <Link
                href="/products"
                className="comic-button-link"
                style={{
                  fontFamily: 'Bangers, cursive',
                  letterSpacing: '0.08em',
                  fontSize: '1rem',
                  padding: '0.5rem 1.4rem',
                  border: '3px solid #E8E8E0',
                  boxShadow: '4px 4px 0 #E8E8E0',
                  color: '#F5F5F0',
                  textDecoration: 'none',
                  background: '#1A1A1A',
                  transition: 'transform 0.1s, box-shadow 0.1s',
                }}
              >
                Lihat Semua →
              </Link>
            </div>
          </ScrollReveal>

          {products.length === 0 ? (
            <div
              style={{
                border: '3px solid #E8E8E0',
                boxShadow: '5px 5px 0 #E8E8E0',
                background: '#1A1A1A',
                padding: '4rem',
                textAlign: 'center',
              }}
            >
              <p style={{ fontFamily: 'Bangers, cursive', fontSize: '1.5rem', color: '#AAAAAA' }}>
                Produk akan segera hadir!
              </p>
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
                <ScrollReveal key={product.id} delay={i * 0.07}>
                  <ComicCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </section>

        {/* DIVIDER PANEL */}
        <div
          style={{
            borderTop: '4px solid #E8E8E0',
            borderBottom: '4px solid #E8E8E0',
            padding: '1rem 1.5rem',
            background: '#1A1A1A',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <p
            style={{
              fontFamily: 'Bangers, cursive',
              fontSize: '1.1rem',
              letterSpacing: '0.3em',
              color: '#444',
              animation: 'scroll-ticker 20s linear infinite',
            }}
          >
            {Array(6).fill('⚡ PLUGIN PREMIUM · ASSET KEREN · JASA TERPERCAYA · MC STORE ').join('')}
          </p>
          <style>{`
            @keyframes scroll-ticker {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>

        {/* LAYANAN JASA */}
        <section style={{ padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <ScrollReveal>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <p style={{ color: '#AAAAAA', letterSpacing: '0.15em', fontSize: '0.85rem', marginBottom: 4 }}>
                  💼 NEED HELP?
                </p>
                <h2
                  style={{
                    fontFamily: 'Bangers, cursive',
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    letterSpacing: '0.06em',
                  }}
                >
                  Layanan Jasa
                </h2>
              </div>
            </ScrollReveal>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {JASA_LIST.map(({ emoji, title, price, desc }, i) => (
                <ScrollReveal key={title} delay={i * 0.1}>
                  <div
                    className="comic-panel"
                    style={{
                      background: '#1A1A1A',
                      padding: '1.8rem',
                      height: '100%',
                    }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{emoji}</div>
                    <h3
                      style={{
                        fontFamily: 'Bangers, cursive',
                        fontSize: '1.5rem',
                        letterSpacing: '0.05em',
                        marginBottom: 4,
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'Bangers, cursive',
                        fontSize: '1rem',
                        color: '#AAAAAA',
                        letterSpacing: '0.05em',
                        marginBottom: 10,
                      }}
                    >
                      {price}
                    </p>
                    <p style={{ color: '#AAAAAA', fontSize: '0.95rem', lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link
                href="/jasa"
                style={{
                  fontFamily: 'Bangers, cursive',
                  letterSpacing: '0.08em',
                  fontSize: '1.1rem',
                  padding: '0.7rem 2rem',
                  border: '3px solid #E8E8E0',
                  boxShadow: '5px 5px 0 #E8E8E0',
                  color: '#0A0A0A',
                  textDecoration: 'none',
                  background: '#F5F5F0',
                  display: 'inline-block',
                }}
              >
                Order Jasa Sekarang →
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* CARA BELI */}
        <section style={{ padding: '5rem 1.5rem', borderTop: '4px solid #E8E8E0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <ScrollReveal style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ color: '#AAAAAA', letterSpacing: '0.15em', fontSize: '0.85rem', marginBottom: 4 }}>
                🛒 MUDAH BANGET!
              </p>
              <h2
                style={{
                  fontFamily: 'Bangers, cursive',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  letterSpacing: '0.06em',
                }}
              >
                Cara Beli
              </h2>
            </ScrollReveal>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.5rem',
                position: 'relative',
              }}
            >
              {HOW_TO_BUY.map(({ step, title, desc }, i) => (
                <ScrollReveal key={step} delay={i * 0.12}>
                  <div
                    style={{
                      border: '3px solid #E8E8E0',
                      boxShadow: '5px 5px 0 #E8E8E0',
                      background: i % 2 === 1 ? '#F5F5F0' : '#1A1A1A',
                      padding: '2rem',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Big step number */}
                    <div
                      aria-hidden
                      style={{
                        position: 'absolute',
                        right: '-0.5rem',
                        bottom: '-1rem',
                        fontFamily: 'Bangers, cursive',
                        fontSize: '7rem',
                        lineHeight: 1,
                        color: i % 2 === 1 ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)',
                        userSelect: 'none',
                      }}
                    >
                      {step}
                    </div>

                    <div
                      style={{
                        fontFamily: 'Bangers, cursive',
                        fontSize: '3rem',
                        letterSpacing: '0.05em',
                        color: i % 2 === 1 ? '#0A0A0A' : '#F5F5F0',
                        marginBottom: 8,
                        lineHeight: 1,
                      }}
                    >
                      {step}
                    </div>
                    <h3
                      style={{
                        fontFamily: 'Bangers, cursive',
                        fontSize: '1.4rem',
                        letterSpacing: '0.05em',
                        color: i % 2 === 1 ? '#0A0A0A' : '#F5F5F0',
                        marginBottom: 8,
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      style={{
                        color: i % 2 === 1 ? '#333' : '#AAAAAA',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BOTTOM */}
        <section
          style={{
            padding: '5rem 1.5rem',
            background: '#F5F5F0',
            borderTop: '4px solid #E8E8E0',
            borderBottom: '4px solid #E8E8E0',
          }}
        >
          <div
            style={{
              maxWidth: 700,
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <ScrollReveal>
              <h2
                style={{
                  fontFamily: 'Bangers, cursive',
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  letterSpacing: '0.05em',
                  color: '#0A0A0A',
                  lineHeight: 1.1,
                  marginBottom: '1.5rem',
                }}
              >
                SERVER KAMU SIAP NAIK LEVEL?
              </h2>
              <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Jangan biarkan server kamu biasa-biasa saja. Upgrade sekarang dengan plugin dan asset
                premium dari MC Store!
              </p>
              <Link
                href="/products"
                className="comic-button-link-dark"
                style={{
                  fontFamily: 'Bangers, cursive',
                  letterSpacing: '0.08em',
                  fontSize: '1.3rem',
                  padding: '0.8rem 2.5rem',
                  border: '3px solid #0A0A0A',
                  boxShadow: '6px 6px 0 #0A0A0A',
                  color: '#F5F5F0',
                  textDecoration: 'none',
                  background: '#0A0A0A',
                  display: 'inline-block',
                  transition: 'transform 0.1s, box-shadow 0.1s',
                }}
              >
                BROWSE SEMUA PRODUK ⚡
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
