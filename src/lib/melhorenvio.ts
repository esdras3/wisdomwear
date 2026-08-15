import { ShippingRate } from '@/types';
import { wisdomEnv } from '@/lib/env';

export interface CalculateShippingParams {
  destinationPostalCode: string;
  items: {
    price: number;
    quantity: number;
  }[];
}

/**
 * Calcula opções de frete via Melhor Envio API v2
 */
export async function calculateMelhorEnvioShipping(params: CalculateShippingParams): Promise<ShippingRate[]> {
  const cleanDestination = params.destinationPostalCode.replace(/\D/g, '');
  const apiUrl = wisdomEnv.melhorEnvioApiUrl();
  const token = wisdomEnv.melhorEnvioToken();
  const originPostal = wisdomEnv.melhorEnvioOriginPostal();

  if (cleanDestination.length !== 8) {
    throw new Error('CEP de destino inválido.');
  }

  if (!token) {
    console.log('[MELHOR ENVIO MOCK] Calculando frete simulado para o CEP:', cleanDestination);

    const isSP = cleanDestination.startsWith('0') || cleanDestination.startsWith('1');
    const isSudeste = cleanDestination.startsWith('2') || cleanDestination.startsWith('3');

    const basePacPrice = isSP ? 16.9 : isSudeste ? 24.9 : 38.9;
    const baseSedexPrice = isSP ? 22.9 : isSudeste ? 34.9 : 54.9;

    return [
      {
        name: 'PAC (Correios)',
        price: basePacPrice,
        deliveryDays: isSP ? 3 : isSudeste ? 5 : 8
      },
      {
        name: 'SEDEX Express (Correios)',
        price: baseSedexPrice,
        deliveryDays: isSP ? 1 : isSudeste ? 2 : 3
      },
      {
        name: 'Jadlog Package',
        price: +(basePacPrice * 0.9).toFixed(2),
        deliveryDays: isSP ? 2 : isSudeste ? 4 : 7
      }
    ];
  }

  try {
    const payload = {
      from: { postal_code: originPostal },
      to: { postal_code: cleanDestination },
      products: params.items.map((item, idx) => ({
        id: `item-${idx}`,
        width: 20,
        height: 5,
        length: 25,
        weight: 0.3 * item.quantity,
        insurance_value: item.price * item.quantity,
        quantity: item.quantity
      }))
    };

    const res = await fetch(`${apiUrl}/me/shipment/calculate`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'User-Agent': 'WisdomWear E-Commerce (contato@wisdomwear.com.br)'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.warn('[MELHOR ENVIO API WARN]', data);
      throw new Error(data.message || 'Erro ao calcular frete no Melhor Envio.');
    }

    return data
      .filter((service: { error?: string }) => !service.error)
      .map(
        (service: {
          name: string;
          custom_price?: number;
          price?: number;
          custom_delivery_time?: number;
          delivery_time?: number;
        }) => ({
          name: service.name,
          price: Number(service.custom_price || service.price || 0),
          deliveryDays: Number(service.custom_delivery_time || service.delivery_time || 3)
        })
      );
  } catch (error) {
    console.error('[MELHOR ENVIO EXCEPTION]', error);
    return [
      { name: 'PAC (Correios)', price: 22.9, deliveryDays: 5 },
      { name: 'SEDEX Express', price: 34.9, deliveryDays: 2 }
    ];
  }
}
