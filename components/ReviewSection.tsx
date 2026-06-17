'use client'

import { useState } from 'react'
import type { Review } from '@/lib/products'
import { Star, MessageSquare, Send, CheckCircle2, User as UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReviewSectionProps {
  productId: string
  reviews: Review[]
  hasPurchased: boolean
  userId?: string
}

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(s => (
        <button 
          key={s} 
          type="button"
          className={cn(
            "transition-all duration-200",
            s <= (hover || value) ? "text-amber-400 scale-110" : "text-zinc-800",
            onChange ? "cursor-pointer p-0.5" : "cursor-default"
          )}
          onMouseEnter={() => onChange && setHover(s)} 
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange?.(s)}
        >
          <Star size={onChange ? 24 : 14} fill={s <= (hover || value) ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  )
}

export default function ReviewSection({ productId, reviews: initialReviews, hasPurchased, userId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const alreadyReviewed = reviews.some(r => r.user_id === userId)

  const handleSubmit = async () => {
    if (!userId || !comment.trim()) return
    setSubmitting(true)
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, rating, comment: comment.trim() }),
    })
    const data = await res.json()
    if (res.ok && data.review) {
      setReviews(prev => [data.review, ...prev])
      setComment('')
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
          REVIEWS
          <span className="px-2 py-0.5 rounded-md bg-white/5 text-xs font-bold text-zinc-500 border border-white/5">
            {reviews.length}
          </span>
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 font-black text-sm">
            <Star size={14} fill="currentColor" />
            {avg.toFixed(1)}
          </div>
        )}
      </div>

      {/* Write review */}
      {hasPurchased && !alreadyReviewed && !submitted && (
        <div className="glass-card p-8 bg-zinc-900/40 border-white/10">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <MessageSquare size={16} className="text-accent-light" />
            Tulis Review Anda
          </h3>
          <div className="space-y-6">
            <Stars value={rating} onChange={setRating} />
            <textarea 
              value={comment} 
              onChange={e => setComment(e.target.value)} 
              placeholder="Ceritain pengalaman kamu pakai produk ini…"
              className="w-full bg-black/40 border border-white/10 text-white rounded-2xl py-4 px-5 outline-none focus:border-accent transition-all resize-none h-32 text-sm"
            />
            <button 
              onClick={handleSubmit} 
              disabled={submitting || !comment.trim()}
              className="btn-elegant btn-primary py-4 px-8 text-xs group"
            >
              {submitting ? (
                <div className="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Kirim Review <Send size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl animate-fade-in">
          <CheckCircle2 className="text-green-500" size={18} />
          <p className="text-green-500 text-sm font-bold">Review berhasil dikirim! Terima kasih.</p>
        </div>
      )}

      {/* Review list */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="p-16 text-center glass-card bg-zinc-900/20 border-dashed border-2 border-white/5">
            <p className="text-zinc-600 font-medium">Belum ada review. Jadilah yang pertama!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map(r => (
              <div key={r.id} className="glass-card p-6 bg-zinc-900/40 border-white/5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/5 bg-zinc-800 flex items-center justify-center text-zinc-600">
                      {r.user_avatar ? (
                        <img src={r.user_avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={20} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{r.user_name ?? 'Anonymous User'}</h4>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                        {new Date(r.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <Stars value={r.rating} />
                </div>
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
