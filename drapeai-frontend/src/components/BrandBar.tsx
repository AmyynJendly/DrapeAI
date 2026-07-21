import React from 'react';

export default function BrandBar() {
  const brands = ['VERSACE', 'ZARA', 'GUCCI', 'PRADA', 'CALVIN KLEIN'];

  return (
    <section id="brands" className="bg-black py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-8 sm:gap-12">
        {brands.map((brand) => (
          <span
            key={brand}
            className="text-white text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] opacity-90 hover:opacity-100 transition-opacity font-serif select-none"
          >
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}
