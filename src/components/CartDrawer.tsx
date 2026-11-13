import React, { useState } from 'react';
import { 
  X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, 
  Truck, Tag
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { handleProductImageError, isLocalAssetImage } from '../utils/imageFallback';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    activeModal, 
    setActiveModal, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal, 
    cartDiscount, 
    cartShipping, 
    cartTotal, 
    freeShippingThreshold, 
    freeShippingRemaining,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getEffectivePrice
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (activeModal !== 'cart') return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  return (
    <div
      onClick={() => setActiveModal(null)}
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-fadeIn"
    >
      
      {/* Slide-over Sheet */}
      <div 
        id="cart-drawer-container"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 relative animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-950">Your Shopping Bag</h2>
              <span className="text-xs text-slate-500">{cart.length} {cart.length === 1 ? 'item' : 'items'} added</span>
            </div>
          </div>

          <button
            id="close-cart-btn"
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3.5 bg-emerald-50/70 border-b border-emerald-100 text-xs">
          {freeShippingRemaining > 0 ? (
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-700">
                <span>Add <strong className="text-emerald-800">₹{freeShippingRemaining}</strong> more for <strong className="text-emerald-800">FREE Express Delivery</strong></span>
                <span className="font-bold text-emerald-800">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-emerald-200/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <Truck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>You unlocked FREE Express Delivery across India! 🚚</span>
            </div>
          )}
        </div>

        {/* Cart Item List / Empty State */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-slate-50/40">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">Your bag is empty</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
                Explore our pure wild honey, traditional health blends, and heritage wellness items.
              </p>
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 bg-[#064E3B] text-white text-xs font-bold rounded-full hover:bg-[#047857] transition-colors cursor-pointer shadow-sm"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const unitPrice = getEffectivePrice(item);
              return (
                <div
                  key={`${item.product.id}-${item.selectedWeight}`}
                  className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center gap-3.5 shadow-2xs group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    onError={(e) => handleProductImageError(e, item.product)}
                    className={`w-16 h-16 sm:w-18 sm:h-18 rounded-xl border border-slate-200 shrink-0 bg-slate-50 ${
                      isLocalAssetImage(item.product.image)
                        ? 'object-contain p-1'
                        : 'object-cover'
                    }`}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-heading font-bold text-sm text-slate-900 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedWeight)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] font-semibold text-emerald-700 mb-2">
                      Variant: {item.selectedWeight}
                    </div>

                    {/* Stepper & Line Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedWeight, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-700 font-bold text-xs hover:bg-white rounded cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-slate-950">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedWeight, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-700 font-bold text-xs hover:bg-white rounded cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-bold text-slate-950">
                          ₹{unitPrice * item.quantity}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-slate-400">
                            ₹{unitPrice} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Area with Coupon & Checkout Button */}
        {cart.length > 0 && (
          <div className="p-5 bg-white border-t border-slate-200 space-y-4 shadow-xl">
            
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon <strong className="font-mono">{appliedCoupon.code}</strong> applied!</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-600 hover:text-rose-700 font-bold text-[11px] underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon (e.g. BANAYANA10)"
                      className="flex-1 px-3 py-2 bg-slate-50 text-slate-900 text-xs uppercase font-medium rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#064E3B] text-white text-xs font-bold rounded-xl hover:bg-[#047857] transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-600 pl-1 font-medium">{couponError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{cartDiscount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{cartShipping === 0 ? <strong className="text-emerald-700 font-bold">FREE</strong> : `₹${cartShipping}`}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-slate-950 pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              id="cart-proceed-checkout-btn"
              onClick={() => setActiveModal('checkout')}
              className="w-full py-3.5 bg-[#064E3B] hover:bg-[#047857] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant UPI QR Payment • Fast Delivery Dispatch</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
