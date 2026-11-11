import React, { useState } from 'react';
import { X, Search, CheckCircle2, Truck, Package, Clock, ShieldCheck, MapPin, MessageCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { DISPLAY_PHONE_NUMBER, openWhatsAppUrl } from '../utils/whatsapp';

export const OrderTrackModal: React.FC = () => {
  const { activeModal, setActiveModal, orders } = useShop();
  const [lookupId, setLookupId] = useState('STM-84920');
  const [searched, setSearched] = useState(true);

  if (activeModal !== 'trackOrder') return null;

  const currentOrder = orders.find(o => 
    o.id.toLowerCase() === lookupId.trim().toLowerCase() || 
    o.trackingNumber.toLowerCase() === lookupId.trim().toLowerCase()
  ) || orders[0];

  const steps = [
    { label: 'Order Confirmed', time: 'Yesterday, 10:30 AM', done: true, desc: 'Verified and sent to facility' },
    { label: 'Packed & Quality Sealed', time: 'Yesterday, 04:15 PM', done: true, desc: 'Packed in eco-friendly glass containers' },
    { label: 'Handed to Express Courier', time: 'Today, 08:45 AM', done: true, desc: 'Dispatched via BlueDart Express Air' },
    { label: 'Out for Doorstep Delivery', time: 'Expected by 4:00 PM', done: false, desc: 'Delivery partner assigned in Chennai' },
    { label: 'Delivered', time: 'Estimated Today', done: false, desc: 'Contactless delivery with OTP' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      
      <div 
        id="track-order-modal-container"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-950">
                Track Your Shipment
              </h2>
              <span className="text-xs text-slate-500">Real-time parcel delivery status</span>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 bg-slate-50/40">
          
          {/* Tracking Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="Enter Order ID (e.g. STM-84920) or Tracking No."
                className="w-full pl-10 pr-4 py-2.5 bg-white text-xs sm:text-sm text-slate-900 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
            <button
              onClick={() => setSearched(true)}
              className="px-5 py-2.5 bg-[#064E3B] text-white text-xs font-bold rounded-xl hover:bg-[#047857] transition-colors cursor-pointer"
            >
              Track
            </button>
          </div>

          {currentOrder && (
            <div className="space-y-6">
              {/* Summary Header */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                <div>
                  <span className="text-[11px] text-slate-500 block">Tracking Number</span>
                  <strong className="text-sm font-mono text-slate-950">{currentOrder.trackingNumber}</strong>
                </div>
                {currentOrder.transactionId && (
                  <div>
                    <span className="text-[11px] text-slate-500 block">Transaction ID</span>
                    <strong className="text-xs font-mono text-emerald-800">{currentOrder.transactionId}</strong>
                  </div>
                )}
                <div>
                  <span className="text-[11px] text-slate-500 block">Carrier</span>
                  <span className="text-xs font-semibold text-emerald-800">BlueDart Express Air</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Payment Status</span>
                  <strong className="text-xs text-emerald-700 font-bold">PAID (₹{currentOrder.totalAmount})</strong>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                <h4 className="font-heading font-bold text-sm text-slate-950 mb-3">
                  Shipment Journey
                </h4>

                <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {steps.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4 pl-2">
                      <div 
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 ${
                          step.done ? 'bg-emerald-600 text-white' : 'bg-slate-100 border border-slate-300 text-slate-400'
                        }`}
                      >
                        {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <h5 className={`text-xs sm:text-sm font-bold ${step.done ? 'text-slate-950' : 'text-slate-400'}`}>
                            {step.label}
                          </h5>
                          <span className="text-[11px] text-slate-400">{step.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address Preview */}
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/80 text-xs text-slate-700 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Destination:</strong> {currentOrder.shippingAddress}, {currentOrder.city} - {currentOrder.postalCode}
                </div>
              </div>

              {/* WhatsApp Support Callout */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Need urgent delivery assistance?</span>
                    <span className="text-slate-500 text-[11px]">Chat with our dispatch desk on WhatsApp ({DISPLAY_PHONE_NUMBER})</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const text = `Hello Banayana Enterprise, please give me a quick delivery update for my Order ID ${currentOrder.id} (Tracking: ${currentOrder.trackingNumber}).`;
                    openWhatsAppUrl(`https://wa.me/918838598172?text=${encodeURIComponent(text)}`);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" /> WhatsApp Updates
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
