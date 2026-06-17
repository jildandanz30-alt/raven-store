"use client";

import { useEffect } from "react";
import { RefreshCcw, Home, AlertTriangle } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="space-y-8 max-w-xl animate-fade-in">
        <div className="relative inline-block">
          <h1 className="text-[10rem] font-black text-red-500/5 tracking-tighter leading-none select-none">
            500
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20 shadow-2xl rotate-12">
              <AlertTriangle className="text-red-500" size={40} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-black text-white tracking-tighter">
            TERJADI <span className="text-red-500">KESALAHAN</span>
          </h2>
          <p className="text-zinc-500 font-medium leading-relaxed">
            Ups! Ada masalah di sistem kami. Jangan khawatir, tim kami sudah diberitahu.
            Silakan coba refresh atau kembali ke beranda.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-4 justify-center pt-8">
          <button
            onClick={reset}
            className="btn-elegant bg-red-500 text-white hover:bg-red-600 py-4 px-8 text-xs"
          >
            <RefreshCcw size={16} className="mr-2" />
            COBA LAGI
          </button>
          <a
            href="/"
            className="btn-elegant btn-outline py-4 px-8 text-xs"
          >
            <Home size={16} className="mr-2" />
            KEMBALI KE BERANDA
          </a>
        </div>
      </div>
    </main>
  );
}
