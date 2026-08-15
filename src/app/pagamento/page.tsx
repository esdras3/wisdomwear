import type { CSSProperties } from 'react';
import Link from 'next/link';
import { PolicyLayout } from '@/components/PolicyLayout';
import { PIX_DISCOUNT_PERCENT } from '@/lib/commerce';

export const metadata = {
  title: 'Pagamento Seguro | Wisdom Wear',
  description: 'Formas de pagamento Asaas — Pix, cartão e boleto.'
};

const h2: CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  margin: '28px 0 10px',
  color: '#111111'
};
const ul: CSSProperties = { paddingLeft: '20px', marginBottom: '16px' };
const a: CSSProperties = { color: '#111111', textDecoration: 'underline' };

export default function PagamentoPage() {
  return (
    <PolicyLayout title="Pagamento seguro">
      <p style={{ marginBottom: '16px', fontSize: '12px', color: '#767676' }}>
        Última atualização: 22 de julho de 2026
      </p>

      <p style={{ marginBottom: '16px' }}>
        Os pagamentos são processados pela <strong>subconta Asaas</strong> da Wisdom Wear, com
        conexão HTTPS. Não há divisão (split) de valores para terceiros na cobrança.
      </p>

      <h2 style={h2}>1. Formas aceitas</h2>
      <ul style={ul}>
        <li>
          <strong>Pix</strong> — confirmação rápida, com{' '}
          <strong>{PIX_DISCOUNT_PERCENT}% de desconto</strong> sobre o valor elegível.
        </li>
        <li>
          <strong>Cartão de crédito</strong> — até 6x, conforme opções exibidas no checkout.
        </li>
        <li>
          <strong>Boleto</strong> — compensação conforme prazo bancário.
        </li>
      </ul>

      <h2 style={h2}>2. Segurança</h2>
      <ul style={ul}>
        <li>Não armazenamos PAN/CVV nos servidores da loja.</li>
        <li>Notificações de status chegam via webhook Asaas ao nosso sistema.</li>
        <li>
          Em caso de chargeback ou estorno, seguimos as regras do Asaas e do emissor do cartão.
        </li>
      </ul>

      <h2 style={h2}>3. Confirmação do pedido</h2>
      <p style={{ marginBottom: '16px' }}>
        O pedido é considerado pago após o evento de confirmação do Asaas (Pix recebido, cartão
        autorizado/confirmado ou boleto liquidado).
      </p>

      <p>
        Dúvidas sobre cobranças:{' '}
        <Link href="/contato" style={a}>
          Contato
        </Link>{' '}
        ·{' '}
        <Link href="/privacidade" style={a}>
          Privacidade
        </Link>
        .
      </p>
    </PolicyLayout>
  );
}
