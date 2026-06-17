import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/common/Button';

export const Cart: React.FC = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center px-6">
        <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-8" />
        <h2 className="text-5xl font-serif font-black mb-6">YOUR BAG IS EMPTY.</h2>
        <p className="text-gray-500 mb-12 max-w-md mx-auto font-light">
          It looks like you haven't started your Manhattan flavor journey yet. Let's fix that.
        </p>
        <Link to="/menu">
          <Button variant="secondary" size="lg" className="mx-auto">
            EXPLORE THE MENU
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-[#F5F1E8] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-7xl font-serif font-black text-[#1A1A1A] mb-16 tracking-tighter">YOUR BAG.</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* List */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-6 border border-[#E8E8E8] flex gap-6 items-center group"
                >
                  <div className="w-24 h-24 bg-[#F5F1E8] shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1">
                    <span className="text-[10px] font-accent tracking-widest text-[#D4A574] uppercase block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mb-1">{item.name}</h3>
                    <p className="text-sm font-accent text-[#1A1A1A] mb-4">Rs. {item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-4 bg-[#F5F1E8] px-4 py-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="hover:text-[#D4A574] transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="hover:text-[#D4A574] transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right ml-4">
                    <p className="text-lg font-accent font-bold mb-2">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button onClick={clearCart} className="text-gray-400 text-xs font-accent tracking-widest hover:text-[#8B0000] uppercase">
              Empty Entire Bag
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] text-white p-10 sticky top-32 shadow-2xl">
              <h3 className="text-3xl font-serif font-bold mb-8">Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-white/60 font-light">
                  <span>Subtotal</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/60 font-light">
                  <span>Estimated Delivery</span>
                  <span>Rs. 150</span>
                </div>
                <div className="flex justify-between text-white/60 font-light">
                  <span>Taxes (Included)</span>
                  <span>Rs. 0</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between text-2xl font-serif">
                  <span>Total</span>
                  <span className="text-[#D4A574]">Rs. {(total + 150).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#D4A574] text-white py-5 text-sm tracking-[0.2em] font-accent uppercase hover:bg-white hover:text-[#1A1A1A] transition-all flex items-center justify-center gap-4"
              >
                PROCEED TO CHECKOUT <ArrowRight className="w-5 h-5" />
              </button>

              <div className="mt-8 flex items-center justify-center gap-4 text-white/30">
                <img src="https://picsum.photos/seed/visa/40/25" className="grayscale h-6" alt="Card" />
                <img src="https://picsum.photos/seed/master/40/25" className="grayscale h-6" alt="Card" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
