import React, { useState, useEffect } from 'react';
import { Hero } from '../components/home/Hero';
import { ProductCard } from '../components/product/ProductCard';
import { db } from '../services/db';
import { Product } from '../types';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsubscribe = db.products.subscribe((all) => {
      setFeaturedProducts(all.filter(p => p.featured));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-[#F5F1E8]">
      <Hero />

      {/* Category Strip - Squares instead of Circles */}
      <section className="py-20 bg-white overflow-hidden border-b border-[#E8E8E8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto pb-8 gap-8 no-scrollbar scroll-smooth">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col items-center gap-4 min-w-[100px] group cursor-pointer"
              >
                <div className="w-20 h-20 bg-[#F5F1E8] border border-gray-100 flex items-center justify-center transition-all duration-500 group-hover:bg-[#1A1A1A] group-hover:text-white group-hover:-translate-y-2 shadow-sm rounded-sm">
                  {cat.icon}
                </div>
                <span className="text-[10px] font-accent tracking-[0.2em] uppercase text-gray-400 group-hover:text-[#D4A574] transition-colors">
                  {cat.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Bento Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-[#D4A574] font-accent tracking-widest uppercase mb-4 block">Selected for You</span>
              <h2 className="text-5xl md:text-7xl font-serif font-black text-[#1A1A1A] leading-tight">
                THE CITY'S <br /> FAVORITES.
              </h2>
            </div>
            <Link to="/menu" className="flex items-center gap-3 text-[#1A1A1A] font-medium group pb-2 border-b-2 border-transparent hover:border-[#D4A574] transition-all">
              VIEW FULL MENU <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.slice(0, 3).map((product, idx) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / Value Prop */}
      <section className="py-32 bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-[#D4A574]/20 flex items-center justify-center rounded-sm mb-8">
                <Star className="text-[#D4A574] w-8 h-8" />
              </div>
              <h4 className="text-2xl font-serif font-bold">Chef's Signature</h4>
              <p className="text-white/50 font-light leading-relaxed">Each recipe is meticulously curated by Michelin-starred culinary artists.</p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-[#D4A574]/20 flex items-center justify-center rounded-sm mb-8">
                <ShieldCheck className="text-[#D4A574] w-8 h-8" />
              </div>
              <h4 className="text-2xl font-serif font-bold">Prime Ingredients</h4>
              <p className="text-white/50 font-light leading-relaxed">100% Organic, farm-to-table sourcing within 100 miles of Manhattan.</p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-[#D4A574]/20 flex items-center justify-center rounded-sm mb-8">
                <Truck className="text-[#D4A574] w-8 h-8" />
              </div>
              <h4 className="text-2xl font-serif font-bold">Rapid Delivery</h4>
              <p className="text-white/50 font-light leading-relaxed">Our fleet ensures your meal arrives at the perfect serving temperature.</p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-[#D4A574]/20 flex items-center justify-center rounded-sm mb-8">
                <Clock className="text-[#D4A574] w-8 h-8" />
              </div>
              <h4 className="text-2xl font-serif font-bold">24/7 Urban Dining</h4>
              <p className="text-white/50 font-light leading-relaxed">The city never sleeps, and neither do our kitchens. Always here for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[#D4A574]/5" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-6xl md:text-8xl font-serif font-black text-[#1A1A1A] mb-12">RESERVE YOUR FLAVOR.</h2>
          <Link to="/menu">
            <button className="bg-[#1A1A1A] text-white px-12 py-6 text-sm tracking-widest font-accent uppercase hover:bg-[#D4A574] transition-all duration-500 shadow-2xl">
              START YOUR ORDER NOW
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};