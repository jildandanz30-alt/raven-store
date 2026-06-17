'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

const PAYMENT_METHODS = [
  { id:'qris',  label:'QRIS',  emoji:'📱', desc:'Scan QR — semua e-wallet & bank' },
  { id:'gopay', label:'GoPay', emoji:'💚', desc:'Transfer ke nomor GoPay' },
  { id:'dana',  label:'Dana',  emoji:'💙', desc:'Transfer ke nomor Dana' },
]

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const productId = searchParams.get('product_id')

  const [product, setProduct]         = useState<any>(null)
  const [method, setMethod]           = useState<string>('qris')
  const [notes, setNotes]             = useState('')
  const [loading, setLoading]         = useState(false)
  const [step, setStep]               = useState<'select' | 'info' | 'done'>('select')
  const [paymentInfo, setPaymentInfo] = useState<any>(null)
  const [orderId, setOrderId]         = useState<string>('')
  const [error, setError]             = useState('')

  useEffect(() => {
    if (!productId) return
    fetch(`/api/products/${productId}`).then(r => r.json()).then(d => setProduct(d.product))
  }, [productId])

  useEffect(() => {
    if (isLoaded && !user) router.push(`/login?redirectTo=/checkout?product_id=${productId}`)
  }, [isLoaded, user])

  const handleOrder = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/payment/create', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ product_id: productId, payment_method: method, notes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPaymentInfo(data.payment_info)
      setOrderId(data.order_id)
      setStep('info')
    } catch (e: any) {
      setError(e.message ?? 'Gagal membuat order')
    } finally {
      setLoading(false)
    }
  }

  const s: Record<string, React.CSSProperties> = {
    root: { minHeight:'100vh', background:'#0D0D0D', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' },
    card: { width:'100%', maxWidth:520, border:'3px solid #E8E8E0', boxShadow:'8px 8px 0 #E8E8E0', background:'#1A1A1A' },
    header: { background:'#F5F5F0', padding:'0.6rem 1.5rem', borderBottom:'3px solid #E8E8E0', display:'flex', justifyContent:'space-between', alignItems:'center' },
    body: { padding:'1.5rem' },
    h1: { fontFamily:'Bangers,cursive', fontSize:'2rem', letterSpacing:'0.08em', color:'#F5F5F0', margin:'0 0 1.2rem' },
    methodBtn: { width:'100%', display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.85rem 1rem', border:'2px solid', cursor:'pointer', marginBottom:'0.5rem', background:'#111', transition:'transform 0.1s,box-shadow 0.1s' },
    note: { width:'100%', padding:'0.75rem', background:'#111', border:'2px solid #333', color:'#F5F5F0', fontFamily:'Comic Neue,cursive', fontSize:'0.9rem', resize:'vertical', minHeight:80, marginBottom:'1rem', boxSizing:'border-box' as const },
    btn: { width:'100%', fontFamily:'Bangers,cursive', fontSize:'1.2rem', letterSpacing:'0.08em', padding:'0.85rem', border:'3px solid #E8E8E0', boxShadow:'4px 4px 0 #E8E8E0', background:'#F5F5F0', color:'#0D0D0D', cursor:'pointer' },
    infoBox: { background:'#111', border:'3px solid #f0a500', boxShadow:'4px 4px 0 #f0a500', padding:'1.2rem', marginBottom:'1rem' },
  }

  if (!product) return (
    <div style={s.root}>
      <div style={{ fontFamily:'Bangers,cursive', fontSize:'2rem', color:'#555' }}>LOADING…</div>
    </div>
  )

  return (
    <div style={s.root}>
      <div style={s.card}>
        <div style={s.header}>
          <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'0.7rem', color:'#333', letterSpacing:'0.1em' }}>CHECKOUT</span>
          <span style={{ fontFamily:'Bangers,cursive', fontSize:'1.1rem', color:'#0D0D0D', letterSpacing:'0.1em' }}>RAVEN STORE</span>
        </div>
        <div style={s.body}>

          {step === 'select' && (
            <>
              <h1 style={s.h1}>PILIH PEMBAYARAN</h1>
              {/* Product summary */}
              <div style={{ display:'flex', gap:'0.75rem', padding:'0.75rem', border:'2px solid #333', marginBottom:'1.2rem', background:'#111' }}>
                {product.images?.[0] && <img src={product.images[0]} alt={product.name} style={{ width:56, height:56, objectFit:'cover', border:'2px solid #333' }} />}
                <div>
                  <div style={{ fontFamily:'Bangers,cursive', fontSize:'1.1rem', color:'#F5F5F0', letterSpacing:'0.05em' }}>{product.name}</div>
                  <div style={{ fontFamily:'Bangers,cursive', fontSize:'1.3rem', color:'#44dd88' }}>
                    Rp{(product.price ?? 0).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {/* Payment methods */}
              {PAYMENT_METHODS.map(pm => (
                <button key={pm.id} onClick={() => setMethod(pm.id)}
                  style={{ ...s.methodBtn, borderColor: method===pm.id ? '#E8E8E0' : '#333', boxShadow: method===pm.id ? '3px 3px 0 #E8E8E0' : 'none' }}>
                  <span style={{ fontSize:'1.5rem' }}>{pm.emoji}</span>
                  <div style={{ flex:1, textAlign:'left' }}>
                    <div style={{ fontFamily:'Bangers,cursive', fontSize:'1rem', letterSpacing:'0.06em', color:'#F5F5F0' }}>{pm.label}</div>
                    <div style={{ fontSize:'0.78rem', color:'#666' }}>{pm.desc}</div>
                  </div>
                  {method===pm.id && <span style={{ color:'#44dd88', fontFamily:'Bangers,cursive' }}>✓ DIPILIH</span>}
                </button>
              ))}

              <textarea placeholder="Catatan (opsional)…" value={notes} onChange={e => setNotes(e.target.value)} style={{ ...s.note, marginTop:'0.75rem' }} />
              {error && <div style={{ color:'#ff6666', fontSize:'0.85rem', marginBottom:'0.75rem', fontFamily:'Comic Neue,cursive' }}>{error}</div>}
              <button onClick={handleOrder} disabled={loading} style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'MEMPROSES…' : '🛒 BUAT ORDER'}
              </button>
            </>
          )}

          {step === 'info' && paymentInfo && (
            <>
              <h1 style={s.h1}>INFO PEMBAYARAN</h1>
              <div style={s.infoBox}>
                <div style={{ fontFamily:'Bangers,cursive', fontSize:'1.1rem', color:'#f0a500', marginBottom:'0.75rem' }}>
                  {method.toUpperCase()} — {paymentInfo.name}
                </div>
                {method === 'qris' ? (
                  paymentInfo.number?.startsWith('http') && (
                    <img src={paymentInfo.number} alt="QRIS" style={{ width:'100%', maxWidth:220, border:'3px solid #f0a500' }} />
                  )
                ) : (
                  <div>
                    <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'1.4rem', color:'#F5F5F0', letterSpacing:'0.1em', marginBottom:'0.25rem' }}>{paymentInfo.number}</div>
                    <div style={{ color:'#AAAAAA', fontSize:'0.85rem', fontFamily:'Comic Neue,cursive' }}>a/n {paymentInfo.holder}</div>
                  </div>
                )}
              </div>
              <div style={{ background:'#111', border:'2px solid #333', padding:'0.75rem', marginBottom:'1rem', fontFamily:'Comic Neue,cursive', fontSize:'0.85rem', color:'#AAAAAA' }}>
                Order ID: <span style={{ fontFamily:'JetBrains Mono,monospace', color:'#F5F5F0' }}>{orderId}</span><br/>
                Kirim bukti transfer ke admin Discord setelah bayar. Order akan dikonfirmasi manual.
              </div>
              <div style={{ display:'flex', gap:'0.5rem' }}>
                <button onClick={() => router.push('/dashboard/orders')} style={{ ...s.btn, flex:1 }}>📋 CEK ORDER</button>
                <button onClick={() => router.push('/')} style={{ ...s.btn, flex:1, background:'transparent', color:'#F5F5F0' }}>🏠 HOME</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
