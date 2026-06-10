"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useClerk, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

const navItems = [
  { href:"/dashboard", label:"Dashboard", icon:(
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  )},
  { href:"/dashboard/orders", label:"My Orders", icon:(
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/>
    </svg>
  )},
  { href:"/dashboard/downloads", label:"Downloads", icon:(
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )},
  { href:"/dashboard/reviews", label:"Reviews", icon:(
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )},
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useClerk()
  const { user } = useUser()

  const handleSignOut = () => signOut(() => router.push('/'))

  const avatarUrl = user?.imageUrl ?? `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.emailAddresses[0]?.emailAddress}`
  const displayName = user?.fullName ?? user?.emailAddresses[0]?.emailAddress?.split('@')[0] ?? 'Player'
  const email = user?.emailAddresses[0]?.emailAddress ?? ''

  return (
    <>
      <aside className="dashboard-sidebar">
        <div className="sidebar-halftone" aria-hidden="true" />

        {/* Profile */}
        <div className="sidebar-profile">
          <div className="sidebar-avatar-wrap">
            <img src={avatarUrl} alt={displayName} className="sidebar-avatar" />
            <div className="sidebar-avatar-badge">✦</div>
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-username">{displayName}</p>
            <p className="sidebar-email">{email}</p>
          </div>
        </div>

        <div className="sidebar-divider" />

        {/* Nav */}
        <nav className="sidebar-nav">
          <p className="sidebar-nav-label">NAVIGATION</p>
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} className={`sidebar-nav-item${isActive ? ' active' : ''}`}>
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span className="sidebar-nav-text">{item.label}</span>
                {isActive && <span className="sidebar-nav-arrow">▶</span>}
              </Link>
            )
          })}
        </nav>

        <div className="sidebar-divider" />

        <div className="sidebar-extra">
          <p className="sidebar-nav-label">EXPLORE</p>
          <Link href="/products" className="sidebar-nav-item">
            <span className="sidebar-nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </span>
            <span className="sidebar-nav-text">Store</span>
          </Link>
        </div>

        <div className="sidebar-footer">
          <button onClick={handleSignOut} className="sidebar-signout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      <style jsx>{`
        .dashboard-sidebar { position:fixed;left:0;top:0;height:100vh;width:260px;background:#111111;border-right:4px solid #e8e8e0;box-shadow:4px 0 0 #e8e8e0;display:flex;flex-direction:column;z-index:100;overflow:hidden;font-family:'Comic Neue','Comic Sans MS',cursive; }
        .sidebar-halftone { position:absolute;inset:0;background-image:radial-gradient(circle,rgba(232,232,224,0.04) 1px,transparent 1px);background-size:12px 12px;pointer-events:none; }
        .sidebar-profile { padding:24px 20px 20px;display:flex;align-items:center;gap:14px;position:relative; }
        .sidebar-avatar-wrap { position:relative;flex-shrink:0; }
        .sidebar-avatar { width:52px;height:52px;border-radius:4px;border:3px solid #e8e8e0;box-shadow:3px 3px 0 #e8e8e0;display:block;background:#1a1a1a; }
        .sidebar-avatar-badge { position:absolute;bottom:-6px;right:-6px;background:#f5f5f0;color:#0a0a0a;font-size:10px;width:18px;height:18px;display:flex;align-items:center;justify-content:center;border:2px solid #0a0a0a;border-radius:2px;font-weight:900; }
        .sidebar-user-info { overflow:hidden; }
        .sidebar-username { font-family:'Bangers',cursive;font-size:18px;color:#f5f5f0;letter-spacing:1px;margin:0 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
        .sidebar-email { font-size:11px;color:#666;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
        .sidebar-divider { height:3px;background:repeating-linear-gradient(90deg,#e8e8e0 0px,#e8e8e0 8px,transparent 8px,transparent 14px);margin:0 16px;flex-shrink:0; }
        .sidebar-nav { flex:1;padding:16px 12px 8px;overflow-y:auto; }
        .sidebar-extra { padding:8px 12px; }
        .sidebar-nav-label { font-family:'Bangers',cursive;font-size:11px;letter-spacing:3px;color:#555;margin:0 0 10px 8px; }
        .sidebar-nav-item { display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:4px;color:#aaa;text-decoration:none;font-size:15px;font-weight:700;margin-bottom:4px;border:2px solid transparent;transition:all 0.15s ease;position:relative;cursor:pointer;background:transparent;width:100%;text-align:left; }
        .sidebar-nav-item:hover { color:#f5f5f0;background:#1e1e1e;border-color:#e8e8e0;box-shadow:2px 2px 0 #e8e8e0;transform:translate(-1px,-1px); }
        .sidebar-nav-item.active { color:#0a0a0a;background:#f5f5f0;border-color:#e8e8e0;box-shadow:3px 3px 0 #888; }
        .sidebar-nav-item.active .sidebar-nav-icon { color:#0a0a0a; }
        .sidebar-nav-icon { flex-shrink:0;display:flex;align-items:center;color:inherit; }
        .sidebar-nav-text { flex:1; }
        .sidebar-nav-arrow { font-size:10px;opacity:0.6; }
        .sidebar-footer { padding:12px 12px 20px; }
        .sidebar-signout { display:flex;align-items:center;gap:10px;padding:10px 12px;width:100%;border:2px solid #333;background:transparent;color:#666;font-family:'Comic Neue',cursive;font-size:14px;font-weight:700;border-radius:4px;cursor:pointer;transition:all 0.15s ease; }
        .sidebar-signout:hover { border-color:#ff4444;color:#ff6666;background:rgba(255,68,68,0.08);box-shadow:2px 2px 0 #ff4444;transform:translate(-1px,-1px); }
        @media (max-width:768px) {
          .dashboard-sidebar { width:100%;height:auto;position:relative;flex-direction:row;flex-wrap:wrap;border-right:none;border-bottom:4px solid #e8e8e0;box-shadow:0 4px 0 #e8e8e0; }
          .sidebar-halftone { display:none; }
          .sidebar-profile { padding:12px 16px; }
          .sidebar-nav { display:flex;flex-direction:row;padding:8px;overflow-x:auto;flex:unset;width:100%; }
          .sidebar-nav-label { display:none; }
          .sidebar-nav-item { margin-bottom:0;margin-right:4px;white-space:nowrap; }
          .sidebar-extra,.sidebar-divider { display:none; }
          .sidebar-footer { padding:8px; }
          .sidebar-signout { padding:8px 10px;font-size:13px; }
          .sidebar-nav-arrow { display:none; }
        }
      `}</style>
    </>
  )
}
