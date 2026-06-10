'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

  const inputBase: React.CSSProperties = {
    width: '100%',
    background: '#111',
    color: '#F5F5F0',
    border: '3px solid #333',
    padding: '0.85rem 1rem',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '1rem',
    outline: 'none',
    letterSpacing: '0.15em',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }

  return (
    <div
      style={{
        border: '3px solid #E8E8E0',
        boxShadow: '6px 6px 0 #E8E8E0',
        background: '#1A1A1A',
        padding: '2.5rem',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            fontFamily: 'Bangers, cursive',
            letterSpacing: '0.1em',
            fontSize: '1rem',
            color: '#AAAAAA',
            display: 'block',
            marginBottom: 8,
          }}
        >
          Admin Password
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••••••"
            style={inputBase}
            onFocus={(e) => (e.target.style.borderColor = '#E8E8E0')}
            onBlur={(e) => (e.target.style.borderColor = '#333')}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#555',
              cursor: 'pointer',
              fontSize: '1rem',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {showPw ? '🙈' : '👁'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            border: '2px solid #ff4444',
            padding: '0.6rem 1rem',
            marginBottom: '1.2rem',
            background: 'rgba(255,68,68,0.08)',
          }}
        >
          <p
            style={{
              color: '#ff6666',
              fontFamily: 'Bangers, cursive',
              letterSpacing: '0.06em',
              fontSize: '0.95rem',
            }}
          >
            ✕ {error}
          </p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !password}
        style={{
          width: '100%',
          fontFamily: 'Bangers, cursive',
          letterSpacing: '0.12em',
          fontSize: '1.3rem',
          padding: '0.85rem',
          border: '3px solid #E8E8E0',
          boxShadow: loading || !password ? '2px 2px 0 #555' : '5px 5px 0 #E8E8E0',
          background: loading || !password ? '#333' : '#F5F5F0',
          color: loading || !password ? '#555' : '#0A0A0A',
          cursor: loading || !password ? 'not-allowed' : 'pointer',
          transition: 'all 0.1s',
        }}
        onMouseEnter={(e) => {
          if (!loading && password) {
            e.currentTarget.style.transform = 'translate(-2px,-3px)'
            e.currentTarget.style.boxShadow = '7px 8px 0 #E8E8E0'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = ''
          e.currentTarget.style.boxShadow = loading || !password ? '2px 2px 0 #555' : '5px 5px 0 #E8E8E0'
        }}
      >
        {loading ? 'Verifying...' : '→ MASUK'}
      </button>

      <p
        style={{
          color: '#333',
          fontSize: '0.78rem',
          textAlign: 'center',
          marginTop: '1.5rem',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        Unauthorized access will be logged.
      </p>
    </div>
  )
}
