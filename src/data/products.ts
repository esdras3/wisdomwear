import { Product } from '@/types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    slug: 'wisdom-classic-black',
    name: 'Camiseta Wisdom Classic Black',
    subtitle: 'Algodão Modal Premium & Ajuste Perfeito',
    price: 189.0,
    description:
      'Desenvolvida para quem busca presença sem ostentação. A Wisdom Classic Black combina algodão de fibra longa e modal com toque aveludado, oferecendo regulação térmica natural, caimento impecável e resistência excepcional ao desbotamento.',
    details: [
      'Modelagem Slim Elegante com caimento fluido',
      'Tecido com toque de seda e alta respirabilidade',
      'Não desbota e mantém o preto profundo (#111111) após lavagens',
      'Assinatura sutil Wisdom no cós inferior'
    ],
    fabric: '50% Algodão Egípcio Nobre + 50% Modal Sustentável',
    care: [
      'Lavar à mão ou no ciclo delicado com água fria',
      'Não utilizar alvejantes ou secadora',
      'Secar à sombra em varal horizontal'
    ],
    colors: [
      { name: 'Preto Profundo', hex: '#111111' }
    ],
    sizes: ['P', 'M', 'G', 'GG'],
    images: [
      'file:///C:/Users/Esdras/.gemini/antigravity/brain/76322a0a-7345-47cb-8459-f17466c9fc77/wisdom_product_tshirt_black_1784757745368.jpg',
      'file:///C:/Users/Esdras/.gemini/antigravity/brain/76322a0a-7345-47cb-8459-f17466c9fc77/wisdom_hero_hero_banner_1784757733271.jpg'
    ],
    isBestSeller: true
  },
  {
    id: 'prod-002',
    slug: 'wisdom-essential-offwhite',
    name: 'Camiseta Wisdom Essential Off-White',
    subtitle: 'Estética Minimalista & Toque de Seda',
    price: 189.0,
    description:
      'Uma peça de luxo silencioso para composições atemporais. Produzida em malha pura de algodão Pima com sutil tom Off-White (#F5F3EE), garante sensação de frescor contínuo e sofisticação em qualquer ambiente.',
    details: [
      'Gola estruturada com costura invisível',
      'Tratamento pré-encolhimento de fábrica',
      'Toque macio com caimento leve e natural',
      'Sensação térmica agradável durante o dia todo'
    ],
    fabric: '100% Algodão Pima Peruano de Fibra Extra Longa',
    care: [
      'Lavar com cores semelhantes',
      'Passar a ferro em temperatura baixa',
      'Não lavar a seco'
    ],
    colors: [
      { name: 'Off White', hex: '#F5F3EE' }
    ],
    sizes: ['P', 'M', 'G', 'GG'],
    images: [
      'file:///C:/Users/Esdras/.gemini/antigravity/brain/76322a0a-7345-47cb-8459-f17466c9fc77/wisdom_product_tshirt_black_1784757745368.jpg'
    ],
    isNew: true
  },
  {
    id: 'prod-003',
    slug: 'wisdom-signature-gold',
    name: 'Camiseta Wisdom Signature Gold',
    subtitle: 'Edição Autoral com Bordado Dourado Micro',
    price: 229.0,
    originalPrice: 259.0,
    description:
      'A expressão máxima do ADN Wisdom. Apresenta o símbolo oficial W/E em fita contínua bordado em micro fios de ouro metálico no peito. Exclusividade e elegância refinada em edição limitada.',
    details: [
      'Bordado autoral micro em tom Dourado Wisdom (#C6A85A)',
      'Construção reforçada de gola e ombros',
      'Tecido duplo na barra para caimento estruturado',
      'Edição com numeração exclusiva de lote'
    ],
    fabric: '60% Algodão Egípcio + 40% Modal de Alta Gramatura',
    care: [
      'Lavar do avesso em saquinho protetor',
      'Não passar o ferro diretamente sobre o bordado',
      'Secagem natural à sombra'
    ],
    colors: [
      { name: 'Preto Profundo', hex: '#111111' },
      { name: 'Dourado Accent', hex: '#C6A85A' }
    ],
    sizes: ['P', 'M', 'G', 'GG'],
    images: [
      'file:///C:/Users/Esdras/.gemini/antigravity/brain/76322a0a-7345-47cb-8459-f17466c9fc77/wisdom_hero_hero_banner_1784757733271.jpg'
    ],
    isNew: true
  }
];
