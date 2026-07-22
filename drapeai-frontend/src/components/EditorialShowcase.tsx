import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function EditorialShowcase() {
  const { scrollY } = useScroll();
  const yParallaxText = useTransform(scrollY, [700, 1700], [-80, 80]);

  // 6 Slit Images matching Stitch Screen 3 monochrome & metallic fabric textures
  const editorialSlitImages = [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
  ];

  return (
    <section className="bg-[#E5DAC8] py-16 overflow-hidden relative border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Editorial Container */}
        <div className="bg-white rounded-[36px] p-8 sm:p-12 shadow-2xl border border-black/10 relative overflow-hidden">
          {/* Scroll-Linked Parallax Vertical Text "THE NEW ERA" matching Stitch Screen 3 */}
          <motion.div
            style={{ y: yParallaxText }}
            className="absolute right-4 sm:right-16 top-0 bottom-0 pointer-events-none select-none flex items-center opacity-15 text-[#5A4533]"
          >
            <span className="text-[11vw] font-black uppercase font-serif-luxury tracking-tighter rotate-90 origin-right whitespace-nowrap">
              THE NEW ERA
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6 z-10">
              <h2 className="text-3xl sm:text-5xl font-normal uppercase tracking-tight text-black font-serif-luxury leading-tight">
                DISCOVER THE LATEST <br />
                TRENDS & INNOVATIONS <br />
                IN DIGITAL FASHION.
              </h2>

              <p className="text-black/70 text-sm font-medium max-w-md">
                Experience high-street haute couture blended with state-of-the-art virtual fitting technology.
              </p>

              <div>
                <a
                  href="#catalog"
                  className="inline-block border-2 border-black text-black px-8 py-3 rounded-none font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  EXPLORE COLLECTION
                </a>
              </div>
            </div>

            {/* Right 6 Vertical Image Slits matching Stitch Screen 3 */}
            <div className="lg:col-span-7 flex gap-2 sm:gap-3 h-[400px] sm:h-[460px] overflow-hidden rounded-2xl">
              {editorialSlitImages.map((img, idx) => (
                <div
                  key={idx}
                  className="flex-1 hover:flex-[2.5] transition-all duration-500 ease-out h-full overflow-hidden rounded-xl bg-black relative group cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`Editorial Texture ${idx + 1}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ticker Bar matching Stitch Screen 3 lower strip */}
      <div className="mt-12 bg-[#C5B299] py-4 border-y border-black/10 overflow-hidden">
        <div className="animate-marquee flex items-center gap-12 text-xs font-black uppercase tracking-[0.25em] text-black/90 whitespace-nowrap font-serif-luxury">
          <span>LUXE MODE</span>
          <span>•</span>
          <span>ATELIER NOIR</span>
          <span>•</span>
          <span>ÉLÉGANCE MODERNE</span>
          <span>•</span>
          <span>COUTURE LAB</span>
          <span>•</span>
          <span>AVANT-GARDE</span>
          <span>•</span>
          <span>TIMELESS STYLE</span>
          <span>•</span>
          <span>LUXE MODE</span>
          <span>•</span>
          <span>ATELIER NOIR</span>
          <span>•</span>
          <span>ÉLÉGANCE MODERNE</span>
        </div>
      </div>
    </section>
  );
}
