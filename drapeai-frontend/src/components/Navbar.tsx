import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, LogOut, Package, LayoutDashboard, Settings, CircleUserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-[100] flex justify-between items-center px-6 sm:px-12 md:px-16 h-24 bg-[#E5DAC8]/80 backdrop-blur-3xl border-b border-black/10 transition-all duration-500">
      
      {/* Left: Official Logo + Nav Links */}
      <div className="flex items-center gap-10">
        <Logo size="md" variant="dark" />

        <div className="hidden md:flex items-center gap-8">
          {['Collections', 'New Arrivals', 'The Edit', 'Designers'].map((item) => (
            <a
              key={item}
              href="#catalog"
              className="text-black/75 hover:text-black font-label-caps text-xs tracking-widest transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* Right: Search, Cart, Account */}
      <div className="flex items-center gap-6">
        {/* Search Field */}
        <div className="hidden md:flex items-center border-b border-black/20 py-1 px-2 focus-within:border-black transition-colors">
          <Search className="w-4 h-4 text-black/60 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs font-label-caps w-28 placeholder:text-black/40 text-black"
          />
        </div>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative text-black hover:scale-110 transition-transform cursor-pointer"
          aria-label="Shopping Cart"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {/* User Account */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-black/80 transition-colors shadow-lg"
              aria-label="Open account menu"
            >
              {user?.name?.charAt(0).toUpperCase() || <CircleUserRound className="w-5 h-5" />}
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-[28px] shadow-2xl border border-black/10 p-3 z-50">
                <div className="rounded-2xl bg-[#F5EFE6] px-4 py-4 border border-black/5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-black">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-black truncate">{user?.name}</p>
                      <p className="text-xs text-black/55 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-bold uppercase tracking-widest text-black/55">
                    <Link to="/account" onClick={() => setShowMenu(false)} className="rounded-xl bg-white px-3 py-2 border border-black/5 hover:border-black/15 hover:bg-black hover:text-white transition text-center">
                      Account
                    </Link>
                    <Link to="/settings" onClick={() => setShowMenu(false)} className="rounded-xl bg-white px-3 py-2 border border-black/5 hover:border-black/15 hover:bg-black hover:text-white transition text-center">
                      Settings
                    </Link>
                  </div>
                </div>
                <Link
                  to="/orders"
                  onClick={() => setShowMenu(false)}
                  className="w-full text-left px-4 py-3 mt-3 text-xs font-bold text-black hover:bg-[#F5EFE6] flex items-center gap-3 transition rounded-2xl"
                >
                  <Package className="w-4 h-4" />
                  My Orders
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowMenu(false)}
                  className="w-full text-left px-4 py-3 text-xs font-bold text-black hover:bg-[#F5EFE6] flex items-center gap-3 transition rounded-2xl"
                >
                  <Settings className="w-4 h-4" />
                  Preferences & Settings
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setShowMenu(false)}
                  className="w-full text-left px-4 py-3 text-xs font-bold text-black hover:bg-[#F5EFE6] flex items-center gap-3 transition rounded-2xl"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Portal
                </Link>
                <button
                  onClick={() => { logout(); setShowMenu(false); }}
                  className="w-full text-left px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition rounded-2xl mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-lg" aria-label="Sign in">
            <User className="w-5 h-5" />
          </Link>
        )}
      </div>
    </nav>
  );
}
