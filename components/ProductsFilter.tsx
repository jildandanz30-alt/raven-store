'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { value: 'all', label: 'Semua' },
  { value: 'plugin', label: 'Plugin' },
  { value: 'asset', label: 'Asset' },
  { value: 'jasa', label: 'Layanan Jasa' },
]

export default function ProductsFilter({ active }: { active: string }) {
  const router = useRouter()

  return (
    <div className="flex gap-3 flex-wrap">
      {CATEGORIES.map(({ value, label }) => {
        const isActive = active === value
        return (
          <button
            key={value}
            onClick={() =>
              router.push(value === 'all' ? '/products' : `/products?category=${value}`)
            }
            className={cn(
              "px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 border",
              isActive 
                ? "bg-white text-black border-white shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]" 
                : "bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white"
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
