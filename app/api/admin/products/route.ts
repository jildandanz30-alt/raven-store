import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/adminAuth'
import { dbSelect, dbInsert, dbUpdate, dbDelete } from '@/lib/db'

export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const products = dbSelect<any>('products').sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))
  return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, slug, description, price, category, images, download_url, is_active } = await req.json()
  if (!name || !slug || !category || price === undefined)
    return NextResponse.json({ error: 'name, slug, category, price wajib diisi' }, { status: 400 })

  const data = dbInsert<any>('products', {
    name, slug, description: description ?? null, price: Number(price), category,
    images: images ?? [], download_url: download_url ?? null, is_active: is_active ?? true,
  })
  return NextResponse.json({ product: data })
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdminSession(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, ...fields } = await req.json()
  if (!id) return NextResponse.json({ error: 'id wajib diisi' }, { status: 400 })
  if (fields.price !== undefined) fields.price = Number(fields.price)

  const data = dbUpdate<any>('products', id, fields)
  return NextResponse.json({ product: data })
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminSession(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id wajib diisi' }, { status: 400 })
  dbDelete('products', id)
  return NextResponse.json({ success: true })
}
