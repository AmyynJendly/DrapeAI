import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function HeroSection() {
  return (
    <section className="bg-[#F2F0F1] overflow-hidden pt-8 md:pt-16 pb-12 md:pb-0 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column Text & Animated Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-8 z-10 py-6"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-black leading-[0.95]">
            FIND CLOTHES THAT MATCH YOUR STYLE
          </h1>

          <p className="text-black/60 text-sm sm:text-base leading-relaxed max-w-lg font-medium">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style. Experience virtual try-on with instant AI visualization.
          </p>

          <div>
            <a
              href="#catalog"
              className="shimmer-btn inline-flex items-center justify-center gap-2 bg-black text-white px-12 py-4 rounded-full font-semibold text-base hover:bg-black/90 transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-black/20 active:scale-95 cursor-pointer"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Metric Stats with Animated Count-Up */}
          <div className="grid grid-cols-3 gap-4 pt-6 sm:pt-8 border-t border-black/10 max-w-lg">
            <div>
              <h3 className="text-2xl sm:text-4xl font-black text-black">
                <AnimatedCounter end={200} suffix="+" />
              </h3>
              <p className="text-xs sm:text-sm text-black/60 font-semibold">International Brands</p>
            </div>
            <div className="border-l border-black/10 pl-4 sm:pl-6">
              <h3 className="text-2xl sm:text-4xl font-black text-black">
                <AnimatedCounter end={2000} suffix="+" />
              </h3>
              <p className="text-xs sm:text-sm text-black/60 font-semibold">High-Quality Products</p>
            </div>
            <div className="border-l border-black/10 pl-4 sm:pl-6">
              <h3 className="text-2xl sm:text-4xl font-black text-black">
                <AnimatedCounter end={30000} suffix="+" />
              </h3>
              <p className="text-xs sm:text-sm text-black/60 font-semibold">Happy Customers</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column Fashion Showcase Model */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="lg:col-span-5 relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-md lg:max-w-none aspect-[4/5] rounded-[28px] overflow-hidden bg-[#E5E3E4] shadow-2xl group">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
              alt="High Street Fashion Model"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="eager"
            />
            {/* Floating Badge with Green Glowing Pulsing Halo Ring */}
            <div className="absolute bottom-6 left-6 right-6 sm:right-auto bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/80 flex items-center gap-3.5">
              <div className="relative">
                {/* Glowing Pulsing Halo Ring */}
                <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <div className="relative w-10 h-10 rounded-full bg-black flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-black uppercase tracking-wider text-black">
                    VIRTUAL TRY-ON READY
                  </p>
                </div>
                <p className="text-[11px] text-black/60 font-semibold mt-0.5">
                  Powered by DrapeAI Engine
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
