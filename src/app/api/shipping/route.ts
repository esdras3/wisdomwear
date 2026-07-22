import { NextResponse } from 'next/server';
import { calculateMelhorEnvioShipping } from '@/lib/melhorenvio';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { destinationPostalCode, items } = body as {
      destinationPostalCode: string;
      items: { price: number; quantity: number }[];
    };

    if (!destinationPostalCode) {
      return NextResponse.json({ error: 'CEP de destino é obrigatório' }, { status: 400 });
    }

    const shippingRates = await calculateMelhorEnvioShipping({
      destinationPostalCode,
      items: items || [{ price: 189, quantity: 1 }]
    });

    return NextResponse.json({ rates: shippingRates });
  } catch (error) {
    console.error('[API SHIPPING ERROR]', error);
    return NextResponse.json({ error: 'Erro ao calcular estimativa de frete com Melhor Envio' }, { status: 500 });
  }
}
