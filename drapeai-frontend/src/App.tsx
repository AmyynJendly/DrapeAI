import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Product } from './types';
import { productApi } from './services/api';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { curatedCatalog } from './data/catalog';
import TopBanner from './components/TopBanner';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BrandBar from './components/BrandBar';
import ProductCard from './components/ProductCard';
import QuoteSection from './components/QuoteSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AccountPage from './pages/AccountPage';
import SettingsPage from './pages/SettingsPage';
import TryOnModal from './components/TryOnModal';

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
        const fallback = activeCategory === 'all'
          ? curatedCatalog
          : curatedCatalog.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
        setProducts(fallback);
      }
    } catch (err: any) {
      setError('Backend offline — showing catalog preview.');
      const filtered = activeCategory === 'all'
        ? curatedCatalog
        : curatedCatalog.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#E5DAC8] text-[#1a1c1c] font-sans flex flex-col">
      {/* 1. Top Banner */}
      <TopBanner />

      {/* 2. Stitch TopNavBar */}
      <Navbar />

      {/* 3. Stitch Hero Section */}
      <HeroSection />

      {/* 4. Stitch Brand Marquee */}
      <BrandBar variant="tan" />

      {/* 5. Stitch Product Grid Section */}
      <section id="catalog" className="py-24 bg-[#E5DAC8] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-black/10 pb-8">
            <div>
              <h3 className="font-serif-luxury text-4xl sm:text-5xl font-extrabold text-black uppercase tracking-tight mb-3">
                NEW ARRIVALS
              </h3>
              <p className="text-black/70 font-sans text-sm max-w-lg leading-relaxed">
                Explore our latest high-street fashion catalog. Click 'Try On with AI' to preview any garment instantly.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-3">
              {[
                { id: 'all', label: 'ALL ITEMS' },
                { id: 'apparel', label: 'APPAREL' },
                { id: 'footwear', label: 'FOOTWEAR' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-7 py-3 rounded-full font-label-caps text-xs tracking-widest transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-black text-white shadow-md'
                      : 'border border-black/20 text-black hover:bg-black/10'
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

          {/* Staggered Bento Grid */}
          {loading ? (
            <div className="py-24 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-black" />
              <p className="text-black/50 text-xs font-label-caps tracking-widest">Loading fashion items...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={idx}
                  onTryOn={(p) => setSelectedTryOnProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Visual Quote Divider */}
      <QuoteSection />

      {/* 7. Try-On Modal */}
      {selectedTryOnProduct && (
        <TryOnModal
          product={selectedTryOnProduct}
          onClose={() => setSelectedTryOnProduct(null)}
        />
      )}

      {/* 8. Stitch Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <CartDrawer />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products/:productId" element={<ProductDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
