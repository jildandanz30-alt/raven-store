'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  name?: string
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0)

  if (!images.length) return null

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-video bg-zinc-950 rounded-2xl overflow-hidden group">
        <img 
          src={images[active]} 
          alt={name ?? 'Product'} 
          className="w-full h-full object-cover transition-all duration-700"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {images.length > 1 && (
          <>
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button 
                onClick={() => setActive(p => (p - 1 + images.length) % images.length)}
                className="w-10 h-10 bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-90"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setActive(p => (p + 1) % images.length)}
                className="w-10 h-10 bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-90"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
              {active + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((src, i) => (
            <button 
              key={i} 
              onClick={() => setActive(i)}
              className={cn(
                "relative w-24 aspect-video rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 border-2",
                i === active 
                  ? "border-accent-light shadow-[0_0_15px_-5px_rgba(144,238,144,0.5)] scale-105" 
                  : "border-white/5 opacity-50 hover:opacity-100"
              )}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
