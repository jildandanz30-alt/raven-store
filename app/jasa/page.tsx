import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import JasaOrderForm from '@/components/JasaOrderForm'
import { CheckCircle2, Clock, Zap, Package, Paintbrush, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Layanan Jasa | Raven Store',
  description: 'Jasa pasang plugin, resource pack, dan buat website store untuk server Minecraft kamu.',
}

const SERVICES = [
  {
    id: 'addon',
    icon: <Zap className="text-green-400" size={32} />,
    title: 'Pasang Add-on',
    price: 'Rp2.000',
    unit: 'per add-on',
    desc: 'Install dan konfigurasi plugin/add-on ke server kamu. Termasuk setup dasar agar langsung bisa dipakai.',
    includes: ['Install plugin ke server', 'Konfigurasi config dasar', 'Test fungsionalitas', 'Panduan penggunaan'],
    turnaround: '1-3 jam',
  },
  {
    id: 'resourcepack',
    icon: <Package className="text-blue-400" size={32} />,
    title: 'Pasang Resource Pack',
    price: 'Rp2.000',
    unit: 'per pack',
    desc: 'Setup lengkap Behavior Pack & Resource Pack untuk server Bedrock kamu dari nol.',
    includes: ['Upload & konfigurasi pack', 'Setup auto-download', 'Integrasi dengan plugin', 'Test di server'],
    turnaround: '2-5 jam',
  },
  {
    id: 'itemadder',
    icon: <Paintbrush className="text-purple-400" size={32} />,
    title: 'Setup ItemAdder / Oraxen',
    price: 'Custom',
    unit: 'tergantung scope',
    desc: 'Pasang dan konfigurasi ItemAdder atau Oraxen beserta custom assets kamu.',
    includes: ['Install & konfigurasi plugin', 'Import custom assets', 'Setup resource pack', 'Troubleshoot error'],
    turnaround: '3-8 jam',
  },
  {
    id: 'website',
    icon: <Globe className="text-pink-400" size={32} />,
    title: 'Buat Website Store',
    price: 'Custom',
    unit: 'hubungi untuk penawaran',
    desc: 'Website toko profesional untuk server Minecraft kamu. Desain modern, payment gateway Midtrans, dashboard member.',
    includes: [
      'Desain modern & elegan',
      'Auth + Dashboard member',
      'Payment gateway (Midtrans)',
      'Deploy ke Railway/Vercel',
      'Admin panel',
    ],
    turnaround: '3-7 hari',
  },
]

export const dynamic = 'force-dynamic'

export default function JasaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-16 max-w-3xl">
            <p className="text-accent-light font-bold tracking-[0.2em] text-xs mb-3 uppercase">
              🛠 PROFESIONAL & TERPERCAYA
            </p>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
              LAYANAN <span className="text-zinc-500">JASA</span>
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Butuh bantuan setup server? Kami handle semuanya — dari install plugin sederhana
              sampai bangun website store penuh buat server kamu.
            </p>
          </div>
        </ScrollReveal>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {SERVICES.map(({ id, icon, title, price, unit, desc, includes, turnaround }, i) => (
            <ScrollReveal key={id} delay={i * 0.08}>
              <div className="glass-card p-8 h-full flex flex-col bg-zinc-900/40 border-white/5">
                <div className="mb-6 p-3 bg-zinc-900 w-fit rounded-2xl border border-white/5">
                  {icon}
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-xl font-black text-white">{price}</span>
                  <span className="text-zinc-600 text-xs font-medium uppercase">/ {unit}</span>
                </div>

                <p className="text-zinc-500 text-sm leading-relaxed mb-8 flex-1">
                  {desc}
                </p>

                {/* What's included */}
                <div className="space-y-3 mb-8">
                  {includes.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="text-accent-light flex-shrink-0 mt-0.5" size={14} />
                      <span className="text-zinc-400 text-xs font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <Clock size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Estimasi</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">{turnaround}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Order form */}
        <ScrollReveal>
          <div className="pt-24 border-t border-white/5">
            <div className="text-center mb-16">
              <p className="text-accent-light font-bold tracking-[0.2em] text-xs mb-3 uppercase">
                📋 ISI FORMULIR DI BAWAH
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                ORDER JASA SEKARANG
              </h2>
            </div>
            <div className="max-w-2xl mx-auto">
              <JasaOrderForm services={SERVICES.map((s) => ({ id: s.id, title: s.title }))} />
            </div>
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  )
}
