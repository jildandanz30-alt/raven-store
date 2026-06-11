'use client'
import type { ProductCategory } from '@/types'

const CATEGORY_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  plugin: { bg: '#1a1a1a', color: '#F5F5F0', border: '#E8E8E0' },
  asset:  { bg: '#F5F5F0', color: '#0A0A0A', border: '#E8E8E0' },
  jasa:   { bg: '#444',    color: '#F5F5F0', border: '#888'    },
}

const CATEGORY_LABELS: Record<string, string> = {
  plugin: 'Plugin',
  asset:  'Asset',
  jasa:   'Jasa',
}

export function CategoryBadge({ category }: { category: string }) {
  const style = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.plugin
  const label = CATEGORY_LABELS[category] ?? category

  return (
    <span style={{
      fontFamily: 'Bangers, cursive',
      letterSpacing: '0.1em',
      fontSize: '0.75rem',
      padding: '2px 10px',
      border: `2px solid ${style.border}`,
      boxShadow: `2px 2px 0 ${style.border}`,
      background: style.bg,
      color: style.color,
      display: 'inline-block',
    }}>
      {label.toUpperCase()}
    </span>
  )
}

const STATUS_COLORS: Record<string, { color: string; border: string }> = {
  pending:   { color: '#f0a500', border: '#f0a500' },
  paid:      { color: '#44dd88', border: '#44dd88' },
  completed: { color: '#44aaff', border: '#44aaff' },
  cancelled: { color: '#ff4444', border: '#ff4444' },
}

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_COLORS[status] ?? { color: '#888', border: '#888' }
  return (
    <span style={{
      fontFamily: 'Bangers, cursive',
      letterSpacing: '0.1em',
      fontSize: '0.75rem',
      padding: '2px 10px',
      border: `2px solid ${style.border}`,
      color: style.color,
      display: 'inline-block',
    }}>
      {status.toUpperCase()}
    </span>
  )
}
