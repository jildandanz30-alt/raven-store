'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { href: 'dashboard',  label: 'Dashboard', icon: '📊' },
  { href: 'products',   label: 'Produk',    icon: '📦' },
  { href: 'orders',     label: 'Orders',    icon: '🛒' },
]

export default function AdminSidebar({ adminSecret }: { adminSecret: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const base = `/${adminSecret}/admin`

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace(base)
  }

  return (
    <aside
      style={{
        width: 220,
        minHeight: '100vh',
        background: '#1A1A1A',
        borderRight: '3px solid #E8E8E0',
        boxShadow: '4px 0 0 #E8E8E0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '1.5rem 1.2rem',
          borderBottom: '3px solid #333',
        }}
      >
        <p
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '1.6rem',
            letterSpacing: '0.1em',
            lineHeight: 1,
          }}
        >
          <span
            style={{
              background: '#F5F5F0',
              color: '#0A0A0A',
              padding: '0 6px',
              border: '2px solid #E8E8E0',
              boxShadow: '3px 3px 0 #E8E8E0',
            }}
          >
            MC
          </span>{' '}
          ADMIN
        </p>
        <p
          style={{
            color: '#444',
            fontSize: '0.72rem',
            fontFamily: 'JetBrains Mono, monospace',
            marginTop: 4,
          }}
        >
          Control Panel
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0' }}>
        {NAV.map(({ href, label, icon }) => {
          const fullHref = `${base}/${href}`
          const isActive = pathname.startsWith(fullHref)
          return (
            <Link
              key={href}
              href={fullHref}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '0.7rem 1.2rem',
                fontFamily: 'Bangers, cursive',
                letterSpacing: '0.08em',
                fontSize: '1.05rem',
                textDecoration: 'none',
                color: isActive ? '#0A0A0A' : '#AAAAAA',
                background: isActive ? '#F5F5F0' : 'transparent',
                borderLeft: isActive ? '4px solid #E8E8E0' : '4px solid transparent',
                boxShadow: isActive ? 'inset -4px 0 0 #E8E8E0' : 'none',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#F5F5F0'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#AAAAAA'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1.2rem', borderTop: '2px solid #333' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            fontFamily: 'Bangers, cursive',
            letterSpacing: '0.08em',
            fontSize: '0.95rem',
            padding: '0.5rem',
            border: '2px solid #555',
            boxShadow: '2px 2px 0 #555',
            background: 'transparent',
            color: '#555',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ff4444'
            e.currentTarget.style.boxShadow = '2px 2px 0 #ff4444'
            e.currentTarget.style.color = '#ff6666'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#555'
            e.currentTarget.style.boxShadow = '2px 2px 0 #555'
            e.currentTarget.style.color = '#555'
          }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  )
}
