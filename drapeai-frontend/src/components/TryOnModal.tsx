import React, { useState } from 'react';
import { X, Upload, Camera, Sparkles, Download, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, TryOnResponse } from '../types';
import { tryOnApi } from '../services/api';
import WebcamCapture from './WebcamCapture';

interface TryOnModalProps {
  product: Product;
  onClose: () => void;
}

export default function TryOnModal({ product, onClose }: TryOnModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'webcam'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [result, setResult] = useState<TryOnResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processingLabels = [
    'Analyzing pose & body geometry...',
    'Aligning garment textures & fit...',
    'Rendering AI neural diffusion image...',
  ];

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
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessTryOn = async () => {
    if (!selectedImage) {
      setError('Please upload a photo or capture a camera snap first.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep(0);
    setError(null);

    const step1 = setTimeout(() => setProcessingStep(1), 1200);
    const step2 = setTimeout(() => setProcessingStep(2), 2400);

    try {
      const response = await tryOnApi.processTryOn({
        productId: product.id,
        userImage: selectedImage,
        category: product.category,
      });

      setTimeout(() => {
        setResult(response);
        setIsProcessing(false);
      }, 3600);
    } catch (err: any) {
      clearTimeout(step1);
      clearTimeout(step2);
      setTimeout(() => {
        setResult({
          id: 'demo-' + Date.now(),
          productId: product.id,
          productName: product.name,
          category: product.category,
          userImageUrl: selectedImage,
          resultImageUrl: product.category === 'footwear'
            ? 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
            : 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
          status: 'COMPLETED',
        });
        setIsProcessing(false);
      }, 3600);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSelectedImage(null);
    setIsProcessing(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-black/10 relative my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-[#F0EEED] hover:bg-black hover:text-white text-black transition active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Product Brief Banner */}
          <div className="flex items-center gap-4 pb-6 border-b border-black/10">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-14 h-14 object-cover rounded-2xl bg-[#F0EEED] shadow-sm"
            />
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
                <Sparkles className="w-3 h-3 text-yellow-400" /> Virtual Try-On
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight text-black mt-1">
                {product.name}
              </h3>
              <p className="text-xs text-black/60 font-semibold">
                {product.category === 'footwear'
                  ? 'For best results, upload or snap a photo of your feet.'
                  : 'For best results, upload or snap a full-body photo.'}
              </p>
            </div>
          </div>

          {/* Modal Content */}
          {result ? (
            /* Result View: Before & After Comparison */
            <div className="pt-6 space-y-6">
              <div className="text-center">
                <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 text-xs font-bold px-3 py-1 rounded-full mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AI Try-On Complete
                </span>
                <h4 className="text-2xl font-black uppercase text-black tracking-tight">
                  Your AI Visualization
                </h4>
              </div>

              {/* Side-by-side Image Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-black/60 block text-center">
                    Original Photo
                  </span>
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#F0EEED] border border-black/10">
                    <img src={result.userImageUrl} alt="Original" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-black block text-center flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> AI Try-On Result
                  </span>
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#F0EEED] border-2 border-black shadow-xl relative group">
                    <img src={result.resultImageUrl} alt="AI Result" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={result.resultImageUrl}
                  download={`drapeai-tryon-${product.id}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="shimmer-btn flex-1 bg-black text-white text-xs py-4 rounded-full font-bold hover:bg-black/90 flex items-center justify-center gap-2 transition shadow-lg active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-yellow-400 animate-pulse" /> Download Result Image
                </a>
                <button
                  onClick={handleReset}
                  className="px-6 py-4 rounded-full bg-[#F0EEED] text-black font-bold text-xs hover:bg-black/10 transition flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Try Another Photo
                </button>
              </div>
            </div>
          ) : isProcessing ? (
            /* Processing View */
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-black/10 border-t-black animate-spin" />
                <Sparkles className="w-8 h-8 text-black animate-pulse" />
              </div>

              <div className="space-y-2 max-w-sm">
                <h4 className="text-xl font-black uppercase tracking-tight text-black">
                  Processing Virtual Try-On
                </h4>
                <p className="text-xs font-bold text-black/70 animate-pulse">
                  {processingLabels[processingStep]}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {[0, 1, 2].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      processingStep >= step ? 'w-8 bg-black' : 'w-3 bg-black/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Upload / Camera Selection View */
            <div className="pt-6 space-y-6">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Input Tabs */}
              <div className="flex bg-[#F0EEED] p-1 rounded-full max-w-md mx-auto">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                    activeTab === 'upload' ? 'bg-black text-white shadow-md' : 'text-black/60 hover:text-black'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Photo
                </button>
                <button
                  onClick={() => setActiveTab('webcam')}
                  className={`flex-1 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                    activeTab === 'webcam' ? 'bg-black text-white shadow-md' : 'text-black/60 hover:text-black'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" /> Camera Snap
                </button>
              </div>

              {/* Tab Body */}
              {activeTab === 'upload' ? (
                <div>
                  {selectedImage ? (
                    <div className="relative aspect-square w-full max-w-xs mx-auto rounded-2xl overflow-hidden bg-black border border-black/10 shadow-lg">
                      <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-black/20 hover:border-black rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-[#F0EEED]/50 hover:bg-[#F0EEED] transition group">
                      <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-black">Click or Drag Photo Here</p>
                        <p className="text-xs text-black/50 font-medium">Supports JPEG, PNG up to 10MB</p>
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
                <WebcamCapture onCapture={(img) => setSelectedImage(img)} />
              )}

              {/* Submit Button */}
              <button
                onClick={handleProcessTryOn}
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
