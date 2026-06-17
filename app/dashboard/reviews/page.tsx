'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Star, MessageSquare, CheckCircle2, AlertCircle, Send, X, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Review {
  id: string; product_id: string; rating: number; comment: string; created_at: string
  product_name?: string; product_category?: string; product_image?: string
}
interface PurchasedProduct {
  product_id: string; product_name: string; product_category: string; product_image: string | null
}

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1.5">
      {[1,2,3,4,5].map(s => (
        <button 
          key={s} 
          type="button"
          className={cn(
            "transition-all duration-200 p-0.5",
            s <= (hover || value) ? "text-amber-400 scale-110" : "text-zinc-800",
            onChange ? "cursor-pointer" : "cursor-default"
          )}
          onMouseEnter={() => onChange && setHover(s)} 
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange?.(s)}
        >
          <Star size={onChange ? 28 : 16} fill={s <= (hover || value) ? "currentColor" : "none"} />
        </button>
      ))}
      {onChange && (
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-3">
          {['','Buruk','Cukup','Bagus','Keren','LUAR BIASA!'][value] || 'Pilih Rating'}
        </span>
      )}
    </div>
  )
}

export default function ReviewsPage() {
  const { user, isLoaded } = useUser()
  const [reviews, setReviews] = useState<Review[]>([])
  const [products, setProducts] = useState<PurchasedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [activeProduct, setActiveProduct] = useState<PurchasedProduct | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!isLoaded || !user) return
    Promise.all([
      fetch('/api/reviews').then(r => r.json()),
      fetch('/api/reviews/reviewable').then(r => r.json()),
    ]).then(([rv, pr]) => {
      setReviews(rv.reviews ?? [])
      setProducts(pr.products ?? [])
      setLoading(false)
    })
  }, [isLoaded, user])

  const reviewedIds = new Set(reviews.map(r => r.product_id))
  const canReview = products.filter(p => !reviewedIds.has(p.product_id))

  async function handleSubmit() {
    if (!activeProduct || rating === 0) return
    setSubmitting(true)
    const res = await fetch('/api/reviews', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ product_id: activeProduct.product_id, rating, comment }),
    })
    const data = await res.json()
    if (res.ok) {
      setMsg('Review berhasil dikirim!')
      setReviews(prev => [{ ...data.review, product_name:activeProduct.product_name, product_category:activeProduct.product_category }, ...prev])
      setActiveProduct(null); setRating(0); setComment('')
    } else {
      setMsg(data.error ?? 'Gagal submit review.')
    }
    setSubmitting(false)
  }

  if (!isLoaded || loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft border border-accent/20 text-accent-light text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
          <Star size={12} />
          TESTIMONIALS
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter">
          REVIEW <span className="text-zinc-500">SAYA</span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium mt-2">Bagikan pengalaman Anda menggunakan produk kami.</p>
      </div>

      {msg && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl animate-fade-in">
          <CheckCircle2 className="text-green-500" size={18} />
          <p className="text-green-500 text-sm font-bold">{msg}</p>
        </div>
      )}

      {/* Can review */}
      {canReview.length > 0 && (
        <div className="glass-card p-8 bg-zinc-900/40 border-accent/20 shadow-[0_0_50px_-20px_rgba(144,238,144,0.15)]">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <MessageSquare className="text-accent-light" size={20} />
            Siap untuk di-Review
          </h2>
          <div className="space-y-4">
            {canReview.map(p => (
              <div key={p.product_id} className="flex items-center gap-5 p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/5 flex-shrink-0">
                  {p.product_image ? (
                    <img src={p.product_image} alt={p.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">
                      <Package size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white mb-0.5 truncate">{p.product_name}</h4>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{p.product_category}</p>
                </div>
                <button 
                  onClick={() => { setActiveProduct(p); setRating(0); setComment(''); setMsg('') }}
                  className="btn-elegant btn-primary py-2.5 px-6 text-[10px]"
                >
                  TULIS REVIEW
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review form */}
      {activeProduct && (
        <div className="glass-card p-8 bg-zinc-900/40 border-white/10 animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">Review — {activeProduct.product_name}</h2>
            <button onClick={() => setActiveProduct(null)} className="p-2 text-zinc-600 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Rating Produk</label>
              <Stars value={rating} onChange={setRating} />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Pengalaman Anda</label>
              <textarea 
                value={comment} 
                onChange={e => setComment(e.target.value)}
                placeholder="Ceritain pengalaman kamu pakai produk ini…"
                className="w-full bg-black/40 border border-white/10 text-white rounded-2xl py-4 px-5 outline-none focus:border-accent transition-all resize-none h-32 text-sm"
              />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleSubmit} 
                disabled={submitting || rating === 0}
                className="flex-1 btn-elegant btn-primary py-4 text-sm group"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    Kirim Review <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveProduct(null)}
                className="btn-elegant btn-outline py-4 px-8 text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing reviews */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          Review yang Sudah Dikirim
          <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-bold text-zinc-600 border border-white/5">
            {reviews.length}
          </span>
        </h2>
        
        {reviews.length === 0 ? (
          <div className="glass-card p-20 text-center border-dashed border-2 border-white/5">
            <p className="text-zinc-600 font-medium">Anda belum pernah mengirim review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map(r => (
              <div key={r.id} className="glass-card p-6 bg-zinc-900/40 border-white/5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white mb-0.5">{r.product_name ?? 'Produk'}</h4>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{r.product_category}</p>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                    {new Date(r.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <Stars value={r.rating} />
                {r.comment && (
                  <p className="text-sm text-zinc-400 leading-relaxed italic bg-black/20 p-4 rounded-xl border border-white/5">
                    "{r.comment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
