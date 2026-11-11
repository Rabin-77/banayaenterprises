import React, { useState } from 'react';
import { Sparkles, Leaf, Check, ArrowRight, X } from 'lucide-react';
import { INGREDIENTS } from '../data/ingredients';
import { Ingredient } from '../types';
import { useShop } from '../context/ShopContext';

export const NaturalIngredientsSection: React.FC = () => {
  const { setSelectedCategory } = useShop();
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  const handleExploreShop = () => {
    const el = document.getElementById('shop-products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="ingredients-section" className="py-16 lg:py-24 bg-slate-50/50 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
            Ethically Harvested & Raw
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight mb-3">
            Nature’s Goodness in Every Product
          </h2>
          <p className="text-base sm:text-lg font-medium text-emerald-800 mb-3">
            “We believe good wellness begins with authentic, unadulterated ingredients.”
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Every herb, seed, honeycomb, and botanical root is sourced directly from ethical farmers, tribal gatherers, and certified organic bio-reserves.
          </p>
        </div>

        {/* Ingredients Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {INGREDIENTS.map((ing) => (
            <div
              key={ing.id}
              id={`ing-card-${ing.id}`}
              onClick={() => setSelectedIngredient(ing)}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-500/80 transition-all duration-300 shadow-xs hover:shadow-xl cursor-pointer flex flex-col justify-between"
            >
              {/* Image Frame */}
              <div className={`relative aspect-4/3 w-full overflow-hidden ${
                ing.image.includes('amla') || ing.image.includes('pouch') || ing.image.includes('bottle') || ing.image.includes('kanji') || ing.image.includes('soup') || ing.image.includes('banaya_honey')
                  ? 'bg-slate-50 p-2 flex items-center justify-center'
                  : 'bg-slate-100'
              }`}>
                <img
                  src={ing.image}
                  alt={ing.name}
                  className={`w-full h-full transition-transform duration-500 ${
                    ing.image.includes('amla') || ing.image.includes('pouch') || ing.image.includes('bottle') || ing.image.includes('kanji') || ing.image.includes('soup') || ing.image.includes('banaya_honey')
                      ? 'object-contain group-hover:scale-105'
                      : 'object-cover group-hover:scale-108'
                  }`}
                  loading="lazy"
                />
                {!ing.image.startsWith('/images/') && (
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                )}
                
                {/* Tamil Name badge */}
                {ing.tamilName && (
                  <span className={`absolute bottom-2 left-2 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md ${
                    ing.image.startsWith('/images/')
                      ? 'text-emerald-950 bg-emerald-100/90 border border-emerald-300 shadow-xs'
                      : 'text-white bg-slate-900/80 backdrop-blur-xs'
                  }`}>
                    {ing.tamilName}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-1">
                    {ing.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {ing.description}
                  </p>
                </div>

                <div>
                  {/* Featured In Pill list */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Featured in:</span>
                    <span className="text-[11px] font-semibold text-emerald-700 truncate max-w-[120px]">
                      {ing.featuredIn[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modern Bottom Banner with Message */}
        <div className="mt-12 p-6 sm:p-8 bg-[#064E3B] rounded-3xl text-center text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h3 className="font-heading text-xl sm:text-2xl font-bold mb-1 text-white">
              Zero Chemical Residue • 100% Traceable Roots
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              We work with over 300+ native tribal honey collectors and traditional farmers across the Western Ghats bio-reserve.
            </p>
          </div>
          <button
            onClick={handleExploreShop}
            className="shrink-0 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-full shadow-md transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>

      </div>

      {/* Ingredient Detail Modal */}
      {selectedIngredient && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedIngredient(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedIngredient(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className={`aspect-16/9 rounded-xl overflow-hidden mb-4 flex items-center justify-center ${selectedIngredient.image.startsWith('/images/') ? 'bg-slate-50 p-2' : 'bg-slate-100'}`}>
              <img 
                src={selectedIngredient.image} 
                alt={selectedIngredient.name} 
                className={`w-full h-full ${selectedIngredient.image.startsWith('/images/') ? 'object-contain' : 'object-cover'}`} 
              />
            </div>

            <div className="flex items-center justify-between mb-1">
              <h3 className="font-heading text-2xl font-bold text-slate-950">
                {selectedIngredient.name}
              </h3>
              {selectedIngredient.tamilName && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {selectedIngredient.tamilName}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              {selectedIngredient.description}
            </p>

            <div className="space-y-2 mb-5">
              <h4 className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
                Key Therapeutic Benefits:
              </h4>
              {selectedIngredient.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <span className="text-xs text-slate-400 block mb-1 font-medium">Found in our creations:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedIngredient.featuredIn.map((item, idx) => (
                  <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-lg">
                    {item}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
