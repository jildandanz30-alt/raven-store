import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { adminGetOrders } from '@/lib/adminData'
import AdminOrdersClient from '@/components/admin/AdminOrdersClient'
import { ShoppingCart } from 'lucide-react'

export default async function AdminOrdersPage({
  params,
}: {
  params: { adminSecret: string }
}) {
  const authed = await isAdminAuthenticated()
  if (!authed) redirect(`/${params.adminSecret}/admin`)

  const orders = await adminGetOrders()

  return (
    <div className="space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft border border-accent/20 text-accent-light text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
          <ShoppingCart size={12} />
          MANAGE
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter">
          ORDERS
        </h1>
      </div>

      <AdminOrdersClient initialOrders={orders} />
    </div>
  )
}
