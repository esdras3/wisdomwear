'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Credenciais inválidas.');
      }
    } catch (err) {
      console.error('Erro de login:', err);
      setError('Erro de conexão ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#111111',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          maxWidth: '420px',
          width: '100%',
          padding: '40px',
          boxShadow: 'var(--shadow-modal)',
          textAlign: 'center'
        }}
      >
        {/* Logo Symbol */}
        <img
          src="/images/wisdom_symbol.png"
          alt="Wisdom"
          style={{ height: '48px', margin: '0 auto 16px auto', display: 'block' }}
        />

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '24px',
            color: '#111111',
            marginBottom: '6px'
          }}
        >
          Área Administrativa
        </h1>
        <p style={{ fontSize: '13px', color: '#767676', marginBottom: '28px' }}>
          Digite suas credenciais para acessar o painel Wisdom Wear.
        </p>

        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#C62828', padding: '10px', fontSize: '12px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">E-mail Administrativo</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="form-input"
                placeholder="admin@wisdomwear.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
              <Mail size={16} color="#767676" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
              <Lock size={16} color="#767676" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold btn-full"
            style={{ padding: '16px 0', fontSize: '13px', marginTop: '12px', gap: '8px' }}
          >
            {loading ? 'AUTENTICANDO...' : 'ENTRAR NO PAINEL'} <ArrowRight size={16} />
          </button>
        </form>

        {/* Credentials Hint */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #eaeaea', fontSize: '11px', color: '#767676', lineHeight: 1.6 }}>
          <ShieldCheck size={14} color="#C6A85A" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
          Credenciais Iniciais do Sistema:<br />
          E-mail: <strong>admin@wisdomwear.com.br</strong><br />
          Senha: <strong>wisdom2026</strong>
        </div>
      </div>
    </div>
  );
}
