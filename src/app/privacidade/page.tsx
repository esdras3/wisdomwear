import type { CSSProperties } from 'react';
import Link from 'next/link';
import { PolicyLayout } from '@/components/PolicyLayout';

export const metadata = {
  title: 'Política de Privacidade | Wisdom Wear',
  description: 'Como a Wisdom Wear trata dados pessoais em conformidade com a LGPD.'
};

const h2: CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  margin: '28px 0 10px',
  color: '#111111'
};
const ul: CSSProperties = { paddingLeft: '20px', marginBottom: '16px' };
const a: CSSProperties = { color: '#111111', textDecoration: 'underline' };

export default function PrivacidadePage() {
  return (
    <PolicyLayout title="Política de privacidade">
      <p style={{ marginBottom: '16px', fontSize: '12px', color: '#767676' }}>
        Última atualização: 22 de julho de 2026 · Controladora: Wisdom Wear (wisdomwear.com.br)
      </p>

      <p style={{ marginBottom: '16px' }}>
        Esta política descreve como coletamos, usamos, armazenamos e protegemos dados pessoais
        no e-commerce Wisdom Wear, em conformidade com a Lei Geral de Proteção de Dados (LGPD —
        Lei nº 13.709/2018).
      </p>

      <h2 style={h2}>1. Dados que coletamos</h2>
      <ul style={ul}>
        <li>
          <strong>Identificação e contato:</strong> nome, e-mail, telefone/WhatsApp, CPF
          (necessário para emissão de cobrança).
        </li>
        <li>
          <strong>Endereço de entrega:</strong> CEP, logradouro, número, complemento, bairro,
          cidade e UF.
        </li>
        <li>
          <strong>Dados de pedido:</strong> itens, valores, cupons, status de pagamento e frete.
        </li>
        <li>
          <strong>Pagamento:</strong> processado pelo Asaas. Não armazenamos número completo do
          cartão (PAN) nem CVV em nossos servidores.
        </li>
        <li>
          <strong>Navegação:</strong> cookies essenciais e, com consentimento, cookies de
          desempenho (veja a{' '}
          <Link href="/cookies" style={a}>
            Política de Cookies
          </Link>
          ).
        </li>
      </ul>

      <h2 style={h2}>2. Finalidades e bases legais</h2>
      <ul style={ul}>
        <li>Execução de contrato: processar pedidos, cobrança, entrega e atendimento.</li>
        <li>Obrigação legal: emissão fiscal e guarda de registros quando aplicável.</li>
        <li>
          Legítimo interesse / consentimento: melhorar a experiência do site e comunicação
          comercial (quando autorizado).
        </li>
      </ul>

      <h2 style={h2}>3. Compartilhamento com terceiros</h2>
      <p style={{ marginBottom: '12px' }}>
        Compartilhamos apenas o necessário com prestadores sob dever de confidencialidade:
      </p>
      <ul style={ul}>
        <li>
          <strong>Asaas</strong> — gateway de pagamento (Pix, cartão, boleto).
        </li>
        <li>
          <strong>Melhor Envio / transportadoras</strong> — cálculo e logística de frete.
        </li>
        <li>
          <strong>Hospedagem</strong> — infraestrutura da loja e banco de dados quando ativo.
        </li>
      </ul>

      <h2 style={h2}>4. Seus direitos (LGPD)</h2>
      <ul style={ul}>
        <li>confirmação de tratamento e acesso aos dados;</li>
        <li>correção de dados incompletos ou desatualizados;</li>
        <li>anonimização, bloqueio ou eliminação de dados desnecessários;</li>
        <li>portabilidade e informação sobre compartilhamentos;</li>
        <li>revogação do consentimento, quando essa for a base legal.</li>
      </ul>
      <p style={{ marginBottom: '16px' }}>
        Canal do titular:{' '}
        <a href="mailto:privacidade@wisdomwear.com.br" style={a}>
          privacidade@wisdomwear.com.br
        </a>{' '}
        ou WhatsApp de atendimento informado no site.
      </p>

      <h2 style={h2}>5. Segurança e retenção</h2>
      <p style={{ marginBottom: '16px' }}>
        Adotamos medidas técnicas e organizacionais razoáveis (HTTPS, controle de acesso ao
        painel, segregação de segredos). Mantemos dados pelo tempo necessário às finalidades e
        às obrigações legais/fiscais.
      </p>

      <h2 style={h2}>6. Atualizações</h2>
      <p>
        Podemos atualizar esta política. A data no topo indica a versão vigente. O uso contínuo
        da loja após alterações relevantes implica ciência da nova versão.
      </p>
    </PolicyLayout>
  );
}
