import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Instagram, Facebook, Youtube, 
  MessageCircle, ShieldCheck, Heart, Sparkles, ChevronRight, X, KeyRound 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ScrollReveal } from './ScrollReveal';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setActiveModal } = useShop();
  const [activeInfoModal, setActiveInfoModal] = useState<{ title: string; content: string } | null>(null);

  const scrollTo = (id: string, cat?: string) => {
    if (cat) setSelectedCategory(cat);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openSupportModal = (title: string, type: 'shipping' | 'returns' | 'privacy' | 'terms' | 'faq') => {
    const contents: Record<string, string> = {
      shipping: 'We provide express door-to-door delivery across all pin codes in India. Orders are dispatched within 24 hours from our sanitized regional facility. Free shipping applies automatically on all orders above ₹499. Standard delivery takes 2-4 business days for South India and 3-6 business days for the rest of India.',
      returns: 'Given the food, ingestible and personal hygiene nature of our natural formulations, we accept returns or replacements within 7 days if the product arrived damaged, broken, or with seal tampering. Simply send photos to care@banayana.com or WhatsApp +91 883 859 8172 for instant doorstep resolution.',
      privacy: 'Banayana Enterprise adheres strictly to digital privacy best practices. Your personal credentials, contact numbers, and delivery addresses are encrypted and never shared or sold to third-party marketing entities. We use enterprise-grade secure payment gateways.',
      terms: 'All items listed on Banayana Enterprise are prepared in small batches using traditional artisanal methods and wild-harvested natural botanicals. Color and texture may exhibit subtle seasonal variation, which is the authentic hallmark of pure natural ingredients without artificial stabilizers.',
      faq: 'Q: How is your honey raw?\nA: Our honey is unheated, unpasteurized, and never blended with synthetic corn or sugar syrups. It contains natural living enzymes.\n\nQ: What is A2 Bilona Ghee?\nA: It is churned from cultured curd of native Gir & Kangayam cows using wooden churners, slow-simmered over brass cauldrons.\n\nQ: What payment methods are supported?\nA: We accept 100% secure online UPI payments (Google Pay, PhonePe, Paytm, BHIM) using our official QR code (banayaenterprise100-1@oksbi). Orders are dispatched immediately after QR payment confirmation.'
    };

    setActiveInfoModal({
      title,
      content: contents[type] || 'Information will be updated shortly.'
    });
  };

  return (
    <footer id="contact-footer" className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4 Columns Grid */}
        <ScrollReveal distance={22} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-slate-800">
          
          {/* Column 1: Brand Info (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center shrink-0">
                <img
                  src="/images/banaya_logo.png"
                  alt="Banaya Enterprises Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
                  Banaya Enterprises
                </span>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-emerald-400 uppercase">
                  Pure Nature • Traditional Goodness
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pr-4">
              Banayana Enterprise is dedicated to preserving ancient Indian wellness recipes and delivering unadulterated, ethically sourced natural products for pure, vibrant everyday living.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/918838598172?text=Hello%20Banayana%20Enterprise%2C%20I%20have%20an%20inquiry"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#25D366] hover:text-white text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                title="WhatsApp Support (+91 883 859 8172)"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading text-sm font-bold text-white tracking-wider uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => scrollTo('hero')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('shop-products')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Shop All
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('about-us')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('categories-section')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('contact-footer')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-sm font-bold text-white tracking-wider uppercase mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => openSupportModal('Track Your Order', 'shipping')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openSupportModal('Returns & Refunds Policy', 'returns')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Returns & Refunds
                </button>
              </li>
              <li>
                <button
                  onClick={() => openSupportModal('Privacy Policy', 'privacy')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openSupportModal('Terms & Conditions', 'terms')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => openSupportModal('Frequently Asked Questions', 'faq')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact (Span 3) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="font-heading text-sm font-bold text-white tracking-wider uppercase mb-4">
              Get in Touch
            </h4>
            
            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-400">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <a href="tel:+918838598172" className="hover:text-white font-medium block">
                  +91 883 859 8172
                </a>
                <span className="text-[11px] text-slate-500">Mon - Sat: 9:00 AM - 7:00 PM IST (Call / WhatsApp)</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-400">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <a href="mailto:care@banayana.com" className="hover:text-white font-medium block">
                  care@banayana.com
                </a>
                <span className="text-[11px] text-slate-500">Direct Customer Care</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-400">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                No. 18, Heritage Wellness Enclave, 2nd Avenue, Anna Nagar, Chennai, Tamil Nadu - 600040
              </p>
            </div>
          </div>

        </ScrollReveal>

        {/* Bottom Bar with Copyright & Admin Portal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-800/80">
          <p>
            © 2026 <strong className="text-slate-300">Banayana Enterprise</strong>. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Genuine Natural Formulas</span>
            <span>•</span>
            <span>Made with Heritage in India 🇮🇳</span>
            <span>•</span>
            <button
              onClick={() => setActiveModal('admin')}
              className="text-slate-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer flex items-center gap-1 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-700 hover:border-amber-400/50"
              title="Restricted Staff & Store Admin Portal"
            >
              <KeyRound className="w-3 h-3 text-amber-300" />
              <span>Staff Admin Login</span>
            </button>
          </div>
        </div>

      </div>

      {/* Support Info Modal */}
      {activeInfoModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 text-slate-900"
          onClick={() => setActiveInfoModal(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveInfoModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-heading text-2xl font-bold text-slate-950 mb-4">
              {activeInfoModal.title}
            </h3>

            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-80 overflow-y-auto">
              {activeInfoModal.content}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveInfoModal(null)}
                className="px-5 py-2 bg-[#064E3B] text-white text-xs font-bold rounded-full cursor-pointer hover:bg-[#047857] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
