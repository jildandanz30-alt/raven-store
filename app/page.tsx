import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import ComicCard from '@/components/ComicCard'
import ScrollReveal from '@/components/ScrollReveal'
import Link from 'next/link'
import { getFeaturedProducts } from '@/lib/products'
import { ArrowRight, Zap, Package, Globe, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Raven Store — Premium Minecraft Plugins & Assets',
  description: 'Plugin premium, asset ItemAdder/Oraxen, dan jasa setup terpercaya untuk server Minecraft kamu.',
}

const JASA_LIST = [
  {
    icon: <Zap className="w-8 h-8 text-green-400" />,
    title: 'Pasang Add-on',
    price: 'Rp2.000 / add-on',
    desc: 'Install plugin & konfigurasi dasar ke server kamu. Cepat, rapi, dan terjamin.',
  },
  {
    icon: <Package className="w-8 h-8 text-blue-400" />,
    title: 'Pasang Resource Pack',
    price: 'Rp2.000',
    desc: 'Setup Behavior Pack + Resource Pack (Bedrock) ke server kamu dari nol.',
  },
  {
    icon: <Globe className="w-8 h-8 text-purple-400" />,
    title: 'Buat Website Store',
    price: 'Custom',
    desc: 'Website toko untuk server Minecraft kamu — desain modern, payment gateway, dan dashboard.',
  },
]

const HOW_TO_BUY = [
  {
    step: '01',
    title: 'Pilih Produk',
    desc: 'Browse katalog plugin, asset, atau jasa yang kamu butuhkan.',
  },
  {
    step: '02',
    title: 'Login & Checkout',
    desc: 'Login pakai Clerk, lalu bayar via Midtrans — QRIS, transfer, dll.',
  },
  {
    step: '03',
    title: 'Download!',
    desc: 'Setelah pembayaran verified, langsung download dari dashboard kamu.',
  },
]

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const products = await getFeaturedProducts(6)

  return (
    <>
      <Navbar />

      <main className="overflow-hidden">
        {/* HERO */}
        <HeroSection />

        {/* PRODUK UNGGULAN */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <p className="text-accent-light font-bold tracking-[0.2em] text-xs mb-3 uppercase">
                  ★ TERBARU & TERLARIS
                </p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                  Produk Unggulan
                </h2>
              </div>
              <Link
                href="/products"
                className="btn-elegant btn-outline group"
              >
                Lihat Semua <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>

          {products.length === 0 ? (
            <div className="glass-card p-20 text-center border-dashed border-2">
              <p className="text-zinc-500 text-xl font-medium">
                Produk akan segera hadir!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 0.1}>
                  <ComicCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </section>

        {/* MARQUEE / TICKER */}
        <div className="py-8 bg-zinc-950 border-y border-white/5 overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee">
            {Array(10).fill(null).map((_, i) => (
              <span key={i} className="mx-8 text-zinc-800 font-black text-2xl uppercase tracking-tighter">
                ⚡ PLUGIN PREMIUM · ASSET KEREN · JASA TERPERCAYA · RAVEN STORE
              </span>
            ))}
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 30s linear infinite;
              display: inline-block;
            }
          `}} />
        </div>

        {/* LAYANAN JASA */}
        <section className="py-24 px-6 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <p className="text-accent-light font-bold tracking-[0.2em] text-xs mb-3 uppercase">
                  💼 NEED HELP?
                </p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                  Layanan Jasa
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {JASA_LIST.map(({ icon, title, price, desc }, i) => (
                <ScrollReveal key={title} delay={i * 0.1}>
                  <div className="glass-card p-8 h-full flex flex-col">
                    <div className="mb-6 p-3 bg-zinc-900 w-fit rounded-2xl border border-white/5">
                      {icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-accent-light font-bold text-sm mb-4">{price}</p>
                    <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal className="text-center mt-12">
              <Link
                href="/jasa"
                className="btn-elegant btn-accent py-4 px-10 text-lg"
              >
                Order Jasa Sekarang <ArrowRight size={20} className="ml-2" />
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* CARA BELI */}
        <section className="py-24 px-6 bg-zinc-950/50 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal className="text-center mb-16">
              <p className="text-accent-light font-bold tracking-[0.2em] text-xs mb-3 uppercase">
                🛒 MUDAH BANGET!
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                Cara Beli
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {HOW_TO_BUY.map(({ step, title, desc }, i) => (
                <ScrollReveal key={step} delay={i * 0.1}>
                  <div className="relative group">
                    <div className="text-8xl font-black text-white/5 absolute -top-10 -left-4 select-none group-hover:text-accent/10 transition-colors">
                      {step}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-accent text-white text-sm flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        {title}
                      </h3>
                      <p className="text-zinc-400 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BOTTOM */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/10 opacity-50 pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <ScrollReveal>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tighter">
                SERVER KAMU SIAP <span className="text-accent-light">NAIK LEVEL?</span>
              </h2>
              <p className="text-zinc-400 text-xl mb-12 max-w-2xl mx-auto">
                Jangan biarkan server kamu biasa-biasa saja. Upgrade sekarang dengan plugin dan asset
                premium dari Raven Store!
              </p>
              <Link
                href="/products"
                className="btn-elegant btn-primary py-5 px-12 text-xl shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)]"
              >
                BROWSE SEMUA PRODUK ⚡
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
