'use client'

import type { WeeklyPoint } from '@/lib/adminData'

export default function WeeklyChart({ data }: { data: WeeklyPoint[] }) {
  const maxOrders = Math.max(...data.map((d) => d.orders), 1)
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1)

  const formatRp = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}jt` : n.toLocaleString('id-ID')

  return (
    <div>
      {/* Bar chart */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-end',
          height: 160,
          marginBottom: '0.75rem',
        }}
      >
        {data.map((d) => {
          const orderHeight = (d.orders / maxOrders) * 140
          const revenueHeight = (d.revenue / maxRevenue) * 140

          return (
            <div
              key={d.date}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                height: '100%',
                justifyContent: 'flex-end',
              }}
            >
              {/* Revenue bar (back) */}
              <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 140 }}>
                <div
                  title={`Revenue: Rp${formatRp(d.revenue)}`}
                  style={{
                    flex: 1,
                    height: Math.max(revenueHeight, 2),
                    background: '#333',
                    border: '2px solid #555',
                    transition: 'height 0.3s ease',
                    cursor: 'default',
                  }}
                />
                <div
                  title={`Orders: ${d.orders}`}
                  style={{
                    flex: 1,
                    height: Math.max(orderHeight, d.orders > 0 ? 8 : 2),
                    background: '#F5F5F0',
                    border: '2px solid #E8E8E0',
                    boxShadow: d.orders > 0 ? '2px 2px 0 #E8E8E0' : 'none',
                    transition: 'height 0.3s ease',
                    cursor: 'default',
                  }}
                />
              </div>

              {/* Day label */}
              <span
                style={{
                  fontFamily: 'Bangers, cursive',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  color: '#AAAAAA',
                  marginTop: 4,
                }}
              >
                {d.date}
              </span>

              {/* Order count */}
              {d.orders > 0 && (
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.68rem',
                    color: '#F5F5F0',
                  }}
                >
                  {d.orders}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
        {[
          { color: '#F5F5F0', label: 'Orders' },
          { color: '#333', border: '2px solid #555', label: 'Revenue' },
        ].map(({ color, border, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 14,
                height: 14,
                background: color,
                border: border ?? '2px solid #E8E8E0',
                flexShrink: 0,
              }}
            />
            <span style={{ color: '#555', fontSize: '0.8rem' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
