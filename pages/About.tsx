import React from 'react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
  return (
    <div className="pt-32 pb-20 bg-[#F5F1E8] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <span className="text-[#D4A574] font-accent tracking-[0.4em] uppercase text-sm mb-6 block">Our Heritage</span>
          <h1 className="text-7xl font-serif font-black text-[#1A1A1A] mb-8 tracking-tighter">BORN IN THE CITY.</h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            Founded in 2024, Manhattan was created to bridge the gap between high-speed urban life and artisanal culinary excellence. 
            We believe fast food shouldn't mean compromise.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-square">
            <img 
              src="https://www.bu.edu/bhr/files/2017/01/service-1303313_1280.jpg" 
              alt="Kitchen" 
              className="w-full h-full object-cover grayscale-[0.5]"
            />
            <div className="absolute -bottom-10 -right-10 bg-[#1A1A1A] p-10 text-white hidden lg:block">
              <p className="font-accent text-5xl mb-2 tracking-tighter">100%</p>
              <p className="text-xs tracking-widest uppercase opacity-50">Local Sourcing</p>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl font-serif font-bold text-[#1A1A1A]">The Manhattan Philosophy</h2>
            <p className="text-gray-600 leading-relaxed font-light">
              Every ingredient is selected with surgical precision. Our beef is grass-fed, our flour is organic, and our vegetables are harvested daily from local vertical farms within the tri-state area.
            </p>
            <p className="text-gray-600 leading-relaxed font-light">
              We aren't just a restaurant; we are a tribute to the relentless energy of New York. Fast, premium, and uncompromising.
            </p>
            <div className="pt-6 border-t border-gray-200">
              <p className="font-serif italic text-2xl">"Speed is a necessity. Quality is a right."</p>
              <p className="font-accent tracking-widest mt-2 text-[#D4A574]">— HEAD CHEF</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
