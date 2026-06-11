// types/database.ts — Plain types untuk Railway PostgreSQL

export type UserRole = 'member' | 'admin'
export type ProductCategory = 'plugin' | 'asset' | 'jasa'
export type OrderStatus = 'pending' | 'paid' | 'completed' | 'cancelled'

export interface UserRow {
  id: string
  clerk_id: string
  email: string
  name: string | null
  avatar: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface ProductRow {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  category: ProductCategory
  images: string[]
  download_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface OrderRow {
  id: string
  user_id: string
  product_id: string
  amount: number
  status: OrderStatus
  payment_method: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ReviewRow {
  id: string
  user_id: string
  product_id: string
  rating: number
  comment: string | null
  created_at: string
}

export interface JasaOrderRow {
  id: string
  service_type: string
  server_name: string
  needs: string
  discord_contact: string
  status: string
  created_at: string
}
