'use client'

import { useState } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import type { Product } from '@/lib/products'

interface BuyButtonProps {
  product: Product
  hasPurchased: boolean
  userId: string | null
}

export default function BuyButton({ product, hasPurchased, userId }: BuyButtonProps) {
  const [loading, setLoading] = useState(false)
  const { openSignIn } = useClerk()
  const router = useRouter()

  const handleDownload = () => {
    if (product.download_url) window.open(product.download_url, '_blank')
  }

  const handleBuy = async () => {
    if (!userId) {
      openSignIn({ afterSignInUrl: `/products/${product.slug}` })
      return
    }
    setLoading(true)
    try {
      router.push(`/checkout?product_id=${product.id}`)
    } finally {
      setLoading(false)
    }
  }

  const btnStyle: React.CSSProperties = {
    width: '100%', fontFamily:'Bangers,cursive', letterSpacing:'0.1em', fontSize:'1.3rem',
    padding: '0.8rem', border:'3px solid #E8E8E0', boxShadow:'5px 5px 0 #E8E8E0',
    background: '#F5F5F0', color:'#0A0A0A', cursor:'pointer', transition:'transform 0.1s,box-shadow 0.1s',
  }

  if (hasPurchased) {
    return (
      <button onClick={handleDownload} disabled={!product.download_url} style={{ ...btnStyle, opacity: product.download_url ? 1 : 0.5, cursor: product.download_url ? 'pointer' : 'not-allowed' }}
        onMouseEnter={e => { if (product.download_url) { e.currentTarget.style.transform='translate(-2px,-3px)'; e.currentTarget.style.boxShadow='7px 8px 0 #E8E8E0' } }}
        onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='5px 5px 0 #E8E8E0' }}>
        ⬇ Download Sekarang
      </button>
    )
  }

  return (
    <button onClick={handleBuy} disabled={loading}
      style={{ ...btnStyle, background: loading ? '#333' : '#F5F5F0', color: loading ? '#AAAAAA' : '#0A0A0A', cursor: loading ? 'wait' : 'pointer' }}
      onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform='translate(-2px,-3px)'; e.currentTarget.style.boxShadow='7px 8px 0 #E8E8E0' } }}
      onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='5px 5px 0 #E8E8E0' }}>
      {loading ? 'Memproses...' : !userId ? '🔑 Login untuk Beli' : '🛒 Beli Sekarang'}
    </button>
  )
}
