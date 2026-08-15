import type { CSSProperties } from 'react';
import Link from 'next/link';
import { PolicyLayout } from '@/components/PolicyLayout';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/commerce';

export const metadata = {
  title: 'Envio e Entrega | Wisdom Wear',
  description: 'Prazos, frete grátis e logística Wisdom Wear.'
};

const h2: CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  margin: '28px 0 10px',
  color: '#111111'
};
const ul: CSSProperties = { paddingLeft: '20px', marginBottom: '16px' };
const a: CSSProperties = { color: '#111111', textDecoration: 'underline' };

export default function EnvioPage() {
  return (
    <PolicyLayout title="Envio e entrega">
      <p style={{ marginBottom: '16px', fontSize: '12px', color: '#767676' }}>
        Última atualização: 22 de julho de 2026
      </p>

      <h2 style={h2}>1. Frete grátis</h2>
      <p style={{ marginBottom: '16px' }}>
        Pedidos com subtotal a partir de <strong>R$ {FREE_SHIPPING_THRESHOLD}</strong> têm
        frete grátis para o Brasil, conforme regras vigentes no checkout e no carrinho.
      </p>

      <h2 style={h2}>2. Cálculo</h2>
      <p style={{ marginBottom: '16px' }}>
        O frete é estimado por CEP via Melhor Envio (quando a integração estiver ativa) ou
        regra equivalente no checkout. Prazos em dias úteis são previsões da transportadora e
        podem variar por região, greves ou restrições locais.
      </p>

      <h2 style={h2}>3. Processamento</h2>
      <ul style={ul}>
        <li>Separação após confirmação do pagamento.</li>
        <li>Você recebe o código de rastreio quando disponível.</li>
        <li>Conferira o endereço no checkout — endereços incompletos atrasam a entrega.</li>
      </ul>

      <h2 style={h2}>4. Problemas na entrega</h2>
      <p>
        Em caso de extravio, atraso excessivo ou avaria, fale com o{' '}
        <Link href="/contato" style={a}>
          atendimento
        </Link>
        . Avaliamos reenvio ou estorno conforme o caso.
      </p>
    </PolicyLayout>
  );
}
