# MAPA.md - Navegação Canônica do Repositório Wisdom Wear

**Atualizado em**: `2026-07-22`  
**Tenant**: `wisdomwear` (`wisdomwear.com.br`)  
**Gateway**: Asaas API v3 (Subconta Sem Divisão / Split = false)  
**Logística**: Melhor Envio API v2  

---

## 1. O que existe aqui

Este repositório contém o código-fonte, configurações de variáveis multi-tenant e componentes UI/UX do e-commerce da **Wisdom Wear**.

---

## 2. Mapa Canônico de Diretórios e Arquivos

| Diretório / Arquivo | Descrição |
| :--- | :--- |
| `.env.local` | Superfície de compatibilidade runtime local |
| `.env.example` | Template público de variáveis sem segredos |
| `env/local/20-tenants/wisdomwear/` | Fonte canônica dos segredos do tenant |
| `env/catalog.json` | Índice oficial de variáveis por tenant |
| `src/app/` | Rotas App Router do Next.js 14 (`/`, `/produto/[slug]`, `/checkout`) |
| `src/app/api/checkout/` | Endpoint de criação de cobranças Asaas v3 |
| `src/app/api/webhooks/asaas/` | Listener de Webhooks para notificações em tempo real |
| `src/app/api/shipping/` | Endpoint de estimativa de frete via Melhor Envio |
| `src/components/` | Componentes do Design System (`Header`, `Footer`, `HeroSection`, `ConceptSection`, `SlideCart`, `ProductCard`) |
| `src/lib/asaas.ts` | Wrapper HTTP da API v3 do Asaas |
| `src/lib/melhorenvio.ts` | Wrapper HTTP da API v2 do Melhor Envio |
| `src/store/cartStore.ts` | Estado reativo do carrinho (Zustand) |
| `src/data/products.ts` | Catálogo de produtos MVP |
| `src/styles/globals.css` | Tokens visuais do Design System (`#C6A85A`, `#111111`) |

---

## 3. Quando atualizar este mapa
Atualize este arquivo sempre que houver novas integrações de serviços, adição de módulos de pagamento ou alteração no schema do banco.
