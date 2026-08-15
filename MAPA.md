# MAPA.md - Estrutura Canônica de Navegação do Repositório Wisdom Wear

**Aplicação**: Next.js 16 App Router + TypeScript + Vanilla CSS + Zustand + Asaas API v3 + Melhor Envio API v2  
**Repositório**: [https://github.com/esdras3/wisdomwear](https://github.com/esdras3/wisdomwear)  
**URL de Produção**: [https://wisdomwear.vercel.app](https://wisdomwear.vercel.app) · Domínio canônico: `wisdomwear.com.br`  
**Specs de produto**: [`../Documentos/`](../Documentos/) (`PRD`, `STACK`, `DESIGNER`, `ASAAS`, `INSIDER_BENCHMARK`, `DECISOES`, `ADMIN_DASHBOARD_SPECS`)

---

## Estrutura de Diretórios

```
bohnen_app/
├── .env.local                                # Compat (gerado ou manual) — não versionar
├── .env.example                              # Modelo sem segredos
├── vercel.json
├── Dockerfile                                # Prep cutover VPS
├── docker-compose.wisdomwear.yml
├── AGENTS.md
├── MAPA.md
├── PROJECT_STATUS.md
├── docs/
│   └── DEPLOY_VPS_CLOUDFLARE.md
├── scripts/
│   ├── build_env_local.py
│   ├── provision_cloudflare_wisdomwear.py
│   └── provision_vercel_wisdomwear.py
├── env/
│   ├── catalog.json
│   ├── README.md
│   ├── CHECKLIST_MULTITENANT.md
│   ├── .gitignore
│   ├── examples/                             # Templates versionados
│   │   ├── 00-global/
│   │   ├── 10-platform/
│   │   ├── 20-tenants/wisdomwear/
│   │   └── 30-operators/
│   ├── local/                                # Segredos (não versionado)
│   │   └── 20-tenants/wisdomwear/{core,billing,shipping,app}.env
│   └── generated/.env.local                  # Saída do builder
├── public/
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── images/
└── src/
    ├── middleware.ts
    ├── app/                                  # pages + api routes
    ├── components/
    ├── data/products.ts
    ├── lib/asaas.ts · melhorenvio.ts · env.ts
    ├── store/cartStore.ts
    └── types/index.ts
```
