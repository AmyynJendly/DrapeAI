import React from 'react';

export default function BrandBar() {
  const brands = ['VERSACE', 'ZARA', 'GUCCI', 'PRADA', 'CALVIN KLEIN'];
  // Duplicate list to achieve continuous seamless infinite marquee loop
  const marqueeItems = [...brands, ...brands, ...brands, ...brands];

  return (
    <section id="brands" className="bg-black py-8 overflow-hidden relative border-y border-white/10">
      {/* Mask Gradient Mask Overlays on edges */}
      <div className="mask-gradient-edges w-full overflow-hidden">
        <div className="animate-marquee flex items-center gap-12 sm:gap-20 whitespace-nowrap">
          {marqueeItems.map((brand, index) => (
            <div
              key={`${brand}-${index}`}
              className="flex items-center gap-12 sm:gap-20 flex-shrink-0"
            >
              <span className="text-white text-2xl sm:text-4xl font-black uppercase tracking-[0.25em] opacity-90 hover:opacity-100 transition-opacity font-serif select-none cursor-pointer">
                {brand}
              </span>
              <span className="text-white/30 text-xs font-mono">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
