import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { handleProductImageError, isLocalAssetImage } from '../utils/imageFallback';

export const SearchModal: React.FC = () => {
  const { 
    products, 
    activeModal, 
    setActiveModal, 
    openProductDetail, 
    setSelectedCategory,
    setSearchQuery: setGlobalSearch 
  } = useShop();

  const [term, setTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!term.trim()) return [];
    const q = term.toLowerCase().trim();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.tamilName && p.tamilName.toLowerCase().includes(q)) ||
      p.tagline.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.ingredients.some(ing => ing.toLowerCase().includes(q))
    );
  }, [term, products]);

  if (activeModal !== 'search') return null;

  const popularTags = [
    'Raw Honey',
    'Curry Leaf Powder',
    'Murungai Leaf Powder',
    'Mudavatukal Soup',
    'ABC Malt',
    'A2 Desi Ghee',
    'Gulkand'
  ];

  const handleTagClick = (tag: string) => {
    setTerm(tag);
  };

  const handleSelectProduct = (product: Product) => {
    setActiveModal(null);
    openProductDetail(product);
  };

  const handleViewInCatalog = () => {
    setGlobalSearch(term);
    setActiveModal(null);
    const el = document.getElementById('shop-products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      onClick={() => setActiveModal(null)}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-fadeIn"
    >
      
      <div 
        id="search-modal-container"
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Search Input */}
        <div className="relative mb-5">
          <input
            id="search-modal-input"
            type="text"
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search raw honey, ghee, herbal ubtan, malt..."
            className="w-full pl-12 pr-10 py-3.5 bg-slate-50 text-slate-900 text-sm sm:text-base rounded-2xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-all shadow-inner"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
          {term && (
            <button
              onClick={() => setTerm('')}
              className="absolute right-4 top-4 text-xs text-slate-400 hover:text-slate-900"
            >
              ✕
            </button>
          )}
        </div>

        {/* Popular Search Suggestions */}
        {!term && (
          <div className="space-y-4">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-3.5 py-1.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 text-xs font-medium rounded-full border border-slate-200 hover:border-emerald-200 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Quick Categories Bar */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-3">
                Browse by Category
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    setSelectedCategory('honey-sweeteners');
                    setActiveModal(null);
                    const el = document.getElementById('shop-products');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left hover:border-emerald-600 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                >
                  🍯 Honey & Natural Sweeteners
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('health-drinks');
                    setActiveModal(null);
                    const el = document.getElementById('shop-products');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left hover:border-emerald-600 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                >
                  🌾 Health Drinks & Malt
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('herbal-powders');
                    setActiveModal(null);
                    const el = document.getElementById('shop-products');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left hover:border-emerald-600 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                >
                  🍃 Herbal Leaf Powders
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('traditional-wellness');
                    setActiveModal(null);
                    const el = document.getElementById('shop-products');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left hover:border-emerald-600 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                >
                  🌿 Traditional Wellness & Tonics
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('ghee-foods');
                    setActiveModal(null);
                    const el = document.getElementById('shop-products');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left hover:border-emerald-600 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                >
                  🧈 Desi Cow Bilona Ghee
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results List */}
        {term && (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
              <span>Found <strong>{searchResults.length}</strong> matching results</span>
              {searchResults.length > 0 && (
                <button
                  onClick={handleViewInCatalog}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  View in Catalog →
                </button>
              )}
            </div>

            {searchResults.length > 0 ? (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => handleProductImageError(e, product)}
                        className={`w-12 h-12 rounded-lg border border-slate-200 shrink-0 bg-white ${
                          isLocalAssetImage(product.image)
                            ? 'object-contain p-0.5'
                            : 'object-cover'
                        }`}
                      />
                      <div className="min-w-0">
                        <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-emerald-800 truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{product.category}</span>
                          <span>•</span>
                          <span className="font-bold text-slate-950">₹{product.price}</span>
                        </div>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-xs sm:text-sm text-slate-500">
                  No products matched "<strong>{term}</strong>". Try searching for "Honey", "Ghee", or "Malt".
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
