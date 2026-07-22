import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">

      {/* ═══ SPLIT BACKGROUND (matching Stitch Screen 2 exactly) ═══ */}
      <div className="absolute inset-0 flex z-0">
        {/* Left half: sand with DRAPE.AI watermark */}
        <div className="w-1/2 bg-[#E5DAC8] relative overflow-hidden flex flex-col justify-center px-12">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-start pointer-events-none select-none overflow-hidden" aria-hidden="true">
            <span className="font-serif-luxury font-black uppercase text-[#C5B299] leading-none whitespace-nowrap"
              style={{ fontSize: 'clamp(100px, 18vw, 240px)', letterSpacing: '-0.02em', opacity: 0.45 }}>
              DRAPE.AI
            </span>
          </div>
          {/* Hero text content visible in background */}
          <div className="relative z-10 space-y-5 pt-24">
            <div className="inline-flex items-center bg-[#C5B299] text-[#3B2E22] text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase">
              Spring Collection
            </div>
            <h1 className="font-serif-luxury uppercase text-black font-black leading-[0.93] opacity-80"
              style={{ fontSize: 'clamp(32px, 4.5vw, 64px)', letterSpacing: '-0.02em' }}>
              FIND CLOTHES<br />THAT MATCH<br />YOUR STYLE
            </h1>
            <p className="text-black/60 text-sm leading-relaxed max-w-xs">
              Browse through our diverse range of meticulously crafted garments.
            </p>
            <Link to="/#catalog" className="shimmer-btn inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-black/90 transition-all shadow-xl active:scale-95">
              Shop Now →
            </Link>
          </div>
        </div>
        {/* Right half: dark fashion model */}
        <div className="w-1/2 bg-[#1A1A1A] relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=80"
            alt="Fashion Model"
            className="w-full h-full object-cover object-center grayscale opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/30 to-transparent" />
        </div>
      </div>

      {/* ═══ Navbar ═══ */}
      <nav className="relative z-20 py-4 px-6 sm:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-serif-luxury font-black text-xl text-black">
          <div className="w-7 h-7 bg-[#5A4533] rounded-md flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#D9C4A9]" />
          </div>
          Drape.AI
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {['Shop', 'On Sale', 'New Arrivals', 'Brands'].map(item => (
            <Link key={item} to="/" className="text-black/70 text-sm font-semibold hover:text-black transition-colors">{item}</Link>
          ))}
        </div>
        <div className="flex items-center gap-5 text-sm font-semibold text-black/70">
          <span className="cursor-pointer hover:text-black">Search</span>
          <span className="cursor-pointer hover:text-black">🛒 Cart</span>
          <span className="w-8 h-8 rounded-full bg-[#8C7355] text-white flex items-center justify-center text-xs font-bold cursor-pointer">A</span>
        </div>
      </nav>

      {/* ═══ Glassmorphism Card (centered over split) ═══ */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-sm"
        >
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-8">
            {/* Logo */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-[#5A4533] rounded-md flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-[#D9C4A9]" />
                </div>
                <span className="font-serif-luxury font-black text-lg text-black">Drape.AI</span>
              </div>
              <h1 className="text-2xl font-serif-luxury font-bold text-black">Welcome Back</h1>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 bg-white/90 border border-black/10 rounded-xl text-sm text-black placeholder:text-black/40 focus:ring-2 focus:ring-black/20 focus:border-black focus:outline-none transition-all"
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 pr-11 bg-white/90 border border-black/10 rounded-xl text-sm text-black placeholder:text-black/40 focus:ring-2 focus:ring-black/20 focus:border-black focus:outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="shimmer-btn w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm hover:bg-black/90 transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="text-center text-xs text-black/50 mt-3 cursor-pointer hover:text-black transition-colors">Forgot Password?</p>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/10" /></div>
              <div className="relative flex justify-center text-xs text-black/40 font-semibold">
                <span className="bg-white/80 px-3">Or sign in with</span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button className="w-11 h-11 rounded-full bg-white shadow border border-black/5 flex items-center justify-center hover:shadow-md transition active:scale-95">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" style={{width:18,height:18}}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button className="w-11 h-11 rounded-full bg-white shadow border border-black/5 flex items-center justify-center hover:shadow-md transition active:scale-95">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}>
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </button>
            </div>

            <p className="text-center text-xs text-black/50 mt-4">
              New to Drape.AI?{' '}
              <Link to="/register" className="font-bold text-black hover:underline">Create Account</Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ═══ Bottom Warm Tan Ticker (matching Stitch Screen 2) ═══ */}
      <div className="relative z-20 bg-[#C5B299] overflow-hidden flex-shrink-0">
        <div className="animate-marquee flex items-center gap-10 py-4 whitespace-nowrap">
          {['ZARA', 'DOLCE & GABBANA', 'GUCCI', 'VERSACE', 'ZARA', 'DOLCE & GABBANA', 'GUCCI', 'VERSACE',
            'ZARA', 'DOLCE & GABBANA', 'GUCCI', 'VERSACE'].map((brand, i) => (
            <React.Fragment key={i}>
              <span className="text-black/90 text-base font-black uppercase tracking-[0.2em] font-serif-luxury flex-shrink-0">{brand}</span>
              <span className="text-black/40 flex-shrink-0">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
