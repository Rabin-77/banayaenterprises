import React, { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '+91 883 859 8172';
  const whatsappUrl = 'https://wa.me/918838598172?text=Hello%20Banayana%20Enterprise%2C%20I%20would%20like%20to%20know%20more%20about%20your%20natural%20products.';

  return (
    <div className="fixed bottom-4 right-3.5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2">
      {/* Popover Bubble */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 w-72 max-w-[calc(100vw-2rem)] mb-2 animate-slideUp">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Banayana Support</h4>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online • Quick Reply
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            Need help choosing products, placing an order, or tracking your package? Chat or call us directly.
          </p>

          <div className="space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
            <a
              href="tel:+918838598172"
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              Call {phoneNumber}
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white pl-4 pr-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
        aria-label="Contact Customer Support"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          +91 883 859 8172
        </span>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
        </span>
      </button>
    </div>
  );
};
