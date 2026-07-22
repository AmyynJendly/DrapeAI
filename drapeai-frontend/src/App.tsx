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

// Seeded fallback products matching Phase 1 spec in case backend is loading or offline
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
      console.warn('Backend offline, using fallback products:', err);
      setError('Spring Boot backend offline (Showing offline preview catalog).');
      const filtered = activeCategory === 'all'
        ? MOCK_PRODUCTS
        : MOCK_PRODUCTS.filter(p => p.category === activeCategory);
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const handleTryOn = (product: Product) => {
    setSelectedTryOnProduct(product);
  };

  return (
    <div className="min-h-screen bg-[#E5DAC8] text-black font-sans selection:bg-black selection:text-white flex flex-col">
      {/* 1. Announcement Banner */}
      <TopBanner />

      {/* 2. Warm Editorial Navbar */}
      <Navbar />

      {/* 3. Stitch Screen 1: Hero Section with Parallax Watermark */}
      <HeroSection />

      {/* 4. Warm Sand Brand Ticker */}
      <BrandBar variant="tan" />

      {/* 5. Stitch Screen 3: Editorial Slit Showcase */}
      <EditorialShowcase />

      {/* 6. Stitch Screen 2: Catalog Grid with Layered Horizontal Tan Slab */}
      <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-8 py-20 flex-1 w-full relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14">
          <h2 className="text-4xl sm:text-6xl font-normal uppercase tracking-tight text-black font-serif-luxury">
            NEW ARRIVALS
          </h2>
          <p className="text-black/75 text-sm max-w-lg mx-auto font-medium">
            Explore our latest high-street fashion catalog. Click "Try On with AI ✨" to preview any garment instantly.
          </p>

          {/* Filter Categories Pills */}
          <div className="pt-4 flex flex-wrap justify-center gap-2">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'apparel', label: 'Apparel' },
              { id: 'footwear', label: 'Footwear' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer active:scale-95 ${
                  activeCategory === cat.id ? 'text-white' : 'text-black/70 hover:text-black bg-[#C5B299]/60'
                }`}
              >
                {activeCategory === cat.id && (
                  <motion.div
                    layoutId="activeCategoryTab"
                    className="absolute inset-0 bg-black rounded-full shadow-md z-0"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Offline Status Warning */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-[#C5B299] border border-black/10 text-xs font-semibold text-black/80 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              {error}
            </span>
            <button
              onClick={fetchProducts}
              className="text-black underline hover:no-underline font-bold"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Product Grid Container with Layered Horizontal Tan Slab matching Stitch Screen 2 */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-black animate-spin" />
            <p className="text-black/60 text-sm font-medium">Loading fashion items...</p>
          </div>
        ) : (
          <div className="relative py-8 px-4 sm:px-6 rounded-[36px]">
            {/* Giant Horizontal Tan Slab Layer behind product cards matching Stitch Screen 2 */}
            <div className="absolute inset-x-0 top-12 bottom-12 bg-[#C5B299] rounded-[36px] border border-black/5 -z-10 shadow-xl" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onTryOn={handleTryOn}
                />
              ))}
            </div>
          </div>
        )}

        {/* View All Button */}
        <div className="mt-16 text-center">
          <button
            onClick={() => setActiveCategory('all')}
            className="px-14 py-4 rounded-full border-2 border-black text-black font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 shadow-md active:scale-95 cursor-pointer"
          >
            View All Products
          </button>
        </div>
      </main>

      {/* 7. Lower Black Ticker Marquee matching Stitch Screen 2 */}
      <BrandBar variant="black" />

      {/* 8. Interactive Try-On Studio Modal */}
      {selectedTryOnProduct && (
        <TryOnModal
          product={selectedTryOnProduct}
          onClose={() => setSelectedTryOnProduct(null)}
        />
      )}

      {/* 9. Footer Component */}
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
