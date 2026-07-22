export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  description: string;
  details: string[];
  fabric: string;
  care: string[];
  colors: { name: string; hex: string }[];
  sizes: ('P' | 'M' | 'G' | 'GG')[];
  images: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  selectedColor: { name: string; hex: string };
  selectedSize: 'P' | 'M' | 'G' | 'GG';
  quantity: number;
}

export interface ShippingRate {
  name: string;
  price: number;
  deliveryDays: number;
}

export interface CustomerData {
  name: string;
  cpfCnpj: string;
  email: string;
  phone: string;
  postalCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'BOLETO';

export interface CreditCardData {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
  installments: number;
}

export interface AsaasPaymentResult {
  success: boolean;
  paymentId?: string;
  status?: string;
  billingType?: PaymentMethod;
  pixQrCode?: {
    encodedImage: string;
    payload: string;
    expirationDate: string;
  };
  invoiceUrl?: string;
  error?: string;
}
