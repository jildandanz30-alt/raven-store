import sql from '@/lib/db'
import type { Product } from '@/lib/products'
import type { AdminOrder } from '@/components/admin/AdminOrdersClient'

export interface AdminStats {
  totalRevenue: number; totalOrders: number
  totalUsers: number; activeProducts: number; pendingOrders: number
}

export async function getAdminStats(): Promise<AdminStats> {
  const [s] = await sql`
    SELECT
      COUNT(*)::int AS total_orders,
      COALESCE(SUM(CASE WHEN status IN ('paid','completed') THEN amount END), 0)::int AS total_revenue,
      COUNT(CASE WHEN status = 'pending' THEN 1 END)::int AS pending_orders
    FROM orders
  `
  const [u] = await sql`SELECT COUNT(*)::int AS count FROM users`
  const [p] = await sql`SELECT COUNT(*)::int AS count FROM products WHERE is_active = true`
  return {
    totalRevenue: s.total_revenue, totalOrders: s.total_orders,
    pendingOrders: s.pending_orders, totalUsers: u.count, activeProducts: p.count,
  }
}

export interface WeeklyPoint { date: string; orders: number; revenue: number }

export async function getWeeklyOrderData(): Promise<WeeklyPoint[]> {
  const rows = await sql`
    SELECT created_at, amount, status FROM orders
    WHERE created_at >= NOW() - INTERVAL '7 days' ORDER BY created_at ASC
  `
  const dayMap: Record<string, WeeklyPoint> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const key = d.toLocaleDateString('id-ID', { weekday:'short', timeZone:'Asia/Jakarta' })
    dayMap[key] = { date: key, orders: 0, revenue: 0 }
  }
  for (const row of rows) {
    const key = new Date(row.created_at).toLocaleDateString('id-ID', { weekday:'short', timeZone:'Asia/Jakarta' })
    if (dayMap[key]) {
      dayMap[key].orders += 1
      if (row.status === 'paid' || row.status === 'completed') dayMap[key].revenue += Number(row.amount ?? 0)
    }
  }
  return Object.values(dayMap)
}

export async function adminGetOrders(): Promise<AdminOrder[]> {
  const rows = await sql<AdminOrder[]>`
    SELECT o.*,
      json_build_object('name', p.name, 'category', p.category, 'download_url', p.download_url) AS products,
      json_build_object('email', u.email, 'name', u.name) AS users
    FROM orders o
    LEFT JOIN products p ON p.id = o.product_id
    LEFT JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC LIMIT 200
  `
  return rows
}

export async function adminGetProducts(): Promise<Product[]> {
  return sql<Product[]>`SELECT * FROM products ORDER BY created_at DESC`
}

export async function adminUpsertProduct(product: Partial<Product> & { id?: string }) {
  const now = new Date().toISOString()
  const imgs = JSON.stringify(product.images ?? [])
  if (product.id) {
    const [data] = await sql<Product[]>`
      UPDATE products SET
        name=${product.name??sql`name`}, slug=${product.slug??sql`slug`},
        description=${product.description??null}, price=${product.price??sql`price`},
        category=${product.category??sql`category`}, images=${imgs}::jsonb,
        download_url=${product.download_url??null}, is_active=${product.is_active??sql`is_active`},
        updated_at=${now}
      WHERE id=${product.id} RETURNING *
    `
    return { data, error: null }
  }
  const [data] = await sql<Product[]>`
    INSERT INTO products (name,slug,description,price,category,images,download_url,is_active,created_at,updated_at)
    VALUES (${product.name!},${product.slug!},${product.description??null},${product.price??0},
            ${product.category!},${imgs}::jsonb,${product.download_url??null},${product.is_active??true},${now},${now})
    RETURNING *
  `
  return { data, error: null }
}

export async function adminDeleteProduct(id: string) {
  try { await sql`DELETE FROM products WHERE id=${id}`; return { error: null } }
  catch (e: any) { return { error: e.message } }
}

export async function adminUpdateOrderStatus(orderId: string, status: string) {
  try { await sql`UPDATE orders SET status=${status}, updated_at=NOW() WHERE id=${orderId}`; return { error: null } }
  catch (e: any) { return { error: e.message } }
}
