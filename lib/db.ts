// lib/db.ts — Local JSON file storage (mengganti PostgreSQL)
// Data disimpan di folder /data/*.json di root project

import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

export { randomUUID }

const DATA_DIR = path.join(process.cwd(), 'data')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readTable(table: string): any[] {
  ensureDir()
  const file = path.join(DATA_DIR, `${table}.json`)
  if (!fs.existsSync(file)) return []
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')) } catch { return [] }
}

function writeTable(table: string, data: any[]) {
  ensureDir()
  const file = path.join(DATA_DIR, `${table}.json`)
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

// ─── Generic helpers ─────────────────────────────────────────────────────────

export function dbSelect<T = any>(table: string, where?: Record<string, any>): T[] {
  const rows = readTable(table)
  if (!where) return rows as T[]
  return rows.filter(row => Object.entries(where).every(([k, v]) => row[k] === v)) as T[]
}

export function dbSelectOne<T = any>(table: string, where: Record<string, any>): T | null {
  return dbSelect<T>(table, where)[0] ?? null
}

export function dbInsert<T = any>(table: string, data: Record<string, any>): T {
  const rows = readTable(table)
  const now = new Date().toISOString()
  const row = { id: randomUUID(), created_at: now, updated_at: now, ...data }
  rows.push(row)
  writeTable(table, rows)
  return row as T
}

export function dbUpdate<T = any>(table: string, id: string, patch: Record<string, any>): T | null {
  const rows = readTable(table)
  const idx = rows.findIndex(r => r.id === id)
  if (idx === -1) return null
  rows[idx] = { ...rows[idx], ...patch, updated_at: new Date().toISOString() }
  writeTable(table, rows)
  return rows[idx] as T
}

export function dbDelete(table: string, id: string): boolean {
  const rows = readTable(table)
  const next = rows.filter(r => r.id !== id)
  if (next.length === rows.length) return false
  writeTable(table, next)
  return true
}

export function dbUpsert<T = any>(
  table: string,
  match: Record<string, any>,
  data: Record<string, any>
): T {
  const rows = readTable(table)
  const now = new Date().toISOString()
  const idx = rows.findIndex(row => Object.entries(match).every(([k, v]) => row[k] === v))
  if (idx !== -1) {
    rows[idx] = { ...rows[idx], ...data, updated_at: now }
    writeTable(table, rows)
    return rows[idx] as T
  }
  const row = { id: randomUUID(), created_at: now, updated_at: now, ...match, ...data }
  rows.push(row)
  writeTable(table, rows)
  return row as T
}

export default { dbSelect, dbSelectOne, dbInsert, dbUpdate, dbDelete, dbUpsert }
