import { Product, Order, AdminLog, Category } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

const DB_KEYS = {
  PRODUCTS: 'manhattan_products',
  ORDERS: 'manhattan_orders',
  LOGS: 'manhattan_logs',
};

const initDB = () => {
  if (!localStorage.getItem(DB_KEYS.PRODUCTS)) {
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(DB_KEYS.ORDERS)) {
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(DB_KEYS.LOGS)) {
    localStorage.setItem(DB_KEYS.LOGS, JSON.stringify([]));
  }
};

initDB();

export const db = {
  products: {
    getAll: async (): Promise<Product[]> => {
      return JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS) || '[]');
    },
    getById: async (id: string): Promise<Product | undefined> => {
      const products = await db.products.getAll();
      return products.find(p => p.id === id);
    },
    save: async (product: Partial<Product>): Promise<Product> => {
      const products = await db.products.getAll();
      let updatedProduct: Product;

      if (product.id) {
        const index = products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          updatedProduct = { ...products[index], ...product } as Product;
          products[index] = updatedProduct;
        } else {
          updatedProduct = product as Product;
          products.push(updatedProduct);
        }
      } else {
        updatedProduct = {
          ...product,
          id: Math.random().toString(36).substr(2, 9),
          stock: product.stock || 0,
          featured: product.featured || false,
        } as Product;
        products.push(updatedProduct);
      }

      localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
      return updatedProduct;
    },
    delete: async (id: string): Promise<void> => {
      const products = JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS) || '[]');
      const filtered = products.filter((p: Product) => p.id !== id);
      localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(filtered));
      return Promise.resolve();
    },
  },
  orders: {
    getAll: async (): Promise<Order[]> => {
      return JSON.parse(localStorage.getItem(DB_KEYS.ORDERS) || '[]');
    },
    create: async (order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
      const orders = await db.orders.getAll();
      const newOrder: Order = {
        ...order,
        id: `ORD-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      orders.push(newOrder);
      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
      return newOrder;
    },
    updateStatus: async (id: string, status: Order['status']): Promise<void> => {
      const orders = await db.orders.getAll();
      const index = orders.findIndex(o => o.id === id);
      if (index !== -1) {
        orders[index].status = status;
        localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
      }
    },
    delete: async (id: string): Promise<void> => {
      const orders = await db.orders.getAll();
      const filtered = orders.filter(o => o.id !== id);
      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(filtered));
    },
  },
  logs: {
    create: async (log: Omit<AdminLog, 'id' | 'timestamp'>): Promise<void> => {
      const logs = JSON.parse(localStorage.getItem(DB_KEYS.LOGS) || '[]');
      logs.unshift({
        ...log,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(DB_KEYS.LOGS, JSON.stringify(logs.slice(0, 100)));
    },
    getAll: async (): Promise<AdminLog[]> => {
      return JSON.parse(localStorage.getItem(DB_KEYS.LOGS) || '[]');
    },
  },
};