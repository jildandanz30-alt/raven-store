'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { ShoppingBag, CreditCard, CheckCircle2, AlertCircle, ChevronLeft, QrCode, Wallet, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const PAYMENT_METHODS = [
  { id:'qris',  label:'QRIS',  icon: <QrCode size={24} />, desc:'Scan QR — e-wallet & mobile banking' },
  { id:'gopay', label:'GoPay', icon: <Wallet size={24} className="text-green-500" />, desc:'Transfer ke nomor GoPay' },
  { id:'dana',  label:'Dana',  icon: <Wallet size={24} className="text-blue-500" />, desc:'Transfer ke nomor Dana' },
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

  if (!product) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
        <div className="mb-8">
          <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-6">
            <ChevronLeft size={16} />
            Kembali ke Produk
          </Link>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            {step === 'select' ? 'CHECKOUT' : 'PEMBAYARAN'}
          </h1>
        </div>

        <div className="glass-card bg-zinc-900/40 border-white/5 overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1 w-full bg-white/5 flex">
            <div className={cn("h-full bg-accent transition-all duration-500", step === 'select' ? 'w-1/2' : 'w-full')} />
          </div>

          <div className="p-8">
            {step === 'select' && (
              <div className="space-y-8">
                {/* Product Summary */}
                <div className="flex items-center gap-5 p-4 bg-black/40 rounded-2xl border border-white/5">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">
                        <ShoppingBag size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">{product.name}</h3>
                    <div className="text-xl font-black text-accent-light tracking-tight">
                      Rp{(product.price ?? 0).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Metode Pembayaran</label>
                  {PAYMENT_METHODS.map(pm => (
                    <button 
                      key={pm.id} 
                      onClick={() => setMethod(pm.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                        method === pm.id 
                          ? "bg-white border-white shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)]" 
                          : "bg-black/40 border-white/5 hover:border-white/10"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-xl border transition-colors",
                        method === pm.id ? "bg-black/5 border-black/10 text-black" : "bg-white/5 border-white/5 text-zinc-400"
                      )}>
                        {pm.icon}
                      </div>
                      <div className="flex-1">
                        <div className={cn("font-bold text-sm", method === pm.id ? "text-black" : "text-white")}>{pm.label}</div>
                        <div className={cn("text-[10px] font-medium uppercase tracking-wider", method === pm.id ? "text-black/60" : "text-zinc-600")}>{pm.desc}</div>
                      </div>
                      {method === pm.id && <CheckCircle2 size={20} className="text-black" />}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Catatan Tambahan</label>
                  <textarea 
                    placeholder="Contoh: Username discord, request khusus, dll." 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                    className="w-full bg-black/40 border border-white/10 text-white rounded-2xl py-4 px-5 outline-none focus:border-accent transition-all resize-none h-24 text-sm"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
                    <p className="text-red-500 text-sm font-bold">{error}</p>
                  </div>
                )}

                <button 
                  onClick={handleOrder} 
                  disabled={loading} 
                  className="w-full btn-elegant btn-primary py-5 text-lg group"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      Lanjutkan Pembayaran <Send size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  )}
                </button>
              </div>
            )}

            {step === 'info' && paymentInfo && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-soft border border-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 text-accent-light">
                    <CreditCard size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Instruksi Pembayaran</h3>
                  <p className="text-zinc-500 text-sm">Silakan lakukan transfer sesuai detail di bawah ini.</p>
                </div>

                <div className="p-8 bg-black/40 rounded-3xl border border-white/5 text-center space-y-6">
                  <div className="text-[10px] font-bold text-accent-light uppercase tracking-[0.2em]">
                    {method.toUpperCase()} — {paymentInfo.name}
                  </div>
                  
                  {method === 'qris' ? (
                    paymentInfo.number?.startsWith('http') && (
                      <div className="p-4 bg-white rounded-2xl inline-block border-4 border-accent/20">
                        <img src={paymentInfo.number} alt="QRIS" className="w-full max-w-[200px] aspect-square" />
                      </div>
                    )
                  ) : (
                    <div className="space-y-2">
                      <div className="text-3xl font-black text-white tracking-widest">{paymentInfo.number}</div>
                      <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">a/n {paymentInfo.holder}</div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-white/5">
                    <div className="text-xs text-zinc-600 mb-1">Total yang harus dibayar</div>
                    <div className="text-2xl font-black text-white">Rp{(product.price ?? 0).toLocaleString('id-ID')}</div>
                  </div>
                </div>

                <div className="p-6 bg-accent-soft/30 border border-accent/10 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="text-accent-light mt-0.5" size={18} />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white uppercase tracking-widest">PENTING</p>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Order ID: <span className="font-mono text-white">{orderId}</span>. 
                        Kirim bukti transfer ke admin via Discord atau WhatsApp untuk konfirmasi instan.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => router.push('/dashboard/orders')} className="btn-elegant btn-primary py-4 text-sm">
                    Cek Status Order
                  </button>
                  <button onClick={() => router.push('/')} className="btn-elegant btn-outline py-4 text-sm">
                    Ke Beranda
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
