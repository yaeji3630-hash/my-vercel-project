'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  restaurantId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestId = localStorage.getItem('cart_restaurant_id');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }
    if (savedRestId) {
      setRestaurantId(savedRestId);
    }
  }, []);

  // Save cart to localStorage
  const saveCart = (newCart: CartItem[], restId: string | null) => {
    setCart(newCart);
    setRestaurantId(restId);
    localStorage.setItem('cart', JSON.stringify(newCart));
    if (restId) {
      localStorage.setItem('cart_restaurant_id', restId);
    } else {
      localStorage.removeItem('cart_restaurant_id');
    }
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    // If adding item from a different restaurant, clear the cart first (standard delivery app behavior)
    if (restaurantId && restaurantId !== item.restaurantId) {
      const confirmChange = window.confirm(
        'You are adding items from a different restaurant. Clear your existing cart?'
      );
      if (!confirmChange) return;
      const newCart = [{ ...item, quantity: 1 }];
      saveCart(newCart, item.restaurantId);
      return;
    }

    const existingIndex = cart.findIndex((cartItem) => cartItem.id === item.id);
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      saveCart(newCart, item.restaurantId);
    } else {
      const newCart = [...cart, { ...item, quantity: 1 }];
      saveCart(newCart, item.restaurantId);
    }
  };

  const removeFromCart = (itemId: string) => {
    const newCart = cart.filter((item) => item.id !== itemId);
    const newRestId = newCart.length === 0 ? null : restaurantId;
    saveCart(newCart, newRestId);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const newCart = cart.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    saveCart(newCart, restaurantId);
  };

  const clearCart = () => {
    saveCart([], null);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        restaurantId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
