import React from 'react';
import { Search, ShoppingBag, User, Sparkles } from 'lucide-react';

interface NavbarProps {
  cartCount?: number;
}

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-4 sm:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <a href="#" className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-black flex items-center gap-1.5">
            DRAPE.AI
            <span className="inline-flex items-center justify-center bg-black text-white p-1 rounded-full text-[10px]">
              <Sparkles className="w-3 h-3 text-yellow-400" />
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#catalog" className="text-black hover:text-black/60 text-sm font-medium transition">
              Shop
            </a>
            <a href="#catalog" className="text-black hover:text-black/60 text-sm font-medium transition">
              On Sale
            </a>
            <a href="#catalog" className="text-black hover:text-black/60 text-sm font-medium transition">
              New Arrivals
            </a>
            <a href="#brands" className="text-black hover:text-black/60 text-sm font-medium transition">
              Brands
            </a>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-md items-center bg-[#F0EEED] rounded-full px-4 py-2.5 text-sm text-black">
          <Search className="w-4 h-4 text-black/40 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search for products, brands..."
            className="bg-transparent border-none outline-none w-full text-black placeholder:text-black/40 text-sm"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          <button className="sm:hidden text-black hover:text-black/60 p-2">
            <Search className="w-5 h-5" />
          </button>

          <button className="relative text-black hover:text-black/60 p-2 transition">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button className="text-black hover:text-black/60 p-2 transition">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
