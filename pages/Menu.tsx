import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../services/db';
import { Product, Category } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { CATEGORIES } from '../constants';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Menu: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const categoryParam = searchParams.get('category') as Category | null;
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetch = async () => {
      const all = await db.products.getAll();
      setProducts(all);
      setIsLoading(false);
    };
    fetch();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="pt-32 pb-20 bg-[#F5F1E8] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-7xl md:text-8xl font-serif font-black text-[#1A1A1A] mb-6 tracking-tighter">OUR MENU.</h1>
          <p className="text-gray-500 max-w-xl font-light text-lg">
            Every bite is a story. Browse our curated selection of premium Manhattan flavors.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-24 z-30 bg-white border border-[#E8E8E8] shadow-xl p-4 mb-12 flex flex-col lg:flex-row gap-6 items-center">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 w-full lg:w-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-6 py-2 text-xs font-accent tracking-widest uppercase transition-all ${
                selectedCategory === 'All' ? 'bg-[#1A1A1A] text-white' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-6 py-2 text-xs font-accent tracking-widest uppercase whitespace-nowrap transition-all ${
                  selectedCategory === cat.name ? 'bg-[#1A1A1A] text-white' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-96 ml-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="SEARCH THE MENU..."
              className="w-full bg-[#F5F1E8] border-none py-3 pl-12 pr-4 text-xs font-accent tracking-widest focus:ring-1 focus:ring-[#D4A574] outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white h-[450px] animate-pulse rounded-lg border border-[#E8E8E8]" />
            ))}
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <div className="py-32 text-center">
                  <h3 className="text-3xl font-serif text-gray-400 mb-4 italic">No matching flavors found.</h3>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="text-[#D4A574] border-b border-[#D4A574] font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};
