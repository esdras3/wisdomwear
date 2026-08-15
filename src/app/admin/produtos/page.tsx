'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  Upload,
  Link2,
  Star,
  X
} from 'lucide-react';
import {
  AdminProduct,
  loadAdminProducts,
  saveAdminProducts,
  slugify,
  toAdminProduct
} from '@/lib/adminProducts';
import { PRODUCTS } from '@/data/products';

type FormState = {
  id?: string;
  name: string;
  subtitle: string;
  price: string;
  originalPrice: string;
  description: string;
  fabric: string;
  active: boolean;
  images: string[];
};

const emptyForm = (): FormState => ({
  name: '',
  subtitle: '',
  price: '',
  originalPrice: '',
  description: '',
  fabric: '',
  active: true,
  images: []
});

const MAX_UPLOAD_BYTES = 2.5 * 1024 * 1024; // 2.5MB antes da compressão
const MAX_IMAGES = 8;

async function fileToCompressedDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Selecione um arquivo de imagem (JPG, PNG ou WebP).');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Imagem muito grande. Use até ~2,5 MB.');
  }

  const bitmap = await createImageBitmap(file);
  const maxSide = 1600;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Não foi possível processar a imagem.');
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.82);
}

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<AdminProduct[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProductList(loadAdminProducts());
    setMounted(true);
  }, []);

  const persist = (next: AdminProduct[]) => {
    setProductList(next);
    saveAdminProducts(next);
  };

  const openCreate = () => {
    setMode('create');
    setForm(emptyForm());
    setImageUrl('');
    setImageError('');
    setShowModal(true);
  };

  const openEdit = (prod: AdminProduct) => {
    setMode('edit');
    setForm({
      id: prod.id,
      name: prod.name,
      subtitle: prod.subtitle,
      price: String(prod.price),
      originalPrice: prod.originalPrice ? String(prod.originalPrice) : '',
      description: prod.description,
      fabric: prod.fabric,
      active: prod.active,
      images: [...prod.images]
    });
    setImageUrl('');
    setImageError('');
    setShowModal(true);
  };

  const addImage = (src: string) => {
    const trimmed = src.trim();
    if (!trimmed) return;
    if (form.images.length >= MAX_IMAGES) {
      setImageError(`Máximo de ${MAX_IMAGES} imagens por produto.`);
      return;
    }
    if (form.images.includes(trimmed)) {
      setImageError('Esta imagem já está na galeria.');
      return;
    }
    setForm((f) => ({ ...f, images: [...f.images, trimmed] }));
    setImageError('');
  };

  const removeImage = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const setPrimaryImage = (index: number) => {
    setForm((f) => {
      if (index <= 0) return f;
      const next = [...f.images];
      const [picked] = next.splice(index, 1);
      next.unshift(picked);
      return { ...f, images: next };
    });
  };

  const handleAddUrl = () => {
    try {
      const u = new URL(imageUrl.trim());
      if (!['http:', 'https:'].includes(u.protocol) && !imageUrl.startsWith('/')) {
        setImageError('Use URL http(s) ou caminho local /images/...');
        return;
      }
    } catch {
      if (!imageUrl.trim().startsWith('/')) {
        setImageError('URL inválida. Ex: https://... ou /images/arquivo.jpg');
        return;
      }
    }
    addImage(imageUrl);
    setImageUrl('');
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setImageError('');
    try {
      for (const file of Array.from(files)) {
        if (form.images.length >= MAX_IMAGES) break;
        const dataUrl = await fileToCompressedDataUrl(file);
        addImage(dataUrl);
      }
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Falha no upload.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(form.price.replace(',', '.')) || 0;
    const originalPrice = form.originalPrice
      ? parseFloat(form.originalPrice.replace(',', '.'))
      : undefined;
    const images =
      form.images.length > 0 ? form.images : ['/images/wisdom_classic_black.jpg'];

    if (mode === 'edit' && form.id) {
      const next = productList.map((p) =>
        p.id === form.id
          ? {
              ...p,
              name: form.name,
              subtitle: form.subtitle || p.subtitle,
              price,
              originalPrice,
              description: form.description,
              fabric: form.fabric || p.fabric,
              slug: slugify(form.name) || p.slug,
              active: form.active,
              images,
              updatedAt: new Date().toISOString()
            }
          : p
      );
      persist(next);
      setShowModal(false);
      return;
    }

    const created = toAdminProduct(
      {
        id: `prod-${Date.now()}`,
        slug: slugify(form.name) || `produto-${Date.now()}`,
        name: form.name,
        subtitle: form.subtitle || 'Linha Premium Wisdom',
        price,
        originalPrice,
        description: form.description,
        details: ['Caimento perfeito', 'Algodão egípcio nobre', 'Lavagem pré-encolhida'],
        fabric: form.fabric || '100% Algodão Pima / Modal',
        care: ['Lavar com cores semelhantes', 'Não secar em tambor'],
        colors: [{ name: 'Preto Profundo', hex: '#111111' }],
        sizes: ['P', 'M', 'G', 'GG'],
        images,
        isNew: true
      },
      form.active
    );

    persist([created, ...productList]);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const prod = productList.find((p) => p.id === id);
    if (!prod) return;
    if (!confirm(`Excluir permanentemente "${prod.name}"?`)) return;
    persist(productList.filter((p) => p.id !== id));
  };

  const toggleActive = (id: string) => {
    persist(
      productList.map((p) =>
        p.id === id
          ? { ...p, active: !p.active, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const resetCatalog = () => {
    if (!confirm('Restaurar o catálogo MVP original? Alterações locais serão perdidas.')) return;
    persist(PRODUCTS.map((p) => toAdminProduct(p)));
  };

  if (!mounted) {
    return (
      <div style={{ backgroundColor: '#F5F3EE', minHeight: '100vh', padding: '48px' }}>
        <p style={{ color: '#767676' }}>Carregando catálogo...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F5F3EE', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <Link
              href="/admin"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#767676',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '8px'
              }}
            >
              <ArrowLeft size={14} /> VOLTAR AO DASHBOARD
            </Link>
            <h1 style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', color: '#111111' }}>
              Gestão de Produtos — CRUD
            </h1>
            <p style={{ fontSize: '13px', color: '#767676', marginTop: '6px', maxWidth: '560px' }}>
              Inclui galeria de imagens (upload, URL, várias fotos, capa).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button type="button" onClick={resetCatalog} className="btn btn-secondary" style={{ gap: '8px' }}>
              <RotateCcw size={14} /> RESTAURAR MVP
            </button>
            <button type="button" onClick={openCreate} className="btn btn-gold" style={{ gap: '8px' }}>
              <Plus size={16} /> CADASTRAR PRODUTO
            </button>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#111111',
            color: '#F5F3EE',
            padding: '12px 16px',
            fontSize: '12px',
            marginBottom: '16px'
          }}
        >
          Imagens ficam no catálogo admin (localStorage). A vitrine pública ainda lê{' '}
          <code style={{ color: '#C6A85A' }}>src/data/products.ts</code> até o Prisma/CDN.
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #eaeaea', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: '#111111',
                  color: '#C6A85A',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                <th style={{ padding: '16px' }}>Produto</th>
                <th style={{ padding: '16px' }}>Fotos</th>
                <th style={{ padding: '16px' }}>Preço</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((prod) => (
                <tr key={prod.id} style={{ borderBottom: '1px solid #eaeaea' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={prod.images[0]}
                        alt=""
                        style={{ width: '48px', height: '60px', objectFit: 'cover', background: '#f5f5f5' }}
                      />
                      <div>
                        <strong style={{ color: '#111111', display: 'block' }}>{prod.name}</strong>
                        <span style={{ fontSize: '12px', color: '#767676' }}>{prod.subtitle}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '13px', color: '#767676' }}>
                    {prod.images.length} foto{prod.images.length === 1 ? '' : 's'}
                  </td>
                  <td style={{ padding: '16px', fontWeight: 600 }}>
                    R$ {prod.price.toFixed(2).replace('.', ',')}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span
                      style={{
                        backgroundColor: prod.active ? '#e8f5e9' : '#fbe9e7',
                        color: prod.active ? '#2E7D32' : '#C62828',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 8px'
                      }}
                    >
                      {prod.active ? 'ATIVO' : 'INATIVO'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => toggleActive(prod.id)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '11px', gap: '4px' }}
                      >
                        {prod.active ? <EyeOff size={12} /> : <Eye size={12} />}
                        {prod.active ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(prod)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '11px', gap: '4px' }}
                      >
                        <Edit2 size={12} /> Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(prod.id)}
                        className="btn btn-secondary"
                        style={{
                          padding: '6px 10px',
                          fontSize: '11px',
                          gap: '4px',
                          color: '#C62828',
                          borderColor: '#ffcdd2'
                        }}
                      >
                        <Trash2 size={12} /> Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              maxWidth: '640px',
              width: '100%',
              padding: '32px',
              position: 'relative',
              maxHeight: '92vh',
              overflowY: 'auto'
            }}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
            <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-heading)', marginBottom: '20px' }}>
              {mode === 'edit' ? 'Editar produto' : 'Cadastrar novo produto'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nome do modelo</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subtítulo</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Preço de venda (R$)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    className="form-input"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Preço original (opcional)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Composição do tecido</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={form.fabric}
                  onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea
                  required
                  className="form-input"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Galeria de imagens */}
              <div
                style={{
                  border: '1px solid #eaeaea',
                  padding: '16px',
                  marginBottom: '20px',
                  backgroundColor: '#F5F3EE'
                }}
              >
                <label className="form-label" style={{ marginBottom: '10px' }}>
                  Imagens do produto ({form.images.length}/{MAX_IMAGES})
                </label>
                <p style={{ fontSize: '12px', color: '#767676', marginBottom: '12px' }}>
                  A primeira foto é a capa. Você pode subir arquivos, colar URL ou usar caminho
                  `/images/...`.
                </p>

                {form.images.length > 0 && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
                      gap: '10px',
                      marginBottom: '14px'
                    }}
                  >
                    {form.images.map((src, index) => (
                      <div
                        key={`${src.slice(0, 40)}-${index}`}
                        style={{
                          position: 'relative',
                          border: index === 0 ? '2px solid #C6A85A' : '1px solid #eaeaea',
                          background: '#fff'
                        }}
                      >
                        <img
                          src={src}
                          alt=""
                          style={{ width: '100%', height: '110px', objectFit: 'cover', display: 'block' }}
                        />
                        {index === 0 && (
                          <span
                            style={{
                              position: 'absolute',
                              left: 4,
                              bottom: 4,
                              background: '#C6A85A',
                              color: '#111',
                              fontSize: '9px',
                              fontWeight: 700,
                              padding: '2px 5px'
                            }}
                          >
                            CAPA
                          </span>
                        )}
                        <div
                          style={{
                            display: 'flex',
                            gap: '4px',
                            padding: '6px',
                            justifyContent: 'center'
                          }}
                        >
                          {index > 0 && (
                            <button
                              type="button"
                              title="Definir como capa"
                              onClick={() => setPrimaryImage(index)}
                              style={{
                                border: 'none',
                                background: '#111',
                                color: '#C6A85A',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex'
                              }}
                            >
                              <Star size={12} />
                            </button>
                          )}
                          <button
                            type="button"
                            title="Remover"
                            onClick={() => removeImage(index)}
                            style={{
                              border: 'none',
                              background: '#fff',
                              color: '#C62828',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                              borderTop: '1px solid #eee'
                            }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="URL ou /images/arquivo.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={{ flex: '1 1 200px', marginBottom: 0 }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleAddUrl}
                    style={{ gap: '6px', padding: '10px 14px' }}
                  >
                    <Link2 size={14} /> URL
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                    style={{ gap: '6px', padding: '10px 14px' }}
                  >
                    <Upload size={14} /> {uploading ? '...' : 'UPLOAD'}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    hidden
                    onChange={(e) => handleUpload(e.target.files)}
                  />
                </div>
                {imageError && (
                  <p style={{ fontSize: '12px', color: '#C62828', margin: 0 }}>{imageError}</p>
                )}
              </div>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  marginBottom: '20px',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
                Ativo no catálogo admin
              </label>

              <button type="submit" className="btn btn-gold btn-full">
                {mode === 'edit' ? 'SALVAR ALTERAÇÕES' : 'CRIAR PRODUTO'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
