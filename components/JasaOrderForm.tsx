'use client'

import { useState } from 'react'
import { CheckCircle2, AlertCircle, Send, MessageSquare } from 'lucide-react'

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

  return (
    <div className="w-full max-w-2xl mx-auto">
      {result === 'success' ? (
        <div className="glass-card p-12 text-center bg-zinc-900/40 border-white/5">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
            <CheckCircle2 className="text-green-500" size={40} />
          </div>
          <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Order Diterima!</h3>
          <p className="text-zinc-500 leading-relaxed mb-10 max-w-md mx-auto">
            Kami akan segera menghubungi kamu via Discord. Biasanya dalam <strong className="text-white">1-2 jam</strong> kerja.
          </p>
          <button
            onClick={() => setResult(null)}
            className="btn-elegant btn-primary py-4 px-10"
          >
            Order Jasa Lainnya
          </button>
        </div>
      ) : (
        <div className="glass-card p-10 bg-zinc-900/40 border-white/5">
          <div className="space-y-8">
            {/* Service type */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 ml-1">Jenis Jasa *</label>
              <select
                value={form.service_type}
                onChange={set('service_type')}
                className="w-full bg-black border border-white/10 text-white rounded-xl py-4 px-5 outline-none focus:border-accent transition-all appearance-none cursor-pointer"
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
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 ml-1">Nama / IP Server *</label>
              <input
                type="text"
                value={form.server_name}
                onChange={set('server_name')}
                placeholder="contoh: play.myserver.net"
                className="w-full bg-black border border-white/10 text-white rounded-xl py-4 px-5 outline-none focus:border-accent transition-all"
              />
            </div>

            {/* Needs */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 ml-1">Kebutuhan Kamu *</label>
              <textarea
                value={form.needs}
                onChange={set('needs')}
                placeholder="Jelaskan detail apa yang kamu butuhkan. Semakin detail, makin cepat dikerjakan!"
                rows={5}
                className="w-full bg-black border border-white/10 text-white rounded-xl py-4 px-5 outline-none focus:border-accent transition-all resize-none"
              />
            </div>

            {/* Discord contact */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 ml-1">Discord kamu *</label>
              <div className="relative">
                <input
                  type="text"
                  value={form.discord_contact}
                  onChange={set('discord_contact')}
                  placeholder="contoh: username#1234 atau @username"
                  className="w-full bg-black border border-white/10 text-white rounded-xl py-4 px-5 pl-12 outline-none focus:border-accent transition-all"
                />
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
              </div>
              <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider mt-3 ml-1">
                * Kami akan menghubungi kamu via Discord untuk konfirmasi.
              </p>
            </div>

            {result === 'error' && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
                <p className="text-red-500 text-sm font-bold">
                  Gagal mengirim order. Coba lagi nanti.
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              className="w-full btn-elegant btn-primary py-5 text-lg disabled:opacity-50 group"
            >
              {submitting ? (
                <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-3">
                  Kirim Order Sekarang <Send size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
