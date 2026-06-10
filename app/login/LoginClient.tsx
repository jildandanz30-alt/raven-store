'use client'
import { useState, useEffect } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function LoginClient({ redirectTo }: { redirectTo?: string }) {
  const { signIn, isLoaded } = useSignIn()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [inkDots, setInkDots] = useState<Array<{ x: number; y: number; size: number; delay: number }>>([])

  useEffect(() => {
    setInkDots(Array.from({ length: 24 }, () => ({
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 12 + 4, delay: Math.random() * 0.8,
    })))
  }, [])

  async function handleGoogleLogin() {
    if (!isLoaded) return
    setLoading(true)
    await signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: redirectTo ?? '/dashboard',
    })
  }

  return (
    <div style={s.root}>
      <div style={s.halftone} aria-hidden />
      <div style={s.inkLayer} aria-hidden>
        {inkDots.map((dot, i) => (
          <div key={i} style={{ ...s.inkDot, left:`${dot.x}%`, top:`${dot.y}%`, width:dot.size, height:dot.size, animationDelay:`${dot.delay}s` }} />
        ))}
      </div>

      <div style={s.card}>
        <div style={s.banner}>
          <span style={s.bannerIssue}>ISSUE #001</span>
          <span style={s.bannerTitle}>RAVEN STORE</span>
        </div>
        <div style={s.body}>
          <h1 style={s.heading}>LOGIN</h1>
          <p style={s.sub}>Masuk untuk mulai belanja produk Minecraft terbaik.</p>

          <button onClick={handleGoogleLogin} disabled={loading || !isLoaded} style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? (
              <span style={s.btnText}>LOADING…</span>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span style={s.btnText}>MASUK DENGAN GOOGLE</span>
              </>
            )}
          </button>
          <p style={s.note}>Dengan masuk, kamu menyetujui syarat layanan Raven Store.</p>
        </div>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  root: { minHeight:'100vh', background:'#0D0D0D', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', padding:'2rem' },
  halftone: { position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,#333 1px,transparent 1px)', backgroundSize:'20px 20px', opacity:0.2, pointerEvents:'none' },
  inkLayer: { position:'absolute', inset:0, pointerEvents:'none' },
  inkDot: { position:'absolute', borderRadius:'50%', background:'#1A1A1A', transform:'translate(-50%,-50%)' },
  card: { position:'relative', zIndex:1, width:'100%', maxWidth:400, border:'3px solid #E8E8E0', boxShadow:'8px 8px 0 #E8E8E0', background:'#1A1A1A' },
  banner: { background:'#F5F5F0', padding:'0.5rem 1.2rem', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'3px solid #E8E8E0' },
  bannerIssue: { fontFamily:'JetBrains Mono,monospace', fontSize:'0.7rem', color:'#333', letterSpacing:'0.1em' },
  bannerTitle: { fontFamily:'Bangers,cursive', fontSize:'1.2rem', color:'#0D0D0D', letterSpacing:'0.15em' },
  body: { padding:'2rem' },
  heading: { fontFamily:'Bangers,cursive', fontSize:'3rem', letterSpacing:'0.1em', color:'#F5F5F0', margin:'0 0 0.5rem' },
  sub: { color:'#AAAAAA', fontSize:'0.9rem', marginBottom:'1.5rem', fontFamily:'Comic Neue,cursive' },
  btn: { width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.75rem', padding:'0.85rem 1.5rem', background:'#F5F5F0', border:'3px solid #E8E8E0', boxShadow:'4px 4px 0 #E8E8E0', cursor:'pointer' },
  btnText: { fontFamily:'Bangers,cursive', fontSize:'1rem', letterSpacing:'0.1em', color:'#0D0D0D' },
  note: { marginTop:'1.2rem', color:'#555', fontSize:'0.75rem', textAlign:'center', fontFamily:'Comic Neue,cursive' },
}
