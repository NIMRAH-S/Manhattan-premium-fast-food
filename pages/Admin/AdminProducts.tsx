import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import { Product, Category } from '../../types';
import { Button } from '../../components/common/Button';
import { CATEGORIES } from '../../constants';
import { Edit2, Trash2, Plus, X, Search, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await db.products.getAll();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!productId) {
      toast.error('Invalid Product ID');
      return;
    }
    
    if (window.confirm('PERMANENTLY DELETE PRODUCT? This action cannot be reversed.')) {
      try {
        // Immediate local state update for responsiveness
        setProducts(prev => prev.filter(p => p.id !== productId));
        
        // Update storage
        await db.products.delete(productId);
        
        toast.success('Product deleted successfully');
      } catch (err) {
        toast.error('Error deleting product');
        // Rollback state if storage update failed
        loadProducts();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || editingProduct.price === undefined) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      await db.products.save(editingProduct);
      toast.success(`Product ${editingProduct.id ? 'updated' : 'added'} successfully.`);
      setIsModalOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      toast.error('Failed to save product.');
    }
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#F5F1E8] min-h-screen pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-serif font-black text-[#1A1A1A] tracking-tighter uppercase">Inventory.</h1>
            <p className="text-gray-500 text-sm mt-2">Manage the Manhattan flavor catalog.</p>
          </div>
          <Button 
            onClick={() => { setEditingProduct({ category: 'Burgers', stock: 0, price: 0, featured: false }); setIsModalOpen(true); }}
            className="font-accent tracking-widest text-xs py-4 px-10 w-full md:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> NEW PRODUCT
          </Button>
        </div>

        <div className="bg-white border border-[#E8E8E8] shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center gap-4">
            <Search className="w-5 h-5 text-gray-300" />
            <input 
              type="text" 
              placeholder="SEARCH CATALOG..."
              className="flex-1 border-none focus:ring-0 text-sm font-accent tracking-widest outline-none bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-accent tracking-widest text-gray-400 uppercase bg-gray-50">
                  <th className="px-8 py-4">Image</th>
                  <th className="px-8 py-4">Name</th>
                  <th className="px-8 py-4">Category</th>
                  <th className="px-8 py-4">Price</th>
                  <th className="px-8 py-4">Stock</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-[#D4A574] border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-accent tracking-widest text-gray-400 uppercase">Synchronizing Catalog...</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length > 0 ? (
                  filtered.map(product => (
                    <tr key={product.id} className="text-sm hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="w-12 h-12 bg-gray-100 overflow-hidden">
                          <img src={product.image} className="w-full h-full object-cover" alt="" />
                        </div>
                      </td>
                      <td className="px-8 py-4 font-bold">{product.name}</td>
                      <td className="px-8 py-4">
                        <span className="text-[10px] font-accent tracking-widest uppercase border border-gray-200 px-2 py-1">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-8 py-4 font-accent text-lg">Rs. {product.price.toLocaleString()}</td>
                      <td className="px-8 py-4">
                        <span className={`font-bold ${product.stock < 10 ? 'text-red-500' : 'text-gray-600'}`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right space-x-2">
                        <button 
                          type="button"
                          onClick={() => handleEdit(product)} 
                          className="p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDelete(product.id)} 
                          className="p-2 text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-gray-400 font-serif italic">
                      No matching products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] bg-[#1A1A1A]/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg relative max-h-[90vh] overflow-y-auto shadow-2xl rounded-sm">
            <button onClick={() => setIsModalOpen(false)} className="sticky top-6 float-right mr-6 text-gray-400 hover:text-black z-20">
              <X className="w-8 h-8" />
            </button>
            <form onSubmit={handleSubmit} className="p-8 md:p-10 clear-both">
              <h2 className="text-4xl font-serif font-black mb-10 tracking-tighter uppercase">
                {editingProduct?.id ? 'Edit flavor.' : 'New flavor.'}
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-accent tracking-widest uppercase text-gray-400">Product Name</label>
                  <input 
                    required type="text" 
                    value={editingProduct?.name || ''} 
                    onChange={e => setEditingProduct({...editingProduct!, name: e.target.value})}
                    className="w-full bg-[#F5F1E8] border-none p-4 text-sm focus:ring-1 focus:ring-[#D4A574] outline-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-accent tracking-widest uppercase text-gray-400">Category</label>
                    <select 
                      value={editingProduct?.category}
                      onChange={e => setEditingProduct({...editingProduct!, category: e.target.value as Category})}
                      className="w-full bg-[#F5F1E8] border-none p-4 text-sm focus:ring-1 focus:ring-[#D4A574] outline-none"
                    >
                      {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-accent tracking-widest uppercase text-gray-400">Price (Rs.)</label>
                    <input 
                      required type="number" step="1" 
                      value={editingProduct?.price || ''} 
                      onChange={e => setEditingProduct({...editingProduct!, price: parseFloat(e.target.value)})}
                      className="w-full bg-[#F5F1E8] border-none p-4 text-sm focus:ring-1 focus:ring-[#D4A574] outline-none" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-accent tracking-widest uppercase text-gray-400">Stock</label>
                    <input 
                      required type="number" 
                      value={editingProduct?.stock || 0} 
                      onChange={e => setEditingProduct({...editingProduct!, stock: parseInt(e.target.value)})}
                      className="w-full bg-[#F5F1E8] border-none p-4 text-sm focus:ring-1 focus:ring-[#D4A574] outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-accent tracking-widest uppercase text-gray-400">Calories</label>
                    <input 
                      type="number" 
                      value={editingProduct?.calories || ''} 
                      onChange={e => setEditingProduct({...editingProduct!, calories: parseInt(e.target.value)})}
                      className="w-full bg-[#F5F1E8] border-none p-4 text-sm focus:ring-1 focus:ring-[#D4A574] outline-none" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-accent tracking-widest uppercase text-gray-400">Image URL</label>
                  <div className="flex gap-4">
                    <input 
                      required type="text" 
                      value={editingProduct?.image || ''} 
                      onChange={e => setEditingProduct({...editingProduct!, image: e.target.value})}
                      className="flex-1 bg-[#F5F1E8] border-none p-4 text-sm focus:ring-1 focus:ring-[#D4A574] outline-none" 
                    />
                    <div className="w-14 h-14 bg-gray-100 flex items-center justify-center shrink-0">
                      {editingProduct?.image ? (
                        <img src={editingProduct.image} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <ImageIcon className="text-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-accent tracking-widest uppercase text-gray-400">Description</label>
                  <textarea 
                    required 
                    value={editingProduct?.description || ''} 
                    onChange={e => setEditingProduct({...editingProduct!, description: e.target.value})}
                    rows={3} 
                    className="w-full bg-[#F5F1E8] border-none p-4 text-sm focus:ring-1 focus:ring-[#D4A574] outline-none" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" id="featured" 
                    checked={editingProduct?.featured || false} 
                    onChange={e => setEditingProduct({...editingProduct!, featured: e.target.checked})}
                    className="w-4 h-4 text-[#D4A574] focus:ring-[#D4A574] cursor-pointer" 
                  />
                  <label htmlFor="featured" className="text-xs uppercase tracking-widest font-accent cursor-pointer">Feature on homepage</label>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full mt-10 py-5 uppercase tracking-widest font-accent">
                {editingProduct?.id ? 'UPDATE PRODUCT' : 'ADD TO CATALOG'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
