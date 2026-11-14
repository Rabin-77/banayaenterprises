import React from 'react';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { handleProductImageError } from '../utils/imageFallback';

export const WishlistDrawer: React.FC = () => {
  const { 
    wishlist, 
    products, 
    activeModal, 
    setActiveModal, 
    toggleWishlist, 
    addToCart, 
    openProductDetail 
  } = useShop();

  if (activeModal !== 'wishlist') return null;

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div
      onClick={() => setActiveModal(null)}
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-fadeIn"
    >
      
      {/* Slide-over Container */}
      <div 
        id="wishlist-drawer-container"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 relative animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-950">Saved Favorites</h2>
              <span className="text-xs text-slate-500">{wishlist.length} items in wishlist</span>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-slate-50/40">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-100">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">Your wishlist is empty</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
                Save your favorite pure honey, health malts, and herbal soaps by tapping the heart icon.
              </p>
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 bg-[#064E3B] text-white text-xs font-bold rounded-full hover:bg-[#047857] transition-colors cursor-pointer shadow-sm"
              >
                Browse Products
              </button>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center gap-3.5 shadow-2xs group"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  onClick={() => openProductDetail(product)}
                  onError={(e) => handleProductImageError(e, product)}
                  className="w-16 h-16 rounded-xl border border-slate-200 shrink-0 cursor-pointer bg-white object-contain object-center p-1"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 
                      onClick={() => openProductDetail(product)}
                      className="font-heading font-bold text-sm text-slate-900 truncate cursor-pointer hover:text-emerald-700"
                    >
                      {product.name}
                    </h4>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs font-bold text-slate-900 mt-0.5 mb-2">
                    ₹{product.price} <span className="text-[10px] text-slate-400 line-through font-normal">₹{product.originalPrice}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={!product.inStock}
                      onClick={() => {
                        addToCart(product, 1, product.defaultWeight);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        product.inStock
                          ? 'bg-[#064E3B] hover:bg-[#047857] text-white cursor-pointer'
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-3 h-3 text-amber-300" />
                      <span>{product.inStock ? 'Move to Bag' : 'Out of Stock'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.some(p => p.inStock) && (
          <div className="p-5 bg-white border-t border-slate-200">
            <button
              onClick={() => {
                wishlistProducts.filter(p => p.inStock).forEach(p => addToCart(p, 1, p.defaultWeight));
                setActiveModal('cart');
              }}
              className="w-full py-3 bg-[#064E3B] hover:bg-[#047857] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Add All In-Stock to Cart</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
