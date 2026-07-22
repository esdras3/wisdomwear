'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { ArrowLeft, Plus, Edit2, Check, Package, Image as ImageIcon } from 'lucide-react';

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    subtitle: '',
    price: '',
    originalPrice: '',
    description: '',
    fabric: '',
    sizes: ['P', 'M', 'G', 'GG']
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: `prod-00${productList.length + 1}`,
      slug: newProduct.name.toLowerCase().replace(/\s+/g, '-'),
      name: newProduct.name,
      subtitle: newProduct.subtitle || 'Linha Premium Wisdom',
      price: parseFloat(newProduct.price) || 189.0,
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
      description: newProduct.description,
      details: ['Caimento perfeito', 'Algodão egípcio nobre', 'Lavagem pré-encolhida'],
      fabric: newProduct.fabric || '100% Algodão Pima / Modal',
      care: ['Lavar com cores semelhantes', 'Não secar em tambor'],
      colors: [{ name: 'Preto Profundo', hex: '#111111' }],
      sizes: ['P', 'M', 'G', 'GG'],
      images: ['/images/wisdom_classic_black.jpg'],
      isNew: true
    };

    setProductList([created, ...productList]);
    setShowModal(false);
    alert('Produto adicionado ao catálogo com sucesso!');
  };

  return (
    <div style={{ backgroundColor: '#F5F3EE', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <Link href="/admin" style={{ fontSize: '12px', fontWeight: 600, color: '#767676', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
              <ArrowLeft size={14} /> VOLTAR AO DASHBOARD
            </Link>
            <h1 style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', color: '#111111' }}>
              Gestão de Produtos & Catálogo MVP
            </h1>
          </div>

          <button onClick={() => setShowModal(true)} className="btn btn-gold" style={{ gap: '8px' }}>
            <Plus size={16} /> CADASTRAR NOVO PRODUTO
          </button>
        </div>

        {/* Tabela de Produtos */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #eaeaea', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#111111', color: '#C6A85A', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <th style={{ padding: '16px' }}>Produto</th>
                <th style={{ padding: '16px' }}>Preço Venda</th>
                <th style={{ padding: '16px' }}>Tecido</th>
                <th style={{ padding: '16px' }}>Tamanhos</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((prod) => (
                <tr key={prod.id} style={{ borderBottom: '1px solid #eaeaea' }}>
                  <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img src={prod.images[0]} alt="" style={{ width: '48px', height: '60px', objectFit: 'cover' }} />
                    <div>
                      <strong style={{ color: '#111111', display: 'block' }}>{prod.name}</strong>
                      <span style={{ fontSize: '12px', color: '#767676' }}>{prod.subtitle}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontWeight: 600, color: '#111111' }}>
                    R$ {prod.price.toFixed(2).replace('.', ',')}
                    {prod.originalPrice && (
                      <span style={{ fontSize: '11px', color: '#767676', textDecoration: 'line-through', marginLeft: '6px' }}>
                        R$ {prod.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px', fontSize: '13px', color: '#767676' }}>{prod.fabric}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {prod.sizes.map((s) => (
                        <span key={s} style={{ backgroundColor: '#F5F3EE', padding: '2px 6px', fontSize: '11px', fontWeight: 600 }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ backgroundColor: '#e8f5e9', color: '#2E7D32', fontSize: '11px', fontWeight: 700, padding: '4px 8px' }}>
                      ATIVO NA LOJA
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>
                      <Edit2 size={12} /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', maxWidth: '560px', width: '100%', padding: '32px', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
              ✕
            </button>
            <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-heading)', marginBottom: '20px' }}>Cadastrar Novo Modelo de Camiseta</h2>

            <form onSubmit={handleCreateProduct}>
              <div className="form-group">
                <label className="form-label">Nome do Modelo</label>
                <input type="text" required className="form-input" placeholder="Wisdom Executive Navy" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Preço de Venda (R$)</label>
                  <input type="number" required step="0.01" className="form-input" placeholder="189.00" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Preço Original (Opcional)</label>
                  <input type="number" step="0.01" className="form-input" placeholder="229.00" value={newProduct.originalPrice} onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Composição do Tecido</label>
                <input type="text" required className="form-input" placeholder="50% Algodão Egípcio + 50% Modal" value={newProduct.fabric} onChange={(e) => setNewProduct({ ...newProduct, fabric: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição do Conceito</label>
                <textarea required className="form-input" rows={3} placeholder="Descrição sofisticada da peça..." value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
              </div>

              <button type="submit" className="btn btn-gold btn-full">SALVAR E PUBLICAR NA LOJA</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
