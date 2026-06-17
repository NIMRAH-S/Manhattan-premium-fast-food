export type Category = 'Pizza' | 'Burgers' | 'Pasta' | 'Fries' | 'Wraps' | 'Sandwiches' | 'Fried Items' | 'Deals' | 'Beverages' | 'Dizaster' | 'Spin Rolls' | 'Platters' | 'Pizza Pie' | 'Add Ons' | 'Shawarma' | 'Paratha' | 'Desserts';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  image: string;
  stock: number;
  featured: boolean;
  calories?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  email?: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  name: string;
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  details: string;
}
