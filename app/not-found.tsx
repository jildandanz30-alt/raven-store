// ============================================
// RAVEN STORE — 404 NOT FOUND PAGE
// Comic Book Style
// ============================================

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Halaman Tidak Ditemukan",
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Halftone bg */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #E8E8E0 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Speed lines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `repeating-conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg 8deg,
            rgba(232,232,224,0.04) 8deg 10deg
          )`,
        }}
      />

      <div className="relative z-10 text-center max-w-2xl mx-auto">

        {/* Big 404 panel */}
        <div
          className="border-[6px] border-border bg-surface shadow-comic-xl mb-8 p-8 relative"
          style={{ boxShadow: "10px 10px 0px #E8E8E0" }}
        >
          {/* Corner decorations */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-[3px] border-l-[3px] border-border" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-[3px] border-r-[3px] border-border" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-[3px] border-l-[3px] border-border" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-[3px] border-r-[3px] border-border" />

          <p className="font-display text-[0.7rem] tracking-[0.4em] text-text-secondary mb-4 uppercase">
            Error
          </p>

          <h1
            className="font-display text-[clamp(5rem,20vw,10rem)] leading-none tracking-wider text-accent"
            style={{ textShadow: "6px 6px 0px #E8E8E0" }}
          >
            404
          </h1>

          <div className="h-1 w-full bg-border my-4 shadow-[2px_2px_0px_#FFFFFF]" />

          {/* Speech bubble */}
          <div className="relative inline-block bg-background border-[3px] border-border px-5 py-3 shadow-comic mt-4">
            <p className="font-display text-xl tracking-wide text-text-primary">
              HALAMAN INI TIDAK ADA!
            </p>
            {/* Bubble tail */}
            <div className="absolute -bottom-[14px] left-6 w-0 h-0 border-l-[12px] border-l-transparent border-r-0 border-t-[14px] border-t-border" />
            <div className="absolute -bottom-[10px] left-[26px] w-0 h-0 border-l-[10px] border-l-transparent border-r-0 border-t-[12px] border-t-background z-10" />
          </div>
        </div>

        {/* Sub message */}
        <p className="font-body text-text-secondary mb-10 text-lg">
          Halaman yang kamu cari sudah pindah, dihapus, atau memang tidak pernah ada.
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 font-display text-xl tracking-widest bg-accent text-background border-[3px] border-border shadow-[4px_4px_0px_#E8E8E0] rounded-[2px] hover:-translate-x-[2px] hover:-translate-y-[3px] hover:shadow-[6px_6px_0px_#E8E8E0] transition-[transform,box-shadow] duration-150 active:translate-x-[2px] active:translate-y-[2px]"
          >
            🏠 BERANDA
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 font-display text-xl tracking-widest bg-transparent text-text-primary border-[3px] border-border shadow-[4px_4px_0px_#E8E8E0] rounded-[2px] hover:-translate-x-[2px] hover:-translate-y-[3px] hover:shadow-[6px_6px_0px_#E8E8E0] transition-[transform,box-shadow] duration-150"
          >
            🛒 PRODUK
          </Link>
        </div>

        {/* Decorative ink blots */}
        <div className="absolute -top-8 -left-8 text-surface text-[6rem] opacity-30 select-none pointer-events-none rotate-12">
          ●
        </div>
        <div className="absolute -bottom-8 -right-8 text-surface text-[4rem] opacity-20 select-none pointer-events-none -rotate-6">
          ●
        </div>
      </div>
    </main>
  );
}
