"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useClerk } from "@clerk/nextjs";

const NAV_ITEMS = [
  { href: "/products", label: "PRODUK" },
  { href: "/products?category=plugin", label: "PLUGIN" },
  { href: "/products?category=asset", label: "ASSET" },
  { href: "/products?category=jasa", label: "JASA" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
          scrolled 
            ? "bg-black/80 backdrop-blur-xl border-white/10 py-3" 
            : "bg-transparent border-transparent py-6"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white text-black flex items-center justify-center rounded-xl font-black text-xl transition-transform group-hover:rotate-12">
              R
            </div>
            <span className="font-black text-2xl tracking-tighter text-white">
              RAVEN<span className="text-zinc-500">STORE</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-xs font-bold uppercase tracking-widest transition-all hover:text-white",
                  pathname === item.href ? "text-white" : "text-zinc-500"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              {isLoaded && isSignedIn ? (
                <div className="relative">
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all"
                  >
                    <img src={user.imageUrl} alt="" className="w-8 h-8 rounded-full border border-white/20" />
                    <span className="text-xs font-bold text-white max-w-[100px] truncate">{user.firstName || user.username}</span>
                    <ChevronDown size={14} className={cn("text-zinc-500 transition-transform", userMenuOpen && "rotate-180")} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 animate-fade-in">
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <LayoutDashboard size={18} />
                        <span className="text-sm font-bold">Dashboard</span>
                      </Link>
                      <div className="h-px bg-white/5 my-2 mx-2" />
                      <button 
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <LogOut size={18} />
                        <span className="text-sm font-bold">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="btn-elegant btn-primary py-2.5 px-6 text-xs">
                  SIGN IN
                </Link>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black transition-transform duration-500 md:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-24 px-8 gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-3xl font-black tracking-tighter uppercase text-white hover:text-zinc-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-auto pb-12">
            {isSignedIn ? (
              <div className="flex flex-col gap-4">
                <Link href="/dashboard" className="w-full btn-elegant btn-outline py-4 text-sm">DASHBOARD</Link>
                <button onClick={() => signOut()} className="w-full btn-elegant bg-red-500/10 text-red-500 border-red-500/20 py-4 text-sm">LOGOUT</button>
              </div>
            ) : (
              <Link href="/login" className="btn-elegant btn-primary w-full py-4 text-sm">
                SIGN IN
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
