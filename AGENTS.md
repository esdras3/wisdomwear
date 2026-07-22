# AGENTS.md - Contexto do Projeto Wisdom Wear

> Este arquivo é lido automaticamente por agentes de IA para entender a arquitetura do tenant Wisdom Wear.

---

## 1. Resumo Executivo

**Projeto**: E-Commerce D2C Wisdom Wear  
**Domínio Principal**: `wisdomwear.com.br`  
**Posicionamento**: Lifestyle Premium / Luxo Minimalista ("Silent Luxury")  
**Arquitetura**: Next.js 14 App Router + TypeScript + Multi-Tenant Env  
**Meio de Pagamento**: Subconta Asaas API v3 (Sem divisão / Split desativado)  
**Logística / Frete**: Melhor Envio API v2  
**Paleta Oficial**: Dourado Wisdom (`#C6A85A`), Preto Profundo (`#111111`), Off-White (`#F5F3EE`)  

---

## 2. Regra de Leitura e Fontes de Verdade

1. `PROJECT_STATUS.md` -> Estado operacional e de build do projeto
2. `AGENTS.md` -> Este arquivo (orientações estratégicas para IAs)
3. `MAPA.md` -> Navegação canônica do repositório
4. `env/catalog.json` -> Índice das variáveis e segredos por tenant
5. `env/local/20-tenants/wisdomwear/wisdomwear.env` -> Credenciais reais do tenant

---

## 3. Diretrizes de Desenvolvimento

- **Preservação de Design**: O dourado (`#C6A85A`) deve ser usado estritamente como destaque estratégico. O fundo principal deve ser limpo (`#FFFFFF` ou `#F5F3EE`) com tipografia Playfair Display e Montserrat.
- **Asaas Subconta (Sem Divisão)**: Toda cobrança via `/v3/payments` deve omitir a propriedade `split`, direcionando 100% dos fundos para a subconta Wisdom.
- **Melhor Envio**: As estimativas de frete utilizam o endpoint `/me/shipment/calculate` da v2 do Melhor Envio com fallback automático para modo sandbox.
