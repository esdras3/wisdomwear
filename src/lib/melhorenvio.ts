import { ShippingRate } from '@/types';

const MELHOR_ENVIO_API_URL = process.env.MELHOR_ENVIO_API_URL || 'https://sandbox.melhorenvio.com.br/api/v2';
const MELHOR_ENVIO_TOKEN = process.env.MELHOR_ENVIO_TOKEN || '';
const ORIGIN_POSTAL_CODE = process.env.MELHOR_ENVIO_POSTAL_CODE_ORIGIN || '01001000'; // CEP de São Paulo como padrão

export interface CalculateShippingParams {
  destinationPostalCode: string;
  items: {
    price: number;
    quantity: number;
  }[];
}

/**
 * Calcula opções de frete (PAC, SEDEX, Jadlog, etc.) via API v2 do Melhor Envio
 */
export async function calculateMelhorEnvioShipping(params: CalculateShippingParams): Promise<ShippingRate[]> {
  const cleanDestination = params.destinationPostalCode.replace(/\D/g, '');

  if (cleanDestination.length !== 8) {
    throw new Error('CEP de destino inválido.');
  }

  // 1. Se estiver em ambiente MOCK sem token de API configurado
  if (!process.env.MELHOR_ENVIO_TOKEN) {
    console.log('[MELHOR ENVIO MOCK] Calculando frete simulado para o CEP:', cleanDestination);

    // Mock realista de cálculo por região (ex: SP é mais barato)
    const isSP = cleanDestination.startsWith('0') || cleanDestination.startsWith('1');
    const isSudeste = cleanDestination.startsWith('2') || cleanDestination.startsWith('3');

    const basePacPrice = isSP ? 16.90 : isSudeste ? 24.90 : 38.90;
    const baseSedexPrice = isSP ? 22.90 : isSudeste ? 34.90 : 54.90;

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

  // 2. Chamada real para a API do Melhor Envio
  try {
    const payload = {
      from: { postal_code: ORIGIN_POSTAL_CODE },
      to: { postal_code: cleanDestination },
      products: params.items.map((item, idx) => ({
        id: `item-${idx}`,
        width: 20, // cm (embalagem padrão camiseta Wisdom)
        height: 5,  // cm
        length: 25, // cm
        weight: 0.3 * item.quantity, // 300g por camiseta
        insurance_value: item.price * item.quantity,
        quantity: item.quantity
      }))
    };

    const res = await fetch(`${MELHOR_ENVIO_API_URL}/me/shipment/calculate`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MELHOR_ENVIO_TOKEN}`,
        'User-Agent': 'WisdomWear E-Commerce (contato@wisdomwear.com.br)'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.warn('[MELHOR ENVIO API WARN]', data);
      throw new Error(data.message || 'Erro ao calcular frete no Melhor Envio.');
    }

    // Filtrar apenas serviços válidos sem erro
    return data
      .filter((service: { error?: string; custom_price?: number; price?: number }) => !service.error)
      .map((service: { name: string; custom_price?: number; price?: number; custom_delivery_time?: number; delivery_time?: number }) => ({
        name: service.name,
        price: Number(service.custom_price || service.price || 0),
        deliveryDays: Number(service.custom_delivery_time || service.delivery_time || 3)
      }));
  } catch (error) {
    console.error('[MELHOR ENVIO EXCEPTION]', error);
    // Fallback de contingência
    return [
      { name: 'PAC (Correios)', price: 22.90, deliveryDays: 5 },
      { name: 'SEDEX Express', price: 34.90, deliveryDays: 2 }
    ];
  }
}
