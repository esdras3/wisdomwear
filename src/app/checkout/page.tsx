'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { CustomerData, PaymentMethod, CreditCardData, AsaasPaymentResult } from '@/types';
import { ShieldCheck, Lock, CreditCard, QrCode, FileText, CheckCircle, Copy, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, getSubtotal, getTotal, discountAmount, couponCode, clearCart } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<AsaasPaymentResult | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  // Form State
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    cpfCnpj: '',
    email: '',
    phone: '',
    postalCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('PIX');
  const [cardData, setCardData] = useState<CreditCardData>({
    holderName: '',
    number: '',
    expiryMonth: '12',
    expiryYear: '2028',
    ccv: '',
    installments: 1
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const total = getTotal();

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFetchCep = async () => {
    const cleanCep = customerData.postalCode.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setCustomerData((prev) => ({
            ...prev,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || ''
          }));
        }
      } catch (err) {
        console.error('Erro ao buscar CEP via ViaCEP:', err);
      }
    }
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderId = `WISDOM-${Math.floor(100000 + Math.random() * 900000)}`;

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerData,
          billingType: selectedMethod,
          amount: total,
          description: `Pedido #${orderId} - Wisdom Wear`,
          orderId,
          creditCardData: selectedMethod === 'CREDIT_CARD' ? cardData : undefined
        })
      });

      const data: AsaasPaymentResult = await response.json();

      if (data.success) {
        setPaymentResult(data);
        if (selectedMethod !== 'PIX') {
          clearCart();
        }
      } else {
        alert(`Erro no pagamento: ${data.error || 'Tente novamente.'}`);
      }
    } catch (err) {
      console.error('Erro de checkout:', err);
      alert('Houve uma falha na comunicação com o gateway de pagamento.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPix = () => {
    if (paymentResult?.pixQrCode?.payload) {
      navigator.clipboard.writeText(paymentResult.pixQrCode.payload);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  // Se o pagamento Pix foi gerado com sucesso
  if (paymentResult && selectedMethod === 'PIX') {
    return (
      <div style={{ backgroundColor: '#F5F3EE', minHeight: '85vh', padding: '60px 16px' }}>
        <div className="container" style={{ maxWidth: '640px', backgroundColor: '#ffffff', padding: '40px', boxShadow: 'var(--shadow-modal)', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f7f3e8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <QrCode size={32} color="#C6A85A" />
          </div>

          <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>
            Pagamento via Pix Gerado!
          </h2>
          <p style={{ fontSize: '14px', color: '#767676', marginBottom: '24px' }}>
            Escaneie o QR Code abaixo no app do seu banco para concluir o pedido.
          </p>

          <div style={{ backgroundColor: '#F5F3EE', padding: '24px', borderRadius: '4px', display: 'inline-block', marginBottom: '24px' }}>
            {paymentResult.pixQrCode?.encodedImage && (
              /* eslint-disable-next-html-loader */
              <img
                src={paymentResult.pixQrCode.encodedImage}
                alt="QR Code Pix"
                style={{ width: '220px', height: '220px', margin: '0 auto', display: 'block' }}
              />
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#767676', marginBottom: '8px', textTransform: 'uppercase' }}>
              CHAVE PIX &quot;COPIA E COLA&quot;
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                readOnly
                value={paymentResult.pixQrCode?.payload || ''}
                style={{ flexGrow: 1, padding: '12px', fontSize: '11px', border: '1px solid #eaeaea', backgroundColor: '#f9f9f9' }}
              />
              <button onClick={handleCopyPix} className="btn btn-gold" style={{ padding: '12px 18px', gap: '6px' }}>
                <Copy size={14} /> {copiedPix ? 'COPIADO!' : 'COPIAR'}
              </button>
            </div>
          </div>

          <div style={{ fontSize: '13px', color: '#2E7D32', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '24px' }}>
            <CheckCircle size={18} /> Aguardando confirmação do Asaas em tempo real...
          </div>

          <Link href="/" onClick={clearCart} className="btn btn-primary btn-full">
            VOLTAR PARA A LOJA
          </Link>
        </div>
      </div>
    );
  }

  // Se o pagamento via Cartão/Boleto foi concluído
  if (paymentResult && selectedMethod !== 'PIX') {
    return (
      <div style={{ backgroundColor: '#F5F3EE', minHeight: '85vh', padding: '60px 16px' }}>
        <div className="container" style={{ maxWidth: '540px', backgroundColor: '#ffffff', padding: '40px', boxShadow: 'var(--shadow-modal)', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <CheckCircle size={32} color="#2E7D32" />
          </div>

          <h2 style={{ fontSize: '26px', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
            Pedido Confirmado com Sucesso!
          </h2>
          <p style={{ fontSize: '14px', color: '#767676', marginBottom: '24px', lineHeight: 1.6 }}>
            Obrigado por escolher a Wisdom. O comprovante foi enviado para o e-mail <strong>{customerData.email}</strong>.
          </p>

          <Link href="/" className="btn btn-gold btn-full">
            CONTINUAR NAVEGANDO
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ padding: '80px 16px', textAlign: 'center', minHeight: '60vh' }}>
        <ShoppingBag size={48} color="#C6A85A" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>Seu carrinho está vazio</h2>
        <p style={{ fontSize: '14px', color: '#767676', marginBottom: '24px' }}>Adicione produtos antes de ir para o checkout.</p>
        <Link href="/" className="btn btn-primary">EXPLORAR COLEÇÃO</Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F5F3EE', minHeight: '90vh', padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Header Breadcrumb */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#767676' }}>
            <ArrowLeft size={16} /> VOLTAR PARA A LOJA
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#2E7D32', fontWeight: 600 }}>
            <Lock size={14} /> Checkout Seguro Criptografado Asaas
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {/* Form Checkout Column */}
          <div style={{ backgroundColor: '#ffffff', padding: '32px', border: '1px solid #eaeaea' }}>
            <form onSubmit={handleSubmitCheckout}>
              {/* Etapa 1: Dados Pessoais */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-heading)', borderBottom: '1px solid #eaeaea', paddingBottom: '12px', marginBottom: '20px' }}>
                  1. DADOS PESSOAIS
                </h3>

                <div className="form-group">
                  <label className="form-label">Nome Completo</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Esdras Silva"
                    value={customerData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">CPF (Para Nota & Asaas)</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="000.000.000-00"
                      value={customerData.cpfCnpj}
                      onChange={(e) => handleInputChange('cpfCnpj', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">WhatsApp / Celular</label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      placeholder="(11) 99999-9999"
                      value={customerData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">E-mail para Confirmação</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="seuemail@exemplo.com"
                    value={customerData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              {/* Etapa 2: Endereço de Entrega */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-heading)', borderBottom: '1px solid #eaeaea', paddingBottom: '12px', marginBottom: '20px' }}>
                  2. ENDEREÇO DE ENTREGA
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">CEP</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="00000-000"
                      value={customerData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      onBlur={handleFetchCep}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Rua / Logradouro</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Av. Paulista"
                      value={customerData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Número</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="1000"
                      value={customerData.number}
                      onChange={(e) => handleInputChange('number', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Complemento (Opcional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Apto 42 / Bloco B"
                      value={customerData.complement}
                      onChange={(e) => handleInputChange('complement', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Bairro</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={customerData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cidade</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={customerData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">UF</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      maxLength={2}
                      value={customerData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Etapa 3: Pagamento Asaas */}
              <div>
                <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-heading)', borderBottom: '1px solid #eaeaea', paddingBottom: '12px', marginBottom: '20px' }}>
                  3. FORMA DE PAGAMENTO (ASAAS)
                </h3>

                {/* Tabs de Pagamento */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('PIX')}
                    style={{
                      padding: '16px 8px',
                      border: selectedMethod === 'PIX' ? '2px solid #C6A85A' : '1px solid #eaeaea',
                      backgroundColor: selectedMethod === 'PIX' ? '#f7f3e8' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <QrCode size={22} color={selectedMethod === 'PIX' ? '#C6A85A' : '#111111'} />
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>PIX DINÂMICO</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('CREDIT_CARD')}
                    style={{
                      padding: '16px 8px',
                      border: selectedMethod === 'CREDIT_CARD' ? '2px solid #C6A85A' : '1px solid #eaeaea',
                      backgroundColor: selectedMethod === 'CREDIT_CARD' ? '#f7f3e8' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <CreditCard size={22} color={selectedMethod === 'CREDIT_CARD' ? '#C6A85A' : '#111111'} />
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>CARTÃO 6X</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('BOLETO')}
                    style={{
                      padding: '16px 8px',
                      border: selectedMethod === 'BOLETO' ? '2px solid #C6A85A' : '1px solid #eaeaea',
                      backgroundColor: selectedMethod === 'BOLETO' ? '#f7f3e8' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={22} color={selectedMethod === 'BOLETO' ? '#C6A85A' : '#111111'} />
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>BOLETO</span>
                  </button>
                </div>

                {/* Formulário de Cartão de Crédito se selecionado */}
                {selectedMethod === 'CREDIT_CARD' && (
                  <div style={{ backgroundColor: '#F5F3EE', padding: '20px', marginBottom: '24px' }}>
                    <div className="form-group">
                      <label className="form-label">Número do Cartão</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="0000 0000 0000 0000"
                        value={cardData.number}
                        onChange={(e) => setCardData((p) => ({ ...p, number: e.target.value }))}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nome Impresso no Cartão</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="ESDRAS SILVA"
                        value={cardData.holderName}
                        onChange={(e) => setCardData((p) => ({ ...p, holderName: e.target.value }))}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <label className="form-label">Mês</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="12"
                          maxLength={2}
                          value={cardData.expiryMonth}
                          onChange={(e) => setCardData((p) => ({ ...p, expiryMonth: e.target.value }))}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Ano</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="2028"
                          maxLength={4}
                          value={cardData.expiryYear}
                          onChange={(e) => setCardData((p) => ({ ...p, expiryYear: e.target.value }))}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="123"
                          maxLength={4}
                          value={cardData.ccv}
                          onChange={(e) => setCardData((p) => ({ ...p, ccv: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-gold btn-full"
                  style={{ padding: '18px 0', fontSize: '15px', marginTop: '12px' }}
                >
                  {loading ? 'PROCESSANDO ASAAS...' : `CONCLUIR PEDIDO (R$ ${total.toFixed(2).replace('.', ',')})`}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary Right Column */}
          <div>
            <div style={{ backgroundColor: '#ffffff', padding: '24px', border: '1px solid #eaeaea', position: 'sticky', top: '90px' }}>
              <h3 style={{ fontSize: '16px', fontFamily: 'var(--font-heading)', borderBottom: '1px solid #eaeaea', paddingBottom: '12px', marginBottom: '16px' }}>
                RESUMO DO PEDIDO
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img src={item.product.images[0]} alt="" style={{ width: '50px', height: '65px', objectFit: 'cover' }} />
                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 600 }}>{item.product.name}</h4>
                      <p style={{ fontSize: '11px', color: '#767676' }}>
                        {item.selectedSize} | {item.selectedColor.name} | Qtd: {item.quantity}
                      </p>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>
                      R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #eaeaea', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#767676' }}>
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E7D32', fontWeight: 600 }}>
                    <span>Desconto ({couponCode})</span>
                    <span>- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#767676' }}>
                  <span>Frete</span>
                  <span>GRÁTIS</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 700, color: '#111111', borderTop: '1px solid #eaeaea', paddingTop: '12px', marginTop: '4px' }}>
                  <span>TOTAL</span>
                  <span style={{ color: '#C6A85A' }}>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
