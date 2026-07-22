import { NextResponse } from 'next/server';
import { createAsaasPayment } from '@/lib/asaas';
import { CustomerData, PaymentMethod, CreditCardData } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerData, billingType, amount, description, orderId, creditCardData } = body as {
      customerData: CustomerData;
      billingType: PaymentMethod;
      amount: number;
      description: string;
      orderId: string;
      creditCardData?: CreditCardData;
    };

    // Validações básicas de payload
    if (!customerData || !customerData.cpfCnpj || !customerData.email) {
      return NextResponse.json({ error: 'Dados do cliente incompletos' }, { status: 400 });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valor total inválido' }, { status: 400 });
    }

    // Processar cobrança via Asaas (Pix, Cartão ou Boleto)
    const result = await createAsaasPayment({
      customerData,
      billingType,
      amount,
      description: description || `Pedido #${orderId} - Wisdom Wear`,
      orderId: orderId || `ORD-${Date.now()}`,
      creditCardData
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Erro no processamento do gateway' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API CHECKOUT ERROR]', error);
    return NextResponse.json({ error: 'Erro interno no servidor de checkout' }, { status: 500 });
  }
}
