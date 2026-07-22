'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, AlertCircle, CheckCircle, Search, UserCheck } from 'lucide-react';

export default function AdminLeadsPage() {
  const [leads] = useState([
    {
      id: 'lead-001',
      name: 'Lucas Mendes',
      email: 'lucas@email.com',
      phone: '11988887777',
      cpf: '345.678.901-22',
      status: 'CARRINHO_ABANDONADO',
      product: 'Camiseta Wisdom Classic Black (Tam: M)',
      amount: 189.0,
      createdAt: '2026-07-22 19:15'
    },
    {
      id: 'lead-002',
      name: 'Fernanda Rocha',
      email: 'fernanda@email.com',
      phone: '21977776666',
      cpf: '123.456.789-00',
      status: 'CARRINHO_ABANDONADO',
      product: 'Camiseta Wisdom Signature Gold (Tam: G)',
      amount: 229.0,
      createdAt: '2026-07-22 18:30'
    },
    {
      id: 'lead-003',
      name: 'Roberto Santos',
      email: 'roberto@email.com',
      phone: '31999990000',
      cpf: '987.654.321-11',
      status: 'CONTATADO',
      product: 'Camiseta Wisdom Essential Off-White (Tam: GG)',
      amount: 189.0,
      createdAt: '2026-07-21 15:40'
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
            Gestão de Leads & Recuperação de Vendas (CRM)
          </h1>
          <p style={{ fontSize: '14px', color: '#767676', marginTop: '4px' }}>
            Clientes que iniciaram o checkout ou se cadastraram na marca.
          </p>
        </div>

        {/* Tabela de Leads */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #eaeaea', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#111111', color: '#C6A85A', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <th style={{ padding: '16px' }}>Cliente / Lead</th>
                <th style={{ padding: '16px' }}>Contato / WhatsApp</th>
                <th style={{ padding: '16px' }}>Produto de Interesse</th>
                <th style={{ padding: '16px' }}>Status CRM</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Ação de Recuperação</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #eaeaea' }}>
                  <td style={{ padding: '16px' }}>
                    <strong style={{ color: '#111111', display: 'block' }}>{lead.name}</strong>
                    <span style={{ fontSize: '12px', color: '#767676' }}>{lead.email}</span>
                  </td>
                  <td style={{ padding: '16px', fontWeight: 600 }}>{lead.phone}</td>
                  <td style={{ padding: '16px', fontSize: '13px', color: '#333333' }}>
                    {lead.product}
                    <div style={{ fontSize: '11px', color: '#C6A85A', fontWeight: 600 }}>
                      Valor: R$ {lead.amount.toFixed(2).replace('.', ',')}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    {lead.status === 'CARRINHO_ABANDONADO' ? (
                      <span style={{ backgroundColor: '#ffebee', color: '#C62828', fontSize: '11px', fontWeight: 700, padding: '4px 8px' }}>
                        CARRINHO ABANDONADO
                      </span>
                    ) : (
                      <span style={{ backgroundColor: '#fff8e1', color: '#b09247', fontSize: '11px', fontWeight: 700, padding: '4px 8px' }}>
                        CONTATADO
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <a
                      href={`https://wa.me/55${lead.phone}?text=Olá%20${encodeURIComponent(
                        lead.name
                      )},%20vimos%20seu%20interesse%20na%20${encodeURIComponent(
                        lead.product
                      )}%20na%20Wisdom%20Wear.%20Ficou%20com%20alguma%20dúvida?%20Use%20o%20cupom%20VOLTA10%20para%20concluir.`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-gold"
                      style={{ padding: '8px 14px', fontSize: '11px', gap: '6px' }}
                    >
                      <MessageSquare size={14} /> ENVIAR WHATSAPP
                    </a>
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
