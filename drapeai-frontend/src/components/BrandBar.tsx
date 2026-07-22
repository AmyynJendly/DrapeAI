import React from 'react';

interface BrandBarProps {
  variant?: 'tan' | 'black';
}

export default function BrandBar({ variant = 'black' }: BrandBarProps) {
  const brands = [
    'ZARA',
    'GUCCI',
    'VERSACE',
    'BALENCIAGA',
    'PRADA',
    'DIOR',
    'FENDI',
    'SAINT LAURENT',
    'HERMÈS',
  ];

  const marqueeItems = [...brands, ...brands, ...brands, ...brands];

  const bgClasses = variant === 'tan'
    ? 'bg-[#C5B299] text-black border-y border-black/10'
    : 'bg-[#111111] text-white py-5 shadow-inner';

  return (
    <section id="brands" className={`${bgClasses} overflow-hidden relative z-10 select-none`}>
      <div className="w-full overflow-hidden">
        <div className="animate-marquee flex items-center gap-12 sm:gap-16 whitespace-nowrap">
          {marqueeItems.map((brand, index) => (
            <div
              key={`${brand}-${index}`}
              className="flex items-center gap-12 sm:gap-16 flex-shrink-0"
            >
              <span className={`text-xl sm:text-2xl font-black uppercase tracking-[0.25em] font-serif-luxury cursor-pointer transition-opacity ${
                variant === 'tan' ? 'text-black opacity-90 hover:opacity-100' : 'text-white/90 hover:text-white'
              }`}>
                {brand}
              </span>
              <span className={`text-xs ${variant === 'tan' ? 'text-black/40' : 'text-white/30'}`}>
                •
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
