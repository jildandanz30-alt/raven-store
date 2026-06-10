'use client'

import { useState } from 'react'
import type { Review } from '@/lib/products'

interface ReviewSectionProps {
  productId: string
  reviews: Review[]
  hasPurchased: boolean
  userId?: string
}

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          style={{ background:'none', border:'none', fontSize:28, color:s<=(hover||value)?'#f0a500':'#333', cursor:onChange?'pointer':'default', padding:'0 2px', lineHeight:1 }}
          onMouseEnter={() => onChange && setHover(s)} onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange?.(s)}>★</button>
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
    <div>
      <h2 style={{ fontFamily:'Bangers,cursive', fontSize:'1.8rem', letterSpacing:'0.06em', marginBottom:'1.5rem', paddingBottom:'0.8rem', borderBottom:'3px solid #E8E8E0' }}>
        ⭐ REVIEW ({reviews.length})
        {reviews.length > 0 && <span style={{ fontFamily:'Comic Neue,cursive', fontSize:'1rem', color:'#f0a500', marginLeft:'1rem' }}>{avg.toFixed(1)} / 5</span>}
      </h2>

      {/* Write review */}
      {hasPurchased && !alreadyReviewed && !submitted && (
        <div style={{ background:'#1A1A1A', border:'3px solid #E8E8E0', boxShadow:'5px 5px 0 #E8E8E0', padding:'1.5rem', marginBottom:'2rem' }}>
          <div style={{ fontFamily:'Bangers,cursive', fontSize:'1.1rem', letterSpacing:'0.08em', marginBottom:'1rem' }}>TULIS REVIEW KAMU</div>
          <Stars value={rating} onChange={setRating} />
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Ceritain pengalaman kamu…"
            style={{ width:'100%', marginTop:'0.8rem', padding:'0.75rem', background:'#111', border:'2px solid #333', color:'#F5F5F0', fontFamily:'Comic Neue,cursive', fontSize:'0.9rem', minHeight:100, resize:'vertical', boxSizing:'border-box' }} />
          <button onClick={handleSubmit} disabled={submitting || !comment.trim()}
            style={{ marginTop:'0.75rem', fontFamily:'Bangers,cursive', padding:'8px 20px', background:'#F5F5F0', border:'3px solid #E8E8E0', boxShadow:'3px 3px 0 #E8E8E0', cursor:'pointer', letterSpacing:'0.08em', opacity:!comment.trim()?0.5:1 }}>
            {submitting ? 'MENGIRIM…' : 'KIRIM REVIEW'}
          </button>
        </div>
      )}

      {submitted && (
        <div style={{ padding:'0.75rem 1rem', marginBottom:'1rem', border:'2px solid #44dd88', color:'#44dd88', fontFamily:'Bangers,cursive' }}>
          ✅ Review berhasil dikirim! Terima kasih.
        </div>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <div style={{ textAlign:'center', padding:'2rem', color:'#555', fontFamily:'Comic Neue,cursive' }}>Belum ada review. Jadilah yang pertama!</div>
      ) : (
        reviews.map(r => (
          <div key={r.id} style={{ background:'#1A1A1A', border:'2px solid #2a2a2a', padding:'1rem', marginBottom:'0.75rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                {r.user_avatar && <img src={r.user_avatar} alt="" style={{ width:32, height:32, borderRadius:'50%', border:'2px solid #333' }} />}
                <span style={{ fontFamily:'Bangers,cursive', letterSpacing:'0.05em' }}>{r.user_name ?? 'User'}</span>
              </div>
              <span style={{ color:'#555', fontSize:'0.8rem' }}>{new Date(r.created_at).toLocaleDateString('id-ID')}</span>
            </div>
            <Stars value={r.rating} />
            {r.comment && <p style={{ marginTop:'0.5rem', color:'#AAAAAA', fontSize:'0.9rem', fontFamily:'Comic Neue,cursive' }}>{r.comment}</p>}
          </div>
        ))
      )}
    </div>
  )
}
