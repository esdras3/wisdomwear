# PROJECT_STATUS.md - Fonte de Verdade Operacional

**Tenant**: `wisdomwear`  
**Domínio**: `wisdomwear.com.br` | `wisdomwear.vercel.app`  
**Status**: 🟢 Ativo, Seguro & Implantado em Produção  
**Última Atualização**: `2026-07-22`  

---

## 1. Inventário de Recursos Adicionados no Projeto

### A. Painel Administrativo & Segurança
- **Middleware Guard (`src/middleware.ts`)**: Proteção de rotas `/admin*` com redirecionamento automático para a tela de login.
- **Tela de Login Admin (`/admin/login`)**: Formulário de autenticação seguro.
- **APIs de Autenticação (`/api/admin/login`, `/api/admin/logout`)**: Geração e destruição de sessão via cookie HTTP-Only `wisdom_admin_session`.
- **Credenciais de Acesso**: Salvas em `.env.local` (`ADMIN_EMAIL="admin@wisdomwear.com.br"`, `ADMIN_PASSWORD="wisdom2026"`).

### B. Gestão de Produtos, Pedidos & CRM de Leads
- **Módulo de Produtos (`/admin/produtos`)**: Cadastro de novos modelos, preços, tecido e matriz de estoque (`P`, `M`, `G`, `GG`).
- **Módulo de Pedidos (`/admin/pedidos`)**: Histórico transacional Asaas e gerador de etiquetas do Melhor Envio.
- **Módulo de Leads & CRM (`/admin/leads`)**: Captura de carrinhos abandonados e botão de recuperação em 1 clique via WhatsApp.
- **Especificação da Base de Dados**: [ADMIN_DASHBOARD_SPECS.md](file:///C:/Users/Esdras/sites_app/bohnen/Documentos/ADMIN_DASHBOARD_SPECS.md) cobrindo os modelos Prisma ORM.

### C. Design System & Identidade Visual
- **Logomarca & Favicon Oficial**: Símbolo W/E em fita dourada e logotipo extraídos do PDF com fundo transparente (`wisdom_symbol.png`, `wisdom_logo.png`, `favicon.ico`, `apple-touch-icon.png`).
- **Fotos sem Artefato**: Fotos de estúdio em alta definição em `public/images/`.

### D. Integrações Financeiras & Logísticas
- **Gateway Asaas v3 (Subconta Sem Divisão)**: Processamento de Pix dinâmico com QR Code, Cartão 6x e Boleto com 100% de repasse à subconta Wisdom.
- **Melhor Envio API v2**: Calculadora de frete em tempo real no SlideCart e Checkout.

---

## 2. Checklist de Produção Real

- [x] **Acesso Admin Salvo**: `ADMIN_EMAIL` e `ADMIN_PASSWORD` no `.env.local`.
- [x] **Deploy de Produção**: [https://wisdomwear.vercel.app](https://wisdomwear.vercel.app).
- [ ] **Credenciais Reais de Gateway & Frete**:
  - Inserir `ASAAS_SUBACCOUNT_API_KEY` e `ASAAS_WEBHOOK_SECRET` no `.env.local` / Vercel.
  - Inserir `MELHOR_ENVIO_TOKEN` e `MELHOR_ENVIO_POSTAL_CODE_ORIGIN`.
- [ ] **Conexão com PostgreSQL**:
  - Aplicar `npx prisma db push` ao banco PostgreSQL da VPS ou Supabase.
