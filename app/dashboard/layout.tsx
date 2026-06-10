import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/DashboardSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth()
  if (!userId) redirect('/login')

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <DashboardSidebar />
      <main style={{ flex:1, marginLeft:260, minHeight:'100vh', background:'#0a0a0a', backgroundImage:'radial-gradient(circle,rgba(232,232,224,0.03) 1px,transparent 1px)', backgroundSize:'20px 20px' }}>
        <div style={{ padding:'40px 48px', maxWidth:1100 }}>
          {children}
        </div>
      </main>
    </div>
  )
}
