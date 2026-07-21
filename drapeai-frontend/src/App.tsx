import React, { useEffect, useState } from 'react';
import { Sparkles, Shirt, Footprints, ShoppingBag, Loader2, RefreshCw, Layers } from 'lucide-react';
import { Product } from './types';
import { productApi } from './services/api';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const catParam = selectedCategory === 'all' ? undefined : selectedCategory;
      const data = await productApi.getProducts(catParam);
      setProducts(data);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      setError('Unable to connect to DrapeAI backend service. Make sure the Spring Boot server is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white">
                Drape<span className="text-indigo-400">AI</span>
              </span>
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                Phase 1 Scaffolding
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              API Online
            </span>
            <button className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition">
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-900 bg-gradient-to-b from-indigo-950/20 to-slate-950 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
            Virtual Try-On Powered by AI
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Browse our catalog below. In upcoming phases, upload your photo to instantly visualize clothing and footwear tailored to your unique style.
          </p>

          {/* Filter Tabs */}
          <div className="pt-6 flex justify-center gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              All Items ({products.length})
            </button>
            <button
              onClick={() => setSelectedCategory('apparel')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                selectedCategory === 'apparel'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Shirt className="w-4 h-4" />
              Apparel
            </button>
            <button
              onClick={() => setSelectedCategory('footwear')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                selectedCategory === 'footwear'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Footprints className="w-4 h-4" />
              Footwear
            </button>
          </div>
        </div>
      </section>

      {/* Main Catalog View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-slate-400 font-medium">Fetching catalog from DrapeAI Spring Boot backend...</p>
          </div>
        ) : error ? (
          <div className="max-w-xl mx-auto bg-rose-950/30 border border-rose-900/50 rounded-2xl p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              !
            </div>
            <h3 className="text-lg font-bold text-rose-200">Backend Connection Error</h3>
            <p className="text-sm text-rose-300/80">{error}</p>
            <button
              onClick={fetchProducts}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm rounded-xl transition"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-950">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                      product.category === 'apparel'
                        ? 'bg-purple-500/80 text-white backdrop-blur-md'
                        : 'bg-amber-500/80 text-white backdrop-blur-md'
                    }`}>
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <span className="text-xl font-black text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-600 text-indigo-300 hover:text-white font-medium text-xs transition">
                      <Sparkles className="w-3.5 h-3.5" />
                      Try On
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 DrapeAI. AI Virtual Try-On Platform.</p>
          <p className="flex items-center gap-2">
            <span>Spring Boot 3</span> • <span>MongoDB</span> • <span>React Vite</span> • <span>Docker</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
