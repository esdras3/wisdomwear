'use client';

import React, { useState, use } from 'react';
import { PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, Check, ShieldCheck, Truck, ArrowLeft, Ruler } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const product = PRODUCTS.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const { addItem } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<'P' | 'M' | 'G' | 'GG'>('M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [added, setAdded] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);

  const handleAddToCart = () => {
    addItem(product, selectedColor, selectedSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh', padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: '30px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#767676',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} /> VOLTAR PARA A COLEÇÃO
          </Link>
        </div>

        {/* Product Layout Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '48px',
            alignItems: 'start'
          }}
        >
          {/* Gallery Column */}
          <div>
            <div style={{ position: 'relative', width: '100%', paddingTop: '125%', backgroundColor: '#f9f9f9', marginBottom: '16px' }}>
              <img
                src={selectedImage}
                alt={product.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '70px',
                      height: '90px',
                      padding: 0,
                      border: selectedImage === img ? '2px solid #C6A85A' : '1px solid #eaeaea',
                      cursor: 'pointer',
                      overflow: 'hidden'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#C6A85A',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              {product.subtitle}
            </span>

            <h1
              style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                color: '#111111',
                marginBottom: '16px',
                lineHeight: 1.2
              }}
            >
              {product.name}
            </h1>

            {/* Price Box */}
            <div style={{ padding: '16px', backgroundColor: '#F5F3EE', marginBottom: '24px', display: 'flex', alignItems: 'baseline', gap: '16px' }}>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              <span style={{ fontSize: '13px', color: '#767676' }}>
                em até <strong>6x de R$ {(product.price / 6).toFixed(2).replace('.', ',')}</strong> sem juros no cartão
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '15px', color: '#333333', lineHeight: 1.8, marginBottom: '28px' }}>
              {product.description}
            </p>

            {/* Color Swatches */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', color: '#111111' }}>
                COR SELECIONADA: <span style={{ color: '#C6A85A' }}>{selectedColor.name}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {product.colors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: color.hex,
                      border: selectedColor.hex === color.hex ? '2px solid #C6A85A' : '1px solid #ccc',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#111111' }}>
                  SELECIONE O TAMANHO: <strong>{selectedSize}</strong>
                </span>
                <button
                  onClick={() => setShowSizeModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '12px',
                    color: '#C6A85A',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Ruler size={14} /> Guia de Medidas
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '14px 0',
                      fontSize: '14px',
                      fontWeight: 600,
                      border: selectedSize === size ? '2px solid #111111' : '1px solid #eaeaea',
                      backgroundColor: selectedSize === size ? '#111111' : '#ffffff',
                      color: selectedSize === size ? '#ffffff' : '#111111',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              className={added ? 'btn btn-gold btn-full' : 'btn btn-primary btn-full'}
              style={{ padding: '18px 0', fontSize: '14px', marginBottom: '28px', gap: '10px' }}
            >
              {added ? (
                <>
                  <Check size={18} /> ADICIONADO AO CARRINHO
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> COMPRAR AGORA
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div style={{ borderTop: '1px solid #eaeaea', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#767676' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={18} color="#C6A85A" />
                <span>Frete Grátis para todo o Brasil em compras acima de R$ 299</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={18} color="#C6A85A" />
                <span>Primeira Troca Grátis sem complicações em até 30 dias</span>
              </div>
            </div>

            {/* Product Details Specs */}
            <div style={{ marginTop: '36px', borderTop: '1px solid #eaeaea', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Especificações de Luxo</h3>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '14px', color: '#333333', lineHeight: 1.8 }}>
                <li><strong>Composição:</strong> {product.fabric}</li>
                {product.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div style={{ backgroundColor: '#ffffff', maxWidth: '500px', width: '100%', padding: '32px', position: 'relative' }}>
            <button
              onClick={() => setShowSizeModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ✕
            </button>
            <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>Guia de Medidas (cm)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F5F3EE', borderBottom: '1px solid #ccc' }}>
                  <th style={{ padding: '10px' }}>Tamanho</th>
                  <th style={{ padding: '10px' }}>Tórax</th>
                  <th style={{ padding: '10px' }}>Comprimento</th>
                  <th style={{ padding: '10px' }}>Manga</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #eaeaea' }}>
                  <td style={{ padding: '10px', fontWeight: 600 }}>P</td>
                  <td>94-98</td>
                  <td>70</td>
                  <td>20</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eaeaea' }}>
                  <td style={{ padding: '10px', fontWeight: 600 }}>M</td>
                  <td>99-104</td>
                  <td>72</td>
                  <td>21</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eaeaea' }}>
                  <td style={{ padding: '10px', fontWeight: 600 }}>G</td>
                  <td>105-110</td>
                  <td>74</td>
                  <td>22</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', fontWeight: 600 }}>GG</td>
                  <td>111-118</td>
                  <td>76</td>
                  <td>23</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
