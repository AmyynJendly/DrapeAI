import React from 'react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="w-full bg-[#111111] text-white pt-20 pb-12 px-6 sm:px-12 md:px-16 text-center border-t border-white/10">
      <div className="max-w-[1440px] mx-auto w-full flex flex-col items-center gap-16">
        
        {/* Top Newsletter Header */}
        <div className="flex flex-col items-center gap-6 max-w-2xl">
          <Logo size="lg" variant="light" />
          
          <p className="font-sans text-base text-white/70 font-normal leading-relaxed">
            Join our inner circle for exclusive access to new arrivals, sustainable initiatives, and AI-curated style edits.
          </p>

          <div className="w-full flex flex-col sm:flex-row gap-4 mt-2 max-w-md">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 bg-transparent border-b border-white/30 py-3 px-2 focus:outline-none focus:border-white transition-colors text-white placeholder:text-white/40 text-sm font-sans"
            />
            <button className="bg-white text-black px-8 py-3.5 rounded-full font-label-caps text-xs font-bold hover:bg-white/90 transition-colors uppercase tracking-widest cursor-pointer">
              Sign Up
            </button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full text-left pt-16 border-t border-white/10">
          <div className="flex flex-col gap-5">
            <span className="font-label-caps text-xs text-white/40 tracking-widest uppercase font-bold">Shop</span>
            <a href="#catalog" className="text-sm text-white/80 hover:text-white transition-colors">Collections</a>
            <a href="#catalog" className="text-sm text-white/80 hover:text-white transition-colors">New Arrivals</a>
            <a href="#catalog" className="text-sm text-white/80 hover:text-white transition-colors">Sale</a>
          </div>

          <div className="flex flex-col gap-5">
            <span className="font-label-caps text-xs text-white/40 tracking-widest uppercase font-bold">About</span>
            <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Sustainability</a>
            <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Press</a>
            <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Contact</a>
          </div>

          <div className="flex flex-col gap-5">
            <span className="font-label-caps text-xs text-white/40 tracking-widest uppercase font-bold">Legal</span>
            <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Shipping & Returns</a>
            <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Terms</a>
          </div>

          <div className="flex flex-col gap-5">
            <span className="font-label-caps text-xs text-white/40 tracking-widest uppercase font-bold">Follow</span>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <span className="text-xs font-bold">IG</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <span className="text-xs font-bold">TW</span>
              </a>
            </div>
          </div>
        </div>

        <p className="font-label-caps text-xs text-white/40 tracking-widest pt-8 border-t border-white/5 w-full">
          © 2026 DRAPE.AI. ALL RIGHTS RESERVED.
        </p>

      </div>
    </footer>
  );
}
