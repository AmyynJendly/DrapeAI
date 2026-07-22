import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSection() {
  const { scrollY } = useScroll();
  // Parallax transform effect: background typography moves slower than scroll
  const yParallaxWatermark = useTransform(scrollY, [0, 800], [0, 200]);
  const yParallaxCard = useTransform(scrollY, [0, 800], [0, -60]);

  return (
    <section className="bg-[#EFE8DD] overflow-hidden pt-8 md:pt-12 pb-16 relative min-h-[90vh] flex flex-col justify-center">
      {/* 1. Oversized Scroll-Linked Parallax Watermark Text */}
      <motion.div
        style={{ y: yParallaxWatermark }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.06] z-0"
      >
        <span className="text-[22vw] font-black uppercase font-serif-luxury tracking-tighter text-black leading-none whitespace-nowrap">
          DRAPE.AI
        </span>
      </motion.div>

      {/* 2. Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full z-10 relative">
        <motion.div
          style={{ y: yParallaxCard }}
          className="bg-[#D9C4A9] rounded-[36px] p-6 sm:p-12 lg:p-16 shadow-2xl border border-black/5 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10">
              {/* Category Tag */}
              <div className="inline-flex items-center gap-2 bg-[#8C7355] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                Spring Collection
              </div>

              {/* Title in Luxury Serif Font */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-tight text-black font-serif-luxury leading-[0.95]">
                FIND CLOTHES <br />
                THAT MATCH <br />
                YOUR STYLE
              </h1>

              <p className="text-black/80 text-sm sm:text-base leading-relaxed max-w-lg font-medium">
                Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style. Experience virtual try-on with instant AI visualization.
              </p>

              <div>
                <a
                  href="#catalog"
                  className="shimmer-btn inline-flex items-center justify-center gap-2 bg-black text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-black/90 transition-all shadow-xl active:scale-95 cursor-pointer"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Fashion Model Image */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full aspect-[4/5] rounded-[28px] overflow-hidden bg-black shadow-2xl group border border-black/10">
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
                  alt="High Fashion Model"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out grayscale"
                  loading="eager"
                />

                {/* Floating Glassmorphism Badge */}
                <div className="absolute bottom-6 right-6 left-6 sm:left-auto bg-black/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 text-white shadow-2xl flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#8C7355] flex items-center justify-center text-white shadow-inner flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-white">
                      VIRTUAL TRY-ON READY
                    </p>
                    <p className="text-[11px] text-white/70 font-semibold mt-0.5">
                      Powered by DrapeAI Engine
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
