'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, LogOut, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: 'dashboard',  label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: 'products',   label: 'Produk',    icon: <Package size={20} /> },
  { href: 'orders',     label: 'Orders',    icon: <ShoppingCart size={20} /> },
]

export default function AdminSidebar({ adminSecret }: { adminSecret: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const base = `/${adminSecret}/admin`

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace(base)
  }

  return (
    <aside className="w-64 min-h-screen bg-zinc-950 border-r border-white/5 flex flex-col sticky top-0 z-50">
      {/* Logo */}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-accent flex items-center justify-center rounded-lg">
            <ShieldCheck className="text-white" size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            RAVEN<span className="text-zinc-500 font-medium">ADMIN</span>
          </span>
        </div>
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
          Secure Control Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {NAV.map(({ href, label, icon }) => {
          const fullHref = `${base}/${href}`
          const isActive = pathname.startsWith(fullHref)
          return (
            <Link
              key={href}
              href={fullHref}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 group",
                isActive 
                  ? "bg-white text-black shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)]" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              <span className={cn(
                "transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-black" : "text-zinc-600 group-hover:text-accent-light"
              )}>
                {icon}
              </span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}
