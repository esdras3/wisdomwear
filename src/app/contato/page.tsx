import type { CSSProperties } from 'react';
import Link from 'next/link';
import { PolicyLayout } from '@/components/PolicyLayout';

export const metadata = {
  title: 'Contato | Wisdom Wear',
  description: 'Fale com o atendimento Wisdom Wear.'
};

const h2: CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  margin: '28px 0 10px',
  color: '#111111'
};
const a: CSSProperties = { color: '#C6A85A', textDecoration: 'none', fontWeight: 600 };

export default function ContatoPage() {
  return (
    <PolicyLayout title="Contato e atendimento">
      <p style={{ marginBottom: '16px' }}>
        Estamos disponíveis para dúvidas sobre pedidos, trocas, tamanhos e a coleção.
      </p>

      <h2 style={h2}>Canais</h2>
      <p style={{ marginBottom: '10px' }}>
        WhatsApp:{' '}
        <a href="https://wa.me/5511999999999" style={a} target="_blank" rel="noreferrer">
          Atendimento Wisdom
        </a>
      </p>
      <p style={{ marginBottom: '10px' }}>
        E-mail comercial:{' '}
        <a href="mailto:contato@wisdomwear.com.br" style={a}>
          contato@wisdomwear.com.br
        </a>
      </p>
      <p style={{ marginBottom: '10px' }}>
        Privacidade / LGPD:{' '}
        <a href="mailto:privacidade@wisdomwear.com.br" style={a}>
          privacidade@wisdomwear.com.br
        </a>
      </p>
      <p style={{ marginBottom: '24px' }}>
        Instagram:{' '}
        <a href="https://instagram.com/wisdomwear" style={a} target="_blank" rel="noreferrer">
          @wisdomwear
        </a>
      </p>

      <h2 style={h2}>Horário</h2>
      <p style={{ marginBottom: '16px' }}>
        Dias úteis, das 9h às 18h (horário de Brasília). Pedidos e pagamentos online funcionam
        24h.
      </p>

      <p style={{ fontSize: '13px', color: '#767676' }}>
        Políticas:{' '}
        <Link href="/trocas" style={{ color: '#111111' }}>
          Trocas
        </Link>
        {' · '}
        <Link href="/envio" style={{ color: '#111111' }}>
          Envio
        </Link>
        {' · '}
        <Link href="/pagamento" style={{ color: '#111111' }}>
          Pagamento
        </Link>
        {' · '}
        <Link href="/privacidade" style={{ color: '#111111' }}>
          Privacidade
        </Link>
      </p>
    </PolicyLayout>
  );
}
