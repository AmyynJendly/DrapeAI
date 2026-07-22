import React from 'react';

export default function QuoteSection() {
  return (
    <section className="relative min-h-[50vh] py-20 flex items-center justify-center bg-[#111111] overflow-hidden text-white my-16">
      <div className="relative z-10 text-center px-6 sm:px-12 max-w-5xl mx-auto">
        <h5 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl text-white leading-tight italic font-normal">
          "Fashion is not something that exists in dresses only. Fashion is in the sky, in the street."
        </h5>
        <p className="font-label-caps text-xs sm:text-sm text-white/60 mt-8 tracking-[0.4em] uppercase font-bold">
          COCO CHANEL
        </p>
      </div>
    </section>
  );
}
