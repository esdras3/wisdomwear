import { Product } from '@/types';
import { PRODUCTS } from '@/data/products';

export const ADMIN_PRODUCTS_KEY = 'wisdom_admin_products_v1';

export type AdminProduct = Product & {
  active: boolean;
  updatedAt: string;
};

export function toAdminProduct(product: Product, active = true): AdminProduct {
  return {
    ...product,
    active,
    updatedAt: new Date().toISOString()
  };
}

export function loadAdminProducts(): AdminProduct[] {
  if (typeof window === 'undefined') {
    return PRODUCTS.map((p) => toAdminProduct(p));
  }
  try {
    const raw = localStorage.getItem(ADMIN_PRODUCTS_KEY);
    if (!raw) {
      const seeded = PRODUCTS.map((p) => toAdminProduct(p));
      localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as AdminProduct[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seeded = PRODUCTS.map((p) => toAdminProduct(p));
      localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return parsed;
  } catch {
    return PRODUCTS.map((p) => toAdminProduct(p));
  }
}

export function saveAdminProducts(products: AdminProduct[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
