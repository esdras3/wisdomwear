# AGENTS.md - Contexto do Projeto Wisdom Wear

> Este arquivo é lido automaticamente por agentes de IA para entender a arquitetura do tenant Wisdom Wear.

---

## 1. Resumo Executivo

**Projeto**: E-Commerce D2C Wisdom Wear  
**Domínio Principal**: `wisdomwear.com.br`  
**Posicionamento**: Lifestyle Premium / Luxo Minimalista ("Silent Luxury")  
**Arquitetura**: Next.js 16 App Router + TypeScript + Multi-Tenant Env (single-tenant runtime)  
**Meio de Pagamento**: Subconta Asaas API v3 (Sem divisão / Split desativado)  
**Logística / Frete**: Melhor Envio API v2  
**Paleta Oficial**: Dourado Wisdom (`#C6A85A`), Preto Profundo (`#111111`), Off-White (`#F5F3EE`)  

---

## 2. Regra de Leitura e Fontes de Verdade

1. `PROJECT_STATUS.md` → Estado operacional
2. `AGENTS.md` → Este arquivo
3. `MAPA.md` → Navegação do repositório
4. `../Documentos/DECISOES.md` → Decisões canônicas (prevalece em conflitos)
5. `../Documentos/PRD.md` · `STACK.md` · `ASAAS_INTEGRATION.md` · `INSIDER_BENCHMARK.md`
6. `env/catalog.json` → Índice multi-tenant
7. `env/local/20-tenants/wisdomwear/*.env` → Credenciais reais (não versionar)

---

## 3. Padrão Multi-Tenant — ENV

Espelha o hub `servidor_email_openclaw` (organização de secrets, **não** roteamento por Host):

| Camada | Uso |
|---|---|
| `00-global` | Infra compartilhada (opcional neste repo) |
| `10-platform` | Plataforma (Vercel/CF refs) |
| `20-tenants/wisdomwear/` | `core.env`, `billing.env`, `shipping.env`, `app.env` |
| `30-operators` | Acessos humanos |
| `99-local/overrides.env` | Leftovers |

- Prefixo canônico: `WISDOMWEAR_*` (aliases legados aceitos via `src/lib/env.ts`).
- Build: `npm run env:build` → `env/generated/.env.local`.
- Runtime do app: single-tenant Wisdom.

---

## 4. Diretrizes de Desenvolvimento

- **Preservação de Design**: dourado (`#C6A85A`) só como destaque; fundo limpo; Playfair + Montserrat.
- **Asaas Sem Divisão**: omitir `split` em `/v3/payments`.
- **Melhor Envio**: `/me/shipment/calculate` v2 com fallback sandbox.
- **Honestidade de status**: admin/webhooks sem Prisma = Parcial, não “entregue”.
