'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

const STORAGE_KEY = 'wisdom_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (value: 'accepted' | 'rejected') => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
      localStorage.setItem(`${STORAGE_KEY}_at`, new Date().toISOString());
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1200,
        padding: '16px',
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          border: '1px solid #eaeaea',
          boxShadow: '0 -8px 40px rgba(17, 17, 17, 0.12)',
          padding: '20px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'auto'
        }}
      >
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}
          >
            <Shield size={16} color="#C6A85A" />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#C6A85A'
              }}
            >
              Nós valorizamos sua privacidade
            </span>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.65, color: '#333333', margin: 0 }}>
            Utilizamos cookies essenciais e, com seu consentimento, cookies de desempenho para
            melhorar a experiência de compra, em conformidade com a LGPD. Ao continuar, você
            concorda com essas diretrizes. Consulte nossa{' '}
            <Link href="/privacidade" style={{ color: '#111111', textDecoration: 'underline' }}>
              Política de Privacidade
            </Link>{' '}
            e a{' '}
            <Link href="/cookies" style={{ color: '#111111', textDecoration: 'underline' }}>
              Política de Cookies
            </Link>
            .
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => save('rejected')}
            className="btn btn-secondary"
            style={{ padding: '12px 18px', fontSize: '11px' }}
          >
            RECUSAR
          </button>
          <button
            type="button"
            onClick={() => save('accepted')}
            className="btn btn-primary"
            style={{ padding: '12px 18px', fontSize: '11px' }}
          >
            ACEITAR TUDO
          </button>
        </div>
      </div>
    </div>
  );
}
