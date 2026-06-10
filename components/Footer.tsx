import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      style={{
        background: '#0A0A0A',
        borderTop: '4px solid #E8E8E0',
        boxShadow: '0 -4px 0 #E8E8E0',
        padding: '3rem 1.5rem 2rem',
        marginTop: 80,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand */}
          <div>
            <h3
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '2rem',
                letterSpacing: '0.1em',
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  background: '#F5F5F0',
                  color: '#0A0A0A',
                  padding: '0 8px',
                  border: '3px solid #E8E8E0',
                  boxShadow: '3px 3px 0 #E8E8E0',
                }}
              >
                MC
              </span>{' '}
              STORE
            </h3>
            <p style={{ color: '#AAAAAA', lineHeight: 1.6, maxWidth: 240, fontSize: '0.95rem' }}>
              Plugin premium, asset keren, dan jasa setup terpercaya untuk server Minecraft kamu.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '1.2rem',
                letterSpacing: '0.08em',
                marginBottom: 12,
                borderBottom: '2px solid #E8E8E0',
                paddingBottom: 6,
              }}
            >
              Navigasi
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Products' },
                { href: '/jasa', label: 'Jasa' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ color: '#AAAAAA', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F5F0')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#AAAAAA')}
                  >
                    → {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '1.2rem',
                letterSpacing: '0.08em',
                marginBottom: 12,
                borderBottom: '2px solid #E8E8E0',
                paddingBottom: 6,
              }}
            >
              Dukungan
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>
                <a
                  href="https://discord.gg/yourserver"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#AAAAAA', textDecoration: 'none', fontSize: '0.95rem' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F5F0')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#AAAAAA')}
                >
                  → Discord Server
                </a>
              </li>
              <li>
                <span style={{ color: '#555', fontSize: '0.95rem' }}>
                  → Terms of Service
                </span>
              </li>
            </ul>
          </div>

          {/* Comic panel deco */}
          <div
            style={{
              border: '3px solid #E8E8E0',
              boxShadow: '5px 5px 0 #E8E8E0',
              padding: '1.2rem',
              background: '#1A1A1A',
              alignSelf: 'start',
            }}
          >
            <p
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '1.4rem',
                letterSpacing: '0.05em',
                lineHeight: 1.3,
              }}
            >
              "KUALITAS PREMIUM,<br />
              HARGA WORTH IT!"
            </p>
            <p style={{ color: '#555', fontSize: '0.8rem', marginTop: 6 }}>— Tim MC Store</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '2px solid #333',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <p style={{ color: '#555', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} MC Store. All rights reserved.
          </p>
          <p style={{ color: '#555', fontSize: '0.85rem', fontFamily: 'JetBrains Mono, monospace' }}>
            v2.0 · Built with Next.js + Supabase
          </p>
        </div>
      </div>
    </footer>
  )
}
