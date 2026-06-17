import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { Button } from '../components/common/Button';
import { toast } from 'react-hot-toast';
import { CheckCircle2, Truck, Banknote, ShieldCheck } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const deliveryFee = 150;

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsLoading(true);
    try {
      const order = await db.orders.create({
        customerName: form.name,
        phone: form.phone,
        address: `${form.address}, ${form.city}, ${form.zip}`,
        items: items,
        total: total + deliveryFee,
      });

      setOrderComplete(order.id);
      clearCart();
      toast.success('ORDER PLACED SUCCESSFULLY!', {
        duration: 5000,
        style: {
          background: '#1A1A1A',
          color: '#fff',
          borderRadius: '0px',
        }
      });
    } catch (err) {
      toast.error('Failed to process order.');
    } finally {
      setIsLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="pt-40 pb-20 text-center px-6 bg-[#F5F1E8] min-h-screen">
        <CheckCircle2 className="w-24 h-24 text-green-600 mx-auto mb-8 animate-bounce" />
        <h2 className="text-6xl font-serif font-black mb-6">THANK YOU, {form.name.split(' ')[0].toUpperCase()}.</h2>
        <p className="text-gray-500 mb-12 max-w-md mx-auto font-light leading-relaxed">
          Your order <span className="text-[#1A1A1A] font-bold">#{orderComplete}</span> has been received and is currently being prepared by our head chef.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button variant="secondary" onClick={() => navigate('/')}>RETURN HOME</Button>
          <Button variant="outline" onClick={() => navigate('/menu')}>ORDER MORE</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-[#F5F1E8] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-7xl font-serif font-black text-[#1A1A1A] mb-16 tracking-tighter">CHECKOUT.</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Delivery Info */}
            <section className="bg-white p-10 border border-[#E8E8E8]">
              <div className="flex items-center gap-4 mb-10">
                <Truck className="w-6 h-6 text-[#D4A574]" />
                <h3 className="text-2xl font-serif font-bold">Delivery Destination</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-accent tracking-widest uppercase text-gray-500">Full Name</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full bg-[#F5F1E8] border-none p-4 text-sm focus:ring-1 focus:ring-[#D4A574] outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-accent tracking-widest uppercase text-gray-500">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full bg-[#F5F1E8] border-none p-4 text-sm focus:ring-1 focus:ring-[#D4A574] outline-none"
                    placeholder="+92 (___) ___ - ____"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-accent tracking-widest uppercase text-gray-500">Delivery Address</label>
                  <input
                    required
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({...form, address: e.target.value})}
                    className="w-full bg-[#F5F1E8] border-none p-4 text-sm focus:ring-1 focus:ring-[#D4A574] outline-none"
                    placeholder="House/Appartment #, Street, Area"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-accent tracking-widest uppercase text-gray-500">City</label>
                  <input
                    required
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({...form, city: e.target.value})}
                    className="w-full bg-[#F5F1E8] border-none p-4 text-sm focus:ring-1 focus:ring-[#D4A574] outline-none"
                    placeholder="e.g. Manhattan, New York..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-accent tracking-widest uppercase text-gray-500">ZIP Code</label>
                  <input
                    required
                    type="text"
                    value={form.zip}
                    onChange={(e) => setForm({...form, zip: e.target.value})}
                    className="w-full bg-[#F5F1E8] border-none p-4 text-sm focus:ring-1 focus:ring-[#D4A574] outline-none"
                    placeholder="XXXXX"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method - Restricted to Cash on Delivery */}
            <section className="bg-white p-10 border border-[#E8E8E8]">
              <div className="flex items-center gap-4 mb-10">
                <Banknote className="w-6 h-6 text-[#D4A574]" />
                <h3 className="text-2xl font-serif font-bold">Payment Method</h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 p-8 border-2 border-[#D4A574] bg-[#D4A574]/5 flex items-center justify-between cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full border-4 border-[#D4A574] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#D4A574]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-lg uppercase font-serif tracking-tight">Cash on Delivery</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest">Pay when you receive your order</span>
                    </div>
                  </div>
                  <Banknote className="w-8 h-8 text-[#D4A574] opacity-20" />
                </div>
              </div>
              <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-[0.2em] text-center">
                Currently, we only accept cash on delivery for all urban orders.
              </p>
            </section>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] text-white p-10 sticky top-32 shadow-2xl">
              <h3 className="text-3xl font-serif font-bold mb-8">Your Order</h3>
              
              <div className="space-y-6 mb-10 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm font-light">
                    <div className="flex items-center gap-3">
                      <span className="text-[#D4A574] font-bold">{item.quantity}x</span>
                      <span className="truncate max-w-[120px]">{item.name}</span>
                    </div>
                    <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/10 space-y-4 mb-10">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Delivery Fee</span>
                  <span>Rs. {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-2xl font-serif pt-4 border-t border-white/5">
                  <span>Total</span>
                  <span className="text-[#D4A574]">Rs. {(total + deliveryFee).toLocaleString()}</span>
                </div>
              </div>

              <Button
                isLoading={isLoading}
                type="submit"
                className="w-full bg-[#D4A574] hover:bg-white hover:text-[#1A1A1A] text-sm tracking-widest py-5 font-accent uppercase transition-all duration-500"
              >
                CONFIRM ORDER
              </Button>

              <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-white/30 uppercase tracking-[0.2em]">
                <ShieldCheck className="w-4 h-4" /> SECURE TRANSACTIONS
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
