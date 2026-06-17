import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutList, ShoppingBag, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Orders', path: '/admin', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Inventory', path: '/admin/products', icon: <LayoutList className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <div className="fixed top-0 left-0 right-0 z-40 bg-[#1A1A1A] text-white pt-20">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-5 py-2.5 text-xs font-accent tracking-widest uppercase transition-all ${
                  location.pathname === item.path
                    ? 'bg-[#D4A574] text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon} {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-accent tracking-widest uppercase text-white/50 hover:text-white transition-all"
            >
              <Home className="w-4 h-4" /> View Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-accent tracking-widest uppercase text-white/50 hover:text-red-400 transition-all"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="pt-16">{children}</div>
    </div>
  );
};