'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="min-h-[90vh] flex items-center pt-24 pb-16 px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-light text-xs font-bold tracking-[0.2em] uppercase mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Sparkles size={14} />
            RAVEN STORE — PREMIUM MINECRAFT ASSETS
          </div>

          {/* Main headline */}
          <h1 className={`text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-8 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            PLUGIN <span className="text-zinc-500">PREMIUM</span> <br />
            UNTUK <span className="text-accent-light">SERVER</span> KAMU!
          </h1>

          {/* Subtext */}
          <p className={`text-zinc-400 text-lg md:text-xl max-w-xl leading-relaxed mb-12 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Satu tempat untuk segala kebutuhan server Minecraft kamu. 
            Dari plugin premium hingga asset ItemAdder & Oraxen yang memukau.
          </p>

          {/* CTA buttons */}
          <div className={`flex flex-wrap gap-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link
              href="/products"
              className="btn-elegant btn-primary py-4 px-10 text-lg"
            >
              Lihat Produk <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link
              href="/jasa"
              className="btn-elegant btn-outline py-4 px-10 text-lg"
            >
              Order Jasa
            </Link>
          </div>

          {/* Stats row */}
          <div className={`flex gap-12 mt-20 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {[
              { n: '50+', label: 'Plugin & Asset' },
              { n: '200+', label: 'Customer' },
              { n: '4.9★', label: 'Rating' },
            ].map(({ n, label }) => (
              <div key={label} className="group">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-accent-light transition-colors">
                  {n}
                </div>
                <div className="text-zinc-500 text-sm font-medium tracking-wide uppercase">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
