import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Deals', path: '/menu?category=Deals' },
    { name: 'About', path: '/about' },
  ];

  const isHomePage = location.pathname === '/';
  const showLogo = !isHomePage || isScrolled;

  const isActive = (path: string) => {
    const currentPath = location.pathname + location.search;
    return currentPath === path;
  };
  const { user, logout } = useAuth();

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#1A1A1A]/95 backdrop-blur-md py-3 shadow-2xl' : 'bg-transparent py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center h-12">
          {/* Logo (Left Aligned) */}
          <div className="flex-1">
            <AnimatePresence>
              {showLogo && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <Link to="/" className="group inline-block">
                    <h1 className="text-xl md:text-2xl font-serif font-black tracking-tighter text-white">
                      MANHATTAN<span className="text-[#D4A574]">.</span>
                    </h1>
                    <div className="h-px w-0 group-hover:w-full bg-[#D4A574] transition-all duration-500" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Links (Centered via margin auto) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[10px] font-accent tracking-[0.2em] uppercase transition-colors relative group ${isActive(link.path) ? 'text-[#D4A574]' : 'text-white'
                  }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-px bg-[#D4A574] transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </div>

          {/* Icons (Right Aligned) */}
          <div className="flex items-center gap-6 flex-1 justify-end">
            {/* <Link to="/admin" className="text-white hover:text-[#D4A574] transition-colors hidden sm:block">
              <User className="w-5 h-5" />
            </Link> */}
            {user ? (
              <div className="hidden sm:flex items-center gap-3 relative">
                <button
                  type="button"
                  onClick={() => setIsAdminMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-[10px] font-accent tracking-widest uppercase"
                >
                  <span>{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {isAdminMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-white/10 bg-[#1A1A1A] p-2 shadow-2xl">
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsAdminMenuOpen(false)}
                        className="block px-3 py-2 text-[10px] font-accent tracking-widest uppercase text-white/80 hover:text-[#D4A574] hover:bg-white/5 rounded-xl"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdminMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-[10px] font-accent tracking-widest uppercase text-white/40 hover:text-red-400 hover:bg-white/5 rounded-xl"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/admin/login" className="text-white hover:text-[#D4A574] transition-colors hidden sm:block">
                <User className="w-5 h-5" />
              </Link>
            )}
            <Link to="/cart" className="relative group text-white">
              <ShoppingCart className="w-6 h-6 group-hover:text-[#D4A574] transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#8B0000] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-[#1A1A1A] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-16">
              <h1 className="text-3xl font-serif font-black text-white">MANHATTAN.</h1>
              <button onClick={() => setIsMenuOpen(false)} className="text-white">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-4xl font-serif text-white hover:text-[#D4A574] transition-colors flex justify-between items-center"
                >
                  {link.name}
                  <ChevronRight className="w-8 h-8 opacity-30" />
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-4xl font-serif text-white hover:text-[#D4A574] transition-colors flex justify-between items-center"
                >
                  Admin Dashboard
                  <ChevronRight className="w-8 h-8 opacity-30" />
                </Link>
              )}
            </div>
            <div className="mt-auto pt-10 border-t border-white/10">
              <p className="text-white/50 text-sm mb-4 uppercase tracking-widest">Premium Fast Food</p>
              <p className="text-[#D4A574] font-serif text-xl">Main Broadway, City Center</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
