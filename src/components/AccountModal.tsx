import React, { useState } from 'react';
import { 
  X, Package, Award, Sparkles, Truck, MessageCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getOrderWhatsAppUrl, openWhatsAppUrl } from '../utils/whatsapp';
import { getPriceForProductWeight } from '../utils/pricing';

export const AccountModal: React.FC = () => {
  const { 
    orders, 
    activeModal, 
    setActiveModal, 
    openOrderTracking 
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  if (activeModal !== 'account') return null;

  return (
    <div
      onClick={() => setActiveModal(null)}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn"
    >
      
      <div 
        id="account-modal-container"
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center font-heading font-extrabold text-xl shadow-xs">
              A
            </div>
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-950">
                Ananya Ramesh
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Member since 2024</span>
                <span>•</span>
                <span className="text-amber-600 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Banayana Gold Club
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loyalty Reward Banner */}
        <div className="px-6 py-3.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-slate-700">Your Banayana Wellness Coins:</span>
            <strong className="text-sm text-emerald-800 font-bold">280 Coins (Worth ₹280)</strong>
          </div>
          <span className="text-[11px] text-amber-700 font-bold">Earn 5% back on all orders</span>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 border-b border-slate-200 flex gap-6 bg-white text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 transition-colors cursor-pointer relative ${
              activeTab === 'orders'
                ? 'text-[#064E3B] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#064E3B]'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Orders & Tracking ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 transition-colors cursor-pointer relative ${
              activeTab === 'addresses'
                ? 'text-[#064E3B] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#064E3B]'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Saved Addresses
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 transition-colors cursor-pointer relative ${
              activeTab === 'profile'
                ? 'text-[#064E3B] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#064E3B]'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Profile & Security
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 bg-slate-50/40">
          {/* Tab 1: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-slate-500">No past orders found.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3.5 shadow-2xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[11px] text-slate-500 block">Order ID</span>
                        <strong className="text-sm text-slate-950 font-mono">{order.id}</strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-500 block">Date</span>
                        <span className="text-xs text-slate-700">{order.date}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-500 block">Total</span>
                        <strong className="text-sm text-slate-950">₹{order.totalAmount}</strong>
                      </div>
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ● {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="space-y-2">
                      {order.items.map((item, idx) => {
                        const unitPrice = getPriceForProductWeight(item.product, item.selectedWeight).price;
                        return (
                          <div key={idx} className="flex items-center justify-between text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-8 h-8 rounded-md border border-slate-200 bg-white object-contain object-center p-0.5"
                              />
                              <span>{item.product.name} ({item.selectedWeight}) × {item.quantity}</span>
                            </div>
                            <span className="font-semibold text-slate-950">₹{unitPrice * item.quantity}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Tracking & WhatsApp Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-[11px] text-slate-500">
                        Tracking: <strong className="font-mono text-emerald-800">{order.trackingNumber}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const url = getOrderWhatsAppUrl(order);
                            openWhatsAppUrl(url);
                          }}
                          className="px-3 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#0d7a36] rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-colors border border-[#25D366]/30"
                          title="Send order details to WhatsApp +91 883 859 8172"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] text-[#25D366]" /> Send to WhatsApp
                        </button>
                        <button
                          onClick={() => openOrderTracking(order.id)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Truck className="w-3.5 h-3.5 text-emerald-700" /> Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-emerald-600 shadow-xs relative">
                <span className="absolute top-4 right-4 text-[10px] font-bold bg-[#064E3B] text-white px-2 py-0.5 rounded">
                  Default
                </span>
                <h4 className="font-bold text-sm text-slate-950 mb-1">Home Address</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Flat 4B, Lotus Apartments, 3rd Cross Street, Anna Nagar<br />
                  Chennai, Tamil Nadu - 600040<br />
                  Phone: +91 98401 23456
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <h4 className="font-bold text-sm text-slate-950 mb-1">Office Address</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Banayana Enterprise Tech Park, Tower B, Level 4, Guindy Industrial Estate<br />
                  Chennai, Tamil Nadu - 600032<br />
                  Phone: +91 98401 23456
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Profile */}
          {activeTab === 'profile' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 text-xs sm:text-sm shadow-2xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Full Name</label>
                  <strong className="text-slate-950 block">Ananya Ramesh</strong>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Email Address</label>
                  <strong className="text-slate-950 block">ananya.r@example.com</strong>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Phone</label>
                  <strong className="text-slate-950 block">+91 98401 23456</strong>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Dietary Preferences</label>
                  <span className="text-emerald-700 font-semibold block">100% Vegetarian & Natural Ayurvedic</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
