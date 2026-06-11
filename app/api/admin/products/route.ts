import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/adminAuth'
import sql from '@/lib/db'

export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  const products = await sql`SELECT * FROM products ORDER BY created_at DESC`
  return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  const { name, slug, description, price, category, images, download_url, is_active } = await req.json()
  if (!name||!slug||!category||price===undefined)
    return NextResponse.json({ error:'name, slug, category, price wajib diisi' }, { status:400 })

  const [data] = await sql`
    INSERT INTO products (name,slug,description,price,category,images,download_url,is_active,created_at,updated_at)
    VALUES (${name},${slug},${description??null},${Number(price)},${category},${JSON.stringify(images??[])}::jsonb,${download_url??null},${is_active??true},NOW(),NOW())
    RETURNING *
  `
  return NextResponse.json({ product: data })
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdminSession(req)) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  const { id, ...fields } = await req.json()
  if (!id) return NextResponse.json({ error:'id wajib diisi' }, { status:400 })
  if (fields.price!==undefined) fields.price = Number(fields.price)

  const [data] = await sql`
    UPDATE products SET
      name        = COALESCE(${fields.name??null}, name),
      slug        = COALESCE(${fields.slug??null}, slug),
      description = ${fields.description??null},
      price       = COALESCE(${fields.price??null}, price),
      category    = COALESCE(${fields.category??null}, category),
      images      = COALESCE(${fields.images ? JSON.stringify(fields.images) : null}::jsonb, images),
      download_url = ${fields.download_url??null},
      is_active   = COALESCE(${fields.is_active??null}, is_active),
      updated_at  = NOW()
    WHERE id=${id} RETURNING *
  `
  return NextResponse.json({ product: data })
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminSession(req)) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error:'id wajib diisi' }, { status:400 })
  await sql`DELETE FROM products WHERE id=${id}`
  return NextResponse.json({ success: true })
}
