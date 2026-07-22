import React from 'react';

interface BrandBarProps {
  variant?: 'beige' | 'black';
}

export default function BrandBar({ variant = 'beige' }: BrandBarProps) {
  const brands = variant === 'beige'
    ? ['ZARA', 'DOLCE & GABBANA', 'GUCCI', 'VERSACE', 'PRADA', 'CALVIN KLEIN']
    : ['ZARA', 'GUCCI', 'BALENCIAGA', 'PRADA', 'DIOR', 'FENDI', 'VERSACE', 'SAINT LAURENT', 'HERMÈS'];

  const marqueeItems = [...brands, ...brands, ...brands, ...brands];

  const bgClasses = variant === 'beige'
    ? 'bg-[#D9C4A9] text-black border-y border-black/10'
    : 'bg-black text-white border-y border-white/10';

  return (
    <section id="brands" className={`${bgClasses} py-6 overflow-hidden relative`}>
      <div className="mask-gradient-edges w-full overflow-hidden">
        <div className="animate-marquee flex items-center gap-12 sm:gap-16 whitespace-nowrap">
          {marqueeItems.map((brand, index) => (
            <div
              key={`${brand}-${index}`}
              className="flex items-center gap-12 sm:gap-16 flex-shrink-0"
            >
              <span className={`text-xl sm:text-3xl font-black uppercase tracking-[0.2em] font-serif-luxury cursor-pointer select-none ${
                variant === 'beige' ? 'text-black opacity-90 hover:opacity-100' : 'text-white opacity-90 hover:opacity-100'
              }`}>
                {brand}
              </span>
              <span className={`text-xs font-mono ${variant === 'beige' ? 'text-black/40' : 'text-white/40'}`}>
                •
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
