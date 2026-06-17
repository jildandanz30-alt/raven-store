# 🐦‍⬛ Raven Store

Minecraft Plugin & Asset Store — Premium seller platform.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: Clerk (Customer) & Password-based (Admin)
- **Database**: Local JSON Storage (db.ts)
- **Payment**: Manual Transfer (Dana, GoPay, QRIS)
- **Deploy**: Railway
- **Notif**: Discord Webhook

## Design System

Elegant Minimalist — Black, White, and Soft Melon Green.
- **Display Font**: Plus Jakarta Sans
- **Body Font**: Inter
- **Mono Font**: JetBrains Mono
- **Colors**: 
  - Background: `#050505`
  - Surface: `#0f0f0f`
  - Accent: `#2d4a3e` (Soft Melon Green)
  - Accent Light: `#4ade80`

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill environment variables
cp .env.example .env.local

# 3. Run dev server
npm run dev
```

## Admin Access

Admin panel can be accessed via a hidden route: `/[ADMIN_SECRET]/admin`
Login using the password configured in `ADMIN_PASSWORD`.

## Key Features

- **Elegant UI**: Modern design with smooth scroll animations.
- **Secure Admin**: Password-protected admin panel without third-party dependencies.
- **Clerk Auth**: Seamless customer login experience.
- **Discord Integration**: Real-time notifications for orders and admin alerts.
- **Product Catalog**: Easy management of plugins, assets, and services.
