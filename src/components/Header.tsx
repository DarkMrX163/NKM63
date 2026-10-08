import React from 'react';
import { Compass, Trophy, Map, Zap, Award, Bot, Moon, Sun, Volume2, VolumeX, BookOpen } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  activeTab: 'quiz' | 'blitz' | 'leaderboard' | 'badges' | 'ai';
  setActiveTab: (tab: 'quiz' | 'blitz' | 'leaderboard' | 'badges' | 'ai') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  playerName: string;
  setPlayerName: (val: string) => void;
  totalScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  playerName,
  setPlayerName,
  totalScore
}) => {
  const [isMuted, setIsMuted] = React.useState(soundFx.isMuted);

  const toggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Ribbon Logo Banner */}
          <div 
            onClick={() => { soundFx.playClick(); setActiveTab('quiz'); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-amber-900/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 flex items-center justify-center border-2 border-amber-600/40 shadow-md group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 sm:w-7 sm:h-7 text-amber-700 dark:text-amber-300" />
            </div>
            <div>
              <div className="museum-ribbon px-3 py-1 rounded-md shadow-md inline-block font-serif font-black tracking-wide text-xs sm:text-sm uppercase">
                НЕФТЕГОРСКИЙ КРАЕВЕДЧЕСКИЙ МУЗЕЙ
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest mt-0.5 font-serif">
                ОНЛАЙН-ВИКТОРИНА • nkm63.ru
              </p>
            </div>
          </div>

          {/* Player profile quick view & Score */}
          <div className="hidden lg:flex items-center gap-3 bg-amber-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400">Игрок:</span>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Ваше имя..."
              className="bg-transparent text-sm font-semibold text-slate-800 dark:text-amber-300 focus:outline-none w-28 border-b border-dashed border-amber-400"
            />
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-600" />
            <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 text-sm">
              <Award className="w-4 h-4" />
              <span>{totalScore} б.</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mute Sound Button */}
            <button
              onClick={toggleSound}
              title={isMuted ? 'Включить звук' : 'Выключить звук'}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-amber-500" />}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => { soundFx.playClick(); setIsDarkMode(!isDarkMode); }}
              title={isDarkMode ? 'Светлая тема' : 'Темная тема'}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar border-t border-slate-100 dark:border-slate-800/60">
          <button
            onClick={() => { soundFx.playClick(); setActiveTab('quiz'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Викторина
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('blitz'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'blitz'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            Блиц-Спринт
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('leaderboard'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Таблица Лидеров
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('badges'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'badges'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            Музей & Достижения
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('ai'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'ai'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
            }`}
          >
            <Bot className="w-4 h-4" />
            ИИ-Краевед
          </button>
        </nav>
      </div>
    </header>
  );
};
