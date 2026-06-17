import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Info, Heart, X, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { Button } from '../common/Button';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('manhattan_favs') || '[]');
    setIsFavorite(favs.includes(product.id));
  }, [product.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    const favs = JSON.parse(localStorage.getItem('manhattan_favs') || '[]');
    let newFavs;
    if (isFavorite) {
      newFavs = favs.filter((id: string) => id !== product.id);
      toast.error(`Removed from favorites`, { icon: '💔' });
    } else {
      newFavs = [...favs, product.id];
      toast.success(`Added to favorites`, { icon: '❤️' });
    }
    localStorage.setItem('manhattan_favs', JSON.stringify(newFavs));
    setIsFavorite(!isFavorite);
  };

  const handleAdd = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      style: { borderRadius: '0px', background: '#1A1A1A', color: '#fff' },
    });
    if (showQuickView) setShowQuickView(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -8 }}
        className="group relative bg-white border border-[#E8E8E8] transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]"
      >
        <button 
          onClick={toggleFavorite}
          className={`absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full transition-colors ${isFavorite ? 'text-[#8B0000]' : 'text-gray-400 hover:text-[#8B0000]'}`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        <div className="relative h-64 overflow-hidden bg-[#F5F1E8]">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <Button 
              variant="secondary" 
              onClick={() => setShowQuickView(true)}
              className="w-full py-2 text-xs flex items-center justify-center gap-2"
            >
              <Info className="w-3 h-3" /> QUICK VIEW
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-accent tracking-widest text-[#D4A574] uppercase">{product.category}</span>
            {product.stock < 10 && <span className="text-[10px] font-medium text-[#8B0000] bg-red-50 px-2 py-0.5 rounded-full">LOW STOCK</span>}
          </div>
          <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mb-2 leading-tight">{product.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-6 font-light leading-relaxed h-10">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-accent text-[#1A1A1A]">Rs. {product.price.toLocaleString()}</span>
            <button onClick={() => handleAdd()} className="bg-[#D4A574] text-white p-3 hover:bg-[#1A1A1A] transition-all duration-300 transform active:scale-90 shadow-lg">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showQuickView && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#1A1A1A]/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 relative overflow-hidden"
            >
              <button onClick={() => setShowQuickView(false)} className="absolute top-6 right-6 z-20 text-gray-400 hover:text-black transition-colors">
                <X className="w-8 h-8" />
              </button>
              <div className="h-[400px] md:h-auto overflow-hidden">
                <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
              </div>
              <div className="p-12 flex flex-col justify-center">
                <span className="text-[#D4A574] font-accent tracking-widest uppercase mb-4">{product.category}</span>
                <h2 className="text-5xl font-serif font-black mb-6 leading-none">{product.name}</h2>
                <p className="text-gray-500 font-light text-lg mb-8 leading-relaxed">{product.description}</p>
                <div className="flex items-baseline gap-4 mb-10">
                  <span className="text-4xl font-accent font-bold">Rs. {product.price.toLocaleString()}</span>
                  {product.calories && <span className="text-gray-300 text-sm">{product.calories} kcal</span>}
                </div>
                <Button onClick={() => handleAdd()} size="lg" className="w-full">
                  <ShoppingCart className="w-5 h-5 mr-2" /> ADD TO BAG
                </Button>
                <p className="mt-6 text-[10px] text-center text-gray-400 uppercase tracking-widest">Available for immediate delivery within Manhattan.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
