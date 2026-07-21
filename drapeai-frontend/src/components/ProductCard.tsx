import React from 'react';
import { Star, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onTryOn?: (product: Product) => void;
}

export default function ProductCard({ product, onTryOn }: ProductCardProps) {
  // Generate consistent mock rating and discount based on product price for demonstration
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
    <div className="bg-[#F0EEED] rounded-[20px] p-4 flex flex-col justify-between overflow-hidden group hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/10">
      {/* Product Image */}
      <div className="relative aspect-square md:aspect-[3/4] w-full overflow-hidden rounded-[12px] bg-[#E8E6E5]">
        <img
          src={getOptimizedUrl(product.imageUrl)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute top-2.5 left-2.5">
          <span className="bg-black/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="mt-3 flex flex-col justify-between flex-1 space-y-2">
        <h3 className="text-base font-bold text-black truncate group-hover:text-black/80 transition-colors">
          {product.name}
        </h3>

        {/* Rating Stars */}
        <div className="flex items-center gap-1.5 text-xs text-black/70">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 text-[#FFC700] fill-[#FFC700]"
              />
            ))}
          </div>
          <span className="font-semibold text-black">{ratingScore}/5</span>
        </div>

        {/* Price & Discount */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xl font-extrabold text-black">
            ${product.price.toFixed(0)}
          </span>
          <span className="text-sm font-bold text-black/40 line-through">
            ${originalPrice}
          </span>
          <span className="bg-[#FF3333]/10 text-[#FF3333] text-xs font-bold px-2 py-0.5 rounded-full">
            {discountPercent}%
          </span>
        </div>

        {/* AI Try-On Button */}
        <button
          onClick={() => onTryOn?.(product)}
          className="w-full bg-black text-white text-xs py-2.5 rounded-full font-medium hover:bg-black/80 flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 mt-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          Try On with AI ✨
        </button>
      </div>
    </div>
  );
}
