import Link from 'next/link'
import type { Product } from '@/types'
import { formatPrice, formatCategoryLabel } from '@/lib/products'

interface ComicCardProps {
  product: Product
  priority?: boolean
}

export default function ComicCard({ product }: ComicCardProps) {
  const categoryColor: Record<string, { bg: string; color: string }> = {
    plugin: { bg: '#1a1a1a', color: '#F5F5F0' },
    asset:  { bg: '#F5F5F0', color: '#0A0A0A' },
    jasa:   { bg: '#444',    color: '#F5F5F0' },
  }
  const catStyle = categoryColor[product.category] ?? categoryColor.plugin

  return (
    <Link href={`/products/${product.slug}`} style={{ textDecoration:'none', display:'block' }}>
      <article className="comic-panel" style={{ background:'#1A1A1A', overflow:'hidden', cursor:'pointer', height:'100%', display:'flex', flexDirection:'column' }}>

        {/* Thumbnail */}
        <div style={{ width:'100%', aspectRatio:'16/9', background:'#111', overflow:'hidden', borderBottom:'3px solid #E8E8E0', position:'relative' }}>
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          ) : (
            <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'#111', backgroundImage:'radial-gradient(circle,#2a2a2a 1px,transparent 1px)', backgroundSize:'12px 12px' }}>
              <span style={{ fontFamily:'Bangers,cursive', fontSize:'3rem', opacity:0.2 }}>MC</span>
            </div>
          )}

          {/* Category badge */}
          <span style={{ position:'absolute', top:8, left:8, fontFamily:'Bangers,cursive', letterSpacing:'0.1em', fontSize:'0.75rem', padding:'2px 10px', border:'2px solid #E8E8E0', boxShadow:'2px 2px 0 #E8E8E0', ...catStyle }}>
            {formatCategoryLabel(product.category)}
          </span>

          {/* Free badge */}
          {product.price === 0 && (
            <span style={{ position:'absolute', top:8, right:8, fontFamily:'Bangers,cursive', letterSpacing:'0.1em', fontSize:'0.75rem', padding:'2px 10px', border:'2px solid #44ff88', boxShadow:'2px 2px 0 #44ff88', background:'#44ff88', color:'#0A0A0A' }}>
              FREE
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding:'1rem', flex:1, display:'flex', flexDirection:'column', gap:6 }}>
          <h3 style={{ fontFamily:'Bangers,cursive', fontSize:'1.25rem', letterSpacing:'0.05em', color:'#F5F5F0', lineHeight:1.2 }}>
            {product.name}
          </h3>

          <p style={{ color:'#AAAAAA', fontSize:'0.88rem', lineHeight:1.5, flex:1, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {product.description}
          </p>

          {/* Price */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:8, borderTop:'2px solid #333', marginTop:4 }}>
            <span style={{ fontFamily:'Bangers,cursive', fontSize:'1.1rem', letterSpacing:'0.05em', color:'#F5F5F0' }}>
              {formatPrice(product.price)}
            </span>
            <span style={{ color:'#555', fontSize:'0.78rem', fontFamily:'JetBrains Mono,monospace' }}>
              {product.category.toUpperCase()}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
