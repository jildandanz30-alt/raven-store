'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'

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
    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          style={{ background:'none', border:'none', fontSize:28, color: s<=(hover||value)?'#f0a500':'#333', cursor:onChange?'pointer':'default', padding:'0 2px', lineHeight:1 }}
          onMouseEnter={() => onChange && setHover(s)} onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange?.(s)}>★</button>
      ))}
      {onChange && <span style={{ fontFamily:'Bangers,cursive', fontSize:16, color:'#888', marginLeft:8 }}>
        {['','Poor','Fair','Good','Great','EPIC!'][value] || 'Select'}
      </span>}
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

  const panel: React.CSSProperties = { border:'3px solid #2a2a2a', background:'#1A1A1A', padding:'1.2rem', marginBottom:'1rem' }

  if (!isLoaded || loading) return <div style={{ color:'#555', padding:'2rem', fontFamily:'Bangers,cursive', fontSize:'1.5rem' }}>LOADING…</div>

  return (
    <div style={{ color:'#F5F5F0', fontFamily:'Comic Neue,cursive' }}>
      <h1 style={{ fontFamily:'Bangers,cursive', fontSize:'2rem', letterSpacing:'0.1em', marginBottom:'1.5rem' }}>⭐ REVIEW SAYA</h1>

      {msg && <div style={{ padding:'0.75rem 1rem', marginBottom:'1rem', border:'2px solid #44dd88', color:'#44dd88', fontFamily:'Bangers,cursive' }}>{msg}</div>}

      {/* Can review */}
      {canReview.length > 0 && (
        <div style={{ ...panel, border:'3px solid #f0a500', boxShadow:'4px 4px 0 #f0a500', marginBottom:'2rem' }}>
          <div style={{ fontFamily:'Bangers,cursive', fontSize:'1.1rem', color:'#f0a500', marginBottom:'1rem', letterSpacing:'0.08em' }}>
            PRODUK YANG BISA KAMU REVIEW
          </div>
          {canReview.map(p => (
            <div key={p.product_id} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.6rem 0', borderBottom:'1px solid #222' }}>
              {p.product_image
                ? <img src={p.product_image} alt={p.product_name} style={{ width:40, height:40, objectFit:'cover', border:'2px solid #333' }} />
                : <div style={{ width:40, height:40, background:'#222', border:'2px solid #333', display:'flex', alignItems:'center', justifyContent:'center' }}>📦</div>
              }
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'Bangers,cursive', letterSpacing:'0.05em' }}>{p.product_name}</div>
                <div style={{ color:'#555', fontSize:'0.75rem' }}>{p.product_category}</div>
              </div>
              <button onClick={() => { setActiveProduct(p); setRating(0); setComment(''); setMsg('') }}
                style={{ fontFamily:'Bangers,cursive', padding:'5px 14px', border:'2px solid #f0a500', color:'#f0a500', background:'none', cursor:'pointer', letterSpacing:'0.06em' }}>
                TULIS REVIEW
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Review form */}
      {activeProduct && (
        <div style={{ ...panel, border:'3px solid #E8E8E0', boxShadow:'5px 5px 0 #E8E8E0', marginBottom:'2rem' }}>
          <div style={{ fontFamily:'Bangers,cursive', fontSize:'1.1rem', letterSpacing:'0.08em', marginBottom:'1rem' }}>
            REVIEW — {activeProduct.product_name.toUpperCase()}
          </div>
          <Stars value={rating} onChange={setRating} />
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Ceritain pengalaman kamu pakai produk ini…"
            style={{ width:'100%', marginTop:'0.8rem', padding:'0.75rem', background:'#111', border:'2px solid #333', color:'#F5F5F0', fontFamily:'Comic Neue,cursive', fontSize:'0.9rem', minHeight:100, resize:'vertical', boxSizing:'border-box' }} />
          <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.75rem' }}>
            <button onClick={handleSubmit} disabled={submitting||rating===0}
              style={{ fontFamily:'Bangers,cursive', padding:'8px 20px', background:'#F5F5F0', border:'3px solid #E8E8E0', boxShadow:'3px 3px 0 #E8E8E0', cursor:'pointer', letterSpacing:'0.08em', opacity:rating===0?0.5:1 }}>
              {submitting ? 'SUBMITTING…' : 'KIRIM REVIEW'}
            </button>
            <button onClick={() => setActiveProduct(null)}
              style={{ fontFamily:'Bangers,cursive', padding:'8px 20px', border:'2px solid #444', color:'#888', background:'none', cursor:'pointer', letterSpacing:'0.06em' }}>
              BATAL
            </button>
          </div>
        </div>
      )}

      {/* Existing reviews */}
      <div style={{ fontFamily:'Bangers,cursive', fontSize:'1.1rem', letterSpacing:'0.08em', marginBottom:'1rem' }}>
        REVIEW YANG SUDAH DIKIRIM ({reviews.length})
      </div>
      {reviews.length === 0 ? (
        <div style={{ ...panel, color:'#555', textAlign:'center', padding:'2rem' }}>Belum ada review.</div>
      ) : (
        reviews.map(r => (
          <div key={r.id} style={panel}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.5rem' }}>
              <div>
                <div style={{ fontFamily:'Bangers,cursive', letterSpacing:'0.05em' }}>{r.product_name ?? 'Produk'}</div>
                <div style={{ color:'#555', fontSize:'0.75rem' }}>{r.product_category}</div>
              </div>
              <span style={{ color:'#555', fontSize:'0.75rem' }}>{new Date(r.created_at).toLocaleDateString('id-ID')}</span>
            </div>
            <Stars value={r.rating} />
            {r.comment && <p style={{ marginTop:'0.5rem', color:'#AAAAAA', fontSize:'0.9rem' }}>{r.comment}</p>}
          </div>
        ))
      )}
    </div>
  )
}
