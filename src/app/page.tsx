'use client';

import React from 'react';
import HeroSection from '@/components/HeroSection';
import ConceptSection from '@/components/ConceptSection';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';
import { ArrowRight, Shield, Award, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* 1. Hero Banner */}
      <HeroSection />

      {/* 2. Seção Conceito / Manifesto ("Não é apenas roupa.") */}
      <ConceptSection />

      {/* 3. Produtos em Destaque (Grade MVP de 2 a 3 camisetas) */}
      <ProductGrid />

      {/* 4. Seção História & Manifesto da Marca */}
      <section
        id="sobre"
        style={{
          padding: '100px 0',
          backgroundColor: '#111111',
          color: '#ffffff',
          position: 'relative'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '60px',
              alignItems: 'center'
            }}
          >
            {/* Editorial Image */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '120%', overflow: 'hidden' }}>
              {/* eslint-disable-next-html-loader */}
              <img
                src="/images/wisdom_hero.jpg"
                alt="Wisdom Wear Lifestyle"
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

            {/* Content */}
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#C6A85A',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '16px'
                }}
              >
                NOSSAS RAÍZES
              </span>

              <h2
                style={{
                  fontSize: 'clamp(32px, 4vw, 44px)',
                  fontFamily: 'var(--font-heading)',
                  color: '#ffffff',
                  marginBottom: '24px',
                  lineHeight: 1.2
                }}
              >
                A busca incessante pelo básico perfeito.
              </h2>

              <p
                style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.8,
                  marginBottom: '20px'
                }}
              >
                A Wisdom nasceu da inquietude contra o excesso de ruído visual do mercado moderno. Acreditamos que a verdadeira elegância não necessita de grandes estampas ou marcas ostensivas. Ela se manifesta no corte impecável, na nobreza do tecido e na confiança de quem veste.
              </p>

              <p
                style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.8,
                  marginBottom: '36px'
                }}
              >
                Cada camiseta Wisdom é concebida com fio duplo de algodão egípcio e modal, proporcionando uma experiência tátil inigualável, regulação térmica natural e presença marcante em qualquer ocasião.
              </p>

              <Link href="#produtos" className="btn btn-gold" style={{ gap: '10px' }}>
                CONHEÇA OS MODELOS <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Seção de Confiança e Atendimento */}
      <section style={{ padding: '60px 0', backgroundColor: '#F5F3EE', borderTop: '1px solid #EAEAEA' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '30px',
              textAlign: 'center'
            }}
          >
            <div style={{ padding: '16px' }}>
              <Award size={24} color="#C6A85A" style={{ marginBottom: '10px' }} />
              <h4 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Tecido Premium Certificado
              </h4>
              <p style={{ fontSize: '12px', color: '#767676', marginTop: '4px' }}>
                Fibras nobres e de alta sustentabilidade ambiental.
              </p>
            </div>

            <div style={{ padding: '16px' }}>
              <Shield size={24} color="#C6A85A" style={{ marginBottom: '10px' }} />
              <h4 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Pagamento Asaas Criptografado
              </h4>
              <p style={{ fontSize: '12px', color: '#767676', marginTop: '4px' }}>
                Pix instantâneo, Cartão de Crédito ou Boleto.
              </p>
            </div>

            <div style={{ padding: '16px' }}>
              <Sparkles size={24} color="#C6A85A" style={{ marginBottom: '10px' }} />
              <h4 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Envio Express Nacional
              </h4>
              <p style={{ fontSize: '12px', color: '#767676', marginTop: '4px' }}>
                Rastreamento em tempo real do seu pedido.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
