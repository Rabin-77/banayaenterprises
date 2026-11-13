import React, { useMemo } from 'react';
import { Sparkles, SlidersHorizontal, Search, RefreshCw } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { ScrollReveal } from './ScrollReveal';

export const FeaturedProducts: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    sortBy, 
    setSortBy, 
    searchQuery, 
    setSearchQuery 
  } = useShop();

  const filterTabs = useMemo(() => [
    { label: 'All Products', slug: 'all', count: products.length },
    { label: 'Honey & Sweeteners', slug: 'honey-sweeteners', count: products.filter(p => p.categorySlug === 'honey-sweeteners').length },
    { label: 'Herbal Leaf Powders', slug: 'herbal-powders', count: products.filter(p => p.categorySlug === 'herbal-powders').length },
    { label: 'Health Drinks & Malt', slug: 'health-drinks', count: products.filter(p => p.categorySlug === 'health-drinks').length },
    { label: 'Ghee & Dairy', slug: 'ghee-foods', count: products.filter(p => p.categorySlug === 'ghee-foods').length },
    { label: 'Nuts & Dry Fruits', slug: 'nuts-dryfruits', count: products.filter(p => p.categorySlug === 'nuts-dryfruits').length },
    { label: 'Traditional Wellness', slug: 'traditional-wellness', count: products.filter(p => p.categorySlug === 'traditional-wellness').length },
    { label: 'Herbal Care', slug: 'herbal-products', count: products.filter(p => p.categorySlug === 'herbal-products').length },
  ], [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (selectedCategory !== 'all') {
      list = list.filter(p => p.categorySlug === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.tamilName && p.tamilName.toLowerCase().includes(q)) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.ingredients.some(ing => ing.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: Newly added & Bestsellers first so new launches appear live at the top
      list.sort((a, b) => {
        const scoreA = (a.isNew ? 2 : 0) + (a.isBestSeller ? 1 : 0);
        const scoreB = (b.isNew ? 2 : 0) + (b.isBestSeller ? 1 : 0);
        return scoreB - scoreA;
      });
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="shop-products" className="py-16 lg:py-24 bg-slate-50/60 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <ScrollReveal distance={24} className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Direct From Nature & Artisans
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
              Our Bestselling Products
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
              From high-altitude raw forest honey to stone-ground herbal blends and Vedic A2 ghee, experience unadulterated purity.
            </p>
          </div>

          {/* Quick Search & Sort Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[220px] flex-1 sm:flex-initial">
              <input
                id="catalog-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search honey, ghee, malt..."
                className="w-full pl-9 pr-8 py-2 bg-white text-slate-900 text-xs sm:text-sm rounded-full border border-slate-200 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 placeholder-slate-400 shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-900"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs sm:text-sm shadow-2xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-800 font-medium focus:outline-hidden cursor-pointer text-xs sm:text-sm"
              >
                <option value="featured">Bestsellers First</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </ScrollReveal>

        {/* Category Filter Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.slug}
              id={`filter-tab-${tab.slug}`}
              onClick={() => setSelectedCategory(tab.slug)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                selectedCategory === tab.slug
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 shadow-2xs'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === tab.slug ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Active Filter Indicator if search or category set */}
        {(selectedCategory !== 'all' || searchQuery) && (
          <div className="flex items-center justify-between bg-white border border-slate-200 px-4 py-2.5 rounded-xl mb-6 text-xs sm:text-sm text-slate-700 shadow-2xs">
            <div>
              Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
              {selectedCategory !== 'all' && (
                <span> in <span className="font-semibold text-emerald-700">{filterTabs.find(t => t.slug === selectedCategory)?.label}</span></span>
              )}
              {searchQuery && (
                <span> matching <span className="italic font-semibold text-slate-900">"{searchQuery}"</span></span>
              )}
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer flex items-center gap-1.5 text-xs"
            >
              <RefreshCw className="w-3 h-3" /> Reset Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, idx) => (
              <ScrollReveal key={product.id} delay={(idx % 4) * 0.07} distance={24} amount={0.08}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">No Products Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              We couldn't find any products matching your current search or category criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-[#064E3B] text-white text-xs font-semibold rounded-full hover:bg-[#047857] transition-colors cursor-pointer shadow-xs"
            >
              View All Products
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
