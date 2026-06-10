"use client";

// ============================================
// RAVEN STORE — ERROR BOUNDARY PAGE
// Comic Book Style — handles runtime errors
// ============================================

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to monitoring service in production
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Halftone bg */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #E8E8E0 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 text-center max-w-xl mx-auto">

        {/* Error panel */}
        <div
          className="border-[6px] border-[#FF4444] bg-surface mb-8 p-8 relative rounded-[2px]"
          style={{ boxShadow: "10px 10px 0px #FF4444" }}
        >
          {/* Corner deco */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-[3px] border-l-[3px] border-[#FF4444]" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-[3px] border-r-[3px] border-[#FF4444]" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-[3px] border-l-[3px] border-[#FF4444]" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-[3px] border-r-[3px] border-[#FF4444]" />

          <p className="font-display text-[0.7rem] tracking-[0.4em] text-[#FF4444] mb-2 uppercase">
            Server Error
          </p>

          <h1
            className="font-display text-[clamp(4rem,15vw,8rem)] leading-none tracking-wider text-[#FF4444]"
            style={{ textShadow: "6px 6px 0px #7A0000" }}
          >
            500
          </h1>

          <div className="h-1 w-full bg-[#FF4444] my-4 shadow-[2px_2px_0px_#7A0000]" />

          <h2 className="font-display text-2xl tracking-wide text-text-primary mb-3">
            TERJADI KESALAHAN!
          </h2>
          <p className="font-body text-text-secondary text-sm mb-2">
            Something went wrong on our end. Coba refresh halaman atau kembali nanti.
          </p>

          {/* Error digest for debugging */}
          {error.digest && (
            <p className="font-mono text-xs text-text-secondary mt-3">
              ID: <span className="text-[#FF4444]">{error.digest}</span>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 font-display text-xl tracking-widest bg-accent text-background border-[3px] border-border shadow-[4px_4px_0px_#E8E8E0] rounded-[2px] hover:-translate-x-[2px] hover:-translate-y-[3px] hover:shadow-[6px_6px_0px_#E8E8E0] transition-[transform,box-shadow] duration-150 active:translate-x-[2px] active:translate-y-[2px]"
          >
            🔄 COBA LAGI
          </button>
          <a
            href="/"
            className="px-6 py-3 font-display text-xl tracking-widest bg-transparent text-text-primary border-[3px] border-border shadow-[4px_4px_0px_#E8E8E0] rounded-[2px] hover:-translate-x-[2px] hover:-translate-y-[3px] hover:shadow-[6px_6px_0px_#E8E8E0] transition-[transform,box-shadow] duration-150 inline-block"
          >
            🏠 BERANDA
          </a>
        </div>
      </div>
    </main>
  );
}
