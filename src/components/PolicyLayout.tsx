import Link from 'next/link';
import type { ReactNode } from 'react';

export function PolicyLayout({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main style={{ backgroundColor: '#F5F3EE', minHeight: '70vh', padding: '64px 0 80px' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <p
          style={{
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#C6A85A',
            fontWeight: 600,
            marginBottom: '12px'
          }}
        >
          Wisdom Wear
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px, 4vw, 40px)',
            color: '#111111',
            marginBottom: '28px',
            lineHeight: 1.2
          }}
        >
          {title}
        </h1>
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #eaeaea',
            padding: '32px 28px',
            fontSize: '14px',
            lineHeight: 1.75,
            color: '#333333'
          }}
        >
          {children}
        </div>
        <p style={{ marginTop: '28px', fontSize: '13px' }}>
          <Link href="/" style={{ color: '#111111', textDecoration: 'underline' }}>
            Voltar à coleção
          </Link>
        </p>
      </div>
    </main>
  );
}
