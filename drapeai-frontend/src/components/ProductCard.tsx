import React from 'react';
import { Star, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onTryOn?: (product: Product) => void;
}

export default function ProductCard({ product, onTryOn }: ProductCardProps) {
  const ratingScore = 4.5;
  const originalPrice = Math.round(product.price * 1.25);
  const discountPercent = -20;

  const getOptimizedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('images.unsplash.com') && !url.includes('?')) {
      return `${url}?auto=format&fit=crop&w=600&q=80`;
    }
    return url;
  };

  return (
    <div className="bg-[#F0EEED] rounded-[24px] p-4 flex flex-col justify-between overflow-hidden group hover:shadow-xl hover:shadow-black/5 transition-all duration-300 border border-transparent hover:border-black/10">
      {/* 1. Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#E8E6E5]">
        <img
          src={getOptimizedUrl(product.imageUrl)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          decoding="async"
        />
        {/* Glassmorphism Category Overlay Pill */}
        <div className="absolute top-3 left-3">
          <span className="backdrop-blur-md bg-black/80 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
            {product.category}
          </span>
        </div>
      </div>

      {/* 2. Product Details */}
      <div className="mt-4 flex flex-col justify-between flex-1 space-y-2.5">
        <h3 className="text-lg font-bold text-black truncate group-hover:text-black/80 transition-colors">
          {product.name}
        </h3>

        {/* Rating Stars */}
        <div className="flex items-center gap-1.5 text-xs text-black/70 font-semibold">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 text-[#FFC700] fill-[#FFC700]"
              />
            ))}
          </div>
          <span className="font-bold text-black">{ratingScore}/5</span>
        </div>

        {/* Pricing Hierarchy */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-2xl font-black text-black">
            ${product.price.toFixed(0)}
          </span>
          <span className="text-base font-bold text-black/40 line-through">
            ${originalPrice}
          </span>
          <span className="bg-[#FF3333]/10 text-[#FF3333] text-xs font-bold px-2.5 py-0.5 rounded-full">
            {discountPercent}%
          </span>
        </div>

        {/* 3. Action Button ("Try On with AI ✨") */}
        <button
          onClick={() => onTryOn?.(product)}
          className="shimmer-btn w-full bg-black text-white text-xs py-3 rounded-full font-bold hover:bg-black/90 flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 mt-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          Try On with AI ✨
        </button>
      </div>
    </div>
  );
}
