'use client'

import { useState } from 'react'

interface JasaOrderFormProps {
  services: { id: string; title: string }[]
}

type FormState = {
  service_type: string
  server_name: string
  needs: string
  discord_contact: string
}

const EMPTY: FormState = {
  service_type: '',
  server_name: '',
  needs: '',
  discord_contact: '',
}

export default function JasaOrderForm({ services }: JasaOrderFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<'success' | 'error' | null>(null)

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const isValid =
    form.service_type && form.server_name.trim() && form.needs.trim() && form.discord_contact.trim()

  const handleSubmit = async () => {
    if (!isValid) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/jasa-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setResult(res.ok ? 'success' : 'error')
      if (res.ok) setForm(EMPTY)
    } catch {
      setResult('error')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#111',
    color: '#F5F5F0',
    border: '3px solid #333',
    padding: '0.7rem 1rem',
    fontFamily: 'Comic Neue, cursive',
    fontSize: '0.97rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Bangers, cursive',
    letterSpacing: '0.08em',
    fontSize: '1rem',
    marginBottom: 6,
    display: 'block',
    color: '#F5F5F0',
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {result === 'success' ? (
        <div
          style={{
            border: '3px solid #E8E8E0',
            boxShadow: '6px 6px 0 #E8E8E0',
            background: '#1A1A1A',
            padding: '3rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>✓</div>
          <h3
            style={{
              fontFamily: 'Bangers, cursive',
              fontSize: '2rem',
              letterSpacing: '0.05em',
              marginBottom: 8,
            }}
          >
            Order Diterima!
          </h3>
          <p style={{ color: '#AAAAAA', lineHeight: 1.6 }}>
            Kami akan segera menghubungi kamu via Discord. Biasanya dalam <strong style={{ color: '#F5F5F0' }}>1-2 jam</strong>.
          </p>
          <button
            onClick={() => setResult(null)}
            style={{
              marginTop: '1.5rem',
              fontFamily: 'Bangers, cursive',
              letterSpacing: '0.08em',
              fontSize: '1rem',
              padding: '0.5rem 1.5rem',
              border: '3px solid #E8E8E0',
              boxShadow: '4px 4px 0 #E8E8E0',
              background: '#1A1A1A',
              color: '#F5F5F0',
              cursor: 'pointer',
            }}
          >
            Order Lagi
          </button>
        </div>
      ) : (
        <div
          className="comic-panel"
          style={{ background: '#1A1A1A', padding: '2rem' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {/* Service type */}
            <div>
              <label style={labelStyle}>Jenis Jasa *</label>
              <select
                value={form.service_type}
                onChange={set('service_type')}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={(e) => (e.target.style.borderColor = '#E8E8E0')}
                onBlur={(e) => (e.target.style.borderColor = '#333')}
              >
                <option value="">-- Pilih jenis jasa --</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Server name */}
            <div>
              <label style={labelStyle}>Nama / IP Server *</label>
              <input
                type="text"
                value={form.server_name}
                onChange={set('server_name')}
                placeholder="contoh: play.myserver.net"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#E8E8E0')}
                onBlur={(e) => (e.target.style.borderColor = '#333')}
              />
            </div>

            {/* Needs */}
            <div>
              <label style={labelStyle}>Kebutuhan Kamu *</label>
              <textarea
                value={form.needs}
                onChange={set('needs')}
                placeholder="Jelaskan detail apa yang kamu butuhkan. Semakin detail, makin cepat dikerjakan!"
                rows={5}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={(e) => (e.target.style.borderColor = '#E8E8E0')}
                onBlur={(e) => (e.target.style.borderColor = '#333')}
              />
            </div>

            {/* Discord contact */}
            <div>
              <label style={labelStyle}>Discord kamu *</label>
              <input
                type="text"
                value={form.discord_contact}
                onChange={set('discord_contact')}
                placeholder="contoh: username#1234 atau @username"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#E8E8E0')}
                onBlur={(e) => (e.target.style.borderColor = '#333')}
              />
              <p style={{ color: '#555', fontSize: '0.82rem', marginTop: 4 }}>
                * Kami akan menghubungi kamu via Discord untuk konfirmasi dan detail lebih lanjut.
              </p>
            </div>

            {result === 'error' && (
              <p
                style={{
                  color: '#ff6b6b',
                  border: '2px solid #ff6b6b',
                  padding: '0.6rem 1rem',
                  fontSize: '0.9rem',
                }}
              >
                Gagal mengirim order. Coba lagi atau hubungi kami langsung di Discord.
              </p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              style={{
                fontFamily: 'Bangers, cursive',
                letterSpacing: '0.1em',
                fontSize: '1.2rem',
                padding: '0.8rem',
                border: '3px solid #E8E8E0',
                boxShadow: isValid && !submitting ? '5px 5px 0 #E8E8E0' : '2px 2px 0 #555',
                background: isValid && !submitting ? '#F5F5F0' : '#333',
                color: isValid && !submitting ? '#0A0A0A' : '#555',
                cursor: isValid && !submitting ? 'pointer' : 'not-allowed',
                transition: 'all 0.1s',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                if (isValid && !submitting) {
                  e.currentTarget.style.transform = 'translate(-2px,-3px)'
                  e.currentTarget.style.boxShadow = '7px 8px 0 #E8E8E0'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = isValid && !submitting ? '5px 5px 0 #E8E8E0' : '2px 2px 0 #555'
              }}
            >
              {submitting ? 'Mengirim...' : 'Kirim Order →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
