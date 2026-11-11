import React from 'react';
import { Instagram, Sparkles, Heart } from 'lucide-react';
import { INSTAGRAM_POSTS } from '../data/content';

export const InstagramSection: React.FC = () => {
  return (
    <section id="social-gallery" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-2.5">
              <Instagram className="w-3.5 h-3.5 text-amber-500" />
              @banayanaenterprise on Instagram
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
              Follow Our Natural Journey
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
              Glimpses into our forest honey harvesting, small-batch Vedic ghee churning, solar curing, and mindful natural living.
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#064E3B] hover:bg-[#047857] text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer shrink-0 self-start md:self-auto"
          >
            <Instagram className="w-4 h-4 text-amber-300" />
            <span>Follow Us @banayanaenterprise</span>
          </a>
        </div>

        {/* 6 Social Photo Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <div
              key={post.id}
              id={post.id}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Hover Overlay with tag & caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 text-white">
                <div className="flex justify-end">
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
                    <Instagram className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block mb-0.5">
                    {post.tag}
                  </span>
                  <p className="text-[11px] font-medium leading-tight line-clamp-3 text-slate-100">
                    {post.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
