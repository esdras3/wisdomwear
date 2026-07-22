'use client';

import React from 'react';
import { ShieldCheck, Sparkles, Feather, RefreshCw } from 'lucide-react';

export default function ConceptSection() {
  return (
    <section
      id="conceito"
      style={{
        backgroundColor: '#F5F3EE',
        padding: '100px 24px',
        borderTop: '1px solid #EAEAEA',
        borderBottom: '1px solid #EAEAEA'
      }}
    >
      <div className="container" style={{ textAlign: 'center', maxWidth: '840px' }}>
        {/* Decorative Symbol Accent */}
        <div style={{ display: 'inline-block', marginBottom: '20px' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '32px',
              color: '#C6A85A',
              fontWeight: 700
            }}
          >
            W / E
          </span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontFamily: 'var(--font-heading)',
            color: '#111111',
            marginBottom: '28px',
            lineHeight: 1.2
          }}
        >
          &quot;Não é apenas roupa.&quot;
        </h2>

        <p
          style={{
            fontSize: 'clamp(16px, 2.2vw, 20px)',
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            color: '#333333',
            lineHeight: 1.8,
            marginBottom: '48px'
          }}
        >
          Wisdom é presença. É identidade sem excesso.<br />
          É estilo que fala baixo e impacta alto.
        </p>

        {/* 4 Core Value Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '32px',
            textAlign: 'center',
            marginTop: '60px'
          }}
        >
          <div style={{ padding: '20px' }}>
            <Feather size={28} color="#C6A85A" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Toque de Seda
            </h3>
            <p style={{ fontSize: '13px', color: '#767676', lineHeight: 1.5 }}>
              Algodão egípcio e modal extra macio para conforto imediato.
            </p>
          </div>

          <div style={{ padding: '20px' }}>
            <Sparkles size={28} color="#C6A85A" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Silêncio Sofisticado
            </h3>
            <p style={{ fontSize: '13px', color: '#767676', lineHeight: 1.5 }}>
              Sem estampas estridentes. O minimalismo que impõe presença.
            </p>
          </div>

          <div style={{ padding: '20px' }}>
            <RefreshCw size={28} color="#C6A85A" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Anti-Desbotamento
            </h3>
            <p style={{ fontSize: '13px', color: '#767676', lineHeight: 1.5 }}>
              Preto Profundo e Off-White que mantêm a vivacidade lavagem após lavagem.
            </p>
          </div>

          <div style={{ padding: '20px' }}>
            <ShieldCheck size={28} color="#C6A85A" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Garantia de Troca
            </h3>
            <p style={{ fontSize: '13px', color: '#767676', lineHeight: 1.5 }}>
              Primeira troca grátis em até 30 dias com devolução descomplica.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
