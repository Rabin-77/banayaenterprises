import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[90] space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const bgStyles = {
          success: 'bg-slate-900 text-white border-slate-800 shadow-xl',
          warning: 'bg-amber-950 text-white border-amber-900 shadow-xl',
          info: 'bg-slate-900 text-white border-slate-800 shadow-xl'
        }[toast.type];

        const Icon = {
          success: CheckCircle2,
          warning: AlertCircle,
          info: Info
        }[toast.type];

        const iconColor = {
          success: 'text-emerald-400',
          warning: 'text-amber-400',
          info: 'text-blue-400'
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 pointer-events-auto animate-slideUp ${bgStyles}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <h5 className="font-heading font-bold text-xs sm:text-sm leading-tight text-white">
                {toast.title}
              </h5>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
