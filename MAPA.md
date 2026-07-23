# MAPA.md - Estrutura Canônica de Navegação do Repositório Wisdom Wear

**Aplicação**: Next.js 14 App Router + TypeScript + Vanilla CSS + Zustand + Asaas API v3 + Melhor Envio API v2  
**Repositório**: [https://github.com/esdras3/wisdomwear](https://github.com/esdras3/wisdomwear)  
**URL de Produção**: [https://wisdomwear.vercel.app](https://wisdomwear.vercel.app)  

---

## 🗂️ Estrutura de Diretórios e Páginas

```
c:\Users\Esdras\sites_app\bohnen\bohnen_app\
├── .env.local                                # Arquivo local com credenciais e chaves API
├── .env.example                              # Modelo de referência de variáveis de ambiente
├── vercel.json                               # Configuração de preset Next.js na Vercel
├── AGENTS.md                                 # Diretrizes canônicas para agentes e IAs
├── MAPA.md                                   # Este mapa estrutural do repositório
├── PROJECT_STATUS.md                         # Relatório operacional de status e entregas
├── env/
│   ├── catalog.json                          # Catálogo de ambientes multi-tenant
│   └── local/20-tenants/wisdomwear/
│       └── wisdomwear.env                    # Fonte de verdade de credenciais do tenant
├── public/
│   ├── favicon.ico                           # Favicon oficial extraído do PDF da marca
│   ├── apple-touch-icon.png                  # Ícone para dispositivos Apple / PWA
│   └── images/
│       ├── wisdom_symbol.png                 # Símbolo W/E em fita dourada com fundo transparente
│       ├── wisdom_logo.png                   # Logotipo oficial transparente
│       ├── wisdom_about.jpg                  # Foto estúdio da seção manifesto
│       ├── wisdom_classic_black.jpg          # Foto de produto Classic Black
│       ├── wisdom_essential_offwhite.jpg     # Foto de produto Essential Off-White
│       └── wisdom_signature_gold.jpg         # Foto de produto Signature Gold
└── src/
    ├── middleware.ts                         # Middleware Guard de segurança para rotas /admin
    ├── app/
    │   ├── layout.tsx                        # Layout global com fontes, metadata e favicons
    │   ├── page.tsx                          # Homepage D2C da Wisdom Wear
    │   ├── checkout/
    │   │   └── page.tsx                      # Página de Checkout em 3 passos com Asaas e Frete
    │   ├── produto/[slug]/
    │   │   └── page.tsx                      # PDP (Página de Detalhes de Produto)
    │   ├── admin/
    │   │   ├── page.tsx                      # Painel Geral Admin (Métricas, Vendas, Asaas)
    │   │   ├── login/page.tsx                # Tela de Login Administrativo protegida
    │   │   ├── produtos/page.tsx             # Gestor de Catálogo, Preços e Estoque P/M/G/GG
    │   │   ├── pedidos/page.tsx              # Gestor de Vendas e Etiquetas do Melhor Envio
    │   │   └── leads/page.tsx                # CRM de Leads & Recuperação de Carrinho no WhatsApp
    │   └── api/
    │       ├── admin/login/route.ts          # API de autenticação administrativa
    │       ├── admin/logout/route.ts         # API de logout administrativo
    │       ├── checkout/route.ts             # API de integração Asaas v3 (Sem Split)
    │       ├── shipping/route.ts             # API de cálculo de frete Melhor Envio v2
    │       └── webhooks/asaas/route.ts       # Listener de notificações de pagamento Asaas
    ├── components/
    │   ├── Header.tsx                        # Cabeçalho com logo transparente e drawer de carrinho
    │   ├── Footer.tsx                        # Rodapé com newsletter e selos Asaas
    │   ├── HeroSection.tsx                   # Banner principal de entrada
    │   ├── ConceptSection.tsx                # Seção de manifesto da marca
    │   ├── ProductGrid.tsx                   # Grade de exibição dos modelos MVP
    │   ├── ProductCard.tsx                   # Card interativo de produto
    │   ├── SlideCart.tsx                     # Gaveta de carrinho com simulador de CEP
    │   └── SizeGuideModal.tsx                # Modal de Guia de Medidas por produto
    ├── data/
    │   └── products.ts                       # Catálogo de produtos MVP
    ├── lib/
    │   ├── asaas.ts                          # SDK/Helper Asaas API v3
    │   └── melhorenvio.ts                    # SDK/Helper Melhor Envio API v2
    ├── store/
    │   └── cartStore.ts                      # Zustand Store de estado do carrinho
    └── types/
        └── index.ts                          # Interfaces TypeScript globais
```
