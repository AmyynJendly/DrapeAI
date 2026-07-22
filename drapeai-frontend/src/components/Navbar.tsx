import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, LogOut, Package, LayoutDashboard, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

import Logo from './Logo';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="bg-[#E5DAC8]/90 backdrop-blur-md border-b border-black/8 py-4 px-8 sm:px-16 sticky top-0 z-40">
      <div className="max-w-[1440px] mx-auto grid grid-cols-3 items-center">

        {/* Left: Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {['SHOP', 'ON SALE', 'NEW ARRIVALS', 'BRANDS'].map((item) => (
            <a
              key={item}
              href="#catalog"
              className="text-black/70 text-[11px] font-semibold hover:text-black transition-colors tracking-[0.15em] font-sans"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Center: Official Brand Logo */}
        <div className="flex justify-center">
          <Logo size="md" variant="dark" />
        </div>

        {/* Right: Utility Icons */}
        <div className="flex items-center justify-end gap-5">
          <button className="text-black/70 hover:text-black transition-colors cursor-pointer" aria-label="Search">
            <Search className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative text-black/70 hover:text-black transition-colors cursor-pointer"
            aria-label="Cart"
          >
            <ShoppingBag style={{ width: 18, height: 18 }} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#5A4533] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-7 h-7 rounded-full bg-[#5A4533] text-white flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-black transition-colors"
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-3 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-black/10 py-2 z-50">
                  <div className="px-4 py-3 border-b border-black/5">
                    <p className="text-sm font-bold text-black">{user?.name}</p>
                    <p className="text-xs text-black/50 truncate">{user?.email}</p>
                  </div>
                  <Link to="/orders" onClick={() => setShowMenu(false)}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-black hover:bg-[#F5EFE6] flex items-center gap-3 transition">
                    <Package className="w-4 h-4" /> My Orders
                  </Link>
                  <Link to="/admin" onClick={() => setShowMenu(false)}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-black hover:bg-[#F5EFE6] flex items-center gap-3 transition">
                    <LayoutDashboard className="w-4 h-4" /> Admin Portal
                  </Link>
                  <button onClick={() => { logout(); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <User style={{ width: 18, height: 18 }} className="text-black/70 hover:text-black transition-colors" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
