import { CustomerData, PaymentMethod, CreditCardData, AsaasPaymentResult } from '@/types';
import { wisdomEnv } from '@/lib/env';

function asaasConfig() {
  return {
    apiUrl: wisdomEnv.asaasApiUrl(),
    apiKey: wisdomEnv.asaasApiKey(),
  };
}

/**
 * Cria ou busca um cliente cadastrado no Asaas via CPF/CNPJ
 */
export async function getOrCreateAsaasCustomer(data: CustomerData): Promise<string> {
  const cleanCpf = data.cpfCnpj.replace(/\D/g, '');
  const { apiUrl, apiKey } = asaasConfig();

  if (!apiKey) {
    console.log('[ASAAS MOCK] Retornando ID de cliente mock para CPF:', cleanCpf);
    return `cus_mock_${cleanCpf.substring(0, 6)}`;
  }

  try {
    const searchRes = await fetch(`${apiUrl}/customers?cpfCnpj=${cleanCpf}`, {
      headers: { access_token: apiKey }
    });
    const searchData = await searchRes.json();

    if (searchData.data && searchData.data.length > 0) {
      return searchData.data[0].id;
    }

    const createRes = await fetch(`${apiUrl}/customers`, {
      method: 'POST',
      headers: {
        access_token: apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        cpfCnpj: cleanCpf,
        email: data.email,
        mobilePhone: data.phone.replace(/\D/g, ''),
        postalCode: data.postalCode.replace(/\D/g, ''),
        address: data.street,
        addressNumber: data.number,
        complement: data.complement || '',
        province: data.neighborhood,
        notificationDisabled: true
      })
    });

    const newCustomer = await createRes.json();
    if (newCustomer.id) {
      return newCustomer.id;
    }
    throw new Error(newCustomer.errors?.[0]?.description || 'Erro ao cadastrar cliente no Asaas');
  } catch (error) {
    console.error('[ASAAS CUSTOMER ERROR]', error);
    return `cus_mock_${cleanCpf.substring(0, 6)}`;
  }
}

/**
 * Cria cobrança no Asaas (Pix, Cartão ou Boleto).
 * Política Wisdom: NUNCA incluir `split` no payload.
 */
export async function createAsaasPayment(params: {
  customerData: CustomerData;
  billingType: PaymentMethod;
  amount: number;
  description: string;
  orderId: string;
  creditCardData?: CreditCardData;
}): Promise<AsaasPaymentResult> {
  const { customerData, billingType, amount, description, orderId, creditCardData } = params;
  const { apiUrl, apiKey } = asaasConfig();
  const customerId = await getOrCreateAsaasCustomer(customerData);

  if (!apiKey) {
    console.log('[ASAAS MOCK] Processando cobrança mock:', { billingType, amount, orderId });

    if (billingType === 'PIX') {
      return {
        success: true,
        paymentId: `pay_pix_${Date.now()}`,
        status: 'PENDING',
        billingType: 'PIX',
        pixQrCode: {
          encodedImage:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          payload: `00020126580014br.gov.bcb.pix0136wisdom-wear-pix-${orderId}5204000053039865405${amount.toFixed(
            2
          )}5802BR5915WISDOM WEAR6009SAO PAULO62070503***6304E8A2`,
          expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }
      };
    }

    return {
      success: true,
      paymentId: `pay_card_${Date.now()}`,
      status: 'CONFIRMED',
      billingType,
      invoiceUrl: `${wisdomEnv.appUrl()}/pedidos/${orderId}`
    };
  }

  try {
    // Sem propriedade `split` — 100% na subconta Wisdom
    const payload: Record<string, unknown> = {
      customer: customerId,
      billingType,
      value: amount,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description,
      externalReference: orderId
    };

    if (billingType === 'CREDIT_CARD' && creditCardData) {
      payload.creditCard = {
        holderName: creditCardData.holderName,
        number: creditCardData.number.replace(/\s/g, ''),
        expiryMonth: creditCardData.expiryMonth,
        expiryYear: creditCardData.expiryYear,
        ccv: creditCardData.ccv
      };
      payload.creditCardHolderInfo = {
        name: customerData.name,
        email: customerData.email,
        cpfCnpj: customerData.cpfCnpj.replace(/\D/g, ''),
        postalCode: customerData.postalCode.replace(/\D/g, ''),
        addressNumber: customerData.number,
        phone: customerData.phone.replace(/\D/g, '')
      };
    }

    const payRes = await fetch(`${apiUrl}/payments`, {
      method: 'POST',
      headers: {
        access_token: apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const payData = await payRes.json();

    if (!payData.id) {
      return {
        success: false,
        error: payData.errors?.[0]?.description || 'Falha ao processar pagamento com o gateway.'
      };
    }

    if (billingType === 'PIX') {
      const qrRes = await fetch(`${apiUrl}/payments/${payData.id}/pixQrCode`, {
        headers: { access_token: apiKey }
      });
      const qrData = await qrRes.json();

      return {
        success: true,
        paymentId: payData.id,
        status: payData.status,
        billingType: 'PIX',
        pixQrCode: {
          encodedImage: qrData.encodedImage,
          payload: qrData.payload,
          expirationDate: qrData.expirationDate
        }
      };
    }

    return {
      success: true,
      paymentId: payData.id,
      status: payData.status,
      billingType,
      invoiceUrl: payData.invoiceUrl
    };
  } catch (error) {
    console.error('[ASAAS PAYMENT EXCEPTION]', error);
    return {
      success: false,
      error: 'Erro de conexão com o servidor de pagamento Asaas.'
    };
  }
}
