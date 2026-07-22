import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const tokenHeader = req.headers.get('asaas-access-token');
    const secret = process.env.ASAAS_WEBHOOK_SECRET;

    // Se houver secret configurado no ambiente, validar header
    if (secret && tokenHeader !== secret) {
      console.warn('[ASAAS WEBHOOK] Tentativa não autorizada com token inválido');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { event, payment } = body;

    console.log(`[ASAAS WEBHOOK SUCCESS] Evento recebido: ${event} para cobrança ID: ${payment?.id}`);

    // Tratar eventos de status do Asaas
    switch (event) {
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_CONFIRMED':
        console.log(`[PEDIDO APROVADO] Liberando pedido ${payment.externalReference} para separação e despacho.`);
        // Aqui atualiza o banco de dados PostgreSQL / Prisma e envia e-mail/WhatsApp para o cliente
        break;

      case 'PAYMENT_OVERDUE':
        console.log(`[PEDIDO EXPIRADO] Cancela reserva do pedido ${payment.externalReference}.`);
        break;

      case 'PAYMENT_REFUNDED':
        console.log(`[PEDIDO ESTORNADO] Cobrança estornada para pedido ${payment.externalReference}.`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[ASAAS WEBHOOK ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
