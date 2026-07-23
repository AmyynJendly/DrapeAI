import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onTryOn?: (product: Product) => void;
  index?: number;
}

const BACKDROP_STYLES = [
  'bg-[#D9C4A9]/40 translate-y-6 translate-x-3',
  'bg-[#C5B299]/30 -translate-y-4 -translate-x-3',
  'bg-[#B5A289]/30 translate-y-4 translate-x-4',
  'bg-[#D9C4A9]/50 -translate-y-6 translate-x-2',
];

export default function ProductCard({ product, onTryOn, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const backdropClass = BACKDROP_STYLES[index % BACKDROP_STYLES.length];

  const getOptimizedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('images.unsplash.com') && !url.includes('?')) {
      return `${url}?auto=format&fit=crop&w=800&q=80`;
    }
    return url;
  };

  return (
    <div className="product-card group relative flex flex-col gap-5 pt-6">
      {/* Offset Parallax Background Slab */}
      <div className={`absolute inset-0 -z-10 rounded-3xl pointer-events-none transition-transform duration-500 ${backdropClass}`} />

      {/* Image Container */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/40 shadow-sm transition-transform duration-700 group-hover:-translate-y-2 border border-black/5">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={getOptimizedUrl(product.imageUrl)}
            alt={product.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            loading="lazy"
          />
        </Link>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
          <div className="space-y-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
            <Link
              to={`/products/${product.id}`}
              className="bg-white text-black w-full py-3.5 rounded-xl font-label-caps text-xs font-bold tracking-wider flex items-center justify-center gap-2 hover:bg-black hover:text-white cursor-pointer active:scale-95 shadow-lg"
            >
              View Details
            </Link>
            <button
              onClick={() => onTryOn?.(product)}
              className="bg-black/80 text-white w-full py-3.5 rounded-xl font-label-caps text-xs font-bold tracking-wider flex items-center justify-center gap-2 hover:bg-black cursor-pointer active:scale-95 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
              Try On with AI
            </button>
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <span className="font-label-caps text-[10px] text-black/60 tracking-[0.2em] uppercase font-bold truncate">
            {product.brand || product.category}
          </span>
          {product.fit && (
            <span className="text-[10px] font-bold text-black/45 uppercase tracking-[0.18em] truncate">
              {product.fit}
            </span>
          )}
        </div>
        <Link to={`/products/${product.id}`}>
          <h4 className="font-serif-luxury text-xl font-bold text-black truncate hover:underline">
            {product.name}
          </h4>
        </Link>
        <p className="text-xs text-black/60 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <div className="flex justify-between items-center pt-1">
          <span className="font-sans font-bold text-lg text-black">
            ${product.price.toFixed(0)}
          </span>
          <button
            onClick={() => addToCart(product, 1)}
            className="text-black font-label-caps text-xs font-bold hover:underline cursor-pointer tracking-wider"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
