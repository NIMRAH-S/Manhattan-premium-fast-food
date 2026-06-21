import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db as firestore } from './firebase';
import { Product, Order, AdminLog } from '../types';

const COLLECTIONS = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  LOGS: 'logs',
};

export const db = {
  products: {
    // One-time fetch (used where a snapshot listener isn't set up, e.g. Home/Menu on first paint)
    getAll: async (): Promise<Product[]> => {
      const snap = await getDocs(collection(firestore, COLLECTIONS.PRODUCTS));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
    },

    getById: async (id: string): Promise<Product | undefined> => {
      const ref = doc(firestore, COLLECTIONS.PRODUCTS, id);
      const snap = await getDoc(ref);
      return snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : undefined;
    },

    // Real-time listener — call this from components instead of getAll() where live updates matter
    subscribe: (callback: (products: Product[]) => void): Unsubscribe => {
      const ref = collection(firestore, COLLECTIONS.PRODUCTS);
      return onSnapshot(ref, snap => {
        const products = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
        callback(products);
      });
    },

    save: async (product: Partial<Product>): Promise<Product> => {
      if (product.id) {
        // Update existing
        const ref = doc(firestore, COLLECTIONS.PRODUCTS, product.id);
        const { id, ...data } = product;
        await setDoc(ref, data, { merge: true });
        return product as Product;
      } else {
        // Create new — let Firestore generate the ID
        const { id, ...data } = product;
        const payload = {
          ...data,
          stock: product.stock || 0,
          featured: product.featured || false,
        };
        const docRef = await addDoc(collection(firestore, COLLECTIONS.PRODUCTS), payload);
        return { id: docRef.id, ...payload } as Product;
      }
    },

    delete: async (id: string): Promise<void> => {
      await deleteDoc(doc(firestore, COLLECTIONS.PRODUCTS, id));
    },
  },

  orders: {
    getAll: async (): Promise<Order[]> => {
      const q = query(collection(firestore, COLLECTIONS.ORDERS), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
    },

    // Real-time listener for the admin dashboard
    subscribe: (callback: (orders: Order[]) => void): Unsubscribe => {
      const q = query(collection(firestore, COLLECTIONS.ORDERS), orderBy('createdAt', 'desc'));
      return onSnapshot(q, snap => {
        const orders = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
        callback(orders);
      });
    },

    create: async (order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
      const payload = {
        ...order,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(firestore, COLLECTIONS.ORDERS), payload);
      return { id: docRef.id, ...payload };
    },

    updateStatus: async (id: string, status: Order['status']): Promise<void> => {
      const ref = doc(firestore, COLLECTIONS.ORDERS, id);
      await updateDoc(ref, { status });
    },

    delete: async (id: string): Promise<void> => {
      await deleteDoc(doc(firestore, COLLECTIONS.ORDERS, id));
    },
  },

  logs: {
    create: async (log: Omit<AdminLog, 'id' | 'timestamp'>): Promise<void> => {
      await addDoc(collection(firestore, COLLECTIONS.LOGS), {
        ...log,
        timestamp: new Date().toISOString(),
      });
    },

    getAll: async (): Promise<AdminLog[]> => {
      const q = query(collection(firestore, COLLECTIONS.LOGS), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminLog));
    },
  },
};