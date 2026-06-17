'use client'

import type { WeeklyPoint } from '@/lib/adminData'
import { cn } from '@/lib/utils'

export default function WeeklyChart({ data }: { data: WeeklyPoint[] }) {
  const maxOrders = Math.max(...data.map((d) => d.orders), 1)
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1)

  const formatRp = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}jt` : n.toLocaleString('id-ID')

  return (
    <div className="w-full">
      {/* Bar chart */}
      <div className="flex gap-4 items-end h-[220px] mb-8">
        {data.map((d) => {
          const orderHeight = (d.orders / maxOrders) * 180
          const revenueHeight = (d.revenue / maxRevenue) * 180

          return (
            <div
              key={d.date}
              className="flex-1 flex flex-col items-center group relative"
            >
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-xl border border-white/20">
                {d.orders} Orders • Rp{formatRp(d.revenue)}
              </div>

              {/* Bars */}
              <div className="w-full flex gap-1 items-end h-[180px] px-1">
                <div
                  className="flex-1 bg-zinc-800 rounded-t-lg transition-all duration-500 group-hover:bg-zinc-700"
                  style={{ height: Math.max(revenueHeight, 4) }}
                />
                <div
                  className="flex-1 bg-accent-light rounded-t-lg transition-all duration-500 shadow-[0_0_15px_-5px_rgba(144,238,144,0.5)] group-hover:brightness-110"
                  style={{ height: Math.max(orderHeight, d.orders > 0 ? 10 : 4) }}
                />
              </div>

              {/* Day label */}
              <span className="text-[10px] font-bold text-zinc-600 mt-4 uppercase tracking-widest">
                {d.date}
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-8 pt-6 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-accent-light shadow-[0_0_10px_rgba(144,238,144,0.5)]" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Orders</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-zinc-800" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Revenue</span>
        </div>
      </div>
    </div>
  )
}
