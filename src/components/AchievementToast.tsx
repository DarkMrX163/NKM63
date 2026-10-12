import React from 'react';
import { Award, Sparkles, X } from 'lucide-react';
import { Badge } from '../types/quiz';

interface AchievementToastProps {
  badge: Badge | null;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ badge, onClose }) => {
  if (!badge) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-50 animate-bounce max-w-sm w-full transition-all">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white shadow-2xl border-2 border-amber-300 flex items-start gap-3 backdrop-blur-md">
        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
          <Award className="w-6 h-6 text-yellow-200 animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-200">
            <Sparkles className="w-3.5 h-3.5" />
            Новое достижение разблокировано!
          </div>
          <h4 className="text-sm font-extrabold font-serif truncate mt-0.5 text-white">
            {badge.title}
          </h4>
          <p className="text-xs text-amber-100/90 leading-tight line-clamp-2 mt-0.5">
            {badge.description}
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
