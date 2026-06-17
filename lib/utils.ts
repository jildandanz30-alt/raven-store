import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ProductCategory } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, options?: { compact?: boolean }): string {
  if (amount === 0) return 'GRATIS'
  if (options?.compact && amount >= 1000000) return `Rp${(amount / 1000000).toFixed(1)}jt`
  if (options?.compact && amount >= 1000) return `Rp${(amount / 1000).toFixed(0)}rb`
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export function formatDate(date: string | Date, format: 'full' | 'short' | 'relative' = 'short'): string {
  const d = new Date(date)
  if (format === 'relative') {
    const diff = Date.now() - d.getTime()
    const s = Math.floor(diff / 1000)
    const m = Math.floor(s / 60)
    const h = Math.floor(m / 60)
    const day = Math.floor(h / 24)
    if (s < 60) return 'baru saja'
    if (m < 60) return `${m} menit lalu`
    if (h < 24) return `${h} jam lalu`
    if (day < 7) return `${day} hari lalu`
  }
  if (format === 'full') {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
  }
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  plugin: 'Plugin',
  asset: 'Asset',
  jasa: 'Jasa',
}

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category as ProductCategory] ?? category
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export const isServer = typeof window === 'undefined'

export const DISCORD_COLORS = {
  success: 0x00ff88, error: 0xff4444, warning: 0xffaa00, info: 0x4488ff, purple: 0x9b59b6,
} as const
