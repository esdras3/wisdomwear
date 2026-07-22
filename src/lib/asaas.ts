import { CustomerData, PaymentMethod, CreditCardData, AsaasPaymentResult } from '@/types';

const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
const ASAAS_API_KEY = process.env.ASAAS_SUBACCOUNT_API_KEY || '$aact_mock_wisdom_subaccount_key_12345';

/**
 * Cria ou busca um cliente cadastrado no Asaas via CPF/CNPJ
 */
export async function getOrCreateAsaasCustomer(data: CustomerData): Promise<string> {
  const cleanCpf = data.cpfCnpj.replace(/\D/g, '');

  // Se estiver sem chave de API em modo mock local
  if (!process.env.ASAAS_SUBACCOUNT_API_KEY) {
    console.log('[ASAAS MOCK] Retornando ID de cliente mock para CPF:', cleanCpf);
    return `cus_mock_${cleanCpf.substring(0, 6)}`;
  }

  try {
    // 1. Pesquisar cliente existente
    const searchRes = await fetch(`${ASAAS_API_URL}/customers?cpfCnpj=${cleanCpf}`, {
      headers: { access_token: ASAAS_API_KEY }
    });
    const searchData = await searchRes.json();

    if (searchData.data && searchData.data.length > 0) {
      return searchData.data[0].id;
    }

    // 2. Criar novo cliente se não encontrado
    const createRes = await fetch(`${ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: {
        access_token: ASAAS_API_KEY,
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
    // Fallback de desenvolvimento
    return `cus_mock_${cleanCpf.substring(0, 6)}`;
  }
}

/**
 * Cria cobrança no Asaas (Pix, Cartão de Crédito ou Boleto)
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

  // 1. Obter ID do cliente
  const customerId = await getOrCreateAsaasCustomer(customerData);

  // 2. Se for modo MOCK (sem API Key real configurada)
  if (!process.env.ASAAS_SUBACCOUNT_API_KEY) {
    console.log('[ASAAS MOCK] Processando cobrança mock:', { billingType, amount, orderId });

    if (billingType === 'PIX') {
      return {
        success: true,
        paymentId: `pay_pix_${Date.now()}`,
        status: 'PENDING',
        billingType: 'PIX',
        pixQrCode: {
          encodedImage:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', // 1x1 mock PNG
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
      invoiceUrl: `https://wisdomwear.com.br/pedidos/${orderId}`
    };
  }

  // 3. Integração real com API Asaas v3
  try {
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

    const payRes = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        access_token: ASAAS_API_KEY,
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

    // Se for PIX, buscar dados do QR Code
    if (billingType === 'PIX') {
      const qrRes = await fetch(`${ASAAS_API_URL}/payments/${payData.id}/pixQrCode`, {
        headers: { access_token: ASAAS_API_KEY }
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
