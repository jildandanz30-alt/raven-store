'use client'

import { useState } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import type { Product } from '@/lib/products'
import { ShoppingCart, Download, Lock } from 'lucide-react'

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
      router.push('/login')
      return
    }
    setLoading(true)
    try {
      router.push(`/checkout?product_id=${product.id}`)
    } finally {
      setLoading(false)
    }
  }

  if (hasPurchased) {
    return (
      <button 
        onClick={handleDownload} 
        disabled={!product.download_url} 
        className="w-full btn-elegant btn-accent py-5 text-xl disabled:opacity-50"
      >
        <Download className="mr-2" size={24} />
        Download Sekarang
      </button>
    )
  }

  return (
    <button 
      onClick={handleBuy} 
      disabled={loading}
      className="w-full btn-elegant btn-primary py-5 text-xl disabled:opacity-50"
    >
      {loading ? (
        <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
      ) : !userId ? (
        <>
          <Lock className="mr-2" size={20} />
          Login untuk Beli
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2" size={24} />
          Beli Sekarang
        </>
      )}
    </button>
  )
}
