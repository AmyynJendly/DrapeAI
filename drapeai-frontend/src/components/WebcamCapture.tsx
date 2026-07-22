import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2 } from 'lucide-react';

interface WebcamCaptureProps {
  onCapture: (imageBase64: string) => void;
}

export default function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 640 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please allow camera permissions in your browser.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      onCapture(dataUrl);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {error ? (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-semibold text-center w-full">
          {error}
        </div>
      ) : capturedImage ? (
        <div className="relative aspect-square w-full max-w-sm rounded-2xl overflow-hidden bg-black border border-black/10 shadow-lg">
          <img src={capturedImage} alt="Captured snap" className="w-full h-full object-cover" />
          <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow">
            <CheckCircle2 className="w-3.5 h-3.5" /> Captured
          </div>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <button
              onClick={retakePhoto}
              className="bg-black/80 hover:bg-black text-white text-xs px-4 py-2 rounded-full font-bold backdrop-blur-md flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-take Snap
            </button>
          </div>
        </div>
      ) : (
        <div className="relative aspect-square w-full max-w-sm rounded-2xl overflow-hidden bg-black border border-black/10 shadow-lg flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <button
              onClick={capturePhoto}
              className="bg-black text-white px-6 py-3 rounded-full font-bold text-xs hover:bg-black/80 transition flex items-center gap-2 shadow-xl border border-white/20 active:scale-95"
            >
              <Camera className="w-4 h-4 text-yellow-400" /> Snap Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
