'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  _count: {
    menuItems: number;
  };
}

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchRestaurants = async () => {
    try {
      const res = await fetch('/api/restaurants');
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data.restaurants);
      }
    } catch (e) {
      console.error('Failed to load restaurants:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const categories = ['All', ...Array.from(new Set(restaurants.map((r) => r.category)))];

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 px-6 py-12 sm:px-12 sm:py-20 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-flex items-center rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400 border border-orange-500/20">
            ⚡ Zero delivery fee on your first order
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-100 sm:text-6xl">
            Gourmet Meals Delivered To{' '}
            <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
              Your Doorstep
            </span>
          </h1>
          <p className="text-lg text-neutral-400">
            Order premium chef-crafted meals from local favorite restaurants in just a few clicks. Fast, fresh, and fully customizable.
          </p>
          {/* Search bar */}
          <div className="flex max-w-md items-center rounded-xl bg-neutral-950 border border-neutral-800 p-1.5 focus-within:border-orange-500 transition-colors">
            <span className="pl-3 text-neutral-500">🔍</span>
            <input
              type="text"
              placeholder="Search cuisines, dishes, restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent px-3 py-2 text-sm text-neutral-200 focus:outline-none placeholder-neutral-500"
            />
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 h-full w-1/3 bg-radial from-orange-500/10 via-transparent to-transparent pointer-events-none" />
      </section>

      {/* Category Filter Pills */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-neutral-100">Browse by Category</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wider uppercase border transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-orange-500 border-orange-600 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Restaurant Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-100">Featured Restaurants</h2>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 animate-pulse rounded-2xl bg-neutral-900 border border-neutral-800" />
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/10">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-neutral-400 font-medium">No restaurants match your search.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurant/${restaurant.id}`}
                className="group flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900/30 overflow-hidden hover:border-neutral-700 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1"
              >
                {/* Banner Image */}
                <div className="relative h-48 w-full overflow-hidden bg-neutral-850">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-orange-500 px-3 py-1 text-2xs font-bold uppercase tracking-wider text-white shadow-lg">
                    {restaurant.category}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 p-5 space-y-3">
                  <h3 className="text-lg font-bold text-neutral-100 group-hover:text-orange-400 transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
                    {restaurant.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs text-neutral-500">
                    <span>✨ {restaurant._count.menuItems} menu options</span>
                    <span className="text-orange-400 font-bold group-hover:underline flex items-center gap-1">
                      View Menu <span>➔</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
