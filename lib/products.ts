// lib/products.ts
import sql from '@/lib/db'

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  category: string
  images: string[]
  download_url: string | null
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
  return sql<Product[]>`
    SELECT * FROM products WHERE is_active = true
    ORDER BY created_at DESC LIMIT ${limit}
  `
}

export async function getProducts(category?: string): Promise<Product[]> {
  if (category && category !== 'all') {
    return sql<Product[]>`
      SELECT * FROM products WHERE is_active = true AND category = ${category}
      ORDER BY created_at DESC
    `
  }
  return sql<Product[]>`SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC`
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const [p] = await sql<Product[]>`SELECT * FROM products WHERE slug = ${slug} LIMIT 1`
  return p ?? null
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  return sql<Review[]>`
    SELECT r.*, u.name as user_name, u.avatar as user_avatar
    FROM reviews r LEFT JOIN users u ON u.id = r.user_id
    WHERE r.product_id = ${productId} ORDER BY r.created_at DESC
  `
}

export async function checkUserPurchased(userId: string, productId: string): Promise<boolean> {
  const [row] = await sql`
    SELECT 1 FROM orders
    WHERE user_id = ${userId} AND product_id = ${productId} AND status IN ('paid','completed')
    LIMIT 1
  `
  return !!row
}

export function formatPrice(price: number): string {
  if (price === 0) return 'GRATIS'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
}

export function formatCategoryLabel(cat: string): string {
  const map: Record<string, string> = { plugin: 'Plugin', asset: 'Asset', jasa: 'Jasa' }
  return map[cat] || cat
}
