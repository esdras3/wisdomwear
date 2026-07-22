'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<'P' | 'M' | 'G' | 'GG'>('M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, selectedColor, selectedSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #eaeaea',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
      className="product-card"
    >
      {/* Badges */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, display: 'flex', gap: '6px' }}>
        {product.isBestSeller && <span className="badge-gold">MAIS VENDIDO</span>}
        {product.isNew && (
          <span
            style={{
              backgroundColor: '#111111',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 600,
              padding: '4px 8px',
              textTransform: 'uppercase'
            }}
          >
            LANÇAMENTO
          </span>
        )}
      </div>

      {/* Product Image Link */}
      <Link href={`/produto/${product.slug}`} style={{ overflow: 'hidden', backgroundColor: '#f9f9f9', display: 'block' }}>
        <div style={{ width: '100%', paddingTop: '125%', position: 'relative' }}>
          {/* eslint-disable-next-html-loader */}
          <img
            src={product.images[0]}
            alt={product.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease'
            }}
          />
        </div>
      </Link>

      {/* Product Info */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <span style={{ fontSize: '11px', color: '#767676', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
          {product.subtitle}
        </span>

        <Link href={`/produto/${product.slug}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontSize: '18px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              color: '#111111',
              marginBottom: '10px'
            }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
          <span style={{ fontSize: '18px', fontWeight: 600, color: '#111111' }}>
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          {product.originalPrice && (
            <span style={{ fontSize: '14px', color: '#767676', textDecoration: 'line-through' }}>
              R$ {product.originalPrice.toFixed(2).replace('.', ',')}
            </span>
          )}
          <span style={{ fontSize: '11px', color: '#C6A85A', fontWeight: 600, marginLeft: 'auto' }}>
            ou 3x R$ {(product.price / 3).toFixed(2).replace('.', ',')}
          </span>
        </div>

        {/* Size Selector */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px', fontWeight: 600, color: '#767676' }}>
            <span>TAMANHO:</span>
            <span style={{ color: '#111111' }}>{selectedSize}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  flex: 1,
                  padding: '6px 0',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: selectedSize === size ? '1px solid #111111' : '1px solid #eaeaea',
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

        {/* Color Swatches */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#767676' }}>COR:</span>
          {product.colors.map((color) => (
            <button
              key={color.hex}
              onClick={() => setSelectedColor(color)}
              title={color.name}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: color.hex,
                border: selectedColor.hex === color.hex ? '2px solid #C6A85A' : '1px solid #ccc',
                cursor: 'pointer',
                padding: 0
              }}
            />
          ))}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={added ? 'btn btn-gold btn-full' : 'btn btn-primary btn-full'}
          style={{ marginTop: 'auto', gap: '8px' }}
        >
          {added ? (
            <>
              <Check size={16} /> ADICIONADO AO CARRINHO
            </>
          ) : (
            <>
              <ShoppingBag size={16} /> ADICIONAR AO CARRINHO
            </>
          )}
        </button>
      </div>
    </div>
  );
}
