import type { Metadata } from 'next'
import AdminLoginForm from '@/components/admin/AdminLoginForm'

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: { index: false, follow: false },
}

// The real secret path is in env; the segment here is just for routing.
// Anyone who finds this URL still needs the password.
export default function AdminLoginPage({
  params,
}: {
  params: { adminSecret: string }
}) {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'Comic Neue, cursive',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Halftone bg */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, #1e1e1e 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.5,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Big decorative text */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: '5%',
          left: '-2rem',
          fontFamily: 'Bangers, cursive',
          fontSize: 'clamp(8rem, 22vw, 18rem)',
          color: 'transparent',
          WebkitTextStroke: '2px #1a1a1a',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        ADMIN
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-block',
              fontFamily: 'Bangers, cursive',
              fontSize: '0.85rem',
              letterSpacing: '0.2em',
              padding: '3px 16px',
              border: '3px solid #E8E8E0',
              boxShadow: '4px 4px 0 #E8E8E0',
              background: '#1A1A1A',
              color: '#AAAAAA',
              marginBottom: '1.2rem',
            }}
          >
            🔒 RESTRICTED ACCESS
          </div>
          <h1
            style={{
              fontFamily: 'Bangers, cursive',
              fontSize: '3.5rem',
              letterSpacing: '0.08em',
              color: '#F5F5F0',
              lineHeight: 1,
            }}
          >
            ADMIN{' '}
            <span
              style={{
                background: '#F5F5F0',
                color: '#0A0A0A',
                padding: '0 8px',
                border: '3px solid #E8E8E0',
                boxShadow: '4px 4px 0 #E8E8E0',
              }}
            >
              PANEL
            </span>
          </h1>
          <p style={{ color: '#555', fontSize: '0.9rem', marginTop: 8 }}>
            MC Store Control Center
          </p>
        </div>

        <AdminLoginForm adminSecret={params.adminSecret} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&family=JetBrains+Mono:wght@400;600&display=swap');
      `}</style>
    </main>
  )
}
