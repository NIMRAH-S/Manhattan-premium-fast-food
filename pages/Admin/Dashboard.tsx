import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import { Order } from '../../types';
import { ShoppingBag, Package, Clock, CheckCircle, XCircle, Trash2, ChefHat } from 'lucide-react';
import { toast } from 'react-hot-toast';

const STATUS_OPTIONS: Order['status'][] = ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'];

export const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = db.orders.subscribe((allOrders) => {
      setOrders(allOrders);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await db.orders.updateStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus}`, { style: { borderRadius: '0px' } });
      // No manual state update needed — onSnapshot pushes the change automatically
    } catch {
      toast.error('Failed to update order status');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!window.confirm('PERMANENTLY DELETE THIS ORDER? This cannot be undone.')) return;
    try {
      await db.orders.delete(orderId);
      toast.success('Order deleted', { style: { borderRadius: '0px' } });
      // No manual state update needed — onSnapshot pushes the change automatically
    } catch {
      toast.error('Failed to delete order');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'preparing': return <ChefHat className="w-4 h-4 text-orange-500" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Package className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700';
      case 'confirmed': return 'bg-blue-50 text-blue-700';
      case 'preparing': return 'bg-orange-50 text-orange-700';
      case 'delivered': return 'bg-green-50 text-green-700';
      case 'cancelled': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="p-8 pt-32 bg-[#F5F1E8] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-serif font-black text-[#1A1A1A] tracking-tighter uppercase">Operations.</h1>
          <p className="text-gray-500 text-sm font-light mt-2 tracking-wide uppercase font-accent">
            Real-time Order Management
          </p>
        </div>

        <div className="bg-white border border-[#E8E8E8] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-xl font-serif font-bold uppercase tracking-tight flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#D4A574]" /> Customer Orders
            </h3>
            <span className="text-[10px] font-accent tracking-widest text-gray-400 uppercase">
              Showing {orders.length} transactions
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-accent tracking-widest text-gray-400 uppercase border-b border-gray-100 bg-gray-50/30">
                  <th className="px-8 py-5">Order ID</th>
                  <th className="px-8 py-5">Customer Details</th>
                  <th className="px-8 py-5">Full Delivery Address</th>
                  <th className="px-8 py-5">Total Amount</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="w-8 h-8 border-2 border-[#D4A574] border-t-transparent rounded-full animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map(order => (
                    <tr key={order.id} className="text-sm group hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6 font-mono font-medium text-xs text-gray-400">{order.id}</td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#1A1A1A] uppercase tracking-tight">{order.customerName}</span>
                          <span className="text-[10px] text-gray-400 font-accent tracking-wider mt-1">{order.phone}</span>
                          <span className="text-[10px] text-gray-400 font-accent tracking-wider">{order.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs text-gray-600 leading-relaxed max-w-xs break-words font-light">
                          {order.address}
                        </p>
                      </td>
                      <td className="px-8 py-6 font-bold text-[#D4A574] text-lg">
                        Rs. {order.total.toLocaleString()}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <select
                            value={order.status}
                            onChange={e => handleStatusChange(order.id, e.target.value as Order['status'])}
                            className={`text-[10px] font-accent tracking-tighter uppercase px-3 py-1.5 rounded-full border-none outline-none cursor-pointer ${getStatusColor(order.status)}`}
                          >
                            {STATUS_OPTIONS.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-32 text-center text-gray-300 font-serif italic text-lg">
                      No customer orders have been placed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};