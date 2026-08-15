# PROJECT_STATUS.md - Fonte de Verdade Operacional

**Tenant**: `wisdomwear`  
**Domínio**: `wisdomwear.com.br` | `wisdomwear.vercel.app`  
**Status**: 🟡 MVP storefront ativo; integrações e admin parciais  
**Última Atualização**: `2026-07-22`  
**Specs**: `../Documentos/` · Decisões: `../Documentos/DECISOES.md`

---

## 1. Inventário (status honesto)

### A. Storefront — Implementado
- Home (Hero, Conceito, Grade), PDP, Size Guide, Slide Cart, Checkout UI.
- Design system + assets oficiais em `public/`.

### B. Admin — Parcial
- Middleware + login cookie HTTP-Only + UI produtos/pedidos/leads.
- **Produtos:** CRUD completo (criar/listar/editar/excluir/ativar) com persistência `localStorage` no admin.
- Vitrine pública ainda usa `src/data/products.ts` — sync via Prisma = próxima fase.
- Credenciais via env (`ADMIN_*` / `WISDOMWEAR_ADMIN_*`) — **não** documentar senhas neste arquivo.

### C. Integrações — Parcial
- Asaas v3 helper **sem split**; mock se faltar API key.
- Melhor Envio v2 + sandbox fallback.
- Webhook Asaas: recebe evento; sem persistência/idempotência.

### D. Env multi-tenant — Em adoção
- Camadas `env/local/{00,10,20,30}` + `catalog.json` + `scripts/build_env_local.py`.
- Prefixo canônico `WISDOMWEAR_*`.

---

## 2. Checklist de Produção

- [x] Deploy Vercel: https://wisdomwear.vercel.app
- [x] Zona Cloudflare `wisdomwear.com.br` criada + CNAME → Vercel
- [x] Domínios + env Production no projeto Vercel `wisdomwear`
- [ ] **NS no Registro.br** → `amy.ns.cloudflare.com` / `sterling.ns.cloudflare.com`
- [x] Chave Asaas espelhada em `billing.env` + Vercel Production (**produção** `api.asaas.com`)
- [x] Webhook Asaas criado (`id` em `billing.env`) → `https://wisdomwear.vercel.app/api/webhooks/asaas`
- [x] `ASAAS_WEBHOOK_SECRET` gerado e sincronizado (local + Vercel)
- [ ] Token Melhor Envio (`shipping.env`) — previsto amanhã
- [x] DB `wisdomwear` na VPS Contabo (reservado; schema Prisma = próxima fase)
- [ ] Após NS: atualizar URL do webhook para `https://wisdomwear.com.br/api/webhooks/asaas`

---

## 3. Fora desta fase
- Prisma schema / admin persistente
- Cutover tráfego Vercel → Docker na VPS (artefatos preparados)
