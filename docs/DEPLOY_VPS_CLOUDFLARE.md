# Deploy VPS Contabo + Cloudflare — Wisdom Wear

**Tenant**: `wisdomwear`  
**Domínio**: `wisdomwear.com.br`  
**Modo ASAP**: híbrido Vercel (compute) + Cloudflare (DNS)  
**Cutover futuro**: Docker na VPS Contabo (`62.171.169.182`)

---

## 1. Estado atual (2026-07-22)

| Item | Valor |
|---|---|
| Zona Cloudflare | criada (`CLOUDFLARE_WISDOMWEAR_ZONE_ID` no hub) |
| Nameservers | `amy.ns.cloudflare.com` · `sterling.ns.cloudflare.com` |
| DNS CF | CNAME `@` e `www` → `cname.vercel-dns.com` (proxied) |
| Vercel project | `wisdomwear` + domínios adicionados + env Production |
| Site smoke | https://wisdomwear.vercel.app → 200 |
| Domínio canônico | pendente troca de NS no Registro.br |

### Ação humana obrigatória
No **Registro.br**, alterar nameservers de `wisdomwear.com.br` para:
1. `amy.ns.cloudflare.com`
2. `sterling.ns.cloudflare.com`

Após propagação: https://wisdomwear.com.br deve servir o app Vercel via Cloudflare.

Webhook Asaas: `https://wisdomwear.com.br/api/webhooks/asaas`

---

## 2. Slot VPS (hub Contabo)

| Recurso | Valor |
|---|---|
| DB | `wisdomwear` em `hub-postgres` (`127.0.0.1:5433`) |
| Container futuro | `wisdomwear-web` bind `172.22.1.1:18834→3000` |
| Vhost futuro | `/opt/mailcow-dockerized/data/conf/nginx/site.wisdomwear.conf` |
| Compose | `docker-compose.wisdomwear.yml` neste repo |
| Dockerfile | `output: 'standalone'` |

Inventário hub:
- `empresas/wisdomwear/MAPA.md`
- `env/local/20-tenants/wisdomwear/core.env`

### Criar DB (já automatizado no provisionamento)

```bash
docker exec -i hub-postgres psql -U hub -d postgres -v ON_ERROR_STOP=1 \
  -c "SELECT 1 FROM pg_database WHERE datname='wisdomwear'" 
# se não existir: CREATE DATABASE wisdomwear OWNER hub;
```

Schema Prisma = **próxima fase**.

---

## 3. Cutover full-VPS (quando estável)

1. Validar porta livre `18834` no host.
2. Build: `docker compose -f docker-compose.wisdomwear.yml build`
3. Up: `docker compose -f docker-compose.wisdomwear.yml up -d`
4. Criar vhost Mailcow `site.wisdomwear.conf` (proxy_pass → `http://172.22.1.1:18834`)
5. Incluir domínio em `ADDITIONAL_SAN` + recriar `acme-mailcow`
6. Cloudflare: mudar `@`/`www` de CNAME Vercel para **A** `62.171.169.182` (DNS-only até LE; depois proxy opcional)
7. Remover domínio custom da Vercel ou manter como staging `*.vercel.app`

---

## 4. Env

App: `npm run env:build` / `env:build:root`  
Hub: rebuild `python scripts/build_env_local.py` após editar `wisdomwear/core.env`

Não rsync `.env.local` de notebook para VPS com segredos misturados — usar `env/local/**` do hub.
