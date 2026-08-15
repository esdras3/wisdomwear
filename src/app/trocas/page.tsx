import type { CSSProperties } from 'react';
import Link from 'next/link';
import { PolicyLayout } from '@/components/PolicyLayout';

export const metadata = {
  title: 'Trocas e Devoluções | Wisdom Wear',
  description: 'Política de trocas e direito de arrependimento Wisdom Wear.'
};

const h2: CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  margin: '28px 0 10px',
  color: '#111111'
};
const ul: CSSProperties = { paddingLeft: '20px', marginBottom: '16px' };
const a: CSSProperties = { color: '#111111', textDecoration: 'underline' };

export default function TrocasPage() {
  return (
    <PolicyLayout title="Trocas e devoluções">
      <p style={{ marginBottom: '16px', fontSize: '12px', color: '#767676' }}>
        Última atualização: 22 de julho de 2026
      </p>

      <p style={{ marginBottom: '16px' }}>
        Queremos que cada peça Vista sua presença com tranquilidade. Oferecemos troca
        facilitada e respeitamos o direito de arrependimento previsto no Código de Defesa do
        Consumidor.
      </p>

      <h2 style={h2}>1. Troca facilitada (30 dias)</h2>
      <ul style={ul}>
        <li>Prazo: até 30 dias corridos após o recebimento.</li>
        <li>Peça sem uso, com etiquetas e embalagem originais.</li>
        <li>Troca por tamanho ou modelo equivalente da coleção vigente.</li>
        <li>
          A primeira troca tem frete de devolução facilitado — oriente-se pelo atendimento
          antes de postar.
        </li>
      </ul>

      <h2 style={h2}>2. Direito de arrependimento (7 dias)</h2>
      <p style={{ marginBottom: '16px' }}>
        Em compras online, você pode desistir em até 7 dias corridos do recebimento (art. 49
        do CDC), com reembolso pelos mesmos meios quando aplicável, após análise da peça.
      </p>

      <h2 style={h2}>3. Como solicitar</h2>
      <ol style={{ ...ul, listStyleType: 'decimal' }}>
        <li>
          Contate o{' '}
          <Link href="/contato" style={a}>
            atendimento
          </Link>{' '}
          com número do pedido, fotos e motivo.
        </li>
        <li>Aguarde a autorização e o código/orientação de postagem.</li>
        <li>Envie a peça nas condições acima.</li>
        <li>Após conferência, processamos troca ou estorno.</li>
      </ol>

      <h2 style={h2}>4. Exceções</h2>
      <ul style={ul}>
        <li>Peças usadas, lavadas, danificadas ou sem identificação do pedido.</li>
        <li>Itens personalizados sob encomenda (quando houver).</li>
      </ul>

      <p>
        Dúvidas:{' '}
        <Link href="/contato" style={a}>
          Fale conosco
        </Link>
        .
      </p>
    </PolicyLayout>
  );
}
