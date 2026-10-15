import React from 'react';
import { 
  Sparkles, 
  Award, 
  Crown, 
  Shuffle, 
  ChevronRight, 
  BookOpen, 
  Zap, 
  Heart, 
  GraduationCap, 
  Ticket,
  Eye,
  CheckCircle2,
  Lock,
  Compass,
  Landmark,
  Search,
  Camera
} from 'lucide-react';
import { Difficulty, GameMode, HallSelection } from '../types/quiz';
import { soundFx } from '../utils/audio';
import { CompletedHallRecord, MUSEUM_HALLS } from '../data/halls';
import { AppTab } from './Header';

interface LevelSelectorProps {
  onSelectLevel: (level: HallSelection, mode: GameMode) => void;
  onNavigateTab?: (tab: AppTab) => void;
  completedHalls?: CompletedHallRecord[];
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ 
  onSelectLevel, 
  onNavigateTab,
  completedHalls = []
}) => {
  const [selectedMode, setSelectedMode] = React.useState<GameMode>('classic');

  const completedCount = completedHalls.length;
  const isTicketUnlocked = completedCount >= 2;

  const modes: Array<{
    id: GameMode;
    title: string;
    desc: string;
    badge: string;
    icon: React.ElementType;
    color: string;
  }> = [
    {
      id: 'classic',
      title: 'Классический Квест',
      desc: 'Вдумчивое изучение музейных залов и фактов без спешки.',
      badge: 'Рекомендуется',
      icon: GraduationCap,
      color: 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200'
    },
    {
      id: 'timed',
      title: 'Блиц-Марафон',
      desc: '15 сек на ответ, комбо-множители очков x1.5, x2, x3 за серию верных ответов!',
      badge: 'Драйв & Комбо',
      icon: Zap,
      color: 'border-orange-500 bg-orange-500/10 text-orange-900 dark:text-orange-200'
    },
    {
      id: 'survival',
      title: 'Выживание: 3 Жизни',
      desc: 'Хардкор-испытание: даётся 3 сердца. Ошибка забирает жизнь!',
      badge: 'Хардкор',
      icon: Heart,
      color: 'border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-200'
    }
  ];

  const levels = [
    {
      id: 'easy' as const,
      title: '🟢 «Юный Краевед»',
      subtitle: 'Детский и лёгкий экспозиционный зал',
      description: 'Идеально для детей, семейной викторины и первых шагов в изучении истории Самарского края и Нефтегорска.',
      badge: 'Для детей и новичков',
      color: 'border-green-500/40 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent hover:border-green-500',
      btnColor: 'bg-green-600 hover:bg-green-700 text-white',
      icon: Sparkles
    },
    {
      id: 'medium' as const,
      title: '🟡 «Знаток Края»',
      subtitle: 'Основной экспозиционный зал музея',
      description: 'Для школьников, студентов и взрослых. Вопросы о Бариновке, Утёвке, географии, реках и развитии Нефтегорска.',
      badge: 'Популярный выбор',
      color: 'border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent hover:border-amber-500',
      btnColor: 'bg-amber-500 hover:bg-amber-600 text-white',
      icon: Award
    },
    {
      id: 'hard' as const,
      title: '🔴 «Хранитель Истории»',
      subtitle: 'Сложный / Архивный зал nkm63.ru',
      description: 'Для знатоков и любителей глубокой истории. Архивные хроники, музейные экспонаты nkm63.ru и даты.',
      badge: 'Для знатоков-экспертов',
      color: 'border-rose-500/40 bg-gradient-to-br from-rose-500/10 via-red-500/5 to-transparent hover:border-rose-500',
      btnColor: 'bg-rose-600 hover:bg-rose-700 text-white',
      icon: Crown
    },
    {
      id: 'mixed' as const,
      title: '🎲 «Микс-Экспозиция»',
      subtitle: 'Сборный зал всех эпох',
      description: 'Случайный марафон вопросов разного уровня сложности с повышенными начислениями очков за каждый правильный ответ.',
      badge: 'Максимум баллов',
      color: 'border-indigo-500/40 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent hover:border-indigo-500',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      icon: Shuffle
    }
  ];

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-widest border border-amber-400/40 shadow-sm font-serif">
          <BookOpen className="w-3.5 h-3.5" />
          Музейно-Краеведческая Экспозиция • nkm63.ru
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-amber-100">
          Выберите Режим и Зал Экспозиции
        </h2>

        <div className="max-w-2xl mx-auto bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/50 dark:border-slate-700/50 shadow-lg">
          <p className="text-slate-800 dark:text-slate-100 text-sm sm:text-base font-semibold leading-relaxed">
            Погрузитесь в богатую историю Нефтегорского района и Самарской области. Пройдите минимум <strong>два тематических зала</strong>, чтобы разблокировать персональный билет в музей со скидкой до 100%!
          </p>
        </div>
      </div>

      {/* MUSEUM TICKET QUEST PROGRESS BANNER */}
      <div className={`p-5 sm:p-6 rounded-3xl border-2 backdrop-blur-md transition-all shadow-xl ${
        isTicketUnlocked 
          ? 'border-emerald-500/50 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100' 
          : 'border-amber-400/50 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Ticket className={`w-5 h-5 ${isTicketUnlocked ? 'text-emerald-600' : 'text-amber-600'}`} />
              <h3 className="font-bold font-serif text-base sm:text-lg">
                Квест на получение билета в музей
              </h3>
            </div>
            <p className="text-xs sm:text-sm opacity-90">
              {isTicketUnlocked ? (
                <span>🎉 <strong>Условие выполнено!</strong> Вы прошли {completedCount} тематических залов. Ваш персональный билет разблокирован!</span>
              ) : (
                <span>Пройдено залов: <strong>{completedCount} из 2</strong>. Пройдите ещё <strong>{2 - completedCount}</strong> зал для открытия официального билета!</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-32 sm:w-40 bg-white/60 dark:bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5 border border-black/10">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isTicketUnlocked ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, (completedCount / 2) * 100)}%` }}
              />
            </div>

            {onNavigateTab && (
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onNavigateTab('ticket');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-1.5 ${
                  isTicketUnlocked 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {isTicketUnlocked ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                {isTicketUnlocked ? 'Открыть билет' : 'Прогресс квеста'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1. GAME MODE SELECTOR */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-white/40 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white">
              1. Выберите Игровой Режим
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
            Влияет на таймер, жизни и комбо
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setSelectedMode(m.id);
                }}
                className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? `${m.color} shadow-lg scale-[1.02]`
                    : 'border-slate-200/80 dark:border-slate-800 bg-white/40 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-800 flex items-center justify-center shadow-xs">
                    <Icon className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                    {m.badge}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm sm:text-base font-serif text-slate-900 dark:text-white">
                    {m.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                    {m.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. THEMATIC MUSEUM HALLS (PRIMARY FOR 2-HALL TICKET QUEST) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-amber-500" />
            2. Тематические Залы Музея (Рекомендуется для квеста)
          </h3>
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
            Режим: {modes.find((m) => m.id === selectedMode)?.title}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MUSEUM_HALLS.map((hall) => {
            const record = completedHalls.find((h) => h.hallId === hall.id);
            const isPassed = !!record;

            return (
              <div
                key={hall.id}
                onClick={() => {
                  soundFx.playClick();
                  onSelectLevel(hall.id, selectedMode);
                }}
                className={`group relative p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex flex-col justify-between ${
                  isPassed 
                    ? 'border-emerald-500/50 bg-emerald-50/20' 
                    : `${hall.accentBorder}`
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl p-1 bg-white/60 dark:bg-slate-800/60 rounded-2xl shadow-xs">
                      {hall.emoji}
                    </span>
                    {isPassed ? (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-400/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Пройден
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300">
                        {hall.badgeText}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold font-serif text-base text-slate-900 dark:text-white leading-snug">
                      {hall.title}
                    </h4>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                      {hall.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                      {hall.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">
                    {isPassed ? `Счет: ${record.score} б.` : 'Вход в зал'}
                  </span>

                  <button
                    type="button"
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all group-hover:px-4 ${
                      isPassed ? 'bg-emerald-600 text-white' : hall.btnColor
                    }`}
                  >
                    {isPassed ? 'Повторить' : 'Войти'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. DIFFICULTY BASED EXPOSITIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-500" />
            3. Экспозиции по Уровню Сложности
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            Все уровни также засчитываются в квест
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {levels.map((lvl) => {
            const Icon = lvl.icon;
            const record = completedHalls.find((h) => h.hallId === lvl.id);
            const isPassed = !!record;

            return (
              <div
                key={lvl.id}
                onClick={() => {
                  soundFx.playClick();
                  onSelectLevel(lvl.id, selectedMode);
                }}
                className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md ${lvl.color}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    {isPassed && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 flex items-center gap-1 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Пройден
                      </span>
                    )}
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70">
                      {lvl.badge}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white mb-1">
                  {lvl.title}
                </h3>
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">
                  {lvl.subtitle}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200 mb-5 leading-relaxed font-medium">
                  {lvl.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Режим «{modes.find((m) => m.id === selectedMode)?.title}»
                  </span>
                  <button
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all group-hover:px-5 ${lvl.btnColor}`}
                  >
                    Войти в зал
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Museum Shortcuts banner */}
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/30 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Ticket className="w-6 h-6 text-amber-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Персональный билет со скидкой до 100% на вход в музей
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Генерируется с персональным промокодом для кассы Нефтегорского краеведческого музея.
            </p>
          </div>
        </div>

        {onNavigateTab && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { soundFx.playClick(); onNavigateTab('detective'); }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-900 dark:text-amber-200 hover:bg-amber-500/30 border border-amber-500/40 flex items-center gap-1.5 transition-all"
            >
              <Search className="w-3.5 h-3.5 text-amber-500" />
              Архивариус
            </button>
            <button
              onClick={() => { soundFx.playClick(); onNavigateTab('ticket'); }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md flex items-center gap-1.5 transition-all"
            >
              <Ticket className="w-3.5 h-3.5" />
              {isTicketUnlocked ? 'Мой билет в музей' : `Билет в музей (${completedCount}/2)`}
            </button>
            <button
              onClick={() => { soundFx.playClick(); onNavigateTab('artifacts'); }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white/40 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-white/60 border border-white/20 flex items-center gap-1.5 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-amber-500" />
              Угадай экспонат
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
