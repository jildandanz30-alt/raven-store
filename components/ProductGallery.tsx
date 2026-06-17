'use client'
import { useState } from 'react'

interface ProductGalleryProps {
  images: string[]
  name?: string
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0)

  if (!images.length) return null

  return (
    <div style={{ marginBottom:'1.5rem' }}>
      {/* Main image */}
      <div style={{ position:'relative', width:'100%', aspectRatio:'16/9', background:'#111', border:'3px solid #E8E8E0', boxShadow:'5px 5px 0 #E8E8E0', overflow:'hidden', marginBottom:'0.75rem' }}>
        <img src={images[active]} alt={name ?? 'Product'} style={{ width:'100%', height:'100%', objectFit:'cover' }} />

        {images.length > 1 && (
          <>
            <button onClick={() => setActive(p => (p - 1 + images.length) % images.length)}
              style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.7)', border:'2px solid #E8E8E0', color:'#F5F5F0', width:36, height:36, cursor:'pointer', fontFamily:'Bangers,cursive', fontSize:'1.2rem' }}>
              ‹
            </button>
            <button onClick={() => setActive(p => (p + 1) % images.length)}
              style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.7)', border:'2px solid #E8E8E0', color:'#F5F5F0', width:36, height:36, cursor:'pointer', fontFamily:'Bangers,cursive', fontSize:'1.2rem' }}>
              ›
            </button>
            <span style={{ position:'absolute', bottom:8, right:8, background:'rgba(0,0,0,0.7)', color:'#AAAAAA', fontSize:'0.75rem', padding:'2px 8px', fontFamily:'JetBrains Mono,monospace' }}>
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
          {images.map((src, i) => (
            <button key={i} onClick={() => setActive(i)}
              style={{ width:64, height:48, padding:0, border: i===active ? '3px solid #F5F5F0' : '2px solid #333', cursor:'pointer', overflow:'hidden', boxShadow: i===active ? '2px 2px 0 #E8E8E0' : 'none', background:'#111' }}>
              <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
