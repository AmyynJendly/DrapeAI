import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSection() {
  const { scrollY } = useScroll();
  const yWatermark = useTransform(scrollY, [0, 700], [0, 140]);
  const yModel = useTransform(scrollY, [0, 700], [0, -40]);

  return (
    <section className="bg-[#E5DAC8] relative overflow-hidden min-h-[85vh] flex flex-col justify-center py-8">
      {/* Giant Scroll-Linked Watermark — Bodoni Moda serif */}
      <motion.div
        style={{ y: yWatermark }}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
      >
        <span
          className="font-serif-luxury font-black uppercase text-[#C5B299] whitespace-nowrap leading-none opacity-40"
          style={{ fontSize: 'clamp(140px, 24vw, 360px)', letterSpacing: '-0.03em' }}
        >
          DRAPE
        </span>
      </motion.div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Content */}
          <div className="lg:col-span-6 space-y-6 pt-4 lg:pt-0">
            {/* Spring Collection Pill */}
            <div className="inline-flex items-center bg-[#C5B299]/70 text-[#3B2E22] text-[11px] font-bold px-4 py-1.5 rounded-full tracking-[0.15em] uppercase border border-[#B5A289]/40">
              SPRING COLLECTION
            </div>

            {/* Headline */}
            <h1
              className="font-serif-luxury uppercase text-black leading-[0.92] font-black tracking-tight"
              style={{ fontSize: 'clamp(44px, 5.5vw, 84px)' }}
            >
              FIND<br />
              CLOTHES<br />
              THAT<br />
              MATCH<br />
              YOUR STYLE
            </h1>

            {/* Description */}
            <p className="text-black/70 text-sm sm:text-base leading-relaxed max-w-md font-normal font-sans">
              Experience the intersection of high fashion and artificial intelligence. Curate your personal aesthetic with our precision-engineered recommendation engine.
            </p>

            {/* CTA */}
            <div className="pt-2">
              <a
                href="#catalog"
                className="shimmer-btn inline-flex items-center justify-center gap-3 bg-black text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black/90 transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Large Rounded Dark Model Panel */}
          <motion.div
            style={{ y: yModel }}
            className="lg:col-span-6 relative h-[520px] sm:h-[640px] lg:h-[720px] w-full"
          >
            <div className="absolute inset-0 rounded-[36px] overflow-hidden bg-[#1A1A1A] shadow-2xl border border-black/10">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80"
                alt="High Fashion Model in White Blazer Suit"
                className="w-full h-full object-cover object-top grayscale opacity-90 transition-transform duration-700 hover:scale-105"
                loading="eager"
              />
              
              {/* Subtle dark gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

              {/* Floating Glassmorphism Badge */}
              <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/20 text-white shadow-2xl flex items-center gap-3.5 max-w-[260px]">
                <div className="w-9 h-9 rounded-xl bg-[#5A4533] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4.5 h-4.5 text-[#D9C4A9] animate-pulse" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.15em] text-white leading-tight">
                    VIRTUAL TRY-ON READY
                  </p>
                  <p className="text-[10px] text-white/60 font-medium mt-0.5">
                    Powered by DrapeAI Engine
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
