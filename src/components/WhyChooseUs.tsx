import React from 'react';
import { Leaf, Sparkles, ShieldCheck, HeartHandshake, Smile, Truck } from 'lucide-react';
import { WHY_CHOOSE_US } from '../data/content';

export const WhyChooseUs: React.FC = () => {
  const iconMap: Record<string, React.ElementType> = {
    Leaf,
    Sparkles,
    ShieldCheck,
    HeartHandshake,
    Smile,
    Truck
  };

  return (
    <section id="why-choose-us" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            The Banayana Standard
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight mb-4">
            Why Thousands Trust Banayana Enterprise
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            We bridge time-honored Indian wellness wisdom and uncompromised modern lab testing so your family can thrive with total peace of mind.
          </p>
        </div>

        {/* 6 Benefit Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((item, idx) => {
            const Icon = iconMap[item.iconName] || Leaf;
            return (
              <div
                key={item.id}
                id={`benefit-card-${item.id}`}
                className="bg-slate-50/70 rounded-2xl p-6 sm:p-7 border border-slate-200 hover:border-emerald-500/80 transition-all duration-300 shadow-xs hover:shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#064E3B] group-hover:text-amber-300 transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-slate-900 mb-2.5 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Guaranteed Quality
                  </span>
                  <span className="text-slate-400 font-mono">0{idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
