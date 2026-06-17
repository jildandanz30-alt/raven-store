import Link from 'next/link'
import type { Product } from '@/types'
import { formatPrice, formatCategoryLabel } from '@/lib/products'
import { cn } from '@/lib/utils'

interface ComicCardProps {
  product: Product
  priority?: boolean
}

export default function ComicCard({ product }: ComicCardProps) {
  const categoryStyles: Record<string, string> = {
    plugin: 'badge-plugin',
    asset:  'badge-asset',
    jasa:   'badge-jasa',
  }
  
  const badgeClass = categoryStyles[product.category] ?? categoryStyles.plugin

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <article className="glass-card overflow-hidden flex flex-col h-full">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-zinc-900 overflow-hidden border-b border-white/5">
          {product.images?.[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-950">
              <span className="text-white/5 font-black text-6xl select-none">RAVEN</span>
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className={cn("badge", badgeClass)}>
              {formatCategoryLabel(product.category)}
            </span>
          </div>

          {/* Free badge */}
          {product.price === 0 && (
            <div className="absolute top-4 right-4">
              <span className="badge bg-green-500 text-black border-none">
                FREE
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-light transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Harga</span>
              <span className="text-lg font-bold text-white">
                {formatPrice(product.price)}
              </span>
            </div>
            <div className="btn-elegant btn-outline p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
