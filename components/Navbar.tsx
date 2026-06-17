'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, isLoaded } = useUser()
  const { signOut, openSignIn } = useClerk()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleLogin = () => openSignIn({ afterSignInUrl: '/dashboard' })
  const handleLogout = () => signOut(() => router.push('/'))

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(10,10,10,0.97)' : '#0A0A0A',
        borderBottom: '3px solid #E8E8E0',
        boxShadow: scrolled ? '0 4px 0 #E8E8E0' : 'none',
        transition: 'box-shadow 0.2s',
        backdropFilter: 'blur(8px)',
      }}>
        <nav style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily:'Bangers,cursive', fontSize:'1.8rem', letterSpacing:'0.1em', color:'#F5F5F0', textDecoration:'none', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ background:'#F5F5F0', color:'#0A0A0A', padding:'0 8px', border:'3px solid #E8E8E0', boxShadow:'3px 3px 0 #E8E8E0', lineHeight:1.3 }}>RAVEN</span>
            STORE
          </Link>

          {/* Desktop nav */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.25rem' }} className="desktop-nav">
            {[{ href:'/products', label:'Products' }, { href:'/jasa', label:'Jasa' }].map(({ href, label }) => (
              <Link key={href} href={href} style={{ fontFamily:'Bangers,cursive', letterSpacing:'0.08em', fontSize:'1.1rem', color:'#F5F5F0', textDecoration:'none', padding:'0.4rem 1rem', border:'2px solid transparent', transition:'border-color 0.15s,box-shadow 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#E8E8E0'; e.currentTarget.style.boxShadow='3px 3px 0 #E8E8E0' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.boxShadow='none' }}>
                {label}
              </Link>
            ))}

            {isLoaded && (
              user ? (
                <div style={{ display:'flex', alignItems:'center', gap:8, marginLeft:8 }}>
                  <Link href="/dashboard" style={{ fontFamily:'Bangers,cursive', letterSpacing:'0.08em', fontSize:'1rem', color:'#0A0A0A', background:'#F5F5F0', textDecoration:'none', padding:'0.35rem 1rem', border:'3px solid #E8E8E0', boxShadow:'3px 3px 0 #E8E8E0' }}>Dashboard</Link>
                  <button onClick={handleLogout} style={{ fontFamily:'Bangers,cursive', letterSpacing:'0.08em', fontSize:'1rem', color:'#F5F5F0', background:'transparent', padding:'0.35rem 1rem', border:'3px solid #E8E8E0', boxShadow:'3px 3px 0 #E8E8E0', cursor:'pointer' }}>Logout</button>
                </div>
              ) : (
                <button onClick={handleLogin} style={{ fontFamily:'Bangers,cursive', letterSpacing:'0.08em', fontSize:'1.05rem', color:'#0A0A0A', background:'#F5F5F0', marginLeft:8, padding:'0.4rem 1.2rem', border:'3px solid #E8E8E0', boxShadow:'4px 4px 0 #E8E8E0', cursor:'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translate(-1px,-2px)'; e.currentTarget.style.boxShadow='5px 6px 0 #E8E8E0' }}
                  onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='4px 4px 0 #E8E8E0' }}>
                  Login Google
                </button>
              )
            )}
          </div>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"
            style={{ display:'none', background:'none', border:'2px solid #E8E8E0', color:'#F5F5F0', padding:'4px 8px', cursor:'pointer', fontFamily:'Bangers,cursive', fontSize:'1.4rem' }}
            className="hamburger">
            {menuOpen ? '✕' : '☰'}
          </button>
        </nav>

        {/* Mobile drawer */}
        {menuOpen && (
          <div style={{ background:'#1A1A1A', borderTop:'3px solid #E8E8E0', padding:'1rem 1.5rem', display:'flex', flexDirection:'column', gap:12 }}>
            {[{ href:'/products', label:'Products' }, { href:'/jasa', label:'Jasa' }].map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                style={{ fontFamily:'Bangers,cursive', letterSpacing:'0.08em', fontSize:'1.3rem', color:'#F5F5F0', textDecoration:'none' }}>
                {label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                  style={{ fontFamily:'Bangers,cursive', fontSize:'1.3rem', color:'#F5F5F0', textDecoration:'none' }}>Dashboard</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false) }}
                  style={{ fontFamily:'Bangers,cursive', fontSize:'1.3rem', color:'#AAAAAA', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>Logout</button>
              </>
            ) : (
              <button onClick={() => { handleLogin(); setMenuOpen(false) }}
                style={{ fontFamily:'Bangers,cursive', fontSize:'1.3rem', color:'#0A0A0A', background:'#F5F5F0', border:'3px solid #E8E8E0', padding:'0.4rem 1rem', cursor:'pointer' }}>
                Login Google
              </button>
            )}
          </div>
        )}
      </header>

      <style jsx global>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </>
  )
}
