'use client';

import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        height: '82vh',
        minHeight: '520px',
        backgroundColor: '#111111',
        backgroundImage: 'linear-gradient(180deg, rgba(17, 17, 17, 0.4) 0%, rgba(17, 17, 17, 0.85) 100%), url("/images/wisdom_hero.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#ffffff',
        padding: '0 24px'
      }}
    >
      <div style={{ maxWidth: '800px', zIndex: 2 }} className="animate-fade-in">
        {/* Subtitle tag */}
        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#C6A85A',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}
        >
          LIFESTYLE PREMIUM • COLEÇÃO AUTORAL
        </div>

        {/* Main Brand Slogan */}
        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '24px',
            color: '#ffffff'
          }}
        >
          Vista sua presença.
        </h1>

        {/* Short Manifesto excerpt */}
        <p
          style={{
            fontSize: 'clamp(14px, 2vw, 17px)',
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: 1.7,
            maxWidth: '600px',
            margin: '0 auto 36px auto'
          }}
        >
          Identidade sem excesso. Estilo que fala baixo e impacta alto. Algodão egípcio e modal de alta gramatura para quem busca elegância atemporal.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="#produtos" className="btn btn-gold">
            EXPLORAR COLEÇÃO
          </Link>

          <Link href="#conceito" className="btn btn-secondary" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}>
            O CONCEITO WISDOM
          </Link>
        </div>
      </div>
    </section>
  );
}
