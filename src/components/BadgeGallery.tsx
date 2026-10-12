import React from 'react';
import { Badge } from '../types/quiz';
import { ALL_BADGES } from '../data/questions';
import { 
  Award, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Scroll, 
  Eye, 
  Ticket, 
  Flame, 
  Shield, 
  Trophy, 
  Zap, 
  Crown, 
  MapPin, 
  Compass 
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface BadgeGalleryProps {
  unlockedBadgeIds: string[];
  onOpenCertificate?: () => void;
  onOpenMiniGame?: () => void;
  onOpenTicket?: () => void;
}

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({ 
  unlockedBadgeIds,
  onOpenCertificate,
  onOpenMiniGame,
  onOpenTicket
}) => {
  const totalBadges = ALL_BADGES.length;
  const unlockedCount = unlockedBadgeIds.length;
  const progressPercent = Math.round((unlockedCount / totalBadges) * 100);

  // Gamification rank title
  const rankTitle = unlockedCount >= 10
    ? 'Гроссмейстер краеведения Самарского края'
    : unlockedCount >= 7
    ? 'Хранитель исторического наследия'
    : unlockedCount >= 4
    ? 'Опытный исследователь Поволжья'
    : 'Юный следопыт Нефтегорска';

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return Flame;
      case 'Shield': return Shield;
      case 'Ticket': return Ticket;
      case 'Trophy': return Trophy;
      case 'Zap': return Zap;
      case 'Crown': return Crown;
      case 'MapPin': return MapPin;
      case 'Scroll': return Scroll;
      case 'Eye': return Eye;
      case 'Sparkles': return Sparkles;
      case 'Compass': return Compass;
      default: return Award;
    }
  };

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-widest border border-amber-400/40 shadow-sm font-serif">
          <BookOpen className="w-3.5 h-3.5" />
          Виртуальный Музей nkm63.ru
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white">
          Коллекция Краеведческих Наград
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Проходите залы викторины, разгадывайте музейные экспонаты, удерживайте комбо и открывайте почетные медали!
        </p>

        {/* Gamified Progress Card */}
        <div className="max-w-xl mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-5 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Ранг эрудита: <span className="text-amber-700 dark:text-amber-300 font-extrabold">{rankTitle}</span>
            </span>
            <span className="font-mono text-amber-600 dark:text-amber-400">
              {unlockedCount} из {totalBadges} ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onOpenTicket && (
            <button
              onClick={() => { soundFx.playClick(); onOpenTicket(); }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 flex items-center gap-2 transition-all"
            >
              <Ticket className="w-4 h-4" />
              Мой билет со скидкой в музей
            </button>
          )}

          {onOpenCertificate && (
            <button
              onClick={() => { soundFx.playClick(); onOpenCertificate(); }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/40 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-white/20 hover:bg-white/60 flex items-center gap-2 transition-all"
            >
              <Scroll className="w-4 h-4 text-amber-500" />
              Именной диплом (PDF/PNG)
            </button>
          )}

          {onOpenMiniGame && (
            <button
              onClick={() => { soundFx.playClick(); onOpenMiniGame(); }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/40 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-white/20 hover:bg-white/60 flex items-center gap-2 transition-all"
            >
              <Eye className="w-4 h-4 text-amber-500" />
              Игра «Угадай экспонат»
            </button>
          )}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_BADGES.map((badge) => {
          const isUnlocked = unlockedBadgeIds.includes(badge.id);
          const Icon = getBadgeIcon(badge.icon);

          return (
            <div
              key={badge.id}
              className={`p-6 rounded-3xl border-2 transition-all relative overflow-hidden bg-white/65 dark:bg-slate-900/65 backdrop-blur-md ${
                isUnlocked
                  ? 'border-amber-400/50 shadow-xl shadow-amber-500/10 hover:scale-[1.02]'
                  : 'border-slate-200/60 dark:border-slate-800/60 opacity-60 grayscale'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${badge.color} text-white flex items-center justify-center shadow-md font-bold`}>
                  <Icon className="w-6 h-6" />
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
