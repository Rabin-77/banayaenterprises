import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Heart, Sparkles, X } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [showStoryModal, setShowStoryModal] = useState(false);

  return (
    <section id="about-us" className="py-16 lg:py-24 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Visual Composition */}
          <div className="lg:col-span-6 relative">
            
            {/* Primary Main Image Frame */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-4/3 sm:aspect-5/4 bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1613548058193-1cd24c1bebcf?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                alt="Traditional herbs and pure wellness products - Banayana Enterprise"
                className="w-full h-full object-cover transform hover:scale-104 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-1">
                  Ancestral Heritage
                </span>
                <p className="font-heading text-lg sm:text-xl font-bold leading-snug drop-shadow-xs">
                  Sourced from pristine Western Ghats forests, prepared with timeless integrity.
                </p>
              </div>
            </div>

            {/* Overlapping Floating Badge */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xl max-w-[220px] hidden sm:block">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">100% Traceable</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                From tribal forest gathers to small-batch Gaushala artisans.
              </p>
            </div>

          </div>

          {/* Right Column: Narrative Content */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Our Story & Heritage
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Rooted in Tradition. <br />
              <span className="text-emerald-700 font-semibold">Crafted for Modern Living.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              At <strong className="text-slate-900 font-semibold">Banayana Enterprise</strong>, we believe wellness should never be artificial or compromised by industrial shortcuts. We bring authentic, traditional natural products directly into your everyday lifestyle—preserving ancient recipes while maintaining world-class laboratory safety standards.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Whether it’s raw rock honey collected by indigenous mountain tribes, A2 bilona ghee churned in clay pots, or sun-cured Damask rose gulkand, every offering is rooted in purity, unconditional trust, and holistic family health.
            </p>

            {/* Core Values Bullet List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Purity at the Source</h4>
                  <p className="text-xs text-slate-500">Direct relationships with organic farmers, forest beekeepers, and indigenous millers.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Heritage Recipes Kept Alive</h4>
                  <p className="text-xs text-slate-500">Authentic preparations passed down through generations, without shortcuts or fillers.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Zero Chemical Guarantee</h4>
                  <p className="text-xs text-slate-500">No artificial preservatives, synthetic colors, refined sugars, or harmful heavy metals.</p>
                </div>
              </div>
            </div>

            {/* Learn More Button */}
            <div className="pt-4">
              <button
                id="about-learn-more-btn"
                onClick={() => setShowStoryModal(true)}
                className="inline-flex items-center gap-2 bg-[#064E3B] hover:bg-[#047857] text-white font-semibold text-sm px-7 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Learn More Detailed Modal */}
      {showStoryModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowStoryModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative animate-fadeIn max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowStoryModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Our Founding Philosophy
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-slate-950 mb-4">
              The Journey of Banayana Enterprise
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Banayana Enterprise was born from a simple realization: while our ancestors lived vibrant, resilient lives powered by pure local food and herbal care, modern store shelves became inundated with ultra-processed shortcuts and deceptive labels.
              </p>
              <p>
                We spent years traveling to the high cliffs of the Western Ghats, ancient Gaushalas in Tamil Nadu, and heritage rose gardens in Pushkar. We partnered directly with traditional artisans who still follow Vedic Bilona churning, wood-pressing, stone-grinding, and sun-cooking.
              </p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900 mb-1">
                  Our 3 Uncompromised Pillars
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li><strong>Total Transparency:</strong> What’s on the label is 100% what’s inside the jar.</li>
                  <li><strong>Fair Livelihoods:</strong> Ethical compensation for our tribal gatherers and generational farmers.</li>
                  <li><strong>Eco-Conscious Packaging:</strong> Glass jars and recyclable materials wherever possible.</li>
                </ul>
              </div>
              <p>
                Thank you for welcoming Banayana Enterprise into your kitchen, skincare altar, and family wellness journey.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowStoryModal(false)}
                className="px-6 py-2.5 bg-[#064E3B] text-white text-xs font-bold rounded-full hover:bg-[#047857] transition-colors cursor-pointer"
              >
                Close Story
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
