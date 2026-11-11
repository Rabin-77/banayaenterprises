import React from 'react';
import { Leaf, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

export const TrustHighlights: React.FC = () => {
  const highlights = [
    {
      id: 'highlight-1',
      title: '100% Natural Ingredients',
      description: 'Carefully selected natural ingredients directly harvested from pristine bio-reserves.',
      icon: Leaf,
      accentColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50 border-emerald-200/80'
    },
    {
      id: 'highlight-2',
      title: 'Traditional Goodness',
      description: 'Inspired by trusted traditional recipes, ancestral practices, and time-tested wisdom.',
      icon: Sparkles,
      accentColor: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-200/80'
    },
    {
      id: 'highlight-3',
      title: 'Certified Lab Tested',
      description: 'Made with utmost care, stringent quality standards, and uncompromised purity.',
      icon: ShieldCheck,
      accentColor: 'text-emerald-800',
      bgColor: 'bg-emerald-50/80 border-emerald-200/80'
    },
    {
      id: 'highlight-4',
      title: 'Everyday Wellness',
      description: 'Pure and nourishing natural choices crafted seamlessly for your modern lifestyle.',
      icon: HeartHandshake,
      accentColor: 'text-teal-700',
      bgColor: 'bg-teal-50 border-teal-200/80'
    }
  ];

  return (
    <section id="trust-highlights" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                id={item.id}
                className="bg-slate-50/60 hover:bg-white border border-slate-200/80 hover:border-emerald-500/80 rounded-2xl p-6 transition-all duration-300 shadow-2xs hover:shadow-lg flex flex-col items-start group"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bgColor} ${item.accentColor} border flex items-center justify-center mb-4 transition-transform group-hover:scale-105 duration-200`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 mb-1.5 group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
