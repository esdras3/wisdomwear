'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, ExternalLink, CheckCircle, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders] = useState([
    {
      id: 'WISDOM-1008',
      asaasId: 'pay_9823471029',
      customer: 'Esdras Silva',
      cpf: '123.456.789-00',
      email: 'esdras@email.com',
      method: 'PIX',
      amount: 378.0,
      status: 'PAGO',
      shippingService: 'SEDEX Express (Melhor Envio)',
      trackingCode: 'BR987654321SP',
      date: '2026-07-22 19:42'
    },
    {
      id: 'WISDOM-1007',
      asaasId: 'pay_9823471028',
      customer: 'Carlos Eduardo',
      cpf: '345.678.901-22',
      email: 'carlos@email.com',
      method: 'CARTÃO 3X',
      amount: 189.0,
      status: 'PAGO',
      shippingService: 'PAC (Melhor Envio)',
      trackingCode: 'BR123456789SP',
      date: '2026-07-22 18:15'
    },
    {
      id: 'WISDOM-1006',
      asaasId: 'pay_9823471027',
      customer: 'Mariana Costa',
      cpf: '987.654.321-11',
      email: 'mariana@email.com',
      method: 'PIX',
      amount: 229.0,
      status: 'AGUARDANDO_PIX',
      shippingService: 'PAC (Melhor Envio)',
      trackingCode: '-',
      date: '2026-07-22 17:30'
    }
  ]);

  return (
    <div style={{ backgroundColor: '#F5F3EE', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container">
        <div style={{ marginBottom: '32px' }}>
          <Link href="/admin" style={{ fontSize: '12px', fontWeight: 600, color: '#767676', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
            <ArrowLeft size={14} /> VOLTAR AO DASHBOARD
          </Link>
          <h1 style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', color: '#111111' }}>
            Gestão de Pedidos & Etiquetas (Melhor Envio)
          </h1>
          <p style={{ fontSize: '14px', color: '#767676', marginTop: '4px' }}>
            Histórico transacional Asaas e emissão de transporte.
          </p>
        </div>

        {/* Tabela de Pedidos */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #eaeaea', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#111111', color: '#C6A85A', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <th style={{ padding: '16px' }}>Pedido / Cliente</th>
                <th style={{ padding: '16px' }}>Pagamento Asaas</th>
                <th style={{ padding: '16px' }}>Envio (Melhor Envio)</th>
                <th style={{ padding: '16px' }}>Status Pedido</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Ação Logística</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id} style={{ borderBottom: '1px solid #eaeaea' }}>
                  <td style={{ padding: '16px' }}>
                    <strong style={{ color: '#111111', display: 'block' }}>{ord.id}</strong>
                    <span style={{ fontSize: '13px', color: '#333333' }}>{ord.customer}</span>
                    <div style={{ fontSize: '11px', color: '#767676' }}>{ord.email} • {ord.cpf}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 700, color: '#111111' }}>R$ {ord.amount.toFixed(2).replace('.', ',')}</div>
                    <div style={{ fontSize: '11px', color: '#767676' }}>{ord.method} • ID: {ord.asaasId}</div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '13px' }}>
                    <div>{ord.shippingService}</div>
                    <span style={{ fontSize: '11px', color: '#C6A85A', fontWeight: 600 }}>
                      Rastreio: {ord.trackingCode}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    {ord.status === 'PAGO' ? (
                      <span style={{ backgroundColor: '#e8f5e9', color: '#2E7D32', fontSize: '11px', fontWeight: 700, padding: '4px 8px' }}>
                        PAGO & APROVADO
                      </span>
                    ) : (
                      <span style={{ backgroundColor: '#fff8e1', color: '#b09247', fontSize: '11px', fontWeight: 700, padding: '4px 8px' }}>
                        AGUARDANDO PIX
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '11px', gap: '6px' }}>
                      <Truck size={14} /> IMPRIMIR ETIQUETA
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
