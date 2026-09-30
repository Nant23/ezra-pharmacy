import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CartItem, Medicine } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (medicine: Medicine, quantity?: number) => void;
  removeFromCart: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  unreadCartItems: number;
  markCartViewed: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DELIVERY_FEE = 50;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('ezra_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [unreadCartItems, setUnreadCartItems] = useState(() => {
    try {
      return Number(localStorage.getItem('ezra_cart_unread') || 0);
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    localStorage.setItem('ezra_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('ezra_cart_unread', String(unreadCartItems));
    } catch {
      // Cart notifications are only a convenience when browser storage is available.
    }
  }, [unreadCartItems]);

  const addToCart = (medicine: Medicine, quantity = 1) => {
    const currentQuantity = items.find(item => item.medicine.id === medicine.id)?.quantity || 0;
    const addedQuantity = Math.max(0, Math.min(quantity, medicine.stock - currentQuantity));
    setItems(prev => {
      const existing = prev.find(item => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map(item =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, medicine.stock) }
            : item
        );
      }
      return [...prev, { medicine, quantity }];
    });
    if (addedQuantity > 0) setUnreadCartItems(count => count + addedQuantity);
  };

  const removeFromCart = (medicineId: string) => {
    setItems(prev => prev.filter(item => item.medicine.id !== medicineId));
  };

  const updateQuantity = (medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.medicine.id === medicineId ? { ...item, quantity } : item
      )
    );
  };

  const markCartViewed = useCallback(() => {
    setUnreadCartItems(0);
    try {
      localStorage.setItem('ezra_cart_unread', '0');
    } catch {
      // Ignore unavailable browser storage.
    }
  }, []);

  const clearCart = () => {
    setItems([]);
    markCartViewed();
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, unreadCartItems, markCartViewed, subtotal, deliveryFee, total
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
