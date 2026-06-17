'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, Package, XCircle, ChevronDown, ChevronUp, ExternalLink, User, ShoppingBag, CreditCard, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

type OrderStatus = 'pending' | 'paid' | 'completed' | 'cancelled'

export interface AdminOrder {
  id: string
  user_id: string
  product_id: string
  amount: number
  status: OrderStatus
  payment_method?: string
  notes?: string
  created_at: string
  updated_at?: string
  users?: { email: string; name?: string }
  products?: { name: string; category: string; download_url?: string }
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: any; color: string; bg: string; border: string }> = {
  pending:   { label: 'Pending',   icon: Clock,        color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  paid:      { label: 'Paid',      icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  completed: { label: 'Completed', icon: Package,      color: 'text-blue-500',  bg: 'bg-blue-500/10',  border: 'border-blue-500/20' },
  cancelled: { label: 'Cancelled', icon: XCircle,      color: 'text-red-500',   bg: 'bg-red-500/10',   border: 'border-red-500/20' },
}

const STATUS_FLOW: OrderStatus[] = ['pending', 'paid', 'completed', 'cancelled']

export default function AdminOrdersClient({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders]   = useState<AdminOrder[]>(initialOrders)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filter, setFilter]   = useState<OrderStatus | 'all'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const counts = {
    all: orders.length,
    pending:   orders.filter((o) => o.status === 'pending').length,
    paid:      orders.filter((o) => o.status === 'paid').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      })
      if (res.ok) {
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o))
      }
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Filter tabs */}
      <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5 w-fit">
        {(['all', ...STATUS_FLOW] as const).map((s) => {
          const isActive = filter === s
          return (
            <button 
              key={s} 
              onClick={() => setFilter(s)} 
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-3",
                isActive 
                  ? "bg-white text-black shadow-lg" 
                  : "text-zinc-500 hover:text-white"
              )}
            >
              {s === 'all' ? 'Semua' : s}
              <span className={cn(
                "text-[10px] px-2 py-0.5 rounded-full",
                isActive ? "bg-black/10 text-black" : "bg-white/5 text-zinc-600"
              )}>
                {counts[s as keyof typeof counts]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Orders list */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="glass-card p-24 text-center border-dashed border-2 border-white/5">
            <p className="text-zinc-500 text-xl font-bold mb-2">Tidak ada order.</p>
            <p className="text-zinc-600 text-sm">Belum ada aktivitas penjualan untuk kategori ini.</p>
          </div>
        )}
        
        {filtered.map((order) => {
          const config = STATUS_CONFIG[order.status]
          const isExpanded = expanded === order.id
          const product = order.products as any
          const user = order.users as any
          const Icon = config.icon

          return (
            <div 
              key={order.id} 
              className={cn(
                "glass-card overflow-hidden transition-all duration-300",
                isExpanded ? "bg-zinc-900 border-white/20" : "bg-zinc-900/40 border-white/5 hover:border-white/10"
              )}
            >
              {/* Header row */}
              <div
                onClick={() => setExpanded(isExpanded ? null : order.id)}
                className="p-6 cursor-pointer flex items-center gap-6"
              >
                <div className={cn("p-3 rounded-xl border", config.bg, config.border, config.color)}>
                  <Icon size={20} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-white group-hover:text-accent-light transition-colors">
                      {product?.name ?? 'Produk Dihapus'}
                    </h4>
                    <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">#{order.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5"><User size={12} /> {user?.email ?? 'Unknown'}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(order.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black text-white tracking-tight mb-1">
                    Rp{(order.amount ?? 0).toLocaleString('id-ID')}
                  </div>
                  <div className={cn("text-[10px] font-bold uppercase tracking-widest", config.color)}>
                    {config.label}
                  </div>
                </div>

                <div className="ml-4 p-2 rounded-full bg-white/5 text-zinc-600">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-6 pb-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-black/40 rounded-2xl border border-white/5 mb-6">
                    <InfoBlock icon={<ShoppingBag size={14} />} label="Produk" value={product?.name ?? '—'} />
                    <InfoBlock icon={<User size={14} />} label="Pembeli" value={user?.email ?? order.user_id} />
                    <InfoBlock icon={<CreditCard size={14} />} label="Metode" value={(order.payment_method ?? 'Manual').toUpperCase()} />
                    <InfoBlock icon={<Clock size={14} />} label="Status" value={order.status.toUpperCase()} />
                    {order.notes && <div className="md:col-span-4"><InfoBlock icon={<Calendar size={14} />} label="Catatan" value={order.notes} /></div>}
                  </div>

                  {/* Download URL jika ada */}
                  {product?.download_url && (
                    <div className="mb-6 p-6 bg-accent-soft/30 border border-accent/10 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2 text-accent-light mb-2">
                          <ExternalLink size={16} />
                          <label className="text-xs font-bold uppercase tracking-widest">Link Download Produk</label>
                        </div>
                        <div className="text-xs font-mono text-zinc-400 truncate">
                          {product.download_url}
                        </div>
                      </div>
                      <button 
                        onClick={() => window.open(product.download_url, '_blank')}
                        className="btn-elegant btn-accent py-2 px-4 text-[10px]"
                      >
                        BUKA LINK
                      </button>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-4">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'paid')}
                        disabled={updating === order.id}
                        className="btn-elegant btn-primary py-3 px-8 text-xs"
                      >
                        {updating === order.id ? 'MEMPROSES...' : 'APPROVE & AKTIFKAN'}
                      </button>
                    )}
                    {order.status === 'paid' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'completed')}
                        disabled={updating === order.id}
                        className="btn-elegant bg-blue-600 hover:bg-blue-500 text-white py-3 px-8 text-xs"
                      >
                        TANDAI SELESAI
                      </button>
                    )}
                    {(order.status === 'pending' || order.status === 'paid') && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                        disabled={updating === order.id}
                        className="btn-elegant btn-outline border-red-500/20 text-red-500 hover:bg-red-500/10 py-3 px-8 text-xs"
                      >
                        BATALKAN
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InfoBlock({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-zinc-600 uppercase tracking-widest text-[10px] font-bold">
        {icon}
        {label}
      </div>
      <div className="text-sm font-bold text-white truncate">{value}</div>
    </div>
  )
}
