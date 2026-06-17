// lib/products.ts — menggunakan local JSON storage
import { dbSelect, dbSelectOne } from '@/lib/db'

export interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  price: number
  category: 'plugin' | 'asset' | 'jasa' | string
  images: string[]
  download_url?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  user_id: string
  product_id: string
  rating: number
  comment: string | null
  created_at: string
  user_name?: string
  user_avatar?: string
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  return dbSelect<Product>('products', { is_active: true } as any)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, limit)
}

export async function getProducts(category?: string): Promise<Product[]> {
  const all = dbSelect<Product>('products', { is_active: true } as any)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
  if (category && category !== 'all') return all.filter(p => p.category === category)
  return all
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return dbSelectOne<Product>('products', { slug } as any)
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const reviews = dbSelect<Review>('reviews', { product_id: productId } as any)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
  // join dengan users
  const users = (await import('@/lib/db')).dbSelect<any>('users')
  return reviews.map(r => {
    const u = users.find((u: any) => u.id === r.user_id)
    return { ...r, user_name: u?.name ?? null, user_avatar: u?.avatar ?? null }
  })
}

export async function checkUserPurchased(userId: string, productId: string): Promise<boolean> {
  const { dbSelect: sel } = await import('@/lib/db')
  const orders = sel<any>('orders')
  return orders.some(o =>
    o.user_id === userId && o.product_id === productId && ['paid','completed'].includes(o.status)
  )
}

export function formatPrice(price: number): string {
  if (price === 0) return 'GRATIS'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
}

export function formatCategoryLabel(cat: string): string {
  const map: Record<string, string> = { plugin: 'Plugin', asset: 'Asset', jasa: 'Jasa' }
  return map[cat] || cat
}
