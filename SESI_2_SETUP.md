# Raven Store — Sesi 2 Setup Guide

## File yang Dibuat di Sesi 2

```
supabase/
  migrations/
    001_initial_schema.sql     ← Run this in Supabase SQL Editor

lib/
  supabase/
    client.ts                  ← Browser Supabase client
    server.ts                  ← Server Supabase client + service client
    middleware.ts              ← Middleware Supabase client helper
  auth.ts                      ← getUser, requireAuth, requireAdmin, isAdmin

types/
  database.ts                  ← TypeScript types for all tables

app/
  login/
    page.tsx                   ← Login page (Server Component)
    LoginClient.tsx            ← Login UI with comic design (Client Component)
  auth/
    callback/route.ts          ← OAuth callback handler
    signout/route.ts           ← POST sign out handler

middleware.ts                  ← Route protection
.env.example                   ← Environment variable template
```

---

## Setup Steps

### 1. Install packages
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2. Configure Supabase Auth (Google OAuth)
1. Buka **Supabase Dashboard** → Authentication → Providers
2. Enable **Google**
3. Buat project di [Google Cloud Console](https://console.cloud.google.com)
4. Tambahkan OAuth 2.0 credentials
5. Set **Authorized redirect URIs**: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
6. Copy Client ID & Secret ke Supabase

### 3. Set Redirect URL di Supabase
Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: `http://localhost:3000` (dev) / `https://ravenstore.id` (prod)
- **Redirect URLs**: tambahkan `http://localhost:3000/auth/callback`

### 4. Jalankan SQL Migration
1. Buka **Supabase Dashboard** → SQL Editor
2. Copy paste isi `supabase/migrations/001_initial_schema.sql`
3. Klik **Run**

### 5. Set first admin
Setelah login pertama kali dengan Google, jalankan di SQL Editor:
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'your@email.com';
```

### 6. Environment Variables
```bash
cp .env.example .env.local
# Fill in your values
```

### 7. Admin Panel Access
URL Admin: `http://localhost:3000/{ADMIN_SECRET_PATH}/admin`

Default path: `ravens-nest` → `/ravens-nest/admin`

Ubah `ADMIN_SECRET_PATH` di `.env.local` ke sesuatu yang susah ditebak!

---

## Cara pakai Auth Helpers

```typescript
// Server Component
import { getUser, requireAuth, requireAdmin } from '@/lib/auth'

// Cek user (nullable)
const user = await getUser()

// Require login (redirect ke /login jika belum)
const user = await requireAuth()

// Require admin (redirect ke /dashboard jika bukan admin)
const admin = await requireAdmin()

// Check boolean
const adminCheck = await isAdmin()
```

---

## Next: Sesi 3
- Layout utama (Navbar, Footer)
- Homepage dengan hero section
- Product listing page dengan filter kategori
