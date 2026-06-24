'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  menuItems: MenuItem[];
}

export default function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchRestaurant = async () => {
    try {
      const res = await fetch(`/api/restaurants/${id}`);
      if (res.ok) {
        const data = await res.json();
        setRestaurant(data.restaurant);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        <div className="h-64 rounded-3xl bg-neutral-900 border border-neutral-800" />
        <div className="space-y-4">
          <div className="h-8 w-1/3 bg-neutral-900 rounded" />
          <div className="h-4 w-2/3 bg-neutral-900 rounded" />
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4">
        <p className="text-5xl">🥡</p>
        <h2 className="text-2xl font-bold text-neutral-200">Restaurant not found.</h2>
        <Link href="/" className="text-orange-400 hover:underline">
          Back to Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-orange-400 transition-colors">
        <span>←</span> Back to Restaurants
      </Link>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-xl">
        <div className="absolute inset-0 bg-neutral-950/60 z-10" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30"
        />
        <div className="relative z-20 px-6 py-12 sm:px-12 sm:py-16 space-y-4 max-w-3xl">
          <span className="inline-block rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-400 border border-orange-500/30">
            {restaurant.category}
          </span>
          <h1 className="text-3xl font-extrabold text-neutral-100 sm:text-5xl">
            {restaurant.name}
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            {restaurant.description}
          </p>
        </div>
      </div>

      {/* Menu items listing */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-neutral-100 pb-2 border-b border-neutral-900">
          Menu Menu
        </h2>

        {restaurant.menuItems.length === 0 ? (
          <p className="text-neutral-500 py-6 text-center">No menu items listed yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {restaurant.menuItems.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-neutral-800 bg-neutral-900/20 hover:border-neutral-700 transition-all duration-300 shadow-md"
              >
                {/* Menu Item Image */}
                <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-neutral-850 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-neutral-100 group-hover:text-orange-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-neutral-100">
                      ${item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() =>
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          restaurantId: restaurant.id,
                        })
                      }
                      className="rounded-full bg-neutral-900 border border-neutral-800 hover:border-orange-500 hover:bg-orange-500 hover:text-white px-4 py-1.5 text-xs font-bold text-orange-400 transition-all duration-200"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
