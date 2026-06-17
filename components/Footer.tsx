'use client'
import Link from 'next/link'
import { Github, Twitter, MessageSquare, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-24 pb-12 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-white flex items-center justify-center rounded-lg">
                <span className="text-black font-bold text-lg">R</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                RAVEN<span className="text-zinc-500 font-medium">STORE</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Plugin premium, asset ItemAdder/Oraxen, dan jasa setup terpercaya untuk server Minecraft kamu. 
              Membangun server impian jadi lebih mudah.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-colors border border-white/5">
                <MessageSquare size={18} />
              </a>
              <a href="#" className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-colors border border-white/5">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-colors border border-white/5">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Navigasi</h4>
            <ul className="space-y-4">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Products' },
                { href: '/jasa', label: 'Layanan Jasa' },
                { href: '/dashboard', label: 'My Account' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-zinc-500 hover:text-white text-sm transition-colors flex items-center group"
                  >
                    {label}
                    <ArrowUpRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6">Dukungan</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://discord.gg/yourserver"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-white text-sm transition-colors flex items-center group"
                >
                  Discord Server
                  <ArrowUpRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-500 hover:text-white text-sm transition-colors flex items-center group">
                  Terms of Service
                  <ArrowUpRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-zinc-500 hover:text-white text-sm transition-colors flex items-center group">
                  Privacy Policy
                  <ArrowUpRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Quote */}
          <div className="glass-card p-6 bg-zinc-900/50">
            <h4 className="text-white font-bold mb-4">Raven Quality</h4>
            <p className="text-zinc-400 text-sm italic leading-relaxed">
              "Kualitas premium, harga worth it. Kami percaya setiap server layak mendapatkan asset terbaik."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-soft border border-accent/20 flex items-center justify-center">
                <span className="text-accent-light text-[10px] font-bold">RS</span>
              </div>
              <span className="text-xs text-zinc-500 font-medium">— Tim Raven Store</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} Raven Store. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-zinc-600 text-xs font-mono">
              v2.1.0 · Next.js 14
            </p>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
