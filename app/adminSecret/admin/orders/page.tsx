import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { adminGetOrders } from '@/lib/adminData'
import AdminOrdersClient from '@/components/admin/AdminOrdersClient'

export default async function AdminOrdersPage({
  params,
}: {
  params: { adminSecret: string }
}) {
  const authed = await isAdminAuthenticated()
  if (!authed) redirect(`/${params.adminSecret}/admin`)

  const orders = await adminGetOrders()

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#555', letterSpacing: '0.15em', fontSize: '0.8rem', marginBottom: 4 }}>
          🛒 MANAGE
        </p>
        <h1
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '3rem',
            letterSpacing: '0.06em',
          }}
        >
          Orders
        </h1>
      </div>

      <AdminOrdersClient initialOrders={orders} />
    </div>
  )
}
