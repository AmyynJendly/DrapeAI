import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({
  className = '',
  variant = 'dark',
  showWordmark = true,
  size = 'md',
}: LogoProps) {
  const iconSizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-black';
  const fillColor = variant === 'light' ? '#FFFFFF' : '#000000';

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 hover:opacity-85 transition-opacity cursor-pointer ${className}`}
    >
      {/* Official Drape.AI Draped "D" Icon SVG */}
      <svg
        viewBox="0 0 100 110"
        className={`${iconSizes[size]} w-auto fill-current flex-shrink-0`}
        style={{ color: fillColor }}
        aria-label="Drape.AI Icon"
      >
        {/* Serif Stem of 'D' */}
        <path d="M 22 20 L 46 20 C 58 20 68 24 74 32 C 78 37 80 43 78 50 C 76 56 71 62 65 67 C 62 70 58 72 54 74 C 64 77 72 83 75 90 C 78 96 74 100 68 100 L 22 100 L 22 92 L 32 92 L 32 28 L 22 28 Z" />
        
        {/* Serifs top & bottom */}
        <path d="M 18 20 L 46 20 L 46 28 L 32 28 L 32 92 L 46 92 L 46 100 L 18 100 L 18 92 L 26 92 L 26 28 L 18 28 Z" />
        
        {/* Curved Fabric Drapes right wing */}
        <path d="M 44 20 C 66 20 84 34 84 54 C 84 62 80 70 74 76 C 79 83 88 89 86 98 C 84 102 78 106 70 104 C 62 102 54 94 50 86 C 47 80 45 74 44 68 Z M 44 30 L 44 62 C 50 67 56 72 62 76 C 68 80 72 84 74 88 C 76 82 76 74 72 68 C 66 60 58 54 50 48 Z" />
        
        {/* Fabric fold shadow accents */}
        <path d="M 52 46 C 60 54 68 64 70 76 C 66 70 60 62 52 56 Z" fillOpacity="0.4" />
        <path d="M 56 64 C 64 74 72 84 72 94 C 68 88 62 80 56 72 Z" fillOpacity="0.3" />
      </svg>

      {/* Wordmark: Drape.AI */}
      {showWordmark && (
        <span className={`font-sans font-bold tracking-tight ${textSizes[size]} ${textColor}`}>
          Drape.AI
        </span>
      )}
    </Link>
  );
}
