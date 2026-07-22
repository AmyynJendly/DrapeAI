import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EditorialShowcase() {
  return (
    <section className="bg-[#E5DAC8] py-16 px-6 sm:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Unified Luxury Editorial Card */}
        <div className="bg-[#111111] rounded-[36px] overflow-hidden shadow-2xl border border-white/10 text-white grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Left Column: Full-Height Fashion Visual */}
          <div className="lg:col-span-6 relative h-[360px] sm:h-[480px] lg:h-[540px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
              alt="High-Fashion Editorial Model"
              className="w-full h-full object-cover object-center grayscale hover:grayscale-0 hover:scale-105 transition-all duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#111111]/80 hidden lg:block" />
          </div>

          {/* Right Column: Editorial Text Content */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 space-y-6">
            <div className="inline-flex items-center gap-2 text-[#D9C4A9] text-xs font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" />
              Digital Haute Couture
            </div>

            <h2
              className="font-serif-luxury uppercase font-black text-white leading-[1.1] tracking-tight"
              style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}
            >
              Discover The Latest<br />
              Trends & Innovations<br />
              In Digital Fashion.
            </h2>

            <p className="text-white/70 text-sm font-medium leading-relaxed max-w-md">
              Experience high-street haute couture blended seamlessly with state-of-the-art virtual fitting technology. Visualize any garment on yourself in real time.
            </p>

            <div className="pt-2">
              <a
                href="#catalog"
                className="inline-flex items-center gap-3 border-2 border-white text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer active:scale-95"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
