'use client'

import { useState } from 'react'

type ProductCategory = 'plugin' | 'asset' | 'jasa'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  category: ProductCategory
  images: string[]
  download_url?: string
  is_active: boolean
  created_at: string
}

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'plugin', label: '🔌 Plugin' },
  { value: 'asset',  label: '🎨 Asset'  },
  { value: 'jasa',   label: '🛠️ Jasa'   },
]

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80)
}

const inp: React.CSSProperties = {
  width: '100%', background: '#0A0A0A', color: '#F5F5F0',
  border: '3px solid #333', padding: '0.65rem 0.9rem',
  fontFamily: 'Comic Neue, cursive', fontSize: '0.95rem',
  outline: 'none', boxSizing: 'border-box',
}

const lbl: React.CSSProperties = {
  fontFamily: 'Bangers, cursive', letterSpacing: '0.08em',
  fontSize: '0.88rem', color: '#AAAAAA', display: 'block', marginBottom: 5,
}

type FormState = {
  name: string; slug: string; description: string
  price: string; category: ProductCategory
  images: string; download_url: string; is_active: boolean
}

const emptyForm: FormState = {
  name: '', slug: '', description: '',
  price: '', category: 'plugin',
  images: '', download_url: '', is_active: true,
}

function ProductModal({ product, onClose, onSaved }: {
  product?: Product; onClose: () => void; onSaved: (p: Product) => void
}) {
  const isEdit = !!product?.id
  const [form, setForm] = useState<FormState>(
    product ? {
      name: product.name, slug: product.slug,
      description: product.description ?? '',
      price: String(product.price), category: product.category,
      images: (product.images ?? []).join('\n'),
      download_url: product.download_url ?? '',
      is_active: product.is_active,
    } : emptyForm
  )
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    if (!form.name || !form.slug || !form.category || !form.price) {
      setError('Nama, slug, kategori, dan harga wajib diisi.'); return
    }
    setSaving(true); setError('')
    try {
      const payload = {
        ...(isEdit ? { id: product!.id } : {}),
        name: form.name.trim(), slug: form.slug.trim(),
        description: form.description.trim(),
        price: Number(form.price), category: form.category,
        images: form.images.split('\n').map(s => s.trim()).filter(Boolean),
        download_url: form.download_url.trim() || null,
        is_active: form.is_active,
      }
      const res = await fetch('/api/admin/products', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onSaved(data.product)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const overlay: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '1rem',
  }
  const modal: React.CSSProperties = {
    background: '#1A1A1A', border: '4px solid #E8E8E0',
    boxShadow: '8px 8px 0 #E8E8E0', width: '100%', maxWidth: 560,
    maxHeight: '90vh', overflow: 'auto', padding: '1.5rem',
  }

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        <div style={{ fontFamily: 'Bangers, cursive', fontSize: '1.6rem', color: '#F5F5F0', letterSpacing: '0.1em', marginBottom: '1.2rem' }}>
          {isEdit ? '✏️ EDIT PRODUK' : '➕ TAMBAH PRODUK'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Nama */}
          <div>
            <label style={lbl}>NAMA PRODUK *</label>
            <input style={inp} value={form.name} onChange={(e) => {
              const val = e.target.value
              setForm(f => ({ ...f, name: val, slug: !isEdit ? slugify(val) : f.slug }))
            }} placeholder="Contoh: SuperCrates Premium" />
          </div>

          {/* Slug */}
          <div>
            <label style={lbl}>SLUG (URL) *</label>
            <input style={inp} value={form.slug} onChange={set('slug')} placeholder="super-crates-premium" />
          </div>

          {/* Kategori */}
          <div>
            <label style={lbl}>KATEGORI *</label>
            <select style={inp} value={form.category} onChange={set('category')}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          {/* Harga */}
          <div>
            <label style={lbl}>HARGA (IDR) *</label>
            <input style={inp} type="number" value={form.price} onChange={set('price')} placeholder="25000" min={0} />
          </div>

          {/* Deskripsi */}
          <div>
            <label style={lbl}>DESKRIPSI</label>
            <textarea style={{ ...inp, resize: 'vertical' }} rows={4} value={form.description} onChange={set('description')} placeholder="Jelaskan fitur produk..." />
          </div>

          {/* Gambar URLs */}
          <div>
            <label style={lbl}>URL GAMBAR (satu per baris)</label>
            <textarea style={{ ...inp, resize: 'vertical', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }} rows={3} value={form.images} onChange={set('images')} placeholder={"https://i.imgur.com/abc.png\nhttps://i.imgur.com/def.png"} />
            <div style={{ fontFamily: 'Comic Neue, cursive', color: '#555', fontSize: '0.8rem', marginTop: 4 }}>Upload dulu ke imgur/imagekit, paste URL di sini</div>
          </div>

          {/* Download URL — field utama */}
          <div style={{ border: '3px solid #4488ff', padding: '1rem', background: '#0a1a2a' }}>
            <label style={{ ...lbl, color: '#88bbff', fontSize: '0.95rem' }}>🔗 URL DOWNLOAD</label>
            <input
              style={{ ...inp, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', borderColor: '#4488ff' }}
              value={form.download_url} onChange={set('download_url')}
              placeholder="https://drive.google.com/file/d/... atau link lain"
            />
            <div style={{ fontFamily: 'Comic Neue, cursive', color: '#88bbff', fontSize: '0.8rem', marginTop: 5 }}>
              Link ini akan muncul ke buyer setelah kamu approve order mereka. Bisa Google Drive, MediaFire, dll.
            </div>
          </div>

          {/* Status aktif */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <input
              type="checkbox" id="is_active" checked={form.is_active}
              onChange={(e) => setForm(f => ({ ...f, is_active: e.target.checked }))}
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
            <label htmlFor="is_active" style={{ ...lbl, marginBottom: 0, cursor: 'pointer' }}>PRODUK AKTIF (tampil di toko)</label>
          </div>
        </div>

        {error && (
          <div style={{ marginTop: '1rem', border: '2px solid #ff4444', padding: '0.6rem', color: '#ff8888', fontFamily: 'Comic Neue, cursive', fontSize: '0.9rem' }}>
            ❌ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
          <button onClick={handleSave} disabled={saving} style={{
            fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '1.1rem',
            padding: '0.6rem 2rem', flex: 1,
            background: saving ? '#333' : '#F5F5F0', color: saving ? '#666' : '#0A0A0A',
            border: '3px solid #E8E8E0', boxShadow: saving ? 'none' : '4px 4px 0 #E8E8E0',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}>
            {saving ? 'MENYIMPAN...' : isEdit ? '💾 SIMPAN PERUBAHAN' : '➕ TAMBAH PRODUK'}
          </button>
          <button onClick={onClose} style={{
            fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '1rem',
            padding: '0.6rem 1.2rem',
            background: 'transparent', color: '#F5F5F0',
            border: '3px solid #555', cursor: 'pointer',
          }}>BATAL</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts]   = useState<Product[]>(initialProducts)
  const [modal, setModal]         = useState<'add' | Product | null>(null)
  const [deleting, setDeleting]   = useState<string | null>(null)
  const [filterCat, setFilterCat] = useState<ProductCategory | 'all'>('all')

  const filtered = filterCat === 'all' ? products : products.filter(p => p.category === filterCat)

  const handleSaved = (saved: Product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === saved.id)
      return exists ? prev.map(p => p.id === saved.id ? saved : p) : [saved, ...prev]
    })
    setModal(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus produk ini?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
      setProducts(prev => prev.filter(p => p.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <>
      {modal && (
        <ProductModal
          product={typeof modal === 'object' && modal !== null && 'id' in modal ? modal as Product : undefined}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.2rem' }}>
        <button onClick={() => setModal('add')} style={{
          fontFamily: 'Bangers, cursive', letterSpacing: '0.08em', fontSize: '1.1rem',
          padding: '0.5rem 1.5rem', background: '#F5F5F0', color: '#0A0A0A',
          border: '3px solid #E8E8E0', boxShadow: '4px 4px 0 #E8E8E0', cursor: 'pointer',
        }}>
          ➕ TAMBAH PRODUK
        </button>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {(['all', 'plugin', 'asset', 'jasa'] as const).map(c => (
            <button key={c} onClick={() => setFilterCat(c)} style={{
              fontFamily: 'Bangers, cursive', letterSpacing: '0.06em', fontSize: '0.85rem',
              padding: '0.3rem 0.8rem',
              border: `2px solid ${filterCat === c ? '#E8E8E0' : '#333'}`,
              boxShadow: filterCat === c ? '3px 3px 0 #E8E8E0' : 'none',
              background: filterCat === c ? '#F5F5F0' : 'transparent',
              color: filterCat === c ? '#0A0A0A' : '#555', cursor: 'pointer',
            }}>
              {c === 'all' ? 'SEMUA' : c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map(p => (
          <div key={p.id} style={{
            border: '3px solid #E8E8E0', boxShadow: '4px 4px 0 #E8E8E0',
            background: '#1A1A1A', padding: '1rem',
            opacity: p.is_active ? 1 : 0.5,
          }}>
            {/* Gambar preview */}
            {p.images?.[0] && (
              <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: 120, objectFit: 'cover', border: '2px solid #333', marginBottom: '0.7rem' }} />
            )}

            <div style={{ fontFamily: 'Bangers, cursive', fontSize: '1.1rem', color: '#F5F5F0', letterSpacing: '0.06em', marginBottom: 4 }}>
              {p.name}
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Bangers, cursive', fontSize: '0.8rem', padding: '2px 8px', border: '2px solid #555', color: '#AAAAAA' }}>
                {p.category.toUpperCase()}
              </span>
              <span style={{ fontFamily: 'Bangers, cursive', fontSize: '0.8rem', padding: '2px 8px', border: `2px solid ${p.is_active ? '#44ff88' : '#555'}`, color: p.is_active ? '#44ff88' : '#555' }}>
                {p.is_active ? 'AKTIF' : 'NONAKTIF'}
              </span>
            </div>
            <div style={{ fontFamily: 'Bangers, cursive', fontSize: '1.3rem', color: '#FFD700', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Rp{p.price.toLocaleString('id-ID')}
            </div>

            {/* Download URL indicator */}
            {p.download_url ? (
              <div style={{ fontFamily: 'Comic Neue, cursive', fontSize: '0.78rem', color: '#88bbff', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                🔗 Link download tersedia
              </div>
            ) : (
              <div style={{ fontFamily: 'Comic Neue, cursive', fontSize: '0.78rem', color: '#ff8888', marginBottom: '0.8rem' }}>
                ⚠️ Belum ada link download
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setModal(p)} style={{
                fontFamily: 'Bangers, cursive', letterSpacing: '0.06em', fontSize: '0.9rem',
                padding: '0.35rem 1rem', flex: 1,
                background: '#F5F5F0', color: '#0A0A0A',
                border: '2px solid #E8E8E0', boxShadow: '3px 3px 0 #E8E8E0', cursor: 'pointer',
              }}>
                ✏️ EDIT
              </button>
              <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{
                fontFamily: 'Bangers, cursive', letterSpacing: '0.06em', fontSize: '0.9rem',
                padding: '0.35rem 0.8rem',
                background: 'transparent', color: '#ff8888',
                border: '2px solid #ff4444', cursor: 'pointer',
                opacity: deleting === p.id ? 0.5 : 1,
              }}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ color: '#555', fontFamily: 'Comic Neue, cursive', padding: '2rem', textAlign: 'center' }}>
          Belum ada produk. Tambahkan produk pertamamu!
        </div>
      )}
    </>
  )
}
