import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/DashboardSidebar'
import Navbar from '@/components/layout/Navbar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth()
  if (!userId) redirect('/login')

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-20">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="p-10 max-w-6xl mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
