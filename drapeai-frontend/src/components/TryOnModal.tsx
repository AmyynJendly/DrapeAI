import React, { useState, useEffect } from 'react';
import { X, Upload, Camera, Sparkles, Download, RefreshCw, CheckCircle2, ShoppingBag, ArrowRight, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { processHuggingFaceVTO } from '../services/hfVtoService';
import WebcamCapture from './WebcamCapture';

interface TryOnModalProps {
  product: Product;
  onClose: () => void;
}

const PRESET_MODELS = [
  {
    id: 'female-model',
    name: 'Female Model',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'male-model',
    name: 'Male Model',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mannequin',
    name: 'Studio Mannequin',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  },
];

const PROGRESS_LABELS = [
  'Connecting to Hugging Face AI cluster...',
  'Fitting garment contours to posture...',
  'Generating high-res fabric rendering...',
];

export default function TryOnModal({ product, onClose }: TryOnModalProps) {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'preset' | 'upload' | 'webcam'>('preset');
  const [selectedImage, setSelectedImage] = useState<string>(PRESET_MODELS[0].url);
  const [selectedModelId, setSelectedModelId] = useState<string>('female-model');

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [progressMessage, setProgressMessage] = useState(PROGRESS_LABELS[0]);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [spaceUsed, setSpaceUsed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Before/After Slider percentage state
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isProcessing) {
      timer = setInterval(() => {
        setProgressStep((prev) => {
          const next = (prev + 1) % PROGRESS_LABELS.length;
          setProgressMessage(PROGRESS_LABELS[next]);
          return next;
        });
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isProcessing]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file is too large (Max 10MB).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setSelectedModelId('custom');
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (model: typeof PRESET_MODELS[0]) => {
    setSelectedImage(model.url);
    setSelectedModelId(model.id);
    setError(null);
  };

  const handleGenerateTryOn = async () => {
    if (!selectedImage) {
      setError('Please select or upload a model photo first.');
      return;
    }

    setIsProcessing(true);
    setProgressStep(0);
    setProgressMessage(PROGRESS_LABELS[0]);
    setError(null);

    try {
      const res = await processHuggingFaceVTO(
        selectedImage,
        product.imageUrl,
        product.category,
        (msg) => setProgressMessage(msg)
      );

      setResultImage(res.resultUrl);
      setSpaceUsed(res.spaceUsed || 'HuggingFace IDM-VTON');
    } catch (err: any) {
      setError(err?.message || 'Failed to generate try-on preview.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResultImage(null);
    setIsProcessing(false);
    setError(null);
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-[#E5DAC8] rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-black/10 relative my-8 text-black"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-black/10 hover:bg-black hover:text-white text-black transition active:scale-90 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Product Brief Banner */}
          <div className="flex items-center gap-4 pb-6 border-b border-black/10">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-2xl bg-white shadow-md border border-black/5"
            />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-black text-white px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
                <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" /> Virtual Try-On
              </span>
              <h3 className="text-xl font-serif-luxury font-bold uppercase tracking-tight text-black mt-1">
                {product.name}
              </h3>
              <p className="text-xs text-black/70 font-medium">
                ${product.price.toFixed(0)} • {product.category.toUpperCase()}
              </p>
            </div>
          </div>

          {/* STEP 3: Result View with Interactive Before / After Slider */}
          {resultImage ? (
            <div className="pt-6 space-y-6">
              <div className="text-center space-y-1">
                <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-100/80 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300/40">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Hugging Face VTO Complete
                </span>
                <h4 className="text-2xl font-serif-luxury font-bold text-black">
                  Before / After AI Comparison
                </h4>
                {spaceUsed && (
                  <p className="text-[11px] text-black/50 font-medium">
                    Engine: <span className="font-bold text-black">{spaceUsed}</span>
                  </p>
                )}
              </div>

              {/* Interactive Before / After Slider */}
              <div className="relative aspect-[4/5] max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-black select-none group">
                {/* After Image (Full width background) */}
                <img
                  src={resultImage}
                  alt="AI Try-On Result"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Before Image (Clipped overlay) */}
                <div
                  className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-xl"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src={selectedImage}
                    alt="Original Photo"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ width: '100%', maxWidth: 'none' }}
                  />
                  <span className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Original
                  </span>
                </div>

                {/* Slider Handle Divider */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-2xl"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-white text-black font-extrabold text-xs shadow-xl border border-black/20 flex items-center justify-center -ml-3.5">
                    ↔
                  </div>
                </div>

                {/* Range Slider Control */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
                />

                <span className="absolute top-3 right-3 bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-400" /> AI Result
                </span>
              </div>

              {/* Action Controls */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={resultImage}
                  download={`drapeai-${product.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="shimmer-btn flex-1 bg-black text-white text-xs py-3.5 px-4 rounded-full font-bold hover:bg-black/90 flex items-center justify-center gap-2 transition shadow-xl cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4 text-yellow-400 animate-pulse" /> Download High-Res ⬇️
                </a>

                <button
                  onClick={handleAddToCart}
                  className="px-6 py-3.5 rounded-full bg-[#5A4533] text-white font-bold text-xs hover:bg-black transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {addedToCart ? 'Added! ✓' : 'Add Item to Cart 🛒'}
                </button>

                <button
                  onClick={handleReset}
                  className="px-5 py-3.5 rounded-full bg-white text-black font-bold text-xs hover:bg-black hover:text-white border border-black/20 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Try Another 🔄
                </button>
              </div>
            </div>
          ) : isProcessing ? (
            /* STEP 2: Generation State with Shimmer & Live Progress Updates */
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Outer Spinning Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-black/10 border-t-black animate-spin" />
                <div className="w-16 h-16 rounded-full bg-[#5A4533] flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-[#D9C4A9] animate-pulse" />
                </div>
              </div>

              {/* Shimmer Visual Container */}
              <div className="w-full max-w-xs aspect-[4/5] rounded-3xl overflow-hidden relative bg-black/10 border border-black/10 shadow-inner">
                <img src={selectedImage} alt="Processing Model" className="w-full h-full object-cover opacity-60 blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
              </div>

              <div className="space-y-2 max-w-sm">
                <h4 className="text-xl font-serif-luxury font-bold text-black uppercase tracking-tight">
                  Processing Virtual Try-On
                </h4>
                <p className="text-xs font-bold text-black/80 animate-pulse bg-white/60 py-2 px-4 rounded-full border border-black/10">
                  {progressMessage}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {[0, 1, 2].map((step) => (
                  <div
                    key={step}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      progressStep >= step ? 'w-8 bg-black' : 'w-3 bg-black/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* STEP 1: Upload / Model Selection View */
            <div className="pt-6 space-y-6">
              {error && (
                <div className="p-3.5 rounded-2xl bg-red-100 border border-red-200 text-red-700 text-xs font-bold">
                  {error}
                </div>
              )}

              {/* Mode Tabs */}
              <div className="flex bg-[#C5B299]/50 p-1.5 rounded-full max-w-md mx-auto border border-black/10">
                <button
                  onClick={() => setActiveTab('preset')}
                  className={`flex-1 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    activeTab === 'preset' ? 'bg-black text-white shadow-md' : 'text-black/70 hover:text-black'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" /> 3 Preset Models
                </button>

                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    activeTab === 'upload' ? 'bg-black text-white shadow-md' : 'text-black/70 hover:text-black'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Photo
                </button>

                <button
                  onClick={() => setActiveTab('webcam')}
                  className={`flex-1 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    activeTab === 'webcam' ? 'bg-black text-white shadow-md' : 'text-black/70 hover:text-black'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" /> Camera Snap
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'preset' ? (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-black/70 text-center uppercase tracking-wider">
                    Select a Model for Instant 1-Click AI Try-On
                  </p>

                  <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                    {PRESET_MODELS.map((model) => {
                      const isSelected = selectedModelId === model.id;
                      return (
                        <button
                          key={model.id}
                          onClick={() => handleSelectPreset(model)}
                          className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group ${
                            isSelected ? 'border-black ring-4 ring-black/10 scale-105 shadow-xl' : 'border-transparent opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img src={model.url} alt={model.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-center">
                            <span className="text-[10px] font-bold text-white block leading-tight">
                              {model.name}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-black text-white p-1 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : activeTab === 'upload' ? (
                <div>
                  {selectedImage && selectedModelId === 'custom' ? (
                    <div className="relative aspect-[3/4] w-full max-w-xs mx-auto rounded-2xl overflow-hidden bg-black border border-black/10 shadow-lg">
                      <img src={selectedImage} alt="Uploaded Photo" className="w-full h-full object-cover" />
                      <button
                        onClick={() => { setSelectedImage(PRESET_MODELS[0].url); setSelectedModelId('female-model'); }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-black/80 text-white hover:bg-black cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-black/20 hover:border-black rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-white/50 hover:bg-white transition group max-w-md mx-auto">
                      <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-bold text-black">Click or Drag Photo Here</p>
                        <p className="text-xs text-black/50 font-medium">Supports JPG, PNG up to 10MB (Base64 URL)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              ) : (
                <WebcamCapture onCapture={(img) => { setSelectedImage(img); setSelectedModelId('custom'); }} />
              )}

              {/* Submit CTA Button */}
              <button
                onClick={handleGenerateTryOn}
                disabled={!selectedImage}
                className="shimmer-btn w-full bg-black text-white py-4 rounded-full font-bold text-sm hover:bg-black/90 flex items-center justify-center gap-2 transition-all shadow-xl disabled:opacity-40 active:scale-95 cursor-pointer"
              >
                Generate AI Try-On ✨
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
