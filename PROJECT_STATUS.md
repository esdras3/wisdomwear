# PROJECT_STATUS.md - Fonte de Verdade Operacional

**Tenant**: `wisdomwear`  
**Status**: Ativo & Prontos para Receber Credenciais  
**Última Atualização**: `2026-07-22`  

---

## 1. Estado Atual dos Serviços

| Serviço | Status | Detalhes |
| :--- | :--- | :--- |
| **Next.js App Router** | 🟢 Operacional | Compilado e validado em `npm run build` |
| **Subconta Asaas API v3** | 🟢 Configurado | Sem divisão de receita (100% repassado à Wisdom) |
| **Melhor Envio API v2** | 🟢 Configurado | Endpoint `/api/shipping` integrado ao SlideCart |
| **Catálogo MVP** | 🟢 Ativo | 3 Modelos de Camisetas (*Classic Black*, *Essential Off-White*, *Signature Gold*) |
| **Estrutura Env Split** | 🟢 Ativo | `.env.local` e `env/local/20-tenants/wisdomwear/wisdomwear.env` criados |

---

## 2. Próximos Passos
1. Preenchimento das credenciais reais no arquivo [.env.local](file:///C:/Users/Esdras/sites_app/bohnen/bohnen_app/.env.local) pelo cliente (`ASAAS_SUBACCOUNT_API_KEY`, `MELHOR_ENVIO_TOKEN`, `DATABASE_URL`).
2. Conexão com o banco PostgreSQL de produção.
