'use client'
import { useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { LogIn, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function LoginClient({ redirectTo }: { redirectTo?: string }) {
  const { signIn, isLoaded } = useSignIn()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleGoogleLogin() {
    if (!isLoaded) return
    setLoading(true)
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: redirectTo ?? '/dashboard',
      })
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden p-6">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#14211a_0%,transparent_50%)] opacity-50" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <span className="text-black font-bold text-xl">R</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              RAVEN<span className="text-zinc-500 font-medium">STORE</span>
            </span>
          </Link>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">SELAMAT DATANG</h1>
          <p className="text-zinc-500 font-medium">Masuk untuk mulai belanja produk Minecraft terbaik.</p>
        </div>

        <div className="glass-card p-8 bg-zinc-900/40 border-white/5">
          <button 
            onClick={handleGoogleLogin} 
            disabled={loading || !isLoaded} 
            className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-white text-black rounded-xl font-bold text-lg transition-all hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" className="opacity-70"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" className="opacity-50"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" className="opacity-80"/>
                </svg>
                Masuk dengan Google
                <ArrowRight size={20} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </>
            )}
          </button>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-zinc-600 text-xs leading-relaxed">
              Dengan masuk, kamu menyetujui <br />
              <Link href="/terms" className="text-zinc-400 hover:text-white transition-colors">Syarat Layanan</Link> & <Link href="/privacy" className="text-zinc-400 hover:text-white transition-colors">Kebijakan Privasi</Link> Raven Store.
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-2 border border-white/5">
              <LogIn size={20} className="text-accent-light" />
            </div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Secure SSO</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-2 border border-white/5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-light">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  )
}
