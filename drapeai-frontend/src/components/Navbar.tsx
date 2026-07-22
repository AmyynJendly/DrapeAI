import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Sparkles, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-4 sm:px-8 sticky top-0 z-40 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-black flex items-center gap-1.5 active:scale-95 transition-transform">
            DRAPE.AI
            <span className="inline-flex items-center justify-center bg-black text-white p-1.5 rounded-full text-[10px]">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#catalog" className="nav-link-hover text-black text-sm font-bold tracking-wide uppercase transition">
              Shop
            </a>
            <a href="#catalog" className="nav-link-hover text-black text-sm font-bold tracking-wide uppercase transition">
              On Sale
            </a>
            <a href="#catalog" className="nav-link-hover text-black text-sm font-bold tracking-wide uppercase transition">
              New Arrivals
            </a>
            <Link to="/orders" className="nav-link-hover text-black text-sm font-bold tracking-wide uppercase transition">
              My Orders
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-md items-center bg-[#F0EEED] rounded-full px-4 py-2.5 text-sm text-black border border-transparent focus-within:border-black focus-within:bg-white transition-all shadow-inner">
          <Search className="w-4 h-4 text-black/40 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search for products, brands..."
            className="bg-transparent border-none outline-none w-full text-black placeholder:text-black/40 text-sm font-medium"
          />
        </div>

        {/* Action Icons & Auth */}
        <div className="flex items-center gap-4">
          <button className="sm:hidden text-black hover:text-black/60 p-2 active:scale-90 transition-transform">
            <Search className="w-5 h-5" />
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative text-black hover:text-black/60 p-2 active:scale-90 transition-transform cursor-pointer"
            title="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0EEED] hover:bg-black hover:text-white transition-all text-xs font-bold text-black shadow-sm active:scale-95 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-black">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate font-bold">{user?.name}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-black/10 py-2 z-50">
                  <div className="px-4 py-2 border-b border-black/5">
                    <p className="text-xs font-bold text-black truncate">{user?.name}</p>
                    <p className="text-[11px] text-black/60 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/orders"
                    onClick={() => setShowMenu(false)}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-black hover:bg-[#F0EEED] flex items-center gap-2 transition"
                  >
                    <Package className="w-3.5 h-3.5" />
                    My Orders
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="shimmer-btn px-5 py-2 rounded-full bg-black text-white hover:bg-black/90 text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
