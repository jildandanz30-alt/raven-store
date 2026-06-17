import Link from "next/link";
import type { Metadata } from "next";
import { Home, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Halaman Tidak Ditemukan",
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="space-y-8 max-w-xl animate-fade-in">
        <div className="relative inline-block">
          <h1 className="text-[10rem] font-black text-white/5 tracking-tighter leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-4 py-2 bg-accent text-white font-bold text-xs tracking-[0.3em] uppercase rounded-lg border border-white/10 shadow-2xl">
              NOT FOUND
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-black text-white tracking-tighter">
            HALAMAN TIDAK <span className="text-zinc-500">DITEMUKAN</span>
          </h2>
          <p className="text-zinc-500 font-medium leading-relaxed">
            Sepertinya halaman yang kamu cari sudah pindah ke dimensi lain atau memang tidak pernah ada.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center pt-8">
          <Link
            href="/"
            className="btn-elegant btn-primary py-4 px-8 text-xs"
          >
            <Home size={16} className="mr-2" />
            KEMBALI KE BERANDA
          </Link>
          <Link
            href="/products"
            className="btn-elegant btn-outline py-4 px-8 text-xs"
          >
            <ShoppingBag size={16} className="mr-2" />
            LIHAT PRODUK
          </Link>
        </div>
      </div>
    </main>
  );
}
