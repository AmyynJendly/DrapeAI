import React from 'react';

interface BrandBarProps {
  variant?: 'tan' | 'black';
}

export default function BrandBar({ variant = 'tan' }: BrandBarProps) {
  const brands = [
    'ZARA',
    'DOLCE & GABBANA',
    'GUCCI',
    'VERSACE',
    'BALENCIAGA',
    'PRADA',
    'SAINT LAURENT',
  ];

  const marqueeItems = [...brands, ...brands, ...brands, ...brands];

  const bgClasses = variant === 'tan'
    ? 'bg-[#D9C4A9] text-black border-y border-black/10 py-10'
    : 'bg-[#111111] text-white py-10 border-y border-white/10';

  return (
    <section id="brands" className={`${bgClasses} overflow-hidden relative z-10 select-none`}>
      <div className="marquee">
        <div className="animate-marquee flex items-center gap-16 whitespace-nowrap">
          {marqueeItems.map((brand, index) => (
            <div
              key={`${brand}-${index}`}
              className="flex items-center gap-16 flex-shrink-0"
            >
              <span className={`font-serif-luxury text-2xl sm:text-4xl font-normal tracking-[0.2em] uppercase ${
                variant === 'tan' ? 'text-black' : 'text-white'
              }`}>
                {brand}
              </span>
              <span className={`w-2.5 h-2.5 rounded-full ${variant === 'tan' ? 'bg-black/20' : 'bg-white/20'}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
