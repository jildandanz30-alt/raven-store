'use client'

import { useState } from 'react'

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

const STATUS_STYLE: Record<OrderStatus, { bg: string; color: string; border: string }> = {
  pending:   { bg: '#1a1a1a', color: '#AAAAAA',  border: '#555'    },
  paid:      { bg: '#0a2a0a', color: '#44ff88',  border: '#00ff88' },
  completed: { bg: '#0a1a2a', color: '#88bbff',  border: '#4488ff' },
  cancelled: { bg: '#2a0a0a', color: '#ff8888',  border: '#ff4444' },
}

const STATUS_EMOJI: Record<string, string> = {
  pending: '🕐', paid: '✅', completed: '📦', cancelled: '❌',
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
    <>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
        {(['all', ...STATUS_FLOW] as const).map((s) => {
          const isActive = filter === s
          return (
            <button key={s} onClick={() => setFilter(s)} style={{
              fontFamily: 'Bangers, cursive', letterSpacing: '0.06em', fontSize: '0.9rem',
              padding: '0.35rem 1rem',
              border: `2px solid ${isActive ? '#E8E8E0' : '#333'}`,
              boxShadow: isActive ? '3px 3px 0 #E8E8E0' : 'none',
              background: isActive ? '#F5F5F0' : 'transparent',
              color: isActive ? '#0A0A0A' : '#555',
              cursor: 'pointer', transition: 'all 0.12s',
            }}>
              {STATUS_EMOJI[s] ?? '📋'} {s === 'all' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}{' '}
              <span style={{ opacity: 0.6 }}>({counts[s as keyof typeof counts]})</span>
            </button>
          )
        })}
      </div>

      {/* Orders list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {filtered.length === 0 && (
          <div style={{ color: '#555', fontFamily: 'Comic Neue, cursive', padding: '2rem', textAlign: 'center' }}>
            Tidak ada order.
          </div>
        )}
        {filtered.map((order) => {
          const st = STATUS_STYLE[order.status]
          const isExpanded = expanded === order.id
          const product = order.products as any
          const user = order.users as any

          return (
            <div key={order.id} style={{ border: `3px solid ${st.border}`, boxShadow: `4px 4px 0 ${st.border}`, background: st.bg, overflow: 'hidden' }}>
              {/* Header row */}
              <div
                onClick={() => setExpanded(isExpanded ? null : order.id)}
                style={{ padding: '0.8rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}
              >
                <span style={{ fontFamily: 'Bangers, cursive', fontSize: '1rem', color: st.color, letterSpacing: '0.08em', minWidth: 90 }}>
                  {STATUS_EMOJI[order.status]} {order.status.toUpperCase()}
                </span>
                <span style={{ fontFamily: 'Comic Neue, cursive', color: '#F5F5F0', fontWeight: 700, flex: 1 }}>
                  {product?.name ?? '—'}
                </span>
                <span style={{ fontFamily: 'Bangers, cursive', color: '#FFD700', fontSize: '1.1rem', letterSpacing: '0.06em' }}>
                  Rp{(order.amount ?? 0).toLocaleString('id-ID')}
                </span>
                <span style={{ fontFamily: 'Comic Neue, cursive', color: '#AAAAAA', fontSize: '0.8rem' }}>
                  {new Date(order.created_at).toLocaleDateString('id-ID')}
                </span>
                <span style={{ color: '#AAAAAA', fontSize: '0.8rem' }}>{isExpanded ? '▲' : '▼'}</span>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{ borderTop: `2px solid ${st.border}`, padding: '1rem', background: '#0A0A0A' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.8rem', marginBottom: '1rem' }}>
                    <InfoBlock label="Order ID" value={order.id.slice(0, 8) + '...'} mono />
                    <InfoBlock label="Pembeli" value={user?.email ?? order.user_id} />
                    <InfoBlock label="Metode Bayar" value={(order.payment_method ?? '—').toUpperCase()} />
                    <InfoBlock label="Kategori" value={product?.category?.toUpperCase() ?? '—'} />
                    {order.notes && <InfoBlock label="Catatan" value={order.notes} />}
                  </div>

                  {/* Download URL jika ada */}
                  {product?.download_url && (
                    <div style={{ marginBottom: '1rem', padding: '0.7rem', border: '2px solid #4488ff', background: '#0a1a2a' }}>
                      <div style={{ fontFamily: 'Bangers, cursive', color: '#88bbff', letterSpacing: '0.08em', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                        🔗 URL DOWNLOAD PRODUK
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#88bbff', fontSize: '0.82rem', wordBreak: 'break-all' }}>
                        {product.download_url}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {/* Approve = set paid */}
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'paid')}
                        disabled={updating === order.id}
                        style={{
                          fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '1rem',
                          padding: '0.5rem 1.2rem',
                          background: '#00ff88', color: '#0A0A0A',
                          border: '3px solid #44ff88', boxShadow: '3px 3px 0 #44ff88',
                          cursor: updating === order.id ? 'not-allowed' : 'pointer',
                          opacity: updating === order.id ? 0.5 : 1,
                        }}
                      >
                        ✅ {updating === order.id ? 'MEMPROSES...' : 'APPROVE & AKTIFKAN DOWNLOAD'}
                      </button>
                    )}
                    {order.status === 'paid' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'completed')}
                        disabled={updating === order.id}
                        style={{
                          fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '1rem',
                          padding: '0.5rem 1.2rem',
                          background: '#4488ff', color: '#0A0A0A',
                          border: '3px solid #88bbff', boxShadow: '3px 3px 0 #88bbff',
                          cursor: 'pointer',
                        }}
                      >
                        📦 TANDAI SELESAI
                      </button>
                    )}
                    {(order.status === 'pending' || order.status === 'paid') && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                        disabled={updating === order.id}
                        style={{
                          fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '1rem',
                          padding: '0.5rem 1rem',
                          background: 'transparent', color: '#ff8888',
                          border: '3px solid #ff4444',
                          cursor: 'pointer',
                        }}
                      >
                        ❌ BATALKAN
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

function InfoBlock({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontFamily: 'Bangers, cursive', color: '#AAAAAA', letterSpacing: '0.06em', fontSize: '0.75rem', marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: mono ? 'JetBrains Mono, monospace' : 'Comic Neue, cursive', color: '#F5F5F0', fontSize: '0.88rem', wordBreak: 'break-all' }}>{value}</div>
    </div>
  )
}
