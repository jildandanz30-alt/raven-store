// scripts/migrate.js
// Jalankan: node scripts/migrate.js
// Atau via Railway: bisa diset sebagai build command

const postgres = require('postgres')

const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false },
  onnotice: () => {},
})

async function migrate() {
  console.log('🚀 Running migrations...')

  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

  // ── users ───────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      clerk_id    TEXT UNIQUE NOT NULL,
      email       TEXT UNIQUE NOT NULL,
      name        TEXT,
      avatar      TEXT,
      role        TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member','admin')),
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  console.log('✅ users')

  // ── products ────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name         TEXT NOT NULL,
      slug         TEXT UNIQUE NOT NULL,
      description  TEXT,
      price        INTEGER NOT NULL DEFAULT 0,
      category     TEXT NOT NULL CHECK (category IN ('plugin','asset','jasa')),
      images       JSONB NOT NULL DEFAULT '[]',
      download_url TEXT,
      is_active    BOOLEAN NOT NULL DEFAULT true,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  console.log('✅ products')

  // ── orders ──────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id     UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      amount         INTEGER NOT NULL DEFAULT 0,
      status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','completed','cancelled')),
      payment_method TEXT,
      notes          TEXT,
      created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  console.log('✅ orders')

  // ── reviews ─────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment     TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, product_id)
    )
  `
  console.log('✅ reviews')

  // ── jasa_orders ─────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS jasa_orders (
      id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      service_type     TEXT NOT NULL,
      server_name      TEXT NOT NULL,
      needs            TEXT NOT NULL,
      discord_contact  TEXT NOT NULL,
      status           TEXT NOT NULL DEFAULT 'pending',
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  console.log('✅ jasa_orders')

  // ── indexes ─────────────────────────────────────────────────
  await sql`CREATE INDEX IF NOT EXISTS idx_users_clerk_id   ON users(clerk_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_users_email      ON users(email)`
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_user_id   ON orders(user_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_status    ON orders(status)`
  await sql`CREATE INDEX IF NOT EXISTS idx_reviews_user_id  ON reviews(user_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_products_slug    ON products(slug)`
  console.log('✅ indexes')

  console.log('\n🎉 Migration selesai!')
  await sql.end()
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
