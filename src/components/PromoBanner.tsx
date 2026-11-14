import React, { useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { ScrollReveal } from './ScrollReveal';

export const PromoBanner: React.FC = () => {
  const { setSelectedCategory } = useShop();
  const bannerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ['start end', 'end start']
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  const handleShopCollection = () => {
    setSelectedCategory('all');
    const el = document.getElementById('shop-products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={bannerRef} id="special-promotion-banner" className="py-14 sm:py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Card with Modern Clean Overlay */}
        <ScrollReveal direction="scale" duration={0.7} className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[380px] sm:min-h-[420px] flex items-center justify-center text-center p-8 sm:p-14 border border-slate-200">
          
          {/* Background Image with Scroll Parallax */}
          <motion.img
            style={{ y: bgY, scale: 1.08 }}
            src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1600&q=80"
            alt="Natural traditional wellness collection"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Deep Emerald Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-[#064E3B]/85 to-slate-950/90 backdrop-blur-2xs"></div>

          {/* Content Overlay */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-5 text-white">
            
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Limited Batch Seasonal Harvest</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Bring Pure Nature Home
            </h2>

            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed">
              Explore our handcrafted collection of natural and traditional wellness products, time-tested heritage ingredients, and clean ethical love.
            </p>

            <div className="pt-2">
              <button
                id="promo-shop-collection-btn"
                onClick={handleShopCollection}
                className="inline-flex items-center gap-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 pt-3 text-xs text-slate-300">
              <span>✓ Free Delivery on ₹499+</span>
              <span className="hidden sm:inline">•</span>
              <span>✓ 100% Genuine Guarantee</span>
              <span className="hidden sm:inline">•</span>
              <span>✓ Secure UPI & Cards</span>
            </div>

          </div>

        </ScrollReveal>

      </div>
    </section>
  );
};
