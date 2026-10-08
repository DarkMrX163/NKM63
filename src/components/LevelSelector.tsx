import React from 'react';
import { Sparkles, Award, Crown, Shuffle, ChevronRight, BookOpen } from 'lucide-react';
import { Difficulty } from '../types/quiz';
import { soundFx } from '../utils/audio';

interface LevelSelectorProps {
  onSelectLevel: (level: Difficulty | 'mixed') => void;
  onNavigateTab?: (tab: 'quiz' | 'blitz' | 'leaderboard' | 'badges' | 'ai') => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelectLevel, onNavigateTab }) => {
  const levels = [
    {
      id: 'easy' as const,
      title: '🟢 «Юный Краевед»',
      subtitle: 'Детский и лёгкий уровень',
      description: 'Идеально для детей, семейной викторины и первых шагов в изучении истории Самарского края и Нефтегорска.',
      badge: 'Для детей и новичков',
      color: 'border-green-500/40 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent hover:border-green-500',
      btnColor: 'bg-green-600 hover:bg-green-700 text-white',
      icon: Sparkles
    },
    {
      id: 'medium' as const,
      title: '🟡 «Знаток Края»',
      subtitle: 'Средний уровень',
      description: 'Для школьников, студентов и взрослых. Вопросы о Бариновке, Утёвке, географии, реках и развитии Нефтегорска.',
      badge: 'Популярный выбор',
      color: 'border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent hover:border-amber-500',
      btnColor: 'bg-amber-500 hover:bg-amber-600 text-white',
      icon: Award
    },
    {
      id: 'hard' as const,
      title: '🔴 «Хранитель Истории»',
      subtitle: 'Сложный / Экспертный уровень',
      description: 'Для настоящих краеведов и любителей глубокой истории. Архивные хроники, музейные экспонаты nkm63.ru и даты.',
      badge: 'Для знатоков-экспертов',
      color: 'border-rose-500/40 bg-gradient-to-br from-rose-500/10 via-red-500/5 to-transparent hover:border-rose-500',
      btnColor: 'bg-rose-600 hover:bg-rose-700 text-white',
      icon: Crown
    },
    {
      id: 'mixed' as const,
      title: '🎲 «Микс-Испытание»',
      subtitle: 'Все уровни сложности',
      description: 'Случайный марафон вопросов разного уровня сложности с повышенными начислениями очков за каждый правильный ответ.',
      badge: 'Максимум драйва',
      color: 'border-indigo-500/40 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent hover:border-indigo-500',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      icon: Shuffle
    }
  ];

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="text-center mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-widest border border-amber-400/40 shadow-sm font-serif">
          <BookOpen className="w-3.5 h-3.5" />
          Музейно-Краеведческая Экспозиция • nkm63.ru
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-amber-100">
          Выберите Экспозиционный Зал
        </h2>

        {/* Readability container with frosted glass backing */}
        <div className="max-w-2xl mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-md transition-all">
          <p className="text-slate-800 dark:text-slate-100 text-sm sm:text-base font-medium leading-relaxed">
            Погрузитесь в богатую историю Нефтегорского района и Самарской области. За каждый верный ответ вы получаете баллы, открываете подлинные музейные экспонаты и архивные справки!
          </p>
        </div>
      </div>

      {/* Level Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {levels.map((lvl) => {
          const Icon = lvl.icon;
          return (
            <div
              key={lvl.id}
              onClick={() => {
                soundFx.playClick();
                onSelectLevel(lvl.id);
              }}
              className={`group relative p-6 sm:p-7 rounded-2xl border-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-slate-900 ${lvl.color}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-amber-500" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {lvl.badge}
                </span>
              </div>

              <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white mb-1">
                {lvl.title}
              </h3>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-3">
                {lvl.subtitle}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                {lvl.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800/80">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Автоподсчет очков и наград
                </span>
                <button
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all group-hover:px-5 ${lvl.btnColor}`}
                >
                  Начать игру
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
