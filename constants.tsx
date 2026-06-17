import React from 'react';
import { Pizza, Ham, Sandwich, Utensils, Zap, Gift, LayoutGrid, Beef } from 'lucide-react';
import { Category } from './types';

export const COLORS = {
  primary: '#D4A574', // Caramel
  charcoal: '#1A1A1A',
  burgundy: '#8B0000',
  cream: '#F5F1E8',
  softGray: '#E8E8E8'
};

// export const CATEGORIES: { name: Category; icon: React.ReactNode }[] = [
//   { name: 'Pizza', icon: <Pizza className="w-5 h-5" /> },
//   { name: 'Burgers', icon: <Ham className="w-5 h-5" /> },
//   { name: 'Pasta', icon: <Utensils className="w-5 h-5" /> },
//   { name: 'Fries', icon: <Zap className="w-5 h-5" /> },
//   { name: 'Wraps', icon: <LayoutGrid className="w-5 h-5" /> },
//   { name: 'Sandwiches', icon: <Sandwich className="w-5 h-5" /> },
//   { name: 'Fried Items', icon: <Beef className="w-5 h-5" /> },
//   { name: 'Deals', icon: <Gift className="w-5 h-5" /> },
// ];

export const CATEGORIES: { name: Category; icon: React.ReactNode }[] = [
  { name: 'Pizza', icon: <Pizza className="w-5 h-5" /> },
  { name: 'Pizza Pie', icon: <Pizza className="w-5 h-5" /> },

  { name: 'Burgers', icon: <Ham className="w-5 h-5" /> },
  { name: 'Sandwiches', icon: <Sandwich className="w-5 h-5" /> },
  { name: 'Wraps', icon: <LayoutGrid className="w-5 h-5" /> },
  { name: 'Shawarma', icon: <LayoutGrid className="w-5 h-5" /> },
  { name: 'Paratha', icon: <LayoutGrid className="w-5 h-5" /> },

  { name: 'Pasta', icon: <Utensils className="w-5 h-5" /> },
  { name: 'Fries', icon: <Zap className="w-5 h-5" /> },
  { name: 'Fried Items', icon: <Beef className="w-5 h-5" /> },
  { name: 'Spin Rolls', icon: <Beef className="w-5 h-5" /> },

  { name: 'Platters', icon: <Beef className="w-5 h-5" /> },
  { name: 'Deals', icon: <Gift className="w-5 h-5" /> },
  { name: 'Add Ons', icon: <Gift className="w-5 h-5" /> },

  { name: 'Beverages', icon: <Utensils className="w-5 h-5" /> },
  { name: 'Desserts', icon: <Utensils className="w-5 h-5" /> },
];

export const INITIAL_PRODUCTS = [
  {
    id: '1',
    name: "Zinger Burger",
    category: "Burgers" as Category,
    price: 350,
    description: "Crunchy spicy chicken fillet topped with crisp lettuce and rich zinger mayo, tucked into a warm toasted bun.",
    stock: 45,
    featured: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8OKUoBfBcWug_um5fiPD3hGV5f8VbDWdOYg&s",
    calories: 850
  },
  {
    id: '2',
    name: "Malai Boti Pizza (Large)",
    category: "Pizza" as Category,
    price: 1199,
    description: "Succulent malai boti chicken in a rich creamy marinade, paired with melted mozzarella and baked on a golden crust.",
    stock: 22,
    featured: true,
    image: "https://i.ytimg.com/vi/A4IzCu349Ds/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCZ0iRGwmEOYz6Ax3cewsOCNva-Eg",
    calories: 1100
  },
  {
    id: '3',
    name: "Crunchy Pasta (Full)",
    category: "Pasta" as Category,
    price: 680,
    description: "Golden crunchy pasta coated in a creamy cheesy sauce, packed with bold flavor and texture.",
    stock: 15,
    featured: false,
    image: "https://pkgiftshop.com/user_files/product_images/1694601178-pJQPzi.webp",
    calories: 620
  },
  {
    id: '4',
    name: "Ultimate Loaded Fries",
    category: "Loaded Fries" as Category,
    price: 500,
    description: "Golden crispy fries piled high with melted cheese, savory toppings, and signature loaded sauce.",
    stock: 50,
    featured: true,
    image: "https://www.charleys.com/wp-content/uploads/2021/09/18354060c4644541a54c9ac6e38f47e4.jpg",
    calories: 780
  },
  {
    id: '5',
    name: "Mexican Sandwich",
    category: "Sandwiches" as Category,
    price: 600,
    description: "Tender chicken, gooey melted cheese, and fresh vegetables with a hint of Mexican spice in a toasted sandwich.",
    stock: 12,
    featured: false,
    image: "https://www.mexicanplease.com/wp-content/uploads/2017/07/mexican-cuban-sandwich-after-cooking-flattened-angled.jpg",
    calories: 450
  },
  {
    id: '6',
    name: "Manhattan Special Deal 1",
    category: "Deals" as Category,
    price: 2499,
    description: "A value-packed deal with 1 Large Special Pizza, 2 Zinger Burgers, 10 Hot Wings, and a 1.5 Ltr Drink.",
    stock: 30,
    featured: true,
    image: "https://images.deliveryhero.io/image/fd-pk/LH/t3ik-listing.jpg",
    calories: 1800
  }
];
