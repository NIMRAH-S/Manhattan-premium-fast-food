import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { AdminLayout } from './components/layout/AdminLayout';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { AdminDashboard } from './pages/Admin/Dashboard';
import { AdminProducts } from './pages/Admin/AdminProducts';
import { AdminLogin } from './pages/Admin/LoginPage';
import { About } from './pages/About';

const ForceHomeOnMount: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, []);
  return null;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isLoadingAuth } = useAuth();
  if (isLoadingAuth) return null;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return <AdminLayout>{children}</AdminLayout>;
};

const AppContent: React.FC = () => {
  const { isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-3xl font-serif font-black text-white tracking-tighter">
            MANHATTAN<span className="text-[#D4A574]">.</span>
          </h1>
          <div className="w-8 h-8 border-2 border-[#D4A574] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/30 text-[10px] font-accent tracking-widest uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ForceHomeOnMount />
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="bg-[#1A1A1A] text-white py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-serif font-black mb-6">MANHATTAN.</h2>
            <p className="text-white/40 font-light max-w-sm leading-relaxed">
              Redefining the urban dining experience with premium ingredients and cinematic presentation. Proudly serving the heart of Faisalabad City since 2024.
            </p>
          </div>
          <div>
            <h4 className="font-accent tracking-widest text-sm text-[#D4A574] mb-6 uppercase">Locations</h4>
            <p className="text-white/60 font-light text-sm">F4R3+687</p>
            <p className="text-white/60 font-light text-sm">Millat Town</p>
            <p className="text-white/60 font-light text-sm">Faisalabad</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-accent tracking-widest text-white/30">
          <p>© 2024 MANHATTAN PREMIUM FAST FOOD. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
          <Toaster position="bottom-right" />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;