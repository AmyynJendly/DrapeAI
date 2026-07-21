import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function TopBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-black text-white text-xs py-2.5 px-4 text-center font-medium relative flex items-center justify-center">
      <p>
        Sign up and get 20% off to your first order.{' '}
        <span className="underline font-bold cursor-pointer hover:text-gray-300 transition">
          Sign Up Now
        </span>
      </p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 text-white/80 hover:text-white transition p-1"
        aria-label="Close banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
