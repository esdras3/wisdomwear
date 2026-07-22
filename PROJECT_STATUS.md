# PROJECT_STATUS.md - Fonte de Verdade Operacional

**Tenant**: `wisdomwear`  
**Domínio**: `wisdomwear.com.br` | `wisdomwear.vercel.app`  
**Status**: 🟢 Ativo & Implantado em Produção  
**Última Atualização**: `2026-07-22`  

---

## 1. Relatório de Execução (O que foi feito)

- [x] **Análise do Manual e Benchmark**: Leitura de `link_modelo_instruções.txt`, `SITE WISDOM.pdf` e estudo do benchmark `INSIDER_BENCHMARK.md`.
- [x] **Design System & Luxo Minimalista**:
  - Implementação dos tokens oficiais (`#C6A85A` Dourado Wisdom, `#111111` Preto Profundo, `#F5F3EE` Off-White).
  - Tipografia *Playfair Display* para títulos e *Montserrat* para corpo/botões.
  - Extração do símbolo W/E em fita dourada do PDF para PNG transparente (`public/images/wisdom_symbol.png`).
  - Geração do `favicon.ico` (16x16 até 64x64) e `apple-touch-icon.png`.
  - Fotos de produto e editorial sem artefatos em `public/images/`.
- [x] **Desenvolvimento Frontend (Next.js 14 App Router)**:
  - Homepage com Hero Banner, Manifesto *"Não é apenas roupa."*, Grade de Produtos e História da Marca.
  - PDP (Página de Produto) com galeria de fotos, seletor de cores, tamanhos (P, M, G, GG) e modal de Guia de Medidas.
  - SlideCart (Gaveta de Carrinho) com régua de frete grátis (acima de R$ 299) e cupons de desconto (`WISDOM10`, `BENVINDO15`).
  - Checkout Transparente com busca automática de CEP via ViaCEP, Pix QR Code com "Copia e Cola", Cartão em até 6x e Boleto.
- [x] **Integrações de API**:
  - **Subconta Asaas API v3**: Módulo `src/lib/asaas.ts`, `/api/checkout` e listener `/api/webhooks/asaas` **sem divisão de receita / split = false** (100% para a subconta Wisdom).
  - **Logística Melhor Envio API v2**: Módulo `src/lib/melhorenvio.ts` e `/api/shipping` com simulador de CEP no carrinho e checkout.
- [x] **Padrão VPS Multi-Tenant & Versionamento**:
  - Estrutura de arquivos `env/local/20-tenants/wisdomwear/wisdomwear.env`, `env/catalog.json` e `.env.local`.
  - Documentação de governança (`MAPA.md`, `AGENTS.md`, `PROJECT_STATUS.md`).
  - Repositório GitHub: [https://github.com/esdras3/wisdomwear](https://github.com/esdras3/wisdomwear).
  - Deploy Vercel: [https://wisdomwear.vercel.app](https://wisdomwear.vercel.app) (**● Ready**).

---

## 2. Checklist de Próximos Passos (O que falta fazer)

- [ ] **Credenciais Reais de Produção**:
  - Inserir a chave de API real da Subconta Asaas (`ASAAS_SUBACCOUNT_API_KEY`) e o secret de Webhook (`ASAAS_WEBHOOK_SECRET`) no arquivo `.env.local` / Vercel.
  - Inserir o Bearer Token real do Melhor Envio (`MELHOR_ENVIO_TOKEN`) e o CEP de origem do galpão.
- [ ] **Persistência de Banco de Dados**:
  - Conectar o Prisma ORM ao PostgreSQL de produção (Supabase, Neon ou VPS) para armazenamento definitivo de pedidos e clientes.
- [ ] **Configuração do Domínio Próprio (`wisdomwear.com.br`)**:
  - Apontar os registros DNS `A` (`76.76.21.21`) e `CNAME` (`cname.vercel-dns.com`) no registrador para a Vercel.
- [ ] **Disparo de E-mails Transacionais**:
  - Conectar serviço de e-mail (Resend ou SMTP Mailcow `mail.personalpay.com.br`) para notificações automáticas de compra efetuada.
