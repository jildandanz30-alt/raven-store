# 🐦‍⬛ Raven Store

Minecraft Plugin & Asset Store — Premium seller platform.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: Supabase Auth (Google OAuth)
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Payment**: Midtrans
- **Deploy**: Railway
- **Notif**: Discord Webhook

## Design System

Comic Book / Manga — Black & White theme.
- **Display Font**: Bangers
- **Body Font**: Comic Neue
- **Mono Font**: JetBrains Mono
- **Color**: #0A0A0A bg, #E8E8E0 border, #F5F5F0 text

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill environment variables
cp .env.example .env.local

# 3. Run dev server
npm run dev
```

## Folder Structure

```
raven-store/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (fonts, loader)
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles + design tokens
│   ├── login/              # Auth pages
│   ├── products/           # Product listing + detail
│   ├── dashboard/          # Member dashboard
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   └── api/                # Route handlers
│       ├── auth/
│       ├── products/
│       ├── orders/
│       ├── payment/midtrans/
│       └── webhooks/discord/
├── components/
│   ├── ui/                 # Base design system components
│   │   ├── ComicCard.tsx
│   │   ├── ComicButton.tsx
│   │   ├── ComicBadge.tsx
│   │   └── PageLoader.tsx
│   ├── layout/             # Layout wrappers
│   ├── product/            # Product-specific components
│   ├── order/              # Order-related components
│   └── admin/              # Admin panel components
├── lib/
│   ├── supabase.ts         # Supabase client/server/admin
│   ├── database.types.ts   # Generated DB types
│   └── utils.ts            # Shared utilities
├── types/
│   └── index.ts            # TypeScript type definitions
└── hooks/                  # Custom React hooks (future)
```

## Sesi Berikutnya

- [ ] Sesi 2: Navbar, Footer, layout halaman utama
- [ ] Sesi 3: Product listing page + filter
- [ ] Sesi 4: Auth (Google OAuth + Supabase)
- [ ] Sesi 5: Dashboard member
- [ ] Sesi 6: Cart + Checkout + Midtrans
- [ ] Sesi 7: Admin panel
- [ ] Sesi 8: Review system + Discord notif
