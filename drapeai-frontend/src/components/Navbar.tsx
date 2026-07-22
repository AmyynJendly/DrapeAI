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
    <nav className="bg-[#EFE8DD]/90 border-b border-black/10 py-4 px-4 sm:px-8 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-black flex items-center gap-2 font-serif-luxury active:scale-95 transition-transform">
            Drape.AI
            <span className="inline-flex items-center justify-center bg-black text-white p-1 rounded-full text-[10px]">
              <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#catalog" className="nav-link-hover text-black text-xs font-bold tracking-widest uppercase transition">
              Shop
            </a>
            <a href="#catalog" className="nav-link-hover text-black text-xs font-bold tracking-widest uppercase transition">
              On Sale
            </a>
            <a href="#catalog" className="nav-link-hover text-black text-xs font-bold tracking-widest uppercase transition">
              New Arrivals
            </a>
            <a href="#brands" className="nav-link-hover text-black text-xs font-bold tracking-widest uppercase transition">
              Brands
            </a>
            <Link to="/orders" className="nav-link-hover text-black text-xs font-bold tracking-widest uppercase transition">
              My Orders
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-xs lg:max-w-md items-center bg-[#D9C4A9]/50 rounded-full px-4 py-2 text-xs text-black border border-transparent focus-within:border-black focus-within:bg-white transition-all shadow-inner">
          <Search className="w-4 h-4 text-black/50 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search for products, brands..."
            className="bg-transparent border-none outline-none w-full text-black placeholder:text-black/50 text-xs font-medium"
          />
        </div>

        {/* Action Controls & Auth */}
        <div className="flex items-center gap-4">
          <button className="sm:hidden text-black hover:text-black/60 p-2 active:scale-90 transition-transform">
            <Search className="w-5 h-5" />
          </button>

          {/* Cart Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1.5 bg-[#D9C4A9]/60 hover:bg-black hover:text-white px-3 py-1.5 rounded-full text-xs font-bold text-black transition-all active:scale-95 cursor-pointer shadow-sm"
            title="View Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="bg-black text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D9C4A9] hover:bg-black hover:text-white transition-all text-xs font-bold text-black shadow-sm active:scale-95 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-black">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate font-bold">{user?.name}</span>
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

                  <Link
                    to="/admin"
                    onClick={() => setShowMenu(false)}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-black hover:bg-[#F0EEED] flex items-center gap-2 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                    Admin Portal
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
