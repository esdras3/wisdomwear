'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, MessageCircle, ShieldCheck, CreditCard, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#111111', color: '#ffffff', paddingTop: '80px', paddingBottom: '40px' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '48px',
            marginBottom: '60px'
          }}
        >
          {/* Brand Info */}
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '24px',
                fontWeight: 700,
                color: '#C6A85A',
                letterSpacing: '0.15em',
                display: 'block',
                marginBottom: '16px'
              }}
            >
              WISDOM WEAR
            </span>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.7, marginBottom: '20px' }}>
              Marca Lifestyle Premium focada no conceito de luxo moderno e silencioso. Peças atemporais desenvolvidas com tecidos nobres para vestir sua presença.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#C6A85A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}
              >
                <Camera size={18} /> @wisdomwear
              </a>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#C6A85A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}
              >
                <MessageCircle size={18} /> Atendimento WhatsApp
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C6A85A', marginBottom: '20px' }}>
              NAVEGAÇÃO
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
              <li>
                <Link href="#produtos" style={{ color: 'inherit', textDecoration: 'none' }}>Coleção de Camisetas</Link>
              </li>
              <li>
                <Link href="#conceito" style={{ color: 'inherit', textDecoration: 'none' }}>Manifesto Wisdom</Link>
              </li>
              <li>
                <Link href="#sobre" style={{ color: 'inherit', textDecoration: 'none' }}>Sobre a Marca</Link>
              </li>
              <li>
                <Link href="/guia-tamanhos" style={{ color: 'inherit', textDecoration: 'none' }}>Guia de Medidas</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C6A85A', marginBottom: '20px' }}>
              SUPORTE E POLÍTICAS
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
              <li>
                <a href="#politicas" style={{ color: 'inherit', textDecoration: 'none' }}>Trocas e Devoluções Grátis</a>
              </li>
              <li>
                <a href="#frete" style={{ color: 'inherit', textDecoration: 'none' }}>Envio e Entrega</a>
              </li>
              <li>
                <a href="#privacidade" style={{ color: 'inherit', textDecoration: 'none' }}>Política de Privacidade</a>
              </li>
              <li>
                <a href="#termos" style={{ color: 'inherit', textDecoration: 'none' }}>Termos de Serviço</a>
              </li>
            </ul>
          </div>

          {/* Payment Badges & Asaas Security */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C6A85A', marginBottom: '20px' }}>
              PAGAMENTO SEGURO (ASAAS)
            </h4>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', lineHeight: 1.5 }}>
              Processamento transparente via Subconta Asaas com criptografia de 256 bits.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <span style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', padding: '6px 12px', fontSize: '11px', fontWeight: 600, color: '#C6A85A' }}>
                PIX INSTANTÂNEO
              </span>
              <span style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', padding: '6px 12px', fontSize: '11px', fontWeight: 600, color: '#ffffff' }}>
                CARTÃO ATÉ 6X
              </span>
              <span style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', padding: '6px 12px', fontSize: '11px', fontWeight: 600, color: '#ffffff' }}>
                BOLETO
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#2E7D32' }}>
              <Lock size={14} /> Checkout 100% Criptografado SSL
            </div>
          </div>
        </div>

        {/* Bottom Rights */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)'
          }}
        >
          <p>© {new Date().getFullYear()} WISDOM WEAR (`wisdomwear.com.br`). Todos os direitos reservados.</p>
          <p>Desenvolvido para e-commerce D2C com integração Asaas API v3.</p>
        </div>
      </div>
    </footer>
  );
}
