import React, { useRef } from 'react';
import { Sparkles, ArrowRight, Award, CheckCircle2, Star, Flame } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useShop } from '../context/ShopContext';

export const Hero: React.FC = () => {
  const { openProductDetail, products } = useShop();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 48]);

  const scrollToShop = () => {
    const el = document.getElementById('shop-products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCategories = () => {
    const el = document.getElementById('categories-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Featured highlight products for floating quick cards
  const malaiThean = products.find(p => p.id === 'malai-thean') || products[1];

  return (
    <section ref={heroRef} id="hero" className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/70 to-emerald-50/20 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/80">
      
      {/* Subtle modern background gradient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none -ml-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            
            {/* Top Brand Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-emerald-900 uppercase shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>100% Pure Sourced • Traditional Indian Wellness</span>
            </div>

            {/* Main Hero Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
              Pure Nature. <br />
              <span className="text-[#059669]">Traditional Goodness.</span> <br />
              Modern Everyday Living.
            </h1>

            {/* Supporting Subtext */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Ethically harvested raw honey, Vedic A2 desi cow ghee, nutrition-packed malt blends, and authentic herbal formulations crafted for pure family health.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                id="hero-shop-now-btn"
                onClick={scrollToShop}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#064E3B] hover:bg-[#047857] text-white font-semibold text-base px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <span>Shop Best Sellers</span>
                <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-explore-products-btn"
                onClick={scrollToCategories}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-base px-7 py-3.5 rounded-full transition-all duration-200 cursor-pointer shadow-xs hover:border-slate-400"
              >
                <span>Browse Categories</span>
              </button>
            </div>

            {/* Value Checkpoints */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-2 sm:gap-4 text-left">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Wild Harvested</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block">Direct from Western Ghats</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Zero Additives</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block">No synthetic sugars or fillers</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Lab Tested</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block">100% Purity Certified</p>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Hero Visual Showcase with Modern Floating Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: imageY }}
            className="lg:col-span-5 relative flex justify-center"
          >
            
            {/* Main Lifestyle Hero Photo Frame */}
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Outer Image Container */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 aspect-4/5">
                <img
                  src="https://images.unsplash.com/photo-1654515722385-c684c5331c04?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                  alt="100% Pure Raw Honey & Natural Wellness - Banaya Enterprise"
                  className="w-full h-full object-cover object-center transform hover:scale-103 transition-transform duration-700"
                />

                {/* Gradient vignette for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-300" /> Small Batch Handcrafted
                  </span>
                  <p className="font-heading text-xl font-bold leading-snug">
                    Time-tested wellness prepared with authentic, pure botanical ingredients.
                  </p>
                </div>
              </div>

              {/* Floating Element 1: Top Right Pill */}
              <div className="absolute -top-4 -right-3 z-20 bg-white/95 border border-slate-200 p-3 rounded-2xl shadow-lg flex items-center gap-3 backdrop-blur-md animate-float-slow">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">100% Certified Pure</div>
                  <div className="text-[10px] text-slate-500">Traditional Bilona & Vedic Method</div>
                </div>
              </div>

              {/* Floating Element 2: Bottom Left Interactive Product Badge */}
              <div 
                onClick={() => openProductDetail(malaiThean)}
                className="absolute -bottom-5 -left-3 z-20 bg-white/95 border border-slate-200 p-3.5 rounded-2xl shadow-xl flex items-center gap-3.5 cursor-pointer hover:border-emerald-500 transition-all group backdrop-blur-md animate-float-reverse active:scale-95"
                title="Click to view Malai Thean details"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shrink-0 bg-slate-50">
                  <img
                    src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=150&q=80"
                    alt="Malai Thean"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                      Wild Forest Honey
                    </span>
                    <span className="text-xs text-amber-600 font-bold flex items-center">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline mr-0.5" /> 4.95
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5 group-hover:text-emerald-700 transition-colors">
                    Malai Thean (Mountain Honey)
                  </div>
                  <div className="text-[11px] font-semibold text-slate-800">
                    ₹{malaiThean.price} <span className="line-through text-slate-400 font-normal text-[10px]">₹{malaiThean.originalPrice}</span>
                  </div>
                </div>
              </div>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
