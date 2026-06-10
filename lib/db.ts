// lib/db.ts — PostgreSQL client (Railway)
import postgres from 'postgres'

const globalForPg = globalThis as unknown as { sql: ReturnType<typeof postgres> }

export const sql = globalForPg.sql ?? postgres(process.env.DATABASE_URL!, {
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idle_timeout: 30,
  connect_timeout: 10,
})

if (process.env.NODE_ENV !== 'production') globalForPg.sql = sql

export default sql
