"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useClerk, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Download, Star, LogOut, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href:"/dashboard", label:"Overview", icon: <LayoutDashboard size={20} /> },
  { href:"/dashboard/orders", label:"My Orders", icon: <ShoppingBag size={20} /> },
  { href:"/dashboard/downloads", label:"Downloads", icon: <Download size={20} /> },
  { href:"/dashboard/reviews", label:"Reviews", icon: <Star size={20} /> },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useClerk()
  const { user } = useUser()

  const handleSignOut = () => signOut(() => router.push('/'))

  return (
    <aside className="w-64 min-h-[calc(100vh-80px)] bg-zinc-950 border-r border-white/5 flex flex-col sticky top-20 z-40">
      {/* Nav */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        <p className="px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">
          NAVIGATION
        </p>
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
          return (
            <Link 
              key={item.href} 
              href={item.href} 
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
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}

        <div className="pt-8">
          <p className="px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">
            SHOPPING
          </p>
          <Link 
            href="/products" 
            className="flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm text-zinc-500 hover:text-white hover:bg-white/5 transition-all group"
          >
            <span className="text-zinc-600 group-hover:text-accent-light transition-transform duration-200 group-hover:scale-110">
              <ShoppingCart size={20} />
            </span>
            Browse Store
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-white/5">
        <button 
          onClick={handleSignOut} 
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
