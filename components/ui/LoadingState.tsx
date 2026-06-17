"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, AlertCircle, Inbox } from "lucide-react";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-white/5 animate-pulse rounded-xl", className)}
      {...props}
    />
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card p-6 bg-zinc-900/40 border-white/5"
        >
          <Skeleton className="aspect-video mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <div className="pt-4 flex justify-between items-center">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrderListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card p-6 bg-zinc-900/40 border-white/5"
        >
          <div className="flex items-center gap-6">
            <Skeleton className="w-16 h-16 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="space-y-3 text-right">
              <Skeleton className="h-6 w-24 ml-auto" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageLoading({ text = "Memuat..." }: { text?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-accent-light animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-black text-white">R</span>
        </div>
      </div>
      <p className="text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">
        {text}
      </p>
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon = <Inbox size={48} />,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-20 px-6 glass-card bg-zinc-900/20 border-dashed border-2 border-white/5",
        className
      )}
    >
      <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-zinc-600 mb-8 border border-white/5">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-white tracking-tighter mb-3">
        {title.toUpperCase()}
      </h3>
      {description && (
        <p className="text-zinc-500 font-medium max-w-sm mb-8">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

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
        "flex flex-col items-center justify-center text-center py-20 px-6 glass-card bg-red-500/5 border-red-500/10",
        className
      )}
    >
      <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mb-8 border border-red-500/20">
        <AlertCircle size={40} />
      </div>
      <h3 className="text-2xl font-black text-red-500 tracking-tighter mb-3">
        {title.toUpperCase()}
      </h3>
      <p className="text-zinc-500 font-medium max-w-sm mb-8">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-elegant bg-red-500 text-white hover:bg-red-600 py-3 px-8 text-xs"
        >
          COBA LAGI
        </button>
      )}
    </div>
  );
}

export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <Loader2 
      className={cn("animate-spin", className)} 
      size={size}
    />
  );
}
