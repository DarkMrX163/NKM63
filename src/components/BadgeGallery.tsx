import React from 'react';
import { Badge } from '../types/quiz';
import { ALL_BADGES } from '../data/questions';
import { Award, Lock, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

interface BadgeGalleryProps {
  unlockedBadgeIds: string[];
}

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({ unlockedBadgeIds }) => {
  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      {/* Title */}
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase border border-amber-300 dark:border-amber-800">
          <BookOpen className="w-3.5 h-3.5" />
          Виртуальный Музей nkm63.ru
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
          Коллекция Краеведческих Наград
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          П проходите уровни викторины, набирайте очки и открывайте памятные музейные медали!
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_BADGES.map((badge) => {
          const isUnlocked = unlockedBadgeIds.includes(badge.id);

          return (
            <div
              key={badge.id}
              className={`p-6 rounded-3xl border-2 transition-all relative overflow-hidden bg-white dark:bg-slate-900 ${
                isUnlocked
                  ? 'border-amber-400/50 shadow-xl shadow-amber-500/5'
                  : 'border-slate-200 dark:border-slate-800 opacity-60 grayscale'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${badge.color} text-white flex items-center justify-center shadow-md font-bold`}>
                  <Award className="w-6 h-6" />
                </div>

                <div>
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 dark:bg-green-950 px-2.5 py-1 rounded-full border border-green-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Разблокировано
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                      <Lock className="w-3.5 h-3.5" />
                      Закрыто
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white mb-1">
                {badge.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {badge.description}
              </p>

              {isUnlocked && (
                <div className="mt-4 pt-3 border-t border-amber-100 dark:border-amber-900/30 flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-3 h-3" />
                  Почетный экспонат вашей коллекции
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
