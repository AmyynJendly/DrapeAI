import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSection() {
  const { scrollY } = useScroll();
  const yWatermark = useTransform(scrollY, [0, 700], [0, 150]);
  const yModel = useTransform(scrollY, [0, 700], [0, -40]);

  return (
    <header className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-[#E5DAC8]">
      {/* Floating Watermark Background */}
      <motion.div
        style={{ y: yWatermark }}
        className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none"
      >
        <div className="watermark-text font-watermark text-[28vw] uppercase leading-none opacity-20">
          DRAPE
        </div>
      </motion.div>

      {/* Hero Container */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 grid grid-cols-12 gap-8 relative z-10 w-full py-12">
        {/* Left Text Content */}
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-center">
          <span className="bg-[#D9C4A9] text-black px-4 py-1.5 rounded-full w-fit mb-6 font-label-caps text-xs tracking-widest font-semibold border border-black/5">
            Spring Collection
          </span>

          <h2 className="font-serif-luxury text-5xl sm:text-6xl lg:text-[76px] lg:leading-[86px] mb-8 text-black font-extrabold tracking-tight uppercase">
            FIND CLOTHES<br />
            THAT MATCH<br />
            YOUR STYLE
          </h2>

          <p className="font-sans text-base text-black/75 max-w-md mb-10 leading-relaxed">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style. Experience virtual try-on with instant AI visualization.
          </p>

          <div className="flex gap-4">
            <a
              href="#catalog"
              className="shimmer-btn bg-black text-white px-10 py-5 rounded-full font-label-caps text-xs tracking-widest flex items-center gap-3 hover:bg-black/90 transition-all group shadow-xl active:scale-95 cursor-pointer"
            >
              Shop Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>

        {/* Right Visual Content */}
        <motion.div
          style={{ y: yModel }}
          className="col-span-12 lg:col-span-6 relative mt-12 lg:mt-0"
        >
          {/* Tan Design Block Background */}
          <div className="absolute -right-6 -bottom-6 w-[85%] h-[75%] bg-[#C5B299]/50 -z-10 rounded-3xl" />

          {/* Model Card */}
          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-[#111111] border border-black/10">
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80"
              alt="Model in Tailored Suit"
              className="w-full h-full object-cover grayscale opacity-90 transition-transform duration-700 hover:scale-105"
            />

            {/* AI Try-on Badge */}
            <div className="absolute bottom-8 right-8 bg-black/40 backdrop-blur-2xl border border-white/20 p-5 rounded-2xl flex flex-col items-center gap-2 max-w-[210px] text-center shadow-2xl">
              <div className="w-10 h-10 bg-[#5A4533] rounded-xl flex items-center justify-center mb-1">
                <Sparkles className="w-5 h-5 text-[#D9C4A9] animate-pulse" />
              </div>
              <span className="font-label-caps text-[11px] text-white tracking-widest leading-tight font-extrabold">
                VIRTUAL TRY-ON READY
              </span>
              <span className="text-[9px] text-white/70 uppercase tracking-wider">
                Powered by DrapeAI Engine
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
