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
    <div className="flex min-h-screen bg-black text-white font-sans">
      {authed && <AdminSidebar adminSecret={params.adminSecret} />}
      <main className="flex-1 p-8 overflow-auto relative">
        {/* Background glow for admin panel */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}
