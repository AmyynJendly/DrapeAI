import React, { useState, useEffect, useRef } from 'react';
import {
  X, Upload, Camera, Sparkles, Download, RefreshCw,
  CheckCircle2, ShoppingBag, ArrowRight, UserCheck, Clock, Zap, Info
} from 'lucide-react';
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

const PROGRESS_STAGES = [
  { label: 'Encoding your photo...', pct: 10 },
  { label: 'Connecting to AI engine...', pct: 25 },
  { label: 'Fitting garment contours...', pct: 50 },
  { label: 'Generating high-res render...', pct: 75 },
  { label: 'Almost there...', pct: 90 },
];

export default function TryOnModal({ product, onClose }: TryOnModalProps) {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'preset' | 'upload' | 'webcam'>('preset');
  const [selectedImage, setSelectedImage] = useState<string>(PRESET_MODELS[0].url);
  const [selectedModelId, setSelectedModelId] = useState<string>('female-model');

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStage, setProgressStage] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [progressMessage, setProgressMessage] = useState(PROGRESS_STAGES[0].label);
  const [elapsedSecs, setElapsedSecs] = useState(0);

  const [resultImage, setResultImage] = useState<string | null>(null);
  const [spaceUsed, setSpaceUsed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [sliderPos, setSliderPos] = useState<number>(50);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Elapsed time counter while processing
  useEffect(() => {
    if (isProcessing) {
      setElapsedSecs(0);
      elapsedTimerRef.current = setInterval(() => {
        setElapsedSecs(prev => prev + 1);
      }, 1000);

      // Simulate steady progress through stages
      let stageIdx = 0;
      progressTimerRef.current = setInterval(() => {
        stageIdx = Math.min(stageIdx + 1, PROGRESS_STAGES.length - 1);
        setProgressStage(stageIdx);
        setProgressPct(PROGRESS_STAGES[stageIdx].pct);
        setProgressMessage(PROGRESS_STAGES[stageIdx].label);
      }, 6000);
    } else {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }
    return () => {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
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
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (model: typeof PRESET_MODELS[0]) => {
    setSelectedImage(model.url);
    setSelectedModelId(model.id);
    setError(null);
    setResultImage(null);
  };

  const handleGenerateTryOn = async () => {
    if (!selectedImage) {
      setError('Please select or upload a model photo first.');
      return;
    }

    setIsProcessing(true);
    setProgressStage(0);
    setProgressPct(PROGRESS_STAGES[0].pct);
    setProgressMessage(PROGRESS_STAGES[0].label);
    setError(null);
    setResultImage(null);

    try {
      const res = await processHuggingFaceVTO(
        selectedImage,
        product.imageUrl,
        product.category,
        (msg) => setProgressMessage(msg),
        product.id
      );

      setProgressPct(100);
      setResultImage(res.resultUrl);
      setSpaceUsed(res.spaceUsed || 'DrapeAI Neural Engine');
    } catch (err: any) {
      setError(err?.message || 'Failed to generate try-on preview. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResultImage(null);
    setIsProcessing(false);
    setError(null);
    setProgressPct(0);
    setElapsedSecs(0);
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const formatElapsed = (secs: number) => {
    if (secs < 60) return `${secs}s`;
    return `${Math.floor(secs / 60)}m ${secs % 60}s`;
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
            className="absolute top-6 right-6 p-2.5 rounded-full bg-black/10 hover:bg-black hover:text-white text-black transition active:scale-90 cursor-pointer z-10"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Product Brief Banner */}
          <div className="flex items-center gap-4 pb-6 border-b border-black/10">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-2xl bg-white shadow-md border border-black/5 flex-shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-black text-white px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" /> Virtual Try-On
              </span>
              <h3 className="text-xl font-serif-luxury font-bold uppercase tracking-tight text-black mt-1 truncate">
                {product.name}
              </h3>
              <p className="text-xs text-black/70 font-medium">
                ${product.price.toFixed(0)} • {product.category.toUpperCase()}
              </p>
            </div>
          </div>

          {/* ── STEP 3: Result View ── */}
          {resultImage ? (
            <div className="pt-6 space-y-6">
              <div className="text-center space-y-1">
                <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-100/80 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300/40">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AI Try-On Complete
                </span>
                <h4 className="text-2xl font-serif-luxury font-bold text-black">
                  Before / After Comparison
                </h4>
                {spaceUsed && (
                  <p className="text-[11px] text-black/50 font-medium">
                    Powered by <span className="font-bold text-black">{spaceUsed}</span>
                  </p>
                )}
              </div>

              {/* Interactive Before / After Slider */}
              <div
                className="relative aspect-[4/5] max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-black select-none group"
              >
                {/* After — AI result (full background) */}
                <img
                  src={resultImage}
                  alt="AI Try-On Result"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Before — original photo (clipped) */}
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

                {/* Slider handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-2xl"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-white text-black font-extrabold text-xs shadow-xl border border-black/20 flex items-center justify-center -ml-3.5">
                    ↔
                  </div>
                </div>

                {/* Range input overlay */}
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
                  className="flex-1 bg-black text-white text-xs py-3.5 px-4 rounded-full font-bold hover:bg-black/90 flex items-center justify-center gap-2 transition shadow-xl cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4 text-yellow-400" /> Download ⬇️
                </a>

                <button
                  onClick={handleAddToCart}
                  className="px-6 py-3.5 rounded-full bg-[#5A4533] text-white font-bold text-xs hover:bg-black transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {addedToCart ? 'Added! ✓' : 'Add to Cart 🛒'}
                </button>

                <button
                  onClick={handleReset}
                  className="px-5 py-3.5 rounded-full bg-white text-black font-bold text-xs hover:bg-black hover:text-white border border-black/20 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Try Another
                </button>
              </div>
            </div>

          ) : isProcessing ? (
            /* ── STEP 2: AI Processing State ── */
            <div className="py-14 flex flex-col items-center justify-center text-center space-y-6">
              {/* Animated spinner + icon */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-black/10 border-t-black animate-spin" />
                <div className="w-16 h-16 rounded-full bg-[#5A4533] flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-[#D9C4A9] animate-pulse" />
                </div>
              </div>

              {/* Shimmer preview */}
              <div className="w-full max-w-[200px] aspect-[3/4] rounded-3xl overflow-hidden relative bg-black/10 border border-black/10 shadow-inner">
                <img
                  src={selectedImage}
                  alt="Processing Model"
                  className="w-full h-full object-cover opacity-50 blur-[2px]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
                  style={{ backgroundSize: '200% 100%' }}
                />
              </div>

              {/* Stage labels */}
              <div className="space-y-2 max-w-sm w-full">
                <h4 className="text-xl font-serif-luxury font-bold text-black uppercase tracking-tight">
                  Generating Try-On
                </h4>
                <p className="text-xs font-bold text-black/80 animate-pulse bg-white/60 py-2 px-4 rounded-full border border-black/10">
                  {progressMessage}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-black/10 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-black rounded-full"
                    initial={{ width: '5%' }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  />
                </div>
              </div>

              {/* Time info */}
              <div className="flex items-center gap-4 text-xs text-black/50 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatElapsed(elapsedSecs)}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  AI engine active
                </span>
              </div>

              {/* "This may take a while" notice after 15s */}
              {elapsedSecs > 15 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 bg-amber-50/80 border border-amber-200 rounded-2xl px-4 py-3 max-w-sm text-left"
                >
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
                    AI processing can take up to 2 minutes on first run. Hang tight — the result is worth it!
                  </p>
                </motion.div>
              )}
            </div>

          ) : (
            /* ── STEP 1: Model Selection + Upload ── */
            <div className="pt-6 space-y-6">
              {error && (
                <div className="p-3.5 rounded-2xl bg-red-100 border border-red-200 text-red-700 text-xs font-bold">
                  ⚠️ {error}
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
                  <UserCheck className="w-3.5 h-3.5" /> Preset
                </button>

                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    activeTab === 'upload' ? 'bg-black text-white shadow-md' : 'text-black/70 hover:text-black'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" /> Upload
                </button>

                <button
                  onClick={() => setActiveTab('webcam')}
                  className={`flex-1 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    activeTab === 'webcam' ? 'bg-black text-white shadow-md' : 'text-black/70 hover:text-black'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" /> Camera
                </button>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'preset' ? (
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-black/70 text-center uppercase tracking-wider">
                        Select a model for instant AI try-on
                      </p>
                      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                        {PRESET_MODELS.map((model) => {
                          const isSelected = selectedModelId === model.id;
                          return (
                            <button
                              key={model.id}
                              onClick={() => handleSelectPreset(model)}
                              className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group ${
                                isSelected
                                  ? 'border-black ring-4 ring-black/10 scale-105 shadow-xl'
                                  : 'border-transparent opacity-75 hover:opacity-100 hover:scale-102'
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
                            onClick={() => {
                              setSelectedImage(PRESET_MODELS[0].url);
                              setSelectedModelId('female-model');
                            }}
                            className="absolute top-3 right-3 p-2 rounded-full bg-black/80 text-white hover:bg-black cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-3 left-0 right-0 text-center">
                            <span className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Photo ready
                            </span>
                          </div>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-black/20 hover:border-black rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-white/50 hover:bg-white transition group max-w-md mx-auto">
                          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-sm font-bold text-black">Click or Drag Photo Here</p>
                            <p className="text-xs text-black/50 font-medium">JPG, PNG up to 10MB</p>
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
                    <WebcamCapture
                      onCapture={(img) => {
                        setSelectedImage(img);
                        setSelectedModelId('custom');
                        setResultImage(null);
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Generate CTA */}
              <button
                onClick={handleGenerateTryOn}
                disabled={!selectedImage || isProcessing}
                className="w-full bg-black text-white py-4 rounded-full font-bold text-sm hover:bg-black/90 flex items-center justify-center gap-2 transition-all shadow-xl disabled:opacity-40 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                Generate AI Try-On
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-[10px] text-black/40 font-medium">
                ✦ Powered by DrapeAI Neural Engine &nbsp;·&nbsp; First run may take up to 2 minutes
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
