import React, { useState } from 'react';
import { X, Upload, Sparkles, Download, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { apiClient } from '../services/api';

interface TryOnModalProps {
  product: Product;
  onClose: () => void;
}

const PRESET_PHOTOS = [
  {
    id: 'preset-female',
    name: 'Female Model',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'preset-male',
    name: 'Male Model',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
];

export default function TryOnModal({ product, onClose }: TryOnModalProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string>(PRESET_PHOTOS[0].url);
  const [userPhotoBase64, setUserPhotoBase64] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUserPhotoBase64(base64);
        setSelectedPhoto(base64);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunTryOn = async () => {
    setIsProcessing(true);
    setError(null);
    setResultImage(null);

    try {
      // Use uploaded base64 or selected photo
      const photoToSend = userPhotoBase64 || selectedPhoto;

      const response = await apiClient.post('/try-on', {
        userPhotoBase64: photoToSend,
        garmentId: product.id || (product as any)._id,
      });

      if (response.data && response.data.resultImage) {
        setResultImage(response.data.resultImage);
      } else {
        throw new Error('No result returned from server.');
      }
    } catch (err: any) {
      console.error('Try-On API error:', err);
      setError(err?.response?.data?.error || err?.message || 'Failed to process virtual try-on.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#E5DAC8] rounded-[32px] max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-black/10 relative text-black"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-black/10 hover:bg-black hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-black/10">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-2xl bg-white border border-black/10 shadow-sm"
            />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-black text-white px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-400" /> Virtual Try-On
              </span>
              <h3 className="text-xl font-serif-luxury font-bold uppercase tracking-tight mt-1">
                {product.name}
              </h3>
              <p className="text-xs text-black/60 font-semibold">${product.price.toFixed(2)}</p>
            </div>
          </div>

          {/* Result View */}
          {resultImage ? (
            <div className="pt-6 space-y-6 text-center">
              <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-100/80 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300/40">
                <CheckCircle2 className="w-3.5 h-3.5" /> AI Try-On Complete
              </span>

              <div className="relative aspect-[3/4] max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-black">
                <img src={resultImage} alt="Try-On Result" className="w-full h-full object-cover" />
              </div>

              <div className="flex gap-3">
                <a
                  href={resultImage}
                  download={`drapeai-${product.name}.png`}
                  className="flex-1 bg-black text-white py-3.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 hover:bg-black/80 transition"
                >
                  <Download className="w-4 h-4 text-yellow-400" /> Download Result
                </a>
                <button
                  onClick={() => setResultImage(null)}
                  className="px-5 py-3.5 rounded-full border border-black/20 text-xs font-bold hover:bg-black hover:text-white transition flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>
          ) : isProcessing ? (
            /* Loading View */
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-black/10 border-t-black animate-spin" />
                <Sparkles className="w-8 h-8 text-black animate-pulse" />
              </div>
              <h4 className="text-xl font-serif-luxury font-bold uppercase">Processing Try-On</h4>
              <p className="text-xs text-black/60 max-w-xs font-semibold">
                Google GenAI is fitting {product.name} to your photo...
              </p>
            </div>
          ) : (
            /* Upload & Select View */
            <div className="pt-6 space-y-6">
              {error && (
                <div className="p-3.5 rounded-2xl bg-red-100 border border-red-200 text-red-700 text-xs font-bold">
                  ⚠️ {error}
                </div>
              )}

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-black/60 mb-3 text-center">
                  1. Upload your photo or choose a model
                </p>
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  {PRESET_PHOTOS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedPhoto(model.url);
                        setUserPhotoBase64(null);
                      }}
                      className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition ${
                        selectedPhoto === model.url && !userPhotoBase64
                          ? 'border-black ring-4 ring-black/10 scale-102'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={model.url} alt={model.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 inset-x-2 text-[10px] font-bold bg-black/70 text-white rounded-md py-1">
                        {model.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* File upload */}
              <label className="border-2 border-dashed border-black/20 hover:border-black rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-white/40 hover:bg-white transition text-center max-w-sm mx-auto">
                <Upload className="w-5 h-5 text-black" />
                <span className="text-xs font-bold text-black">
                  {userPhotoBase64 ? '✓ Custom photo uploaded' : 'Or upload custom photo (JPG/PNG)'}
                </span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              {/* Action Button */}
              <button
                onClick={handleRunTryOn}
                className="w-full bg-black text-white py-4 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black/90 transition shadow-xl cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Try On With Google GenAI
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
