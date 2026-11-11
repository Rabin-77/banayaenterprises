import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Zap, Check } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { getPriceForProductWeight } from '../utils/pricing';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, openProductDetail, openQuickCheckout } = useShop();
  const [selectedWeight, setSelectedWeight] = useState<string>(product.defaultWeight);
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const currentPrices = getPriceForProductWeight(product, selectedWeight);
  const discountPercent = Math.round(((currentPrices.original - currentPrices.price) / currentPrices.original) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, selectedWeight);
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickCheckout(product, selectedWeight);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => openProductDetail(product)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/60 transition-all duration-300 shadow-xs hover:shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer transform hover:-translate-y-1.5 active:scale-[0.99]"
    >
      {/* Product Image Header Container */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full transition-transform duration-700 ease-out ${
            product.image.includes('rose_gulkand')
              ? 'object-cover object-center group-hover:scale-108'
              : product.image.startsWith('/images/') || product.image.startsWith('/assets/')
                ? 'object-contain p-3 group-hover:scale-108'
                : 'object-cover object-center group-hover:scale-108'
          }`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badges.slice(0, 2).map((badge, i) => (
            <span
              key={i}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
                badge === 'Bestseller'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900/85 text-white backdrop-blur-xs'
              }`}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs z-10 cursor-pointer ${
            inWishlist
              ? 'bg-rose-50 text-rose-600 border border-rose-200 scale-105'
              : 'bg-white/90 text-slate-500 hover:text-rose-600 hover:bg-white border border-slate-200/60'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 px-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProductDetail(product);
            }}
            className="w-full py-1.5 bg-white/95 hover:bg-white text-slate-900 text-xs font-semibold rounded-xl shadow-md flex items-center justify-center gap-1.5 border border-slate-200 backdrop-blur-xs transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        
        <div>
          {/* Rating & Origin */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1 text-slate-800 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal text-[11px]">({product.reviewsCount})</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium truncate max-w-[110px] bg-slate-100 px-1.5 py-0.5 rounded">
              {product.origin.split(',')[0]}
            </span>
          </div>

          {/* Product Name & Tamil Subtitle */}
          <div className="mb-1.5">
            <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight line-clamp-1">
              {product.name}
            </h3>
            {product.tamilName && (
              <span className="text-[11px] font-medium text-emerald-700 tracking-wide block mt-0.5">
                {product.tamilName}
              </span>
            )}
          </div>

          {/* Short description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
            {product.tagline}
          </p>
        </div>

        {/* Weights Selection & Pricing */}
        <div>
          {/* Weight selector pills */}
          {product.weightOptions.length > 1 && (
            <div className="flex flex-wrap gap-1 mb-3" onClick={(e) => e.stopPropagation()}>
              {product.weightOptions.map((wt) => (
                <button
                  key={wt}
                  onClick={() => setSelectedWeight(wt)}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                    selectedWeight === wt
                      ? 'bg-[#064E3B] text-white border-[#064E3B]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {wt}
                </button>
              ))}
            </div>
          )}

          {/* Price Container */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold text-slate-950 font-heading">
              ₹{currentPrices.price}
            </span>
            <span className="text-xs text-slate-400 line-through font-normal">
              ₹{currentPrices.original}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              {discountPercent}% OFF
            </span>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              id={`add-to-cart-btn-${product.id}`}
              onClick={handleAddToCart}
              className={`py-2 px-2 rounded-xl font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                isAddedAnim
                  ? 'bg-emerald-600 text-white shadow-xs animate-badgePop'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 hover:border-slate-300'
              }`}
              title="Add item to your cart"
            >
              {isAddedAnim ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-slate-700" />
                  <span>Add</span>
                </>
              )}
            </button>

            <button
              id={`buy-now-btn-${product.id}`}
              onClick={handleBuyNow}
              className="py-2 px-2 rounded-xl bg-[#064E3B] hover:bg-[#047857] active:scale-95 text-white font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-1 shadow-xs hover:shadow-md cursor-pointer"
              title="Instant Checkout"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Buy Now</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
