import React, { useState } from 'react';
import { Mail, Check, Sparkles, Gift } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const NewsletterSection: React.FC = () => {
  const { showToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Invalid Email', 'Please enter a valid email address.', 'warning');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed!', 'Welcome to the Banayana Enterprise Family! Use coupon BANAYANA10 for 10% off.', 'success');
  };

  return (
    <section id="newsletter-section" className="py-16 sm:py-20 bg-slate-50/60 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Container Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl relative overflow-hidden">
          
          {/* Subtle Organic Backdrops */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-50 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3.5 py-1 rounded-full text-xs font-semibold uppercase">
              <Gift className="w-3.5 h-3.5 text-amber-500" />
              Join The Wellness Circle
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Stay Connected With Banayana Enterprise
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Get product updates, seasonal harvest alerts, and natural wellness tips directly in your inbox.
            </p>

            {subscribed ? (
              /* Success confirmation state */
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center max-w-md mx-auto space-y-2 animate-fadeIn">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-lg text-slate-950">
                  Welcome to Banayana Enterprise!
                </h4>
                <p className="text-xs text-slate-600">
                  Your VIP coupon code has been activated. Use code <strong className="text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 font-mono text-sm">BANAYANA10</strong> at checkout for 10% off.
                </p>
              </div>
            ) : (
              /* Input Form */
              <form onSubmit={handleSubmit} className="pt-2 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                <div className="relative w-full">
                  <input
                    id="newsletter-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 text-slate-900 text-sm rounded-full border border-slate-200 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 placeholder-slate-400"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
                <button
                  id="newsletter-subscribe-btn"
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 bg-[#064E3B] hover:bg-[#047857] text-white font-semibold text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}

            <p className="text-[11px] text-slate-400 pt-1">
              🔒 We respect your privacy. No spam, only natural wellness tips & rare harvest alerts.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};
