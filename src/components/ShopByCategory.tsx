import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useShop } from '../context/ShopContext';
import { ScrollReveal } from './ScrollReveal';

export const ShopByCategory: React.FC = () => {
  const { setSelectedCategory, products } = useShop();

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    const el = document.getElementById('shop-products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories-section" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-14" distance={24}>
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Curated Categories
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight mb-4">
            Explore Natural Living Categories
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Every product category is rooted in traditional wellness principles, harvested ethically, and minimally processed for maximum vitality.
          </p>
        </ScrollReveal>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => {
            const isFeaturedLarge = idx === 0; // highlight the first honey category nicely
            const liveCount = products.filter(p => p.categorySlug === cat.slug).length;
            return (
              <ScrollReveal
                key={cat.id}
                id={`cat-card-${cat.id}`}
                delay={(idx % 4) * 0.08}
                distance={26}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-500/80 transition-all duration-300 shadow-xs hover:shadow-xl cursor-pointer flex flex-col justify-between ${
                  isFeaturedLarge ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Image Container */}
                <div className={`relative overflow-hidden w-full bg-slate-100 ${isFeaturedLarge ? 'h-64 sm:h-72' : 'h-52'}`}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>
                  
                  {/* Highlight pill */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-200 shadow-xs">
                    {cat.highlight}
                  </div>

                  {/* Live Item Count pill */}
                  <div className="absolute top-3 right-3 bg-[#064E3B]/90 backdrop-blur-xs text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-700/60 shadow-xs">
                    {liveCount} {liveCount === 1 ? 'Item' : 'Items'}
                  </div>

                  {/* Category Title overlay */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-heading text-xl sm:text-2xl font-bold leading-tight drop-shadow-xs">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                {/* Content info & Explore button */}
                <div className="p-4 sm:p-5 flex items-center justify-between gap-4 bg-slate-50/70 border-t border-slate-100">
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategorySelect(cat.slug);
                    }}
                    className="shrink-0 inline-flex items-center gap-1.5 bg-[#064E3B] group-hover:bg-[#047857] text-white text-xs font-semibold px-3.5 py-2 rounded-full transition-all duration-200 shadow-xs cursor-pointer"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
