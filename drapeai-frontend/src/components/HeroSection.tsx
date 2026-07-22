import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSection() {
  const { scrollY } = useScroll();
  const yWatermark = useTransform(scrollY, [0, 600], [0, 100]);
  const yModel = useTransform(scrollY, [0, 600], [0, -30]);

  return (
    <section className="bg-[#E5DAC8] relative overflow-hidden min-h-[85vh] flex flex-col justify-center py-12 lg:py-20">
      {/* Subtle Background Watermark */}
      <motion.div
        style={{ y: yWatermark }}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-start pointer-events-none select-none z-0 overflow-hidden px-8"
      >
        <span
          className="font-serif-luxury font-black uppercase text-[#C5B299]/35 whitespace-nowrap leading-none"
          style={{ fontSize: 'clamp(120px, 20vw, 300px)', letterSpacing: '-0.02em' }}
        >
          DRAPE.AI
        </span>
      </motion.div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#C5B299]/60 text-black text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase backdrop-blur-sm border border-black/5">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              Spring Collection 2026
            </div>

            <h1
              className="font-serif-luxury text-black font-extrabold leading-[1.05] tracking-tight uppercase"
              style={{ fontSize: 'clamp(40px, 4.8vw, 76px)' }}
            >
              Find Clothes<br />
              That Match<br />
              Your Style
            </h1>

            <p className="text-black/70 text-base leading-relaxed max-w-md font-medium">
              Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality. Experience virtual try-on with instant AI visualization.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <a
                href="#catalog"
                className="shimmer-btn inline-flex items-center gap-3 bg-black text-white px-9 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black/90 transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Full-Height High-Fashion Model Visual */}
          <motion.div
            style={{ y: yModel }}
            className="lg:col-span-6 relative h-[480px] sm:h-[580px] lg:h-[660px] w-full"
          >
            <div className="absolute inset-0 rounded-[32px] overflow-hidden bg-[#111111] shadow-2xl border border-black/10">
              <img
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80"
                alt="High Fashion Model Full Outfit"
                className="w-full h-full object-cover object-top grayscale opacity-90 transition-transform duration-700 hover:scale-105"
                loading="eager"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Glassmorphism Badge */}
              <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-xl rounded-2xl p-4 border border-white/20 text-white shadow-2xl flex items-center gap-3.5 max-w-[250px]">
                <div className="w-9 h-9 rounded-xl bg-[#5A4533] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4.5 h-4.5 text-[#D9C4A9] animate-pulse" />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-white leading-tight">
                    VIRTUAL TRY-ON READY
                  </p>
                  <p className="text-[10px] text-white/70 font-medium mt-0.5">
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
