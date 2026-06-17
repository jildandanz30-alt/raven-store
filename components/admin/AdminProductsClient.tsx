'use client'

import { useState } from 'react'
import { Plus, Filter, Edit2, Trash2, CheckCircle2, AlertCircle, ExternalLink, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ProductCategory = 'plugin' | 'asset' | 'jasa'

interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  price: number
  category: ProductCategory | string
  images: string[]
  download_url?: string | null
  is_active: boolean
  created_at: string
}

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'plugin', label: 'Plugin' },
  { value: 'asset',  label: 'Asset'  },
  { value: 'jasa',   label: 'Jasa'   },
]

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80)
}

type FormState = {
  name: string; slug: string; description: string
  price: string; category: ProductCategory | string
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
        <div className="p-8 border-b border-white/5 flex justify-between items-center sticky top-0 bg-zinc-950 z-10">
          <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            {isEdit ? <Edit2 className="text-accent-light" size={24} /> : <Plus className="text-accent-light" size={24} />}
            {isEdit ? 'EDIT PRODUK' : 'TAMBAH PRODUK'}
          </h3>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Nama Produk *</label>
              <input 
                className="w-full bg-black border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-accent transition-all" 
                value={form.name} 
                onChange={(e) => {
                  const val = e.target.value
                  setForm(f => ({ ...f, name: val, slug: !isEdit ? slugify(val) : f.slug }))
                }} 
                placeholder="Contoh: Raven Anticheat" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Slug (URL) *</label>
              <input 
                className="w-full bg-black border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-accent transition-all font-mono text-sm" 
                value={form.slug} 
                onChange={set('slug')} 
                placeholder="raven-anticheat" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Kategori *</label>
              <select 
                className="w-full bg-black border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-accent transition-all appearance-none cursor-pointer" 
                value={form.category} 
                onChange={set('category')}
              >
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Harga (IDR) *</label>
              <input 
                className="w-full bg-black border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-accent transition-all" 
                type="number" 
                value={form.price} 
                onChange={set('price')} 
                placeholder="150000" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Deskripsi</label>
            <textarea 
              className="w-full bg-black border border-white/10 text-white rounded-xl py-4 px-5 outline-none focus:border-accent transition-all resize-none" 
              rows={4} 
              value={form.description} 
              onChange={set('description')} 
              placeholder="Jelaskan fitur produk..." 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">URL Gambar (satu per baris)</label>
            <textarea 
              className="w-full bg-black border border-white/10 text-white rounded-xl py-4 px-5 outline-none focus:border-accent transition-all resize-none font-mono text-xs" 
              rows={3} 
              value={form.images} 
              onChange={set('images')} 
              placeholder={"https://i.imgur.com/abc.png\nhttps://i.imgur.com/def.png"} 
            />
          </div>

          <div className="p-6 bg-accent-soft/30 border border-accent/10 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-accent-light">
              <ExternalLink size={18} />
              <label className="text-xs font-bold uppercase tracking-widest">Link Download Produk</label>
            </div>
            <input
              className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-accent transition-all font-mono text-sm"
              value={form.download_url} 
              onChange={set('download_url')}
              placeholder="https://drive.google.com/..."
            />
            <p className="text-[10px] text-zinc-500 font-medium">Link ini akan muncul di dashboard pembeli setelah status order PAID.</p>
          </div>

          <div className="flex items-center gap-3 p-2">
            <input
              type="checkbox" 
              id="is_active" 
              checked={form.is_active}
              onChange={(e) => setForm(f => ({ ...f, is_active: e.target.checked }))}
              className="w-5 h-5 rounded-lg bg-black border-white/10 text-accent focus:ring-accent"
            />
            <label htmlFor="is_active" className="text-sm font-bold text-white cursor-pointer select-none">Produk Aktif (Tampil di Katalog)</label>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
              <p className="text-red-500 text-sm font-bold">{error}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4 sticky bottom-0 bg-zinc-950 pb-2">
            <button 
              onClick={handleSave} 
              disabled={saving} 
              className="flex-1 btn-elegant btn-primary py-4 text-lg disabled:opacity-50"
            >
              {saving ? 'MENYIMPAN...' : isEdit ? 'SIMPAN PERUBAHAN' : 'TAMBAH PRODUK'}
            </button>
            <button 
              onClick={onClose} 
              className="btn-elegant btn-outline py-4 px-8 text-lg"
            >
              BATAL
            </button>
          </div>
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
    <div className="space-y-8">
      {modal && (
        <ProductModal
          product={typeof modal === 'object' && modal !== null && 'id' in modal ? modal as Product : undefined}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <button 
          onClick={() => setModal('add')} 
          className="btn-elegant btn-primary py-3 px-8 text-sm"
        >
          <Plus size={18} className="mr-2" />
          TAMBAH PRODUK
        </button>
        
        <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5">
          {(['all', 'plugin', 'asset', 'jasa'] as const).map(c => (
            <button 
              key={c} 
              onClick={() => setFilterCat(c)} 
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                filterCat === c 
                  ? "bg-white text-black shadow-lg" 
                  : "text-zinc-500 hover:text-white"
              )}
            >
              {c === 'all' ? 'SEMUA' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(p => (
          <div key={p.id} className={cn(
            "glass-card p-6 bg-zinc-900/40 border-white/5 group transition-all",
            !p.is_active && "opacity-60 grayscale-[0.5]"
          )}>
            {/* Gambar preview */}
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-black border border-white/5">
              {p.images?.[0] ? (
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="text-zinc-800" size={48} />
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                  {p.category}
                </span>
                <span className={cn(
                  "text-[10px] font-bold px-3 py-1 rounded-full border backdrop-blur-md uppercase tracking-widest",
                  p.is_active ? "bg-green-500/20 text-green-400 border-green-500/20" : "bg-zinc-500/20 text-zinc-400 border-zinc-500/20"
                )}>
                  {p.is_active ? 'AKTIF' : 'NONAKTIF'}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-accent-light transition-colors line-clamp-1">
              {p.name}
            </h3>
            <p className="text-2xl font-black text-white mb-6 tracking-tight">
              Rp{p.price.toLocaleString('id-ID')}
            </p>

            {/* Download URL indicator */}
            <div className="mb-6 p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
              {p.download_url ? (
                <>
                  <CheckCircle2 className="text-green-500" size={16} />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Link Download Tersedia</span>
                </>
              ) : (
                <>
                  <AlertCircle className="text-amber-500" size={16} />
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Belum Ada Link</span>
                </>
              )}
            </div>

            <div className="flex gap-3 pt-6 border-t border-white/5">
              <button 
                onClick={() => setModal(p)} 
                className="flex-1 btn-elegant btn-outline py-3 text-xs"
              >
                <Edit2 size={14} className="mr-2" />
                EDIT
              </button>
              <button 
                onClick={() => handleDelete(p.id)} 
                disabled={deleting === p.id} 
                className="p-3 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-24 text-center border-dashed border-2 border-white/5">
          <p className="text-zinc-500 text-xl font-bold mb-2">Belum ada produk.</p>
          <p className="text-zinc-600 text-sm">Tambahkan produk pertamamu untuk mulai berjualan!</p>
        </div>
      )}
    </div>
  )
}
