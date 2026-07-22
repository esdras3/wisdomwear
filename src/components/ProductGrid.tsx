'use client';

import React from 'react';
import { PRODUCTS } from '@/data/products';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  return (
    <section id="produtos" style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#C6A85A',
              letterSpacing: '0.25em',
              textTransform: 'uppercase'
            }}
          >
            COLEÇÃO ESSENCIAL
          </span>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 36px)',
              fontFamily: 'var(--font-heading)',
              color: '#111111',
              marginTop: '8px'
            }}
          >
            Peças em Destaque
          </h2>
          <p style={{ fontSize: '14px', color: '#767676', marginTop: '8px' }}>
            Grade limpa. Algodão nobre de fibra extra longa. Modelagem atemporal.
          </p>
        </div>

        <div className="grid-products">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
