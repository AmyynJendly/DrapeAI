import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from './types';
import { productApi } from './services/api';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import TopBanner from './components/TopBanner';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import EditorialShowcase from './components/EditorialShowcase';
import BrandBar from './components/BrandBar';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import TryOnModal from './components/TryOnModal';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Retro White Sneakers',
    description: 'Classic retro white sneakers designed for everyday comfort and street style.',
    category: 'footwear',
    price: 85.00,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    name: 'Urban Running Shoes',
    description: 'High-performance running shoes built for maximum cushioning and urban trail traction.',
    category: 'footwear',
    price: 110.00,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    name: 'Classic Canvas Low-Tops',
    description: 'Timeless low-top canvas sneakers featuring durable stitching and flexible rubber soles.',
    category: 'footwear',
    price: 55.00,
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    name: 'Minimalist Black Tee',
    description: 'Essential premium cotton t-shirt with a modern tailored fit in deep jet black.',
    category: 'apparel',
    price: 28.00,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '5',
    name: 'Vintage Graphic Tee',
    description: 'Soft washed crewneck graphic tee with a relaxed retro aesthetic.',
    category: 'apparel',
    price: 32.00,
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '6',
    name: 'Organic White Tee',
    description: 'Ultra-soft 100% organic cotton t-shirt crafted for breathability and effortless everyday style.',
    category: 'apparel',
    price: 25.00,
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '7',
    name: 'Oversized Knit Pullover',
    description: 'Cozy oversized sweater crafted from plush yarn for relaxed warmth during cooler seasons.',
    category: 'apparel',
    price: 65.00,
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '8',
    name: 'Classic Gray Hoodie',
    description: 'Mid-weight fleece pullover hoodie featuring a front pouch pocket and ribbed cuffs.',
    category: 'apparel',
    price: 50.00,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
  },
];

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedTryOnProduct, setSelectedTryOnProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const catParam = activeCategory === 'all' ? undefined : activeCategory;
      const data = await productApi.getProducts(catParam);
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(MOCK_PRODUCTS);
      }
    } catch (err: any) {
      setError('Backend offline — showing preview catalog.');
      const filtered = activeCategory === 'all'
        ? MOCK_PRODUCTS
        : MOCK_PRODUCTS.filter(p => p.category === activeCategory);
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#E5DAC8] text-black font-sans flex flex-col">
      {/* 1. Announcement Banner */}
      <TopBanner />

      {/* 2. Minimalist Navbar */}
      <Navbar />

      {/* 3. Solution 3 Minimalist Hero Section */}
      <HeroSection />

      {/* 4. Sleek Brand Ticker */}
      <BrandBar variant="black" />

      {/* 5. Solution 3 Editorial Showcase */}
      <EditorialShowcase />

      {/* 6. Product Catalog — Seamless Sand Canvas matching Login aesthetic */}
      <section id="catalog" className="py-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 space-y-4">
            <h2
              className="font-extrabold uppercase text-black font-serif-luxury tracking-tight"
              style={{ fontSize: 'clamp(32px, 4vw, 64px)' }}
            >
              New Arrivals
            </h2>
            <p className="text-black/70 text-sm max-w-xl mx-auto font-medium leading-relaxed">
              Explore our latest high-street fashion catalog. Click "Try On with AI ✨" to preview any garment instantly.
            </p>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2.5 pt-2">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'apparel', label: 'Apparel' },
                { id: 'footwear', label: 'Footwear' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${
                    activeCategory === cat.id ? 'bg-black text-white shadow-md' : 'bg-[#C5B299]/50 text-black/80 hover:bg-[#C5B299]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                {error}
              </span>
              <button onClick={fetchProducts} className="font-bold underline hover:no-underline">Retry</button>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="py-24 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-black" />
              <p className="text-black/50 text-sm font-medium">Loading fashion items...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onTryOn={(p) => setSelectedTryOnProduct(p)}
                />
              ))}
            </div>
          )}

          <div className="mt-14 text-center">
            <button
              onClick={() => setActiveCategory('all')}
              className="px-12 py-4 rounded-full border-2 border-black text-black font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* 7. Bottom Brand Ticker */}
      <BrandBar variant="black" />

      {/* 8. Try-On Modal */}
      {selectedTryOnProduct && (
        <TryOnModal
          product={selectedTryOnProduct}
          onClose={() => setSelectedTryOnProduct(null)}
        />
      )}

      {/* 9. Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <CartDrawer />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
