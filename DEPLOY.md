# 🚀 Deploy Guide — Raven Store (Vercel + GitHub)

## Prasyarat
- Akun GitHub
- Akun Vercel (gratis)
- Akun Supabase (gratis)
- Discord server untuk notifikasi

---

## Step 1 — Setup Supabase

1. Buat project baru di https://supabase.com
2. Buka **SQL Editor**, jalankan migration file secara berurutan:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/001_session3_schema.sql`
   - `supabase/migrations/002_session5_schema.sql`
   - `supabase/migrations/003_manual_payment.sql`
3. Buka **Authentication > Providers**, enable **Google**
4. Buka **Project Settings > API**, copy:
   - `URL`
   - `anon public` key
   - `service_role` key

---

## Step 2 — Setup Discord Webhook

1. Buka Discord server kamu
2. Pilih channel untuk notifikasi (misal: #orders)
3. Edit Channel > Integrations > Webhooks > New Webhook
4. Copy webhook URL

---

## Step 3 — Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit — Raven Store"
git remote add origin https://github.com/username/raven-store.git
git push -u origin main
```

---

## Step 4 — Deploy ke Vercel

1. Buka https://vercel.com/new
2. Import repository GitHub kamu
3. Framework preset: **Next.js** (auto-detect)
4. Klik **Environment Variables**, tambahkan:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase kamu |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key |
| `DISCORD_WEBHOOK_URL` | Webhook Discord |
| `ADMIN_SECRET` | String acak untuk URL admin (contoh: `r4v3n-s3cr3t-2024`) |
| `ADMIN_PASSWORD` | Password admin panel |
| `PAYMENT_HOLDER_NAME` | Nama pemilik akun payment |
| `PAYMENT_DANA` | Nomor Dana kamu |
| `PAYMENT_GOPAY` | Nomor GoPay kamu |
| `PAYMENT_QRIS_URL` | URL gambar QRIS kamu |
| `NEXT_PUBLIC_APP_URL` | URL Vercel kamu (setelah deploy pertama) |

5. Klik **Deploy**

---

## Step 5 — Setup Admin Account

Setelah deploy, login dulu dengan Google di website kamu, lalu:

1. Buka Supabase Dashboard > Table Editor > `users`
2. Cari row dengan email kamu
3. Ubah kolom `role` dari `member` menjadi `admin`
4. Simpan

---

## Step 6 — Akses Admin Panel

URL admin panel: `https://your-domain.vercel.app/[ADMIN_SECRET]/admin`

Ganti `[ADMIN_SECRET]` dengan nilai yang kamu set di environment variable.

---

## Cara Setup QRIS

1. Ambil foto/screenshot QR code QRIS kamu
2. Upload ke https://imgur.com (gratis)
3. Copy URL gambar langsung (klik kanan > copy image address)
4. Paste ke `PAYMENT_QRIS_URL` di Vercel

---

## Alur Order Manual

```
Buyer pilih produk → Checkout → Pilih metode (Dana/GoPay/QRIS)
→ Sistem buat order (status: pending) → Discord notif ke kamu
→ Buyer transfer manual → Buyer klik "Sudah Transfer"
→ Kamu cek transfer → Buka admin panel → Approve order
→ Status berubah ke paid → Link download muncul di dashboard buyer
```
