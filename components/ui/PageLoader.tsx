"use client";

// ============================================
// RAVEN STORE — PAGE LOADER
// Ink Splatter Animation
// ============================================

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// === INK SPLAT SVG ===
// Pure CSS/SVG ink splatter shapes
function InkBlot({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("absolute", className)}
      style={style}
      fill="currentColor"
      aria-hidden
    >
      <ellipse cx="50" cy="50" rx="48" ry="44" />
      <ellipse cx="30" cy="20" rx="18" ry="12" transform="rotate(-30 30 20)" />
      <ellipse cx="70" cy="15" rx="12" ry="8" transform="rotate(20 70 15)" />
      <ellipse cx="85" cy="55" rx="10" ry="14" transform="rotate(15 85 55)" />
      <ellipse cx="75" cy="80" rx="16" ry="10" transform="rotate(-20 75 80)" />
      <ellipse cx="25" cy="75" rx="14" ry="9" transform="rotate(10 25 75)" />
      <ellipse cx="15" cy="45" rx="8" ry="13" transform="rotate(-10 15 45)" />
      {/* Drip details */}
      <ellipse cx="60" cy="95" rx="5" ry="8" />
      <ellipse cx="40" cy="96" rx="3" ry="6" />
      <ellipse cx="78" cy="88" rx="4" ry="7" transform="rotate(15 78 88)" />
    </svg>
  );
}

// === MAIN LOADER ===
interface PageLoaderProps {
  /** Minimum display time in ms */
  minDuration?: number;
  /** Callback when loader finishes */
  onComplete?: () => void;
}

export function PageLoader({ minDuration = 1200, onComplete }: PageLoaderProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Phase 1: Ink splatter enters (400ms)
    const enterTimer = setTimeout(() => {
      setPhase("hold");
    }, 400);

    // Phase 2: Hold, then begin exit
    const exitTimer = setTimeout(() => {
      setPhase("exit");
    }, minDuration);

    // Phase 3: Remove from DOM after fade
    const unmountTimer = setTimeout(() => {
      setMounted(false);
      onComplete?.();
    }, minDuration + 400);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, [minDuration, onComplete]);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "page-loader-overlay",
        phase === "exit" && "fade-out"
      )}
      aria-label="Loading Raven Store..."
      role="status"
    >
      {/* Halftone background dots */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, #2A2A2A 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />

      {/* Central ink blot */}
      <div
        className={cn(
          "relative w-32 h-32 text-accent",
          phase === "enter" && "animate-ink-in",
          phase === "hold" && "opacity-100",
        )}
      >
        <InkBlot className="w-full h-full" />

        {/* Logo text inside blot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display text-4xl tracking-widest text-background select-none"
            style={{ textShadow: "none" }}
          >
            R
          </span>
        </div>
      </div>

      {/* Scattered small ink blots */}
      <div
        className={cn(
          "absolute w-8 h-8 text-border opacity-0",
          phase !== "enter" && "animate-ink-in"
        )}
        style={{
          top: "20%",
          left: "15%",
          animationDelay: "0.1s",
          transform: "rotate(25deg)",
        }}
      >
        <InkBlot className="w-full h-full" />
      </div>

      <div
        className={cn(
          "absolute w-5 h-5 text-border opacity-0",
          phase !== "enter" && "animate-ink-in"
        )}
        style={{
          top: "70%",
          right: "20%",
          animationDelay: "0.2s",
          transform: "rotate(-15deg)",
        }}
      >
        <InkBlot className="w-full h-full" />
      </div>

      <div
        className={cn(
          "absolute w-6 h-6 text-text-secondary opacity-0",
          phase !== "enter" && "animate-ink-in"
        )}
        style={{
          top: "30%",
          right: "25%",
          animationDelay: "0.15s",
          transform: "rotate(45deg)",
        }}
      >
        <InkBlot className="w-full h-full" />
      </div>

      <div
        className={cn(
          "absolute w-4 h-4 text-border opacity-0",
          phase !== "enter" && "animate-ink-in"
        )}
        style={{
          bottom: "25%",
          left: "22%",
          animationDelay: "0.25s",
          transform: "rotate(-30deg)",
        }}
      >
        <InkBlot className="w-full h-full" />
      </div>

      {/* Store name */}
      <div
        className={cn(
          "mt-6 overflow-hidden",
          phase === "enter" && "opacity-0",
          phase !== "enter" && "animate-panel-slide-up"
        )}
      >
        <h1 className="font-display text-3xl tracking-[0.2em] text-text-primary">
          RAVEN STORE
        </h1>
      </div>

      {/* Loading dots */}
      <div
        className={cn(
          "flex gap-2 mt-3",
          phase === "enter" && "opacity-0",
          phase !== "enter" && "opacity-100 transition-opacity duration-300"
        )}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 bg-text-secondary rounded-full"
            style={{
              animation: `halftone-pulse 0.8s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// === INLINE LOADER (for content areas) ===
interface InlineLoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function InlineLoader({ size = "md", text, className }: InlineLoaderProps) {
  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className={cn("relative text-border animate-loader-spin", sizeMap[size])}>
        <InkBlot className="w-full h-full" />
      </div>
      {text && (
        <p className="font-display text-text-secondary tracking-wider text-sm">
          {text}
        </p>
      )}
    </div>
  );
}

// === SKELETON CARD LOADER ===
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-surface border-[4px] border-surface rounded-[2px] overflow-hidden",
        className
      )}
    >
      {/* Thumbnail skeleton */}
      <div className="aspect-video comic-skeleton" />
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="comic-skeleton h-3 w-20 rounded-sm" />
        <div className="comic-skeleton h-5 w-4/5 rounded-sm" />
        <div className="comic-skeleton h-4 w-3/5 rounded-sm" />
        <div className="comic-skeleton h-6 w-2/5 rounded-sm" />
      </div>
    </div>
  );
}

export default PageLoader;
