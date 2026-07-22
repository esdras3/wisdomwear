'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
  const { toggleCart, getItemCount } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const itemCount = mounted ? getItemCount() : 0;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.96)' : '#ffffff',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        borderBottom: '1px solid #eaeaea',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Top Banner de Frete Grátis */}
      <div
        style={{
          backgroundColor: '#111111',
          color: '#C6A85A',
          textAlign: 'center',
          padding: '6px 16px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}
      >
        Frete Grátis para todo o Brasil em compras acima de R$ 299 | Parcelamento em até 6x no Cartão ou Pix
      </div>

      <div className="container" style={{ height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          aria-label="Abrir Menu"
          className="mobile-only-btn"
        >
          {isMobileMenuOpen ? <X size={22} color="#111111" /> : <Menu size={22} color="#111111" />}
        </button>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-nav">
          <Link
            href="/"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#111111',
              transition: 'color 0.2s ease'
            }}
          >
            COLEÇÃO
          </Link>
          <Link
            href="#conceito"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#111111',
              transition: 'color 0.2s ease'
            }}
          >
            CONCEITO
          </Link>
          <Link
            href="#sobre"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#111111',
              transition: 'color 0.2s ease'
            }}
          >
            SOBRE A MARCA
          </Link>
        </nav>

        {/* Center Logo */}
        <Link href="/" style={{ textDecoration: 'none', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '26px',
                fontWeight: 700,
                color: '#C6A85A',
                letterSpacing: '0.15em',
                lineHeight: 1.1,
                textTransform: 'uppercase'
              }}
            >
              WISDOM
            </span>
            <span
              style={{
                fontSize: '9px',
                fontWeight: 600,
                color: '#111111',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginTop: '2px'
              }}
            >
              WEAR
            </span>
          </div>
        </Link>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111111' }}
            aria-label="Buscar"
          >
            <Search size={20} />
          </button>

          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111111' }}
            aria-label="Minha Conta"
          >
            <User size={20} />
          </button>

          {/* Cart Trigger */}
          <button
            onClick={toggleCart}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#111111',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
            aria-label="Ver Carrinho"
          >
            <ShoppingBag size={22} color="#111111" />
            {itemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-8px',
                  backgroundColor: '#C6A85A',
                  color: '#111111',
                  fontSize: '10px',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #eaeaea',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            COLEÇÃO
          </Link>
          <Link
            href="#conceito"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            CONCEITO
          </Link>
          <Link
            href="#sobre"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            SOBRE A MARCA
          </Link>
        </div>
      )}
    </header>
  );
}
