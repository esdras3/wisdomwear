import type { CSSProperties } from 'react';
import Link from 'next/link';
import { PolicyLayout } from '@/components/PolicyLayout';

export const metadata = {
  title: 'Política de Cookies | Wisdom Wear',
  description: 'Como a Wisdom Wear utiliza cookies em conformidade com a LGPD.'
};

const h2: CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  margin: '28px 0 10px',
  color: '#111111'
};
const ul: CSSProperties = { paddingLeft: '20px', marginBottom: '16px' };
const a: CSSProperties = { color: '#111111', textDecoration: 'underline' };

export default function CookiesPage() {
  return (
    <PolicyLayout title="Política de cookies">
      <p style={{ marginBottom: '16px', fontSize: '12px', color: '#767676' }}>
        Última atualização: 22 de julho de 2026
      </p>

      <p style={{ marginBottom: '16px' }}>
        Cookies são pequenos arquivos armazenados no seu dispositivo. Usamos cookies para o
        funcionamento da loja e, com o seu consentimento, para entender o desempenho do site.
      </p>

      <h2 style={h2}>1. Tipos de cookies</h2>
      <ul style={ul}>
        <li>
          <strong>Essenciais:</strong> necessários ao carrinho, checkout, sessão administrativa
          e segurança. Não podem ser desativados sem prejudicar a loja.
        </li>
        <li>
          <strong>Preferências:</strong> lembram escolhas como o consentimento de cookies
          (`wisdom_cookie_consent`).
        </li>
        <li>
          <strong>Desempenho / analytics:</strong> apenas se você aceitar o banner — ajudam a
          medir páginas visitadas e melhorar a experiência (Silent Luxury, sem tracking
          invasivo desnecessário).
        </li>
      </ul>

      <h2 style={h2}>2. Seu controle</h2>
      <p style={{ marginBottom: '16px' }}>
        No primeiro acesso, o banner permite <strong>Aceitar tudo</strong> ou{' '}
        <strong>Recusar</strong> cookies não essenciais. Você também pode limpar cookies no
        navegador. Detalhes de privacidade em{' '}
        <Link href="/privacidade" style={a}>
          Política de Privacidade
        </Link>
        .
      </p>

      <h2 style={h2}>3. Terceiros</h2>
      <p>
        Prestadores de pagamento e hospedagem podem definir cookies técnicos próprios sob suas
        políticas (ex.: Asaas, infraestrutura de CDN/hosting).
      </p>
    </PolicyLayout>
  );
}
