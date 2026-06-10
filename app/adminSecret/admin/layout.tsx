import { isAdminAuthenticated } from '@/lib/adminAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { adminSecret: string }
}) {
  const authed = await isAdminAuthenticated()

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0A0A0A', color:'#F5F5F0', fontFamily:"'Comic Neue', cursive" }}>
      {authed && <AdminSidebar adminSecret={params.adminSecret} />}
      <main style={{ flex:1, padding:'2rem', overflow:'auto', minWidth:0 }}>
        {children}
      </main>
    </div>
  )
}
