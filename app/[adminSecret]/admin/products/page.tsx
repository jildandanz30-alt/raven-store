import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { adminGetProducts } from '@/lib/adminData'
import AdminProductsClient from '@/components/admin/AdminProductsClient'
import { Package } from 'lucide-react'

export default async function AdminProductsPage({
  params,
}: {
  params: { adminSecret: string }
}) {
  const authed = await isAdminAuthenticated()
  if (!authed) redirect(`/${params.adminSecret}/admin`)

  const products = await adminGetProducts()

  return (
    <div className="space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft border border-accent/20 text-accent-light text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
          <Package size={12} />
          MANAGE
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter">
          PRODUCTS
        </h1>
      </div>

      <AdminProductsClient initialProducts={products} />
    </div>
  )
}
