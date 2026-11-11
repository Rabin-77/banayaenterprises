import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    // Check if user already saw splash in this session if preferred,
    // or let it run on every fresh page visit for an immersive brand experience
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 15;
      });
    }, 150);

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2000);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  const handleDismiss = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 400);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#03231B] via-[#064E3B] to-[#021B14] text-white transition-opacity duration-500 ease-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Welcome to Banaya Enterprises"
    >
      {/* Subtle organic ambient glow */}
      <div className="absolute w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-64 h-64 rounded-full bg-amber-400/10 blur-2xl pointer-events-none -translate-y-8" />

      {/* Top right skip button */}
      <button
        onClick={handleDismiss}
        className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium tracking-wide text-emerald-100 border border-white/10 backdrop-blur-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5 z-10 hover:scale-105 active:scale-95"
      >
        <span>Enter Store</span>
        <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
      </button>

      {/* Centered Brand Presentation */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-md animate-fadeIn">
        {/* Logo Container with Soft Glow Ring */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-400/30 via-emerald-300/30 to-amber-400/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-spin-slow" />
          
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white p-2 shadow-2xl ring-4 ring-white/20 flex items-center justify-center transform transition-transform duration-700 hover:scale-105">
            <img
              src="/images/banaya_logo.png"
              alt="Banaya Enterprises Logo"
              className="w-full h-full object-contain rounded-full drop-shadow-sm"
            />
          </div>

          <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-lg ring-2 ring-[#064E3B] animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-slate-900 fill-slate-900" />
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-white mb-2 drop-shadow-sm">
          Banaya Enterprises
        </h1>

        {/* Tagline */}
        <div className="flex items-center gap-2 mb-3">
          <span className="h-px w-6 bg-amber-400/60" />
          <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-amber-300 uppercase">
            Pure & Natural Living
          </p>
          <span className="h-px w-6 bg-amber-400/60" />
        </div>

        <p className="text-xs text-emerald-100/80 max-w-xs mb-8 leading-relaxed">
          Authentic Wild Harvests • Traditional A2 Ghee • Handcrafted Wellness
        </p>

        {/* Smooth Loading Indicator */}
        <div className="w-48 sm:w-56 h-1.5 bg-emerald-950/80 rounded-full overflow-hidden p-0.5 border border-emerald-700/50 mb-3 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-300 to-emerald-300 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <p className="text-[11px] font-mono tracking-wider text-emerald-200/60 uppercase">
          Preparing Fresh Harvest...
        </p>
      </div>

      {/* Bottom Footer Note */}
      <div className="absolute bottom-6 text-center text-[11px] text-emerald-300/60 font-medium">
        100% Authentic Botanical Heritage • Tamil Nadu, India
      </div>
    </div>
  );
};
