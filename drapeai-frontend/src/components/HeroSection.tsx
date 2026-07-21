import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="bg-[#F2F0F1] overflow-hidden pt-8 md:pt-16 pb-12 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column Text & Stats */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-8 z-10 py-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-black leading-[0.95]">
            FIND CLOTHES THAT MATCH YOUR STYLE
          </h1>

          <p className="text-black/60 text-sm sm:text-base leading-relaxed max-w-lg">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style. Experience virtual try-on with instant AI visualization.
          </p>

          <div>
            <a
              href="#catalog"
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-12 py-4 rounded-full font-semibold text-base hover:bg-black/80 transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-black/20"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Metric Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 sm:pt-8 border-t border-black/10 max-w-lg">
            <div>
              <h3 className="text-2xl sm:text-4xl font-black text-black">200+</h3>
              <p className="text-xs sm:text-sm text-black/60 font-medium">International Brands</p>
            </div>
            <div className="border-l border-black/10 pl-4 sm:pl-6">
              <h3 className="text-2xl sm:text-4xl font-black text-black">2,000+</h3>
              <p className="text-xs sm:text-sm text-black/60 font-medium">High-Quality Products</p>
            </div>
            <div className="border-l border-black/10 pl-4 sm:pl-6">
              <h3 className="text-2xl sm:text-4xl font-black text-black">30,000+</h3>
              <p className="text-xs sm:text-sm text-black/60 font-medium">Happy Customers</p>
            </div>
          </div>
        </div>

        {/* Right Column Fashion Showcase Model */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md lg:max-w-none aspect-[4/5] rounded-[24px] overflow-hidden bg-[#E5E3E4] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
              alt="High Street Fashion Model"
              className="w-full h-full object-cover object-top"
              loading="eager"
            />
            {/* Overlay AI Floating Badge */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-black">Virtual Try-On Ready</p>
                <p className="text-[11px] text-black/60">Powered by DrapeAI Engine</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
