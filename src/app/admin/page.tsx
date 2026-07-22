'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Users, DollarSign, Package, AlertCircle, ArrowUpRight, TrendingUp, RefreshCw } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats] = useState({
    totalSales: 12480.0,
    ordersCount: 56,
    activeLeads: 24,
    abandonedCarts: 8,
    conversionRate: '4.8%'
  });

  const recentOrders = [
    { id: 'WISDOM-1008', customer: 'Esdras Silva', method: 'PIX', amount: 378.0, status: 'PAGO', date: 'Hoje, 19:42' },
    { id: 'WISDOM-1007', customer: 'Carlos Eduardo', method: 'CARTÃO 3X', amount: 189.0, status: 'PAGO', date: 'Hoje, 18:15' },
    { id: 'WISDOM-1006', customer: 'Mariana Costa', method: 'PIX', amount: 229.0, status: 'AGUARDANDO_PIX', date: 'Hoje, 17:30' },
    { id: 'WISDOM-1005', customer: 'Rodrigo Lima', method: 'BOLETO', amount: 189.0, status: 'PAGO', date: 'Ontem, 21:10' }
  ];

  const recentLeads = [
    { name: 'Lucas Mendes', email: 'lucas@email.com', phone: '(11) 98888-7777', item: 'Wisdom Classic Black (M)', status: 'Carrinho Abandonado', time: 'Há 25 min' },
    { name: 'Fernanda Rocha', email: 'fernanda@email.com', phone: '(21) 97777-6666', item: 'Wisdom Signature Gold (G)', status: 'Carrinho Abandonado', time: 'Há 1 hora' }
  ];

  return (
    <div style={{ backgroundColor: '#F5F3EE', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container">
        {/* Header Admin Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#C6A85A', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              PAINEL ADMINISTRATIVO D2C
            </span>
            <h1 style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', color: '#111111', marginTop: '4px' }}>
              Visão Geral do E-Commerce
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/admin/produtos" className="btn btn-secondary" style={{ padding: '10px 18px', fontSize: '12px' }}>
              + NOVO PRODUTO
            </Link>
            <Link href="/" target="_blank" className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '12px', gap: '6px' }}>
              VER LOJA <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* 4 Cards de Métricas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '24px', border: '1px solid #eaeaea' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#C6A85A', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#767676' }}>
                Faturamento (Mês)
              </span>
              <DollarSign size={20} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#111111' }}>
              R$ {stats.totalSales.toFixed(2).replace('.', ',')}
            </div>
            <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
              <TrendingUp size={12} /> +18.4% em relação ao mês anterior
            </span>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '24px', border: '1px solid #eaeaea' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#C6A85A', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#767676' }}>
                Pedidos Realizados
              </span>
              <ShoppingBag size={20} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#111111' }}>
              {stats.ordersCount}
            </div>
            <span style={{ fontSize: '11px', color: '#767676', marginTop: '6px', display: 'block' }}>
              Processamento transparente Asaas
            </span>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '24px', border: '1px solid #eaeaea' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#C6A85A', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#767676' }}>
                Leads no Funil CRM
              </span>
              <Users size={20} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#111111' }}>
              {stats.activeLeads}
            </div>
            <span style={{ fontSize: '11px', color: '#767676', marginTop: '6px', display: 'block' }}>
              Capturados no checkout e newsletter
            </span>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '24px', border: '1px solid #eaeaea' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#C62828', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#767676' }}>
                Carrinhos Abandonados
              </span>
              <AlertCircle size={20} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#111111' }}>
              {stats.abandonedCarts}
            </div>
            <span style={{ fontSize: '11px', color: '#C6A85A', fontWeight: 600, marginTop: '6px', display: 'block' }}>
              Aguardando automação WhatsApp
            </span>
          </div>
        </div>

        {/* 2 Grids: Últimos Pedidos & Leads para Recuperação */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
          {/* Tabela de Pedidos */}
          <div style={{ backgroundColor: '#ffffff', padding: '24px', border: '1px solid #eaeaea' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                Últimas Vendas (Asaas)
              </h3>
              <Link href="/admin/pedidos" style={{ fontSize: '12px', color: '#C6A85A', fontWeight: 600 }}>
                Ver Todos →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#F5F3EE',
                    fontSize: '13px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#111111' }}>{ord.id} • {ord.customer}</div>
                    <div style={{ fontSize: '11px', color: '#767676' }}>{ord.method} • {ord.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#111111' }}>R$ {ord.amount.toFixed(2).replace('.', ',')}</div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: ord.status === 'PAGO' ? '#2E7D32' : '#C6A85A',
                        textTransform: 'uppercase'
                      }}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabela de Leads & Recuperação */}
          <div style={{ backgroundColor: '#ffffff', padding: '24px', border: '1px solid #eaeaea' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                Recuperação de Carrinho (CRM)
              </h3>
              <Link href="/admin/leads" style={{ fontSize: '12px', color: '#C6A85A', fontWeight: 600 }}>
                Gerenciar CRM →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentLeads.map((lead, i) => (
                <div
                  key={i}
                  style={{
                    padding: '14px',
                    border: '1px solid #eaeaea',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#111111' }}>{lead.name}</span>
                    <span style={{ fontSize: '11px', color: '#C62828', fontWeight: 600 }}>{lead.time}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#767676', marginBottom: '10px' }}>
                    Item: <strong>{lead.item}</strong> | WhatsApp: {lead.phone}
                  </div>
                  <a
                    href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(
                      lead.name
                    )},%20vimos%20seu%20interesse%20na%20camiseta%20Wisdom.%20Precisa%20de%20ajuda%20para%20concluir%20seu%20pedido?`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-gold btn-full"
                    style={{ padding: '8px 0', fontSize: '11px' }}
                  >
                    RECUPERAR NO WHATSAPP (1 CLICK)
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
