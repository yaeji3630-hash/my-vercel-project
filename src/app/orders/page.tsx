'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  menuItem: {
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.status === 401) {
        setUnauthorized(true);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (unauthorized) {
    return (
      <div className="mx-auto max-w-md text-center py-20 px-4 space-y-6">
        <p className="text-6xl">🔒</p>
        <h2 className="text-2xl font-bold text-neutral-200">Access Denied</h2>
        <p className="text-neutral-400 text-sm">Please log in to view your order history.</p>
        <Link
          href="/login"
          className="inline-block rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-sm font-semibold text-white hover:from-orange-600 hover:to-amber-600 transition-all"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-100">My Orders</h1>
        <p className="text-sm text-neutral-400 mt-1">Review your past orders and delivery status.</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((n) => (
            <div key={n} className="h-40 rounded-2xl bg-neutral-900 border border-neutral-800" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/10 space-y-4">
          <p className="text-5xl">🥡</p>
          <p className="text-neutral-400 font-medium">You haven&apos;t placed any orders yet.</p>
          <Link
            href="/"
            className="inline-block text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors"
          >
            Order delicious food now ➔
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6 space-y-4 shadow-sm"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-neutral-900">
                <div className="space-y-1">
                  <p className="text-xs text-neutral-500 font-mono">Order ID: {order.id}</p>
                  <p className="text-sm text-neutral-400">
                    Ordered on: {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-2xs font-bold uppercase tracking-wider ${
                      order.status === 'DELIVERED'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-lg font-bold text-neutral-100">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="h-10 w-10 rounded-lg object-cover bg-neutral-850"
                      />
                      <div>
                        <p className="font-semibold text-neutral-200">{item.menuItem.name}</p>
                        <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-neutral-300">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
