'use client'

import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { value: 'all', label: 'Semua' },
  { value: 'plugin', label: '🔌 Plugin' },
  { value: 'asset', label: '🎨 Asset' },
  { value: 'jasa', label: '🛠 Jasa' },
]

export default function ProductsFilter({ active }: { active: string }) {
  const router = useRouter()

  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      {CATEGORIES.map(({ value, label }) => {
        const isActive = active === value
        return (
          <button
            key={value}
            onClick={() =>
              router.push(value === 'all' ? '/products' : `/products?category=${value}`)
            }
            style={{
              fontFamily: 'Bangers, cursive',
              letterSpacing: '0.08em',
              fontSize: '1rem',
              padding: '0.5rem 1.4rem',
              border: '3px solid #E8E8E0',
              boxShadow: isActive ? '4px 4px 0 #E8E8E0' : '2px 2px 0 #555',
              background: isActive ? '#F5F5F0' : '#1A1A1A',
              color: isActive ? '#0A0A0A' : '#AAAAAA',
              cursor: 'pointer',
              transform: isActive ? 'translate(-1px,-2px)' : 'none',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.boxShadow = '4px 4px 0 #E8E8E0'
                e.currentTarget.style.color = '#F5F5F0'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.boxShadow = '2px 2px 0 #555'
                e.currentTarget.style.color = '#AAAAAA'
              }
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
