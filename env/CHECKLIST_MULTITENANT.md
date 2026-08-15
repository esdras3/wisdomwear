# CHECKLIST — Multi-Tenant ENV (Wisdom Wear)

- [x] `env/catalog.json` com `lookup_rules` + `merge_order` + `files[]`
- [x] `env/examples/**` templates sem segredos
- [x] `env/local/20-tenants/wisdomwear/{core,billing,shipping,app}.env`
- [x] `scripts/build_env_local.py`
- [x] `npm run env:build`
- [x] `src/lib/env.ts` com aliases
- [ ] Preencher chaves reais Asaas / Melhor Envio
- [x] Espelhar env Production na Vercel após build
- [x] Zona Cloudflare criada (pendente NS Registro.br)
