import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { adminGetProducts } from '@/lib/adminData'
import AdminProductsClient from '@/components/admin/AdminProductsClient'

export default async function AdminProductsPage({
  params,
}: {
  params: { adminSecret: string }
}) {
  const authed = await isAdminAuthenticated()
  if (!authed) redirect(`/${params.adminSecret}/admin`)

  const products = await adminGetProducts()

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#555', letterSpacing: '0.15em', fontSize: '0.8rem', marginBottom: 4 }}>
          📦 MANAGE
        </p>
        <h1
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '3rem',
            letterSpacing: '0.06em',
          }}
        >
          Produk
        </h1>
      </div>

      <AdminProductsClient initialProducts={products} />
    </div>
  )
}
