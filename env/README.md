# Env multi-tenant — Wisdom Wear (padrão openclaw)

## Camadas
- `00-global` — infra compartilhada
- `10-platform` — hosting (Vercel/Cloudflare refs)
- `20-tenants/wisdomwear/` — core / billing / shipping / app
- `30-operators` — acessos humanos
- `99-local/overrides.env` — leftovers

## Fluxo
1. Editar arquivos em `env/local/**` (não versionados).
2. `npm run env:build` → gera `env/generated/.env.local`.
3. Opcional: `npm run env:build:root` → também escreve `.env.local` na raiz (`--write-root`).
4. Templates versionados: `env/examples/**`.

## Prefixo
Canônico: `WISDOMWEAR_*`. Aliases legados (`ASAAS_*`, `MELHOR_ENVIO_*`, `ADMIN_*`) resolvidos em `src/lib/env.ts`.

## Runtime
Single-tenant Wisdom — sem resolução por Host.
