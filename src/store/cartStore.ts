import { create } from 'zustand';
import { Product, CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  couponCode: string;
  discountAmount: number;
  shippingPrice: number;
  freeShippingThreshold: number;
  
  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, selectedColor: { name: string; hex: string }, selectedSize: 'P' | 'M' | 'G' | 'GG', quantity?: number) => void;
  removeItem: (productId: string, size: string, colorHex: string) => void;
  updateQuantity: (productId: string, size: string, colorHex: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  setShippingPrice: (price: number) => void;
  
  // Getters
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
  getRemainingForFreeShipping: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,
  couponCode: '',
  discountAmount: 0,
  shippingPrice: 0,
  freeShippingThreshold: 299.0, // Frete grátis para compras acima de R$ 299

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  addItem: (product, selectedColor, selectedSize, quantity = 1) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor.hex === selectedColor.hex
      );

      if (existingIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex].quantity += quantity;
        return { items: updatedItems, isCartOpen: true };
      } else {
        return {
          items: [...state.items, { product, selectedColor, selectedSize, quantity }],
          isCartOpen: true
        };
      }
    });
  },

  removeItem: (productId, size, colorHex) => {
    set((state) => ({
      items: state.items.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.hex === colorHex
          )
      )
    }));
  },

  updateQuantity: (productId, size, colorHex, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId, size, colorHex);
      return;
    }

    set((state) => ({
      items: state.items.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor.hex === colorHex
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    }));
  },

  clearCart: () => set({ items: [], couponCode: '', discountAmount: 0, shippingPrice: 0 }),

  applyCoupon: (code: string) => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'WISDOM10' || formatted === 'PRESENCA10') {
      const subtotal = get().getSubtotal();
      const discount = subtotal * 0.1; // 10% de desconto
      set({ couponCode: formatted, discountAmount: discount });
      return true;
    } else if (formatted === 'BENVINDO15') {
      const subtotal = get().getSubtotal();
      const discount = subtotal * 0.15; // 15% de desconto
      set({ couponCode: formatted, discountAmount: discount });
      return true;
    }
    return false;
  },

  setShippingPrice: (price: number) => set({ shippingPrice: price }),

  getSubtotal: () => {
    return get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const subtotalAfterDiscount = Math.max(0, subtotal - get().discountAmount);
    const shipping = subtotalAfterDiscount >= get().freeShippingThreshold ? 0 : get().shippingPrice;
    return subtotalAfterDiscount + shipping;
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },

  getRemainingForFreeShipping: () => {
    const subtotal = get().getSubtotal();
    return Math.max(0, get().freeShippingThreshold - subtotal);
  }
}));
