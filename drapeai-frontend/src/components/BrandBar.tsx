import React from 'react';

interface BrandBarProps {
  variant?: 'tan' | 'black';
}

export default function BrandBar({ variant = 'tan' }: BrandBarProps) {
  const brands = variant === 'tan'
    ? ['ZARA', 'DOLCE & GABBANA', 'GUCCI', 'VERSACE']
    : ['ZARA', 'GUCCI', 'BALENCIAGA', 'PRADA', 'DIOR', 'FENDI', 'VERSACE', 'SAINT LAURENT', 'HERMÈS'];

  const marqueeItems = [...brands, ...brands, ...brands, ...brands, ...brands, ...brands];

  const bgClasses = variant === 'tan'
    ? 'bg-[#C5B299] text-black border-y border-black/10'
    : 'bg-black text-white border-y border-white/10';

  return (
    <section id="brands" className={`${bgClasses} py-5 overflow-hidden relative z-10`}>
      <div className="mask-gradient-edges w-full overflow-hidden">
        <div className="animate-marquee flex items-center gap-10 sm:gap-14 whitespace-nowrap">
          {marqueeItems.map((brand, index) => (
            <div
              key={`${brand}-${index}`}
              className="flex items-center gap-10 sm:gap-14 flex-shrink-0"
            >
              <span className={`text-xl sm:text-2xl font-black uppercase tracking-[0.25em] font-serif-luxury cursor-pointer select-none ${
                variant === 'tan' ? 'text-black opacity-90 hover:opacity-100' : 'text-white opacity-90 hover:opacity-100'
              }`}>
                {brand}
              </span>
              <span className={`text-xs font-mono ${variant === 'tan' ? 'text-black/50' : 'text-white/50'}`}>
                •
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
