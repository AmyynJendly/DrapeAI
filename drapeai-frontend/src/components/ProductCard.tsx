import React from 'react';
import { Star, Sparkles, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onTryOn?: (product: Product) => void;
}

export default function ProductCard({ product, onTryOn }: ProductCardProps) {
  const { addToCart } = useCart();
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
    <div className="bg-white rounded-[28px] p-4 flex flex-col justify-between overflow-hidden shadow-xl border border-black/5 transition-all duration-300 hover:-translate-y-1.5 group">
      {/* 1. Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#E8E6E5]">
        <img
          src={getOptimizedUrl(product.imageUrl)}
          alt={product.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
          loading="lazy"
          decoding="async"
        />
        {/* Glassmorphism Category Pill matching Stitch Screen 2 */}
        <div className="absolute top-3 left-3">
          <span className="backdrop-blur-md bg-black/90 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Floating Cart Button */}
        <button
          onClick={() => addToCart(product, 1)}
          className="absolute bottom-3 right-3 bg-white text-black p-2.5 rounded-full shadow-md hover:bg-black hover:text-white transition-colors duration-200 active:scale-90"
          title="Add to Cart"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Product Details */}
      <div className="mt-4 flex flex-col justify-between flex-1 space-y-2">
        <h3 className="text-base font-bold text-black truncate">
          {product.name}
        </h3>

        {/* Rating Stars */}
        <div className="flex items-center gap-1.5 text-xs text-black/70 font-semibold">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 text-[#FFC700] fill-[#FFC700]"
              />
            ))}
          </div>
          <span className="font-bold text-black text-[11px]">{ratingScore}/5</span>
        </div>

        {/* Pricing Hierarchy */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xl font-black text-black">
            ${product.price.toFixed(0)}
          </span>
          <span className="text-sm font-bold text-black/40 line-through">
            ${originalPrice}
          </span>
          <span className="bg-[#FF3333]/10 text-[#FF3333] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            {discountPercent}%
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          <button
            onClick={() => onTryOn?.(product)}
            className="col-span-4 shimmer-btn bg-black text-white text-xs py-3 rounded-full font-bold hover:bg-black/90 flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            Try On with AI ✨
          </button>

          <button
            onClick={() => addToCart(product, 1)}
            className="col-span-1 bg-[#F0EEED] hover:bg-black text-black hover:text-white border border-black/10 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-90"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
