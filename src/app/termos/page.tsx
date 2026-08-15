import type { CSSProperties } from 'react';
import Link from 'next/link';
import { PolicyLayout } from '@/components/PolicyLayout';
import { FREE_SHIPPING_THRESHOLD, PIX_DISCOUNT_PERCENT } from '@/lib/commerce';

export const metadata = {
  title: 'Termos de Serviço | Wisdom Wear',
  description: 'Condições gerais de uso e compra na loja Wisdom Wear.'
};

const h2: CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  margin: '28px 0 10px',
  color: '#111111'
};
const ul: CSSProperties = { paddingLeft: '20px', marginBottom: '16px' };
const a: CSSProperties = { color: '#111111', textDecoration: 'underline' };

export default function TermosPage() {
  return (
    <PolicyLayout title="Termos de serviço">
      <p style={{ marginBottom: '16px', fontSize: '12px', color: '#767676' }}>
        Última atualização: 22 de julho de 2026
      </p>

      <p style={{ marginBottom: '16px' }}>
        Ao acessar wisdomwear.com.br e concluir compras, você concorda com estes Termos, com a{' '}
        <Link href="/privacidade" style={a}>
          Política de Privacidade
        </Link>
        ,{' '}
        <Link href="/trocas" style={a}>
          Trocas
        </Link>
        ,{' '}
        <Link href="/envio" style={a}>
          Envio
        </Link>{' '}
        e{' '}
        <Link href="/pagamento" style={a}>
          Pagamento
        </Link>
        .
      </p>

      <h2 style={h2}>1. Objeto</h2>
      <p style={{ marginBottom: '16px' }}>
        A Wisdom Wear comercializa vestuário premium D2C. Preços, disponibilidade e prazos
        podem variar e são confirmados no checkout.
      </p>

      <h2 style={h2}>2. Cadastro e pedidos</h2>
      <ul style={ul}>
        <li>É necessário informar dados verdadeiros para faturamento e entrega.</li>
        <li>O pedido só é confirmado após aprovação do pagamento pelo Asaas.</li>
        <li>
          Ofertas vigentes incluem frete grátis acima de R$ {FREE_SHIPPING_THRESHOLD} e{' '}
          {PIX_DISCOUNT_PERCENT}% de desconto no Pix, conforme indicado na loja.
        </li>
      </ul>

      <h2 style={h2}>3. Propriedade intelectual</h2>
      <p style={{ marginBottom: '16px' }}>
        Marca, logotipo, textos, fotos e layout são protegidos. É vedada a reprodução sem
        autorização.
      </p>

      <h2 style={h2}>4. Conduta</h2>
      <p style={{ marginBottom: '16px' }}>
        É proibido uso fraudulento do site, tentativas de abuso de cupons, engenharia reversa
        ou qualquer ato que comprometa a segurança da loja ou de outros usuários.
      </p>

      <h2 style={h2}>5. Limitação</h2>
      <p style={{ marginBottom: '16px' }}>
        Empregamos melhores esforços para disponibilidade do site e precisão das informações.
        Eventuais indisponibilidades de gateway, frete ou hospedagem serão tratadas com o
        cliente de boa-fé.
      </p>

      <h2 style={h2}>6. Foro</h2>
      <p>
        Fica eleito o foro da comarca do estabelecimento da Wisdom Wear, salvo disposições
        legais de proteção ao consumidor em contrário.
      </p>
    </PolicyLayout>
  );
}
