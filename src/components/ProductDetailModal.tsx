import React, { useState, useEffect } from 'react';
import { 
  X, Star, Heart, ShoppingBag, Zap, ShieldCheck, CheckCircle2, 
  Truck, Leaf, ChevronLeft, ChevronRight,
  MessageCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getProductBookingWhatsAppUrl, openWhatsAppUrl } from '../utils/whatsapp';
import { getPriceForProductWeight } from '../utils/pricing';
import { handleProductImageError } from '../utils/imageFallback';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    activeModal, 
    setActiveModal, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    products, 
    setSelectedProduct 
  } = useShop();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'usage' | 'reviews'>('benefits');

  useEffect(() => {
    if (selectedProduct) {
      setSelectedWeight(selectedProduct.defaultWeight);
      const galLen = selectedProduct.gallery?.length || 1;
      setActiveImageIdx(prev => (prev >= galLen ? 0 : prev));
    }
  }, [selectedProduct?.id, selectedProduct?.defaultWeight, selectedProduct?.gallery?.length]);

  if (activeModal !== 'quickView' || !selectedProduct) return null;

  const currentWeight = selectedWeight || selectedProduct.defaultWeight;
  const inWishlist = isInWishlist(selectedProduct.id);

  // Pricing calculations
  const currentPrices = getPriceForProductWeight(selectedProduct, currentWeight);
  const discountPercent =
    currentPrices.original > currentPrices.price
      ? Math.round(((currentPrices.original - currentPrices.price) / currentPrices.original) * 100)
      : 0;

  const images = selectedProduct.gallery && selectedProduct.gallery.length > 0
    ? selectedProduct.gallery
    : [selectedProduct.image];

  // Related products from same category or bestsellers
  const relatedProducts = products
    .filter(p => p.id !== selectedProduct.id && (p.categorySlug === selectedProduct.categorySlug || p.isBestSeller))
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, currentWeight);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity, currentWeight);
    setActiveModal('checkout');
  };

  const handleClose = () => {
    setActiveModal(null);
    setSelectedProduct(null);
    setQuantity(1);
    setActiveImageIdx(0);
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-modalBackdrop"
    >
      
      {/* Modal Container */}
      <div 
        id="product-detail-modal-container"
        className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl animate-modalScale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-detail-btn"
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-700 flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer border border-slate-200"
          title="Close detail view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* Left Column: Image Gallery & Thumbnails */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Main Active Image Frame */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs flex items-center justify-center p-3 sm:p-5">
                <img
                  src={images[activeImageIdx] || selectedProduct.image}
                  alt={selectedProduct.name}
                  onError={(e) => handleProductImageError(e, selectedProduct)}
                  className="w-full h-full object-contain object-center"
                  referrerPolicy="no-referrer"
                />

                {/* Left/Right arrow navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIdx(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-md cursor-pointer border border-slate-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveImageIdx(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-md cursor-pointer border border-slate-200"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {selectedProduct.badges.map((b, i) => (
                    <span key={i} className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#064E3B]/90 text-white backdrop-blur-xs shadow-sm">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Thumbnails Navigation */}
              {images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer flex items-center justify-center bg-white ${
                        activeImageIdx === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-600/20'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${idx + 1}`} 
                        onError={(e) => handleProductImageError(e, selectedProduct)}
                        className="w-full h-full object-contain object-center p-1" 
                        referrerPolicy="no-referrer" 
                      />
                      {img.includes('front') && (
                        <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] text-white font-semibold py-0.5 text-center">
                          Front
                        </span>
                      )}
                      {img.includes('back') && (
                        <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] text-white font-semibold py-0.5 text-center">
                          Back
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Value Badges Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs text-slate-600">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-950">100% Lab Tested</span>
                  <span className="text-[10px] text-slate-400">Zero Adulteration</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center gap-1">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-950">Natural Recipe</span>
                  <span className="text-[10px] text-slate-400">Ancestral Wisdom</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center gap-1">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-950">Fast Shipping</span>
                  <span className="text-[10px] text-slate-400">Dispatch in 24h</span>
                </div>
              </div>

            </div>

            {/* Right Column: Product Content & Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              
              <div>
                {/* Category & Origin breadcrumb */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
                  <span className="uppercase tracking-wider text-emerald-700 font-bold">
                    {selectedProduct.category}
                  </span>
                  <span>Origin: {selectedProduct.origin}</span>
                </div>

                {/* Title & Tamil Name */}
                <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 leading-tight mb-1">
                  {selectedProduct.name}
                </h1>
                {selectedProduct.tamilName && (
                  <p className="text-sm font-semibold text-emerald-800 tracking-wide mb-2">
                    {selectedProduct.tamilName}
                  </p>
                )}

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200/60 px-2.5 py-0.5 rounded-md font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{selectedProduct.rating}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Based on <strong>{selectedProduct.reviewsCount}</strong> verified reviews
                  </span>
                  <span className={`text-xs font-semibold flex items-center gap-1 px-2 py-0.5 rounded border ${
                    selectedProduct.inStock
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-rose-700 bg-rose-50 border-rose-200'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" /> {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Pricing Block */}
                <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 mb-5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Special Online Price</span>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                        ₹{currentPrices.price}
                      </span>
                      {currentPrices.original > currentPrices.price && (
                        <>
                          <span className="text-sm text-slate-400 line-through">
                            ₹{currentPrices.original}
                          </span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                            Save {discountPercent}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    <span>Inclusive of all taxes</span>
                    <span className="block font-semibold text-emerald-800">Free delivery above ₹499</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  {selectedProduct.description}
                </p>

                {/* Size / Weight Selector */}
                <div className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Select Size / Quantity: <span className="text-emerald-700">{currentWeight}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.weightOptions.map((wt) => {
                      const p = getPriceForProductWeight(selectedProduct, wt);
                      return (
                        <button
                          key={wt}
                          onClick={() => setSelectedWeight(wt)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex flex-col items-center ${
                            currentWeight === wt
                              ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span>{wt}</span>
                          <span className={`text-[10px] ${currentWeight === wt ? 'text-amber-300' : 'text-slate-400'}`}>
                            ₹{p.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity & CTA Buttons */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-white font-bold text-sm cursor-pointer"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-9 text-center font-bold text-sm text-slate-950">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-white font-bold text-sm cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                      id="modal-add-to-cart-btn"
                      disabled={!selectedProduct.inStock}
                      onClick={handleAddToCart}
                      className={`flex-1 py-3 px-4 border rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-2xs ${
                        selectedProduct.inStock
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200 cursor-pointer'
                          : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-800" />
                      <span>{selectedProduct.inStock ? `Add to Bag (₹${currentPrices.price * quantity})` : 'Out of Stock'}</span>
                    </button>

                    {/* Wishlist toggle */}
                    <button
                      id="modal-wishlist-toggle-btn"
                      onClick={() => toggleWishlist(selectedProduct.id)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
                        inWishlist
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:text-rose-600'
                      }`}
                      title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* CTA Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Instant Buy Now Button */}
                    <button
                      id="modal-buy-now-btn"
                      disabled={!selectedProduct.inStock}
                      onClick={handleBuyNow}
                      className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                        selectedProduct.inStock
                          ? 'bg-[#064E3B] hover:bg-[#047857] text-white shadow-md hover:shadow-lg cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>{selectedProduct.inStock ? 'Buy Now • Checkout' : 'Currently Unavailable'}</span>
                    </button>

                    {/* Direct WhatsApp Booking Button */}
                    <button
                      id="modal-whatsapp-book-btn"
                      onClick={() => {
                        const url = getProductBookingWhatsAppUrl({
                          product: selectedProduct,
                          selectedWeight: currentWeight,
                          quantity,
                          price: currentPrices.price
                        });
                        openWhatsAppUrl(url);
                      }}
                      className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Book on WhatsApp</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Tabs: Key Benefits, Ingredients, How To Use */}
              <div className="border-t border-slate-200 pt-5">
                <div className="flex border-b border-slate-200 mb-4 gap-6">
                  <button
                    onClick={() => setActiveTab('benefits')}
                    className={`pb-2.5 text-xs sm:text-sm font-bold transition-colors cursor-pointer relative ${
                      activeTab === 'benefits'
                        ? 'text-[#064E3B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#064E3B]'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Key Benefits
                  </button>
                  <button
                    onClick={() => setActiveTab('ingredients')}
                    className={`pb-2.5 text-xs sm:text-sm font-bold transition-colors cursor-pointer relative ${
                      activeTab === 'ingredients'
                        ? 'text-[#064E3B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#064E3B]'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Ingredients
                  </button>
                  <button
                    onClick={() => setActiveTab('usage')}
                    className={`pb-2.5 text-xs sm:text-sm font-bold transition-colors cursor-pointer relative ${
                      activeTab === 'usage'
                        ? 'text-[#064E3B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#064E3B]'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    How to Use
                  </button>
                </div>

                {/* Tab 1: Benefits */}
                {activeTab === 'benefits' && (
                  <div className="space-y-2">
                    {selectedProduct.keyBenefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 2: Ingredients */}
                {activeTab === 'ingredients' && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 mb-2 font-medium">
                      100% natural and transparent ingredients with zero hidden chemicals:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.ingredients.map((ing, i) => (
                        <span key={i} className="bg-slate-50 border border-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-lg font-medium">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 3: Usage */}
                {activeTab === 'usage' && (
                  <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                    <p className="leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      {selectedProduct.howToUse}
                    </p>
                    {selectedProduct.storageInfo && (
                      <p className="text-xs text-slate-400 italic">
                        <strong>Storage:</strong> {selectedProduct.storageInfo}
                      </p>
                    )}
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* Related Products Carousel / Grid */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-950 mb-4">
                You May Also Like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((relProduct) => (
                  <div
                    key={relProduct.id}
                    onClick={() => {
                      setSelectedProduct(relProduct);
                      setActiveImageIdx(0);
                      setQuantity(1);
                    }}
                    className="p-3 bg-slate-50/70 rounded-2xl border border-slate-200 hover:border-emerald-500/80 hover:bg-white transition-all cursor-pointer flex items-center gap-3 group shadow-2xs"
                  >
                    <img
                      src={relProduct.image}
                      alt={relProduct.name}
                      onError={(e) => handleProductImageError(e, relProduct)}
                      className="w-16 h-16 rounded-xl bg-white border border-slate-100 object-contain object-center p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-emerald-700 truncate">
                        {relProduct.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <span className="font-bold text-slate-950">₹{relProduct.price}</span>
                        <span className="text-[10px] text-amber-500">★ {relProduct.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
