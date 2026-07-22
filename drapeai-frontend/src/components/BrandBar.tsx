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
    : 'bg-black text-white py-6';

  return (
    <section id="brands" className={`${bgClasses} overflow-hidden relative z-10 select-none`}>
      <div className="w-full overflow-hidden">
        <div className="animate-marquee flex items-center gap-12 sm:gap-16 whitespace-nowrap">
          {marqueeItems.map((brand, index) => (
            <div
              key={`${brand}-${index}`}
              className="flex items-center gap-12 sm:gap-16 flex-shrink-0"
            >
              <span className={`text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] font-serif-luxury cursor-pointer transition-opacity ${
                variant === 'tan' ? 'text-black opacity-90 hover:opacity-100' : 'text-white opacity-95 hover:opacity-100'
              }`}>
                {brand}
              </span>
              <span className={`text-xs font-mono ${variant === 'tan' ? 'text-black/40' : 'text-white/40'}`}>
                •
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
