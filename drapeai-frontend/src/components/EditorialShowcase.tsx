import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Fashion fabric & texture closeups — matching Stitch Screen 3 exactly
const SLIT_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80',   // black wool texture
  'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=500&q=80', // silver rings/jewelry
  'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=500&q=80', // metallic belt buckle
  'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=500&q=80', // black satin/silk
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=500&q=80', // silver/chrome fabric
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=500&q=80',   // cream/ivory drape
];

export default function EditorialShowcase() {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [500, 1600], [-60, 120]);

  return (
    <section className="bg-[#E5DAC8] py-8 px-4 sm:px-8 relative overflow-hidden">
      {/* Outer Dark Rounded Container — exactly matches Stitch Screen 3 */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#111111] rounded-[40px] overflow-hidden relative shadow-2xl">

          {/* ═══ TOP HALF: Vertical Image Slits ═══ */}
          <div className="relative h-[300px] sm:h-[380px] flex gap-0.5 overflow-hidden">
            {SLIT_IMAGES.map((img, i) => (
              <div
                key={i}
                className="flex-1 relative overflow-hidden group cursor-pointer"
              >
                <img
                  src={img}
                  alt={`Fashion texture ${i + 1}`}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-colors duration-500" />
              </div>
            ))}

            {/* THE NEW ERA — Vertical Parallax Watermark on right side */}
            <motion.div
              style={{ y: yText }}
              className="absolute right-0 top-0 bottom-0 flex items-start justify-end pointer-events-none select-none overflow-hidden"
              aria-hidden="true"
            >
              <span
                className="font-serif-luxury font-black uppercase text-[#C5B299] leading-none writing-mode-vertical"
                style={{
                  fontSize: 'clamp(80px, 9vw, 140px)',
                  letterSpacing: '0.05em',
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  opacity: 0.55,
                }}
              >
                THE NEW ERA
              </span>
            </motion.div>
          </div>

          {/* ═══ BOTTOM HALF: Split White/Dark layout ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: White content panel */}
            <div className="lg:col-span-7 bg-white/95 p-8 sm:p-12 space-y-6">
              <h2
                className="font-serif-luxury uppercase font-black text-black leading-tight"
                style={{ fontSize: 'clamp(24px, 3vw, 44px)', letterSpacing: '-0.02em' }}
              >
                DISCOVER THE LATEST<br />
                TRENDS & INNOVATIONS<br />
                IN DIGITAL FASHION.
              </h2>

              <p className="text-black/60 text-sm font-medium max-w-sm leading-relaxed">
                Experience high-street haute couture blended with state-of-the-art virtual fitting technology.
              </p>

              <a
                href="#catalog"
                className="inline-block border-2 border-black text-black px-8 py-3 font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all cursor-pointer active:scale-95"
              >
                EXPLORE COLLECTION
              </a>

              {/* Slide indicator dots */}
              <div className="flex gap-2 pt-2">
                <span className="w-6 h-1.5 rounded-full bg-black" />
                <span className="w-1.5 h-1.5 rounded-full bg-black/30" />
                <span className="w-1.5 h-1.5 rounded-full bg-black/30" />
              </div>
            </div>

            {/* Right: Continuation of dark panel */}
            <div className="lg:col-span-5 bg-[#111111] min-h-[120px] relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <span className="font-serif-luxury text-white font-black text-[80px] uppercase">ERA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warm Ticker matching Stitch Screen 3 */}
      <div className="mt-6 overflow-hidden">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap py-4">
          {['LUXE MODE', 'ATELIER NOIR', 'ÉLÉGANCE MODERNE', 'COUTURE LAB', 'AVANT-GARDE', 'TIMELESS STYLE',
            'LUXE MODE', 'ATELIER NOIR', 'ÉLÉGANCE MODERNE', 'COUTURE LAB', 'AVANT-GARDE', 'TIMELESS STYLE'].map((text, i) => (
            <React.Fragment key={i}>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-black/70 font-serif-luxury flex-shrink-0">{text}</span>
              <span className="text-[#8C7355] font-mono text-xs flex-shrink-0">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
