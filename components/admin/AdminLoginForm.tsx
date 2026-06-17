'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, ShieldAlert } from 'lucide-react'

export default function AdminLoginForm({ adminSecret }: { adminSecret: string }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!password) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        // Karena route ini butuh adminSecret di body sesuai route.ts yang kita lihat tadi
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, adminSecret }),
      })

      if (res.ok) {
        router.replace(`/${adminSecret}/admin/dashboard`)
      } else {
        const data = await res.json()
        setError(data.error ?? 'Password salah.')
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-10 bg-zinc-900/40 border-white/5 max-w-md w-full mx-auto">
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Lock className="text-white" size={32} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white text-center mb-2">Admin Access</h2>
      <p className="text-zinc-500 text-center text-sm mb-8 font-medium">Masukkan password untuk mengelola Raven Store.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">
            Admin Password
          </label>
          <div className="relative group">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••••••"
              className="w-full bg-black border border-white/10 text-white rounded-xl py-4 px-5 outline-none focus:border-accent transition-all font-mono tracking-widest"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
            >
              {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <ShieldAlert className="text-red-500 flex-shrink-0" size={18} />
            <p className="text-red-500 text-sm font-bold">
              {error}
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !password}
          className="w-full btn-elegant btn-primary py-4 text-lg disabled:opacity-50"
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            'Akses Dashboard'
          )}
        </button>

        <div className="pt-6 text-center border-t border-white/5">
          <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-widest">
            Unauthorized access will be logged and reported.
          </p>
        </div>
      </div>
    </div>
  )
}
