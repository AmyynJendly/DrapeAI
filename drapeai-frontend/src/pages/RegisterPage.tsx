import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const STEPS = ['Your Info', 'Account', 'Done'];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(s => s + 1);
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Email may already be registered.');
      setStep(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">

      {/* ═══ SPLIT BACKGROUND (matching Stitch Screen 1 exactly) ═══ */}
      <div className="absolute inset-0 flex z-0">
        {/* Left half: sand with DRAPE.AI watermark + hero content */}
        <div className="w-1/2 bg-[#E5DAC8] relative overflow-hidden flex flex-col justify-center px-12">
          <div className="absolute inset-0 flex items-center justify-start pointer-events-none select-none overflow-hidden" aria-hidden="true">
            <span className="font-serif-luxury font-black uppercase text-[#C5B299] leading-none whitespace-nowrap"
              style={{ fontSize: 'clamp(100px, 18vw, 240px)', letterSpacing: '-0.02em', opacity: 0.45 }}>
              DRAPE.AI
            </span>
          </div>
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

      {/* ═══ White Card — Create Account (matching Stitch Screen 1) ═══ */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-sm"
        >
          <div className="bg-white/92 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/70 p-8">
            {/* Title */}
            <h1 className="text-2xl font-serif-luxury font-bold text-black text-center mb-6">Create Account</h1>

            {/* Step Indicators */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {STEPS.map((_, i) => {
                const s = i + 1;
                const isActive = s === step;
                const isDone = s < step;
                return (
                  <React.Fragment key={s}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      isDone ? 'bg-black border-black text-white' :
                      isActive ? 'bg-[#C5B299] border-[#C5B299] text-black' :
                      'bg-transparent border-black/20 text-black/30'
                    }`}>
                      {isDone ? '✓' : s}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 max-w-[32px] rounded-full transition-all ${s < step ? 'bg-black' : 'bg-black/10'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">{error}</div>
            )}

            <form className="space-y-3" onSubmit={handleSubmit}>
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="w-full px-4 py-3 bg-white/90 border border-black/10 rounded-xl text-sm text-black placeholder:text-black/40 focus:ring-2 focus:ring-black/20 focus:border-black focus:outline-none transition-all"
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-white/90 border border-black/10 rounded-xl text-sm text-black placeholder:text-black/40 focus:ring-2 focus:ring-black/20 focus:border-black focus:outline-none transition-all"
                  />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-white/90 border border-black/10 rounded-xl text-sm text-black placeholder:text-black/40 focus:ring-2 focus:ring-black/20 focus:border-black focus:outline-none transition-all"
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4 space-y-2">
                  <div className="text-4xl">🎉</div>
                  <p className="font-bold text-black">You're almost in!</p>
                  <p className="text-xs text-black/50">Click below to complete your account.</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="shimmer-btn w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm hover:bg-black/90 transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer mt-2"
              >
                {isSubmitting ? 'Creating...' : step < 3 ? 'Continue →' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-xs text-black/50 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-black hover:underline">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ═══ Bottom Black Ticker (matching Stitch Screen 1) ═══ */}
      <div className="relative z-20 bg-black overflow-hidden flex-shrink-0">
        <div className="animate-marquee flex items-center gap-10 py-4 whitespace-nowrap">
          {Array(8).fill('JOIN THE FUTURE OF FASHION').map((text, i) => (
            <React.Fragment key={i}>
              <span className="text-white text-base font-black uppercase tracking-[0.15em] font-serif-luxury flex-shrink-0">{text}</span>
              <span className="text-white/40 flex-shrink-0">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
