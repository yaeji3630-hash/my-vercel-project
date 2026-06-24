'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

interface User {
  id: string;
  email: string;
  name: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        router.push('/');
        router.refresh();
      }
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('Please log in to place an order.');
      router.push('/login');
      setIsCartOpen(false);
      return;
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          totalPrice: cartTotal,
        }),
      });

      if (res.ok) {
        alert('Order placed successfully!');
        clearCart();
        setIsCartOpen(false);
        router.push('/orders');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to place order.');
      }
    } catch (e) {
      console.error('Checkout error:', e);
      alert('An error occurred during checkout.');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:to-amber-600 transition-all duration-300">
                🚀 TastyGo
              </span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-orange-400 ${
                  pathname === '/' ? 'text-orange-400' : 'text-neutral-400'
                }`}
              >
                Restaurants
              </Link>
              {user && (
                <Link
                  href="/orders"
                  className={`text-sm font-medium transition-colors hover:text-orange-400 ${
                    pathname === '/orders' ? 'text-orange-400' : 'text-neutral-400'
                  }`}
                >
                  My Orders
                </Link>
              )}
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-neutral-400 hover:text-orange-400 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white shadow-lg animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Buttons */}
            {loading ? (
              <div className="h-8 w-20 animate-pulse rounded bg-neutral-800" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline text-sm text-neutral-300">
                  Welcome, <strong className="text-neutral-100">{user.name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-neutral-900 border border-neutral-800 px-4 py-1.5 text-sm font-semibold text-neutral-200 transition-all hover:bg-neutral-800 hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-full bg-neutral-900 border border-neutral-800 px-4 py-1.5 text-sm font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-1.5 text-sm font-semibold text-white shadow-md shadow-orange-500/10 hover:from-orange-600 hover:to-amber-600 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Cart Sidebar (Drawer) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-md transform bg-neutral-950 border-l border-neutral-800 p-6 shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
                  <span>🛒</span> Your Cart
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4 max-h-[calc(100vh-250px)]">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-5xl mb-4">🍽️</p>
                    <p className="text-neutral-400 font-medium">Your cart is empty.</p>
                    <p className="text-xs text-neutral-500 mt-1">Add items from a restaurant to start!</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-neutral-800 bg-neutral-900/50"
                    >
                      <div className="flex-1 pr-4">
                        <h4 className="font-semibold text-neutral-200 text-sm">{item.name}</h4>
                        <p className="text-orange-400 font-bold text-xs mt-0.5">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-900 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-semibold text-neutral-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 py-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-500 hover:text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-neutral-950 p-6 border-t border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 font-medium">Subtotal</span>
                    <span className="text-xl font-bold text-neutral-100">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-center text-sm font-bold text-white hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/10"
                  >
                    Place Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
