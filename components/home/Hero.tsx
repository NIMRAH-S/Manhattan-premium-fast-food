import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../common/Button';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      {/* Background Image Layer */}
      <motion.div
        style={{ y: y1 }}
        className="absolute inset-0 z-0"
      >
        <img
          // src="https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80&w=2000"
          src="https://milehighcre.com/wp-content/uploads/2025/08/Screenshot-2025-08-22-at-7.38.10-AM-1024x590.png"
          alt="Atmospheric Restaurant"
          className="w-full h-[120%] object-cover opacity-60 grayscale-[0.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-black/40" />
      </motion.div>

      {/* Content Layer (Main text centered) */}
      <div className="relative z-10 w-full px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          {/* Label below the header */}
          <span className="text-[#D4A574] font-medium tracking-[0.5em] uppercase text-xs md:text-sm mb-6 block">
            Crafted for the Urban Connoisseur
          </span>

          {/* Main Title - Adjusted with vw to fit all screens and slightly shifted left for optical centering */}
          <h1 className="text-[12vw] sm:text-[11vw] md:text-[10vw] lg:text-[9vw] font-serif font-black text-white leading-[0.8] mb-12 tracking-tighter uppercase relative -left-[0.5vw]">
            MANHATTAN<span className="text-[#D4A574]">.</span>
          </h1>
          
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto mb-16 font-light leading-relaxed tracking-wide">
            Experience premium, chef-driven fast food redefined with artisanal precision. From the heart of the city, straight to your plate.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/menu">
              <Button size="lg" className="w-full sm:w-64 tracking-[0.2em] font-accent">
                EXPLORE MENU
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-64 text-white border-white/20 hover:bg-white/10 tracking-[0.2em] font-accent">
                OUR STORY
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-16 bg-gradient-to-b from-[#D4A574] to-transparent" />
        <span className="text-white/30 text-[10px] uppercase tracking-widest font-accent">Scroll</span>
      </motion.div>
    </section>
  );
};
