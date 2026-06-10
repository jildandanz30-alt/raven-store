export type ProductCategory = 'plugin' | 'asset' | 'jasa'

export interface Product {
  id: string
  slug: string
  name: string
  description: string | null
  price: number
  category: ProductCategory
  images: string[]
  download_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  user_name?: string
  user_avatar?: string
  rating: number
  comment: string | null
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  product_id: string
  status: 'pending' | 'paid' | 'completed' | 'cancelled'
  amount: number
  payment_method: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface JasaOrder {
  id: string
  service_type: string
  server_name: string
  needs: string
  discord_contact: string
  status: string
  created_at: string
}

export interface UserProfile {
  id: string
  clerk_id: string
  email: string
  name: string | null
  avatar: string | null
  role: 'member' | 'admin'
  created_at: string
  updated_at: string
}
