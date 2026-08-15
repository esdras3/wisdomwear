import { create } from 'zustand';
import { Product, CartItem, PaymentMethod } from '@/types';
import { FREE_SHIPPING_THRESHOLD, PIX_DISCOUNT_PERCENT } from '@/lib/commerce';

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  couponCode: string;
  discountAmount: number;
  shippingPrice: number;
  freeShippingThreshold: number;
  pixDiscountPercent: number;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    product: Product,
    selectedColor: { name: string; hex: string },
    selectedSize: 'P' | 'M' | 'G' | 'GG',
    quantity?: number
  ) => void;
  removeItem: (productId: string, size: string, colorHex: string) => void;
  updateQuantity: (productId: string, size: string, colorHex: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  setShippingPrice: (price: number) => void;

  getSubtotal: () => number;
  getPixDiscountAmount: () => number;
  getTotal: (paymentMethod?: PaymentMethod) => number;
  getItemCount: () => number;
  getRemainingForFreeShipping: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,
  couponCode: '',
  discountAmount: 0,
  shippingPrice: 0,
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  pixDiscountPercent: PIX_DISCOUNT_PERCENT,

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
      }
      return {
        items: [...state.items, { product, selectedColor, selectedSize, quantity }],
        isCartOpen: true
      };
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
      set({ couponCode: formatted, discountAmount: subtotal * 0.1 });
      return true;
    }
    if (formatted === 'BENVINDO15') {
      const subtotal = get().getSubtotal();
      set({ couponCode: formatted, discountAmount: subtotal * 0.15 });
      return true;
    }
    return false;
  },

  setShippingPrice: (price: number) => set({ shippingPrice: price }),

  getSubtotal: () =>
    get().items.reduce((total, item) => total + item.product.price * item.quantity, 0),

  getPixDiscountAmount: () => {
    const subtotalAfterCoupon = Math.max(0, get().getSubtotal() - get().discountAmount);
    return +(subtotalAfterCoupon * (get().pixDiscountPercent / 100)).toFixed(2);
  },

  getTotal: (paymentMethod?: PaymentMethod) => {
    const subtotal = get().getSubtotal();
    const afterCoupon = Math.max(0, subtotal - get().discountAmount);
    const afterPix =
      paymentMethod === 'PIX'
        ? Math.max(0, afterCoupon - get().getPixDiscountAmount())
        : afterCoupon;
    const ship = afterCoupon >= get().freeShippingThreshold ? 0 : get().shippingPrice;
    return afterPix + ship;
  },

  getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),

  getRemainingForFreeShipping: () => {
    const subtotal = get().getSubtotal();
    return Math.max(0, get().freeShippingThreshold - subtotal);
  }
}));
