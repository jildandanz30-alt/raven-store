// lib/adminData.ts — menggunakan local JSON storage
import { dbSelect, dbInsert, dbUpdate, dbDelete } from '@/lib/db'
import type { Product } from '@/lib/products'
import type { AdminOrder } from '@/components/admin/AdminOrdersClient'

export interface AdminStats {
  totalRevenue: number; totalOrders: number
  totalUsers: number; activeProducts: number; pendingOrders: number
}

export async function getAdminStats(): Promise<AdminStats> {
  const orders = dbSelect<any>('orders')
  const users = dbSelect<any>('users')
  const products = dbSelect<any>('products')

  const totalOrders = orders.length
  const totalRevenue = orders
    .filter((o: any) => ['paid','completed'].includes(o.status))
    .reduce((sum: number, o: any) => sum + Number(o.amount ?? 0), 0)
  const pendingOrders = orders.filter((o: any) => o.status === 'pending').length
  const totalUsers = users.length
  const activeProducts = products.filter((p: any) => p.is_active).length

  return { totalRevenue, totalOrders, pendingOrders, totalUsers, activeProducts }
}

export interface WeeklyPoint { date: string; orders: number; revenue: number }

export async function getWeeklyOrderData(): Promise<WeeklyPoint[]> {
  const orders = dbSelect<any>('orders')
  const sevenDaysAgo = Date.now() - 7 * 86400000
  const recent = orders.filter((o: any) => new Date(o.created_at).getTime() >= sevenDaysAgo)

  const dayMap: Record<string, WeeklyPoint> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const key = d.toLocaleDateString('id-ID', { weekday: 'short', timeZone: 'Asia/Jakarta' })
    dayMap[key] = { date: key, orders: 0, revenue: 0 }
  }
  for (const row of recent) {
    const key = new Date(row.created_at).toLocaleDateString('id-ID', { weekday: 'short', timeZone: 'Asia/Jakarta' })
    if (dayMap[key]) {
      dayMap[key].orders += 1
      if (row.status === 'paid' || row.status === 'completed') dayMap[key].revenue += Number(row.amount ?? 0)
    }
  }
  return Object.values(dayMap)
}

export async function adminGetOrders(): Promise<AdminOrder[]> {
  const orders = dbSelect<any>('orders').sort((a: any, b: any) => b.created_at.localeCompare(a.created_at)).slice(0, 200)
  const products = dbSelect<any>('products')
  const users = dbSelect<any>('users')

  return orders.map((o: any) => {
    const p = products.find((p: any) => p.id === o.product_id)
    const u = users.find((u: any) => u.id === o.user_id)
    return {
      ...o,
      products: { name: p?.name ?? null, category: p?.category ?? null, download_url: p?.download_url ?? null },
      users: { email: u?.email ?? null, name: u?.name ?? null },
    }
  })
}

export async function adminGetProducts(): Promise<Product[]> {
  return dbSelect<Product>('products').sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function adminUpsertProduct(product: Partial<Product> & { id?: string }) {
  const now = new Date().toISOString()
  const imgs = product.images ?? []

  if (product.id) {
    const data = dbUpdate<any>('products', product.id, {
      name: product.name, slug: product.slug, description: product.description ?? null,
      price: product.price, category: product.category,
      images: imgs, download_url: product.download_url ?? null,
      is_active: product.is_active, updated_at: now,
    })
    return { data, error: null }
  }

  const data = dbInsert<any>('products', {
    name: product.name!, slug: product.slug!, description: product.description ?? null,
    price: product.price ?? 0, category: product.category!, images: imgs,
    download_url: product.download_url ?? null, is_active: product.is_active ?? true,
  })
  return { data, error: null }
}

export async function adminDeleteProduct(id: string) {
  try { dbDelete('products', id); return { error: null } }
  catch (e: any) { return { error: e.message } }
}

export async function adminUpdateOrderStatus(orderId: string, status: string) {
  try { dbUpdate<any>('orders', orderId, { status }); return { error: null } }
  catch (e: any) { return { error: e.message } }
}
