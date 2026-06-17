'use client'
import { cn } from '@/lib/utils'

const CATEGORY_STYLES: Record<string, string> = {
  plugin: 'bg-accent-soft text-accent-light border-accent/20',
  asset:  'bg-zinc-900 text-zinc-400 border-white/5',
  jasa:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

const CATEGORY_LABELS: Record<string, string> = {
  plugin: 'Plugin',
  asset:  'Asset',
  jasa:   'Jasa',
}

export function CategoryBadge({ category }: { category: string }) {
  const styleClass = CATEGORY_STYLES[category] ?? CATEGORY_STYLES.plugin
  const label = CATEGORY_LABELS[category] ?? category

  return (
    <span className={cn(
      "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border",
      styleClass
    )}>
      {label}
    </span>
  )
}

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-500/10 text-amber-500 border-amber-500/20',
  paid:      'bg-green-500/10 text-green-500 border-green-500/20',
  completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
}

export function StatusBadge({ status }: { status: string }) {
  const styleClass = STATUS_STYLES[status] ?? 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
  return (
    <span className={cn(
      "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border",
      styleClass
    )}>
      {status}
    </span>
  )
}
