import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Loader2, Package, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { productApi } from '../services/api';
import { curatedCatalog } from '../data/catalog';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TopBanner from '../components/TopBanner';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product not found.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await productApi.getProductById(productId);
        setProduct(data);
      } catch (err) {
        const fallback = curatedCatalog.find((item) => item.id === productId) || null;
        setProduct(fallback);
        if (!fallback) {
          setError('This product is unavailable.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const relatedProducts = useMemo(() => {
    if (!product) return curatedCatalog.slice(0, 4);
    return curatedCatalog
      .filter((item) => item.id !== product.id && item.category === product.category)
      .slice(0, 4);
  }, [product]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [product.imageUrl];
  }, [product]);

  const currentImage = selectedImage || product?.imageUrl || galleryImages[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E5DAC8] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-black" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#E5DAC8] text-black flex flex-col">
        <TopBanner />
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-6 py-24 text-center">
          <Package className="w-14 h-14 mx-auto mb-4 text-black/30" />
          <h1 className="text-4xl font-black uppercase tracking-tighter">Product not found</h1>
          <p className="mt-3 text-black/60">{error || 'The item you selected is no longer available.'}</p>
          <button
            onClick={() => navigate('/#catalog')}
            className="mt-8 inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to catalog
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5DAC8] text-black flex flex-col">
      <TopBanner />
      <Navbar />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 lg:py-16">
          <button
            onClick={() => navigate('/#catalog')}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black/55 hover:text-black transition mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to catalog
          </button>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="rounded-[32px] overflow-hidden bg-white/60 border border-black/5 shadow-xl">
                <img src={currentImage} alt={product.name} className="w-full h-[640px] object-cover" />
              </div>

              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 transition cursor-pointer flex-shrink-0 ${
                        currentImage === img ? 'border-black ring-2 ring-black/10' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="space-y-6 lg:sticky lg:top-28"
            >
              <div className="space-y-3">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-black/45">{product.brand || product.category}</p>
                <h1 className="font-serif-luxury text-4xl sm:text-6xl font-black leading-[0.95] tracking-tight">{product.name}</h1>
                <p className="text-2xl font-black">${product.price.toFixed(2)}</p>
              </div>

              <p className="text-sm sm:text-base text-black/70 leading-7 max-w-2xl">{product.description}</p>

              <div className="grid sm:grid-cols-2 gap-4">
                {product.fit && (
                  <div className="rounded-3xl bg-white/70 border border-black/5 p-4">
                    <p className="text-[11px] uppercase tracking-[0.25em] font-black text-black/40">Fit</p>
                    <p className="mt-2 font-bold text-black">{product.fit}</p>
                  </div>
                )}
                {product.materials && (
                  <div className="rounded-3xl bg-white/70 border border-black/5 p-4">
                    <p className="text-[11px] uppercase tracking-[0.25em] font-black text-black/40">Materials</p>
                    <p className="mt-2 font-bold text-black">{product.materials}</p>
                  </div>
                )}
              </div>

              {product.highlights && product.highlights.length > 0 && (
                <div className="rounded-3xl bg-white/70 border border-black/5 p-5">
                  <p className="text-[11px] uppercase tracking-[0.25em] font-black text-black/40">Highlights</p>
                  <ul className="mt-3 space-y-2">
                    {product.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2 text-sm text-black/75">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-black/60" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.careInstructions && (
                <div className="rounded-3xl bg-[#F5EFE6] border border-black/5 p-5">
                  <p className="text-[11px] uppercase tracking-[0.25em] font-black text-black/40">Care</p>
                  <p className="mt-2 text-sm text-black/75 leading-7">{product.careInstructions}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => addToCart(product, 1)}
                  className="bg-black text-white px-6 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black/90 transition shadow-lg cursor-pointer"
                >
                  Add to cart
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-black/45">More from this edit</p>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">Related pieces</h2>
            </div>
            <Link to="/#catalog" className="text-xs font-black uppercase tracking-widest text-black/55 hover:text-black">Browse all</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((item, index) => (
              <ProductCard key={item.id} product={item} index={index} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}