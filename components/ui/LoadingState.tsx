"use client";

// ============================================
// RAVEN STORE — LOADING STATE COMPONENTS
// Consistent loading UI across all pages
// ============================================

import React from "react";
import { cn } from "@/lib/utils";

// ============================================
// SKELETON — generic block
// ============================================
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("comic-skeleton rounded-[2px]", className)}
      {...props}
    />
  );
}

// ============================================
// PRODUCT GRID SKELETON
// ============================================
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-surface border-[4px] border-surface rounded-[2px] overflow-hidden"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <Skeleton className="aspect-video" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-6 w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// ORDER LIST SKELETON
// ============================================
export function OrderListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-surface border-[4px] border-surface rounded-[2px] p-4"
        >
          <div className="flex items-start gap-4">
            <Skeleton className="w-16 h-16 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// FULL PAGE LOADING
// For Suspense fallback on page-level
// ============================================
export function PageLoading({ text = "Memuat..." }: { text?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      {/* Animated ink blot */}
      <div className="relative">
        <div
          className="w-16 h-16 border-[4px] border-border rounded-full animate-loader-spin"
          style={{
            borderTopColor: "transparent",
            boxShadow: "3px 3px 0px #E8E8E0",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-accent text-xl">R</span>
        </div>
      </div>
      <p className="font-display text-lg tracking-widest text-text-secondary">
        {text.toUpperCase()}
      </p>
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================
interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon = "📭",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-4",
        className
      )}
    >
      <div
        className={cn(
          "w-24 h-24 flex items-center justify-center text-5xl mb-6",
          "bg-surface border-[4px] border-border shadow-comic",
          "rounded-[2px]"
        )}
      >
        {icon}
      </div>
      <h3 className="font-display text-2xl tracking-wider text-text-primary mb-2">
        {title.toUpperCase()}
      </h3>
      {description && (
        <p className="font-body text-text-secondary max-w-sm mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

// ============================================
// ERROR STATE
// ============================================
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Terjadi Kesalahan",
  description = "Gagal memuat data. Silakan coba lagi.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-4",
        className
      )}
    >
      <div
        className={cn(
          "w-24 h-24 flex items-center justify-center text-5xl mb-6",
          "bg-[#2A0A0A] border-[4px] border-[#FF4444]",
          "shadow-[5px_5px_0px_#FF4444]",
          "rounded-[2px]"
        )}
      >
        ⚠️
      </div>
      <h3 className="font-display text-2xl tracking-wider text-[#FF4444] mb-2">
        {title.toUpperCase()}
      </h3>
      <p className="font-body text-text-secondary max-w-sm mb-6">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 font-display text-base tracking-widest bg-accent text-background border-[3px] border-border shadow-[3px_3px_0px_#E8E8E0] rounded-[2px] hover:-translate-x-[1px] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_#E8E8E0] transition-[transform,box-shadow] duration-150"
        >
          COBA LAGI
        </button>
      )}
    </div>
  );
}

// ============================================
// INLINE SPINNER
// ============================================
export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn("inline-block rounded-full border-[2px] border-current border-t-transparent animate-loader-spin", className)}
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  );
}
