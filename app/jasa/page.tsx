import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import JasaOrderForm from '@/components/JasaOrderForm'

export const metadata: Metadata = {
  title: 'Jasa',
  description: 'Jasa pasang plugin, resource pack, dan buat website store untuk server Minecraft kamu.',
}

const SERVICES = [
  {
    id: 'addon',
    emoji: '🔌',
    title: 'Pasang Add-on',
    price: 'Rp2.000',
    unit: 'per add-on',
    desc: 'Install dan konfigurasi plugin/add-on ke server kamu. Termasuk setup dasar agar langsung bisa dipakai.',
    includes: ['Install plugin ke server', 'Konfigurasi config dasar', 'Test fungsionalitas', 'Panduan penggunaan'],
    turnaround: '1-3 jam',
  },
  {
    id: 'resourcepack',
    emoji: '📦',
    title: 'Pasang Resource Pack',
    price: 'Rp2.000',
    unit: 'per pack',
    desc: 'Setup lengkap Behavior Pack & Resource Pack untuk server Bedrock kamu dari nol.',
    includes: ['Upload & konfigurasi pack', 'Setup auto-download', 'Integrasi dengan plugin', 'Test di server'],
    turnaround: '2-5 jam',
  },
  {
    id: 'itemadder',
    emoji: '🎨',
    title: 'Setup ItemAdder / Oraxen',
    price: 'Custom',
    unit: 'tergantung scope',
    desc: 'Pasang dan konfigurasi ItemAdder atau Oraxen beserta custom assets kamu.',
    includes: ['Install & konfigurasi plugin', 'Import custom assets', 'Setup resource pack', 'Troubleshoot error'],
    turnaround: '3-8 jam',
  },
  {
    id: 'website',
    emoji: '🌐',
    title: 'Buat Website Store',
    price: 'Custom',
    unit: 'hubungi untuk penawaran',
    desc: 'Website toko profesional untuk server Minecraft kamu. Desain comic book, payment gateway Midtrans, dashboard member.',
    includes: [
      'Desain comic book kustom',
      'Auth + Dashboard member',
      'Payment gateway (Midtrans)',
      'Deploy ke Railway/Vercel',
      'Admin panel',
    ],
    turnaround: '3-7 hari',
  },
]

export default function JasaPage() {
  return (
    <>
      <Navbar />
      <main style={{ padding: '4rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <ScrollReveal>
          <div style={{ marginBottom: '4rem', maxWidth: 680 }}>
            <p style={{ color: '#AAAAAA', letterSpacing: '0.15em', fontSize: '0.85rem', marginBottom: 6 }}>
              🛠 PROFESIONAL & TERPERCAYA
            </p>
            <h1
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                letterSpacing: '0.05em',
                lineHeight: 1.05,
                marginBottom: '1rem',
              }}
            >
              Layanan{' '}
              <span
                style={{
                  background: '#F5F5F0',
                  color: '#0A0A0A',
                  padding: '0 8px',
                  border: '3px solid #E8E8E0',
                  boxShadow: '5px 5px 0 #E8E8E0',
                }}
              >
                Jasa
              </span>
            </h1>
            <p style={{ color: '#AAAAAA', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Butuh bantuan setup server? Kami handle semuanya — dari install plugin sederhana
              sampai bangun website store penuh buat server kamu.
            </p>
          </div>
        </ScrollReveal>

        {/* Service cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '5rem',
          }}
        >
          {SERVICES.map(({ id, emoji, title, price, unit, desc, includes, turnaround }, i) => (
            <ScrollReveal key={id} delay={i * 0.08}>
              <div
                className="comic-panel"
                style={{
                  background: '#1A1A1A',
                  padding: '1.8rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ fontSize: '2.8rem', marginBottom: 12 }}>{emoji}</div>

                <h2
                  style={{
                    fontFamily: 'Bangers, cursive',
                    fontSize: '1.6rem',
                    letterSpacing: '0.05em',
                    marginBottom: 4,
                  }}
                >
                  {title}
                </h2>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: '1rem' }}>
                  <span
                    style={{
                      fontFamily: 'Bangers, cursive',
                      fontSize: '1.5rem',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {price}
                  </span>
                  <span style={{ color: '#555', fontSize: '0.8rem' }}>/ {unit}</span>
                </div>

                <p style={{ color: '#AAAAAA', fontSize: '0.93rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                  {desc}
                </p>

                {/* What's included */}
                <ul
                  style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5,
                    marginBottom: '1.2rem',
                    flex: 1,
                  }}
                >
                  {includes.map((item) => (
                    <li
                      key={item}
                      style={{
                        color: '#AAAAAA',
                        fontSize: '0.88rem',
                        display: 'flex',
                        gap: 8,
                        alignItems: 'flex-start',
                      }}
                    >
                      <span style={{ color: '#F5F5F0', flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div
                  style={{
                    paddingTop: '1rem',
                    borderTop: '2px solid #333',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#555', fontSize: '0.8rem' }}>Estimasi selesai:</span>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.82rem',
                      color: '#AAAAAA',
                    }}
                  >
                    {turnaround}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Order form */}
        <ScrollReveal>
          <div
            style={{
              borderTop: '4px solid #E8E8E0',
              paddingTop: '4rem',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ color: '#AAAAAA', letterSpacing: '0.15em', fontSize: '0.85rem', marginBottom: 4 }}>
                📋 ISI FORMULIR DI BAWAH
              </p>
              <h2
                style={{
                  fontFamily: 'Bangers, cursive',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  letterSpacing: '0.06em',
                }}
              >
                Order Jasa Sekarang
              </h2>
            </div>
            <JasaOrderForm services={SERVICES.map((s) => ({ id: s.id, title: s.title }))} />
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  )
}
