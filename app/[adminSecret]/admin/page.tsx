import type { Metadata } from 'next'
import AdminLoginForm from '@/components/admin/AdminLoginForm'
import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Login | Raven Store',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage({
  params,
}: {
  params: { adminSecret: string }
}) {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden p-6">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <span className="text-black font-bold text-xl">R</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              RAVEN<span className="text-zinc-500 font-medium">STORE</span>
            </span>
          </Link>
          
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
              <ShieldAlert size={12} />
              RESTRICTED AREA
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
              ADMIN <span className="text-zinc-500">PORTAL</span>
            </h1>
            <p className="text-zinc-500 font-medium max-w-xs mx-auto">
              Otentikasi diperlukan untuk mengakses Raven Store Control Center.
            </p>
          </div>
        </div>

        <AdminLoginForm adminSecret={params.adminSecret} />
        
        <div className="mt-12 text-center">
          <Link href="/" className="text-zinc-600 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  )
}
