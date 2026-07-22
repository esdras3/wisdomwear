'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function SlideCart() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotal,
    getRemainingForFreeShipping,
    freeShippingThreshold,
    applyCoupon,
    couponCode,
    discountAmount
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [inputCep, setInputCep] = useState('');
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<{ name: string; price: number; deliveryDays: number }[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<{ name: string; price: number; deliveryDays: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isCartOpen) return null;

  const subtotal = getSubtotal();
  const total = getTotal();
  const remainingFreeShipping = getRemainingForFreeShipping();
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;

    const success = applyCoupon(inputCoupon);
    if (success) {
      setCouponSuccess('Cupom aplicado com sucesso!');
      setCouponError('');
    } else {
      setCouponError('Cupom inválido. Tente WISDOM10');
      setCouponSuccess('');
    }
  };

  const handleCalculateShipping = async () => {
    const clean = inputCep.replace(/\D/g, '');
    if (clean.length !== 8) {
      alert('Por favor, informe um CEP com 8 dígitos.');
      return;
    }
    setLoadingShipping(true);
    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationPostalCode: clean,
          items: items.map((i) => ({ price: i.product.price, quantity: i.quantity }))
        })
      });
      const data = await res.json();
      if (data.rates) {
        setShippingOptions(data.rates);
        setSelectedShipping(data.rates[0]);
        const { setShippingPrice } = useCartStore.getState();
        setShippingPrice(data.rates[0].price);
      }
    } catch (err) {
      console.error('Erro ao calcular frete no Melhor Envio:', err);
    } finally {
      setLoadingShipping(false);
    }
  };

  const handleSelectShippingOption = (opt: { name: string; price: number; deliveryDays: number }) => {
    setSelectedShipping(opt);
    const { setShippingPrice } = useCartStore.getState();
    setShippingPrice(opt.price);
  };

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(3px)',
          zIndex: 999
        }}
      />

      {/* Drawer Panel */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: '440px',
          height: '100vh',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-drawer)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s ease forwards'
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #eaeaea',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="#C6A85A" />
            <h2 style={{ fontSize: '18px', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
              Seu Carrinho ({items.length})
            </h2>
          </div>
          <button
            onClick={closeCart}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            aria-label="Fechar"
          >
            <X size={22} color="#111111" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div style={{ padding: '14px 24px', backgroundColor: '#F5F3EE', borderBottom: '1px solid #eaeaea' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 500, color: '#111111', marginBottom: '8px' }}>
            <Truck size={16} color="#C6A85A" />
            {remainingFreeShipping === 0 ? (
              <span style={{ color: '#2E7D32', fontWeight: 600 }}>Parabéns! Você ganhou Frete Grátis.</span>
            ) : (
              <span>
                Faltam <strong>R$ {remainingFreeShipping.toFixed(2).replace('.', ',')}</strong> para Frete Grátis!
              </span>
            )}
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#eaeaea', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: '#C6A85A',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Items List */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#767676' }}>
              <ShoppingBag size={48} color="#eaeaea" style={{ marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#111111', marginBottom: '8px' }}>
                Seu carrinho está vazio
              </p>
              <p style={{ fontSize: '13px', marginBottom: '24px' }}>
                Explore nossa coleção minimalista e escolha sua presença.
              </p>
              <button onClick={closeCart} className="btn btn-primary">
                VER PRODUTOS
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}-${idx}`}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #eaeaea'
                  }}
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    style={{ width: '70px', height: '90px', objectFit: 'cover', backgroundColor: '#f9f9f9' }}
                  />

                  {/* Details */}
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor.hex)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#767676' }}
                          title="Remover"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p style={{ fontSize: '12px', color: '#767676', marginTop: '2px' }}>
                        Tam: <strong>{item.selectedSize}</strong> | Cor: <strong>{item.selectedColor.name}</strong>
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eaeaea' }}>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor.hex,
                              item.quantity - 1
                            )
                          }
                          style={{ width: '26px', height: '26px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          -
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '12px', fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor.hex,
                              item.quantity + 1
                            )
                          }
                          style={{ width: '26px', height: '26px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          +
                        </button>
                      </div>

                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>
                        R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Checkout Action */}
        {items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #eaeaea', backgroundColor: '#ffffff' }}>
            {/* Form de Frete com Melhor Envio */}
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#F5F3EE' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Calcular CEP (Melhor Envio)"
                  maxLength={9}
                  value={inputCep}
                  onChange={(e) => setInputCep(e.target.value)}
                  style={{
                    flexGrow: 1,
                    padding: '8px 12px',
                    fontSize: '12px',
                    border: '1px solid #eaeaea'
                  }}
                />
                <button
                  type="button"
                  onClick={handleCalculateShipping}
                  className="btn btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '11px' }}
                >
                  {loadingShipping ? '...' : 'CALCULAR'}
                </button>
              </div>

              {shippingOptions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                  {shippingOptions.map((opt, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectShippingOption(opt)}
                      style={{
                        padding: '8px',
                        border: selectedShipping?.name === opt.name ? '1px solid #C6A85A' : '1px solid #eaeaea',
                        backgroundColor: selectedShipping?.name === opt.name ? '#ffffff' : 'transparent',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      <div>
                        <strong>{opt.name}</strong> ({opt.deliveryDays} dias úteis)
                      </div>
                      <span style={{ fontWeight: 600, color: '#C6A85A' }}>
                        {opt.price === 0 ? 'GRÁTIS' : `R$ ${opt.price.toFixed(2).replace('.', ',')}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coupon Form */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div style={{ position: 'relative', flexGrow: 1 }}>
                <input
                  type="text"
                  placeholder="Cupom (ex: WISDOM10)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 32px',
                    fontSize: '12px',
                    border: '1px solid #eaeaea',
                    textTransform: 'uppercase'
                  }}
                />
                <Tag size={14} color="#767676" style={{ position: 'absolute', left: '10px', top: '12px' }} />
              </div>
              <button type="submit" className="btn btn-secondary" style={{ padding: '10px 16px', fontSize: '11px' }}>
                APLICAR
              </button>
            </form>
            {couponSuccess && <p style={{ fontSize: '11px', color: '#2E7D32', marginBottom: '12px' }}>{couponSuccess}</p>}
            {couponError && <p style={{ fontSize: '11px', color: '#C62828', marginBottom: '12px' }}>{couponError}</p>}

            {/* Summary Lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', marginBottom: '16px' }}>
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
                <span>{remainingFreeShipping === 0 ? 'GRÁTIS' : 'Calculado no checkout'}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#111111',
                  marginTop: '6px',
                  paddingTop: '8px',
                  borderTop: '1px solid #eaeaea'
                }}
              >
                <span>TOTAL</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link href="/checkout" onClick={closeCart} className="btn btn-primary btn-full" style={{ gap: '8px' }}>
              FINALIZAR COMPRA <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </aside>

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
