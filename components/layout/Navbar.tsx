"use client";

// ============================================
// RAVEN STORE — NAVBAR (MOBILE RESPONSIVE)
// Comic-style navigation with hamburger menu
// ============================================

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/products", label: "PRODUK" },
  { href: "/products?category=plugin", label: "PLUGIN" },
  { href: "/products?category=asset", label: "ASSET" },
  { href: "/products?category=jasa", label: "JASA" },
];

// ============================================
// MAIN NAVBAR
// ============================================
export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount] = useState(0); // Wire to cart context in real app

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "bg-background border-b-[4px] border-border",
          "transition-shadow duration-200",
          scrolled && "shadow-[0_4px_0px_#E8E8E0]"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* === LOGO === */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 group"
            aria-label="Raven Store Home"
          >
            <div
              className={cn(
                "w-9 h-9 bg-accent border-[3px] border-border",
                "shadow-[3px_3px_0px_#E8E8E0]",
                "flex items-center justify-center",
                "transition-[transform,box-shadow] duration-150",
                "group-hover:-translate-x-[1px] group-hover:-translate-y-[2px]",
                "group-hover:shadow-[4px_4px_0px_#E8E8E0]"
              )}
            >
              <span className="font-display text-background text-xl leading-none">R</span>
            </div>
            <span className="font-display text-2xl tracking-[0.1em] text-text-primary hidden sm:block">
              RAVEN<span className="text-text-secondary ml-1 text-xl">STORE</span>
            </span>
          </Link>

          {/* === DESKTOP NAV LINKS === */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                active={pathname === item.href}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* === RIGHT ACTIONS === */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              href="/cart"
              className={cn(
                "relative p-2 rounded-[2px]",
                "border-[2px] border-transparent",
                "hover:border-border hover:bg-surface",
                "transition-all duration-150"
              )}
              aria-label="Cart"
            >
              <ShoppingCart size={20} className="text-text-primary" />
              {cartCount > 0 && (
                <span
                  className={cn(
                    "absolute -top-1 -right-1",
                    "w-5 h-5 flex items-center justify-center",
                    "font-display text-xs text-background bg-accent",
                    "border-[2px] border-background rounded-full"
                  )}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth button — Desktop */}
            <div className="hidden md:block">
              <AuthButton />
            </div>

            {/* Hamburger — Mobile only */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={cn(
                "md:hidden p-2 rounded-[2px]",
                "border-[2px] border-border",
                "shadow-[2px_2px_0px_#E8E8E0]",
                "transition-[transform,box-shadow] duration-150",
                "hover:-translate-x-[1px] hover:-translate-y-[1px]",
                "hover:shadow-[3px_3px_0px_#E8E8E0]",
                "active:translate-x-[1px] active:translate-y-[1px]",
                mobileOpen && "bg-surface"
              )}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X size={20} className="text-text-primary" />
              ) : (
                <Menu size={20} className="text-text-primary" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* === MOBILE MENU OVERLAY === */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* === MOBILE MENU PANEL === */}
      <div
        className={cn(
          "fixed top-16 left-0 right-0 z-40 md:hidden",
          "bg-background border-b-[4px] border-border",
          "shadow-[0_6px_0px_#E8E8E0]",
          "transition-[transform,opacity] duration-300",
          mobileOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-4 opacity-0 pointer-events-none"
        )}
      >
        {/* Halftone dots */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #E8E8E0 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />

        <div className="relative z-10 px-4 py-6 space-y-2">
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3",
                "font-display text-xl tracking-widest",
                "border-[3px] rounded-[2px]",
                "transition-[transform,box-shadow,background-color] duration-150",
                pathname === item.href
                  ? "border-accent bg-surface text-accent shadow-[3px_3px_0px_#FFFFFF]"
                  : "border-border text-text-primary hover:bg-surface hover:shadow-[3px_3px_0px_#E8E8E0]"
              )}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {item.label}
            </Link>
          ))}

          {/* Auth in mobile */}
          <div className="pt-3 border-t-[3px] border-border">
            <AuthButton fullWidth />
          </div>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}

// ============================================
// NAV LINK
// ============================================
function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-1.5 rounded-[2px]",
        "font-display text-sm tracking-widest",
        "transition-all duration-150",
        active
          ? "text-background bg-accent border-[2px] border-border shadow-[2px_2px_0px_#E8E8E0]"
          : "text-text-secondary hover:text-text-primary hover:bg-surface border-[2px] border-transparent hover:border-border"
      )}
    >
      {children}
    </Link>
  );
}

// ============================================
// AUTH BUTTON
// Shows login or user menu based on auth state
// ============================================
function AuthButton({ fullWidth = false }: { fullWidth?: boolean }) {
  // In production, wire this to useAuth() context
  const isLoggedIn = false;
  const user = null as null | { display_name: string };

  if (isLoggedIn && user) {
    return (
      <div className="relative group">
        <button
          className={cn(
            "flex items-center gap-2 px-3 py-1.5",
            "font-display text-sm tracking-wider",
            "border-[2px] border-border bg-surface",
            "shadow-[2px_2px_0px_#E8E8E0]",
            "transition-[transform,box-shadow] duration-150",
            "hover:-translate-x-[1px] hover:-translate-y-[1px]",
            "hover:shadow-[3px_3px_0px_#E8E8E0]",
            "rounded-[2px]",
            fullWidth && "w-full justify-center"
          )}
        >
          <User size={16} />
          <span className="truncate max-w-[100px]">{user.display_name}</span>
        </button>

        {/* Dropdown */}
        <div
          className={cn(
            "absolute right-0 top-full mt-2 w-48 py-1",
            "bg-surface border-[3px] border-border shadow-comic",
            "rounded-[2px] z-50",
            "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto",
            "transition-opacity duration-150"
          )}
        >
          <DropdownItem href="/dashboard" icon={<LayoutDashboard size={14} />}>
            Dashboard
          </DropdownItem>
          <DropdownItem
            href="/api/auth/signout"
            icon={<LogOut size={14} />}
            danger
          >
            Keluar
          </DropdownItem>
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className={cn(
        "flex items-center gap-2 px-4 py-1.5",
        "font-display text-sm tracking-wider",
        "bg-accent text-background",
        "border-[2px] border-border",
        "shadow-[3px_3px_0px_#E8E8E0]",
        "rounded-[2px]",
        "transition-[transform,box-shadow] duration-150",
        "hover:-translate-x-[1px] hover:-translate-y-[2px]",
        "hover:shadow-[4px_4px_0px_#E8E8E0]",
        fullWidth && "w-full justify-center"
      )}
    >
      <User size={16} />
      LOGIN
    </Link>
  );
}

function DropdownItem({
  href,
  icon,
  children,
  danger = false,
}: {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-4 py-2",
        "font-body text-sm",
        "transition-colors duration-100",
        danger
          ? "text-[#FF4444] hover:bg-[#2A0A0A]"
          : "text-text-primary hover:bg-background"
      )}
    >
      {icon}
      {children}
    </Link>
  );
}

export default Navbar;
