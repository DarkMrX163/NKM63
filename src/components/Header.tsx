import React from 'react';
import { 
  Compass, 
  Trophy, 
  Map, 
  Zap, 
  Award, 
  Bot, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Eye, 
  Scroll,
  Ticket,
  Image,
  Camera,
  Search
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { AtmosphericAudioWidget } from './AtmosphericAudioWidget';
import nkmLogoImg from '../assets/nkm_logo.jpg';

export type AppTab = 'quiz' | 'photoarchive' | 'detective' | 'artifacts' | 'certificate' | 'ticket' | 'blitz' | 'leaderboard' | 'badges' | 'ai';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  playerName: string;
  setPlayerName: (val: string) => void;
  totalScore: number;
  completedHallsCount?: number;
  onOpenBackgroundModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  playerName,
  setPlayerName,
  totalScore,
  completedHallsCount = 0,
  onOpenBackgroundModal
}) => {
  const [isMuted, setIsMuted] = React.useState(soundFx.isMuted);

  const toggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/8 dark:bg-slate-950/20 backdrop-blur-xs border-b border-white/15 dark:border-white/10 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Ribbon Logo Banner with NKM official museum icon */}
          <div 
            onClick={() => { soundFx.playClick(); setActiveTab('quiz'); }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                soundFx.playClick();
                setActiveTab('quiz');
              }
            }}
            title="Главная — Нефтегорский краеведческий музей (нажмите для перехода к викторине)"
            className="flex items-center gap-3 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-2xl select-none"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white p-1 flex items-center justify-center border-2 border-amber-600/50 shadow-md group-hover:scale-105 group-hover:border-amber-400 group-hover:shadow-lg transition-all duration-300 overflow-hidden shrink-0">
              <img 
                src={nkmLogoImg} 
                alt="НКМ Нефтегорский краеведческий музей" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/nkm_logo.jpg';
                }}
              />
            </div>
            <div>
              <div className="museum-ribbon px-3 py-1 rounded-md shadow-md inline-block font-serif font-black tracking-wide text-xs sm:text-sm uppercase group-hover:brightness-105 transition-all">
                НЕФТЕГОРСКИЙ КРАЕВЕДЧЕСКИЙ МУЗЕЙ
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-widest mt-0.5 font-serif">
                ОНЛАЙН-ВИКТОРИНА • nkm63.ru
              </p>
            </div>
          </div>

          {/* Player profile quick view & Score */}
          <div className="hidden lg:flex items-center gap-3 bg-white/10 dark:bg-slate-800/20 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/20 dark:border-white/10">
            <span className="text-xs text-slate-700 dark:text-slate-300">Игрок:</span>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Ваше имя..."
              className="bg-transparent text-sm font-semibold text-slate-900 dark:text-amber-300 focus:outline-none w-28 border-b border-dashed border-amber-400"
            />
            <div className="h-4 w-px bg-slate-400/40 dark:bg-slate-600/60" />
            <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 text-sm">
              <Award className="w-4 h-4" />
              <span>{totalScore} б.</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Ambient Soundscapes Widget */}
            <AtmosphericAudioWidget />

            {/* Museum Wallpaper Theme Selector */}
            {onOpenBackgroundModal && (
              <button
                onClick={() => { soundFx.playClick(); onOpenBackgroundModal(); }}
                title="Фон краеведческого музея"
                className="p-2 sm:p-2.5 rounded-xl text-slate-700 dark:text-slate-200 bg-white/10 dark:bg-slate-800/20 backdrop-blur-xs hover:bg-white/25 dark:hover:bg-slate-800/40 border border-white/20 dark:border-white/10 transition-colors flex items-center gap-1.5"
              >
                <Image className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-semibold hidden md:inline">Фон музея</span>
              </button>
            )}

            {/* Mute Sound FX Button */}
            <button
              onClick={toggleSound}
              title={isMuted ? 'Включить звук' : 'Выключить звук'}
              className="p-2 sm:p-2.5 rounded-xl text-slate-700 dark:text-slate-200 bg-white/10 dark:bg-slate-800/20 backdrop-blur-xs hover:bg-white/25 dark:hover:bg-slate-800/40 border border-white/20 dark:border-white/10 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-amber-500" />}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => { soundFx.playClick(); setIsDarkMode(!isDarkMode); }}
              title={isDarkMode ? 'Светлая тема' : 'Темная тема'}
              className="p-2 sm:p-2.5 rounded-xl text-slate-700 dark:text-slate-200 bg-white/10 dark:bg-slate-800/20 backdrop-blur-xs hover:bg-white/25 dark:hover:bg-slate-800/40 border border-white/20 dark:border-white/10 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar border-t border-white/10 dark:border-white/5">
          <button
            onClick={() => { soundFx.playClick(); setActiveTab('quiz'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'quiz'
                ? 'bg-amber-500/90 text-white shadow-md shadow-amber-500/20 backdrop-blur-xs'
                : 'text-slate-800 dark:text-slate-200 bg-white/5 dark:bg-slate-800/10 hover:bg-white/20 dark:hover:bg-slate-800/30 backdrop-blur-xs border border-white/10 dark:border-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Викторина
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('photoarchive'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'photoarchive'
                ? 'bg-amber-500/90 text-white shadow-md shadow-amber-500/20 backdrop-blur-xs font-bold'
                : 'text-slate-800 dark:text-slate-200 bg-white/5 dark:bg-slate-800/10 hover:bg-white/20 dark:hover:bg-slate-800/30 backdrop-blur-xs border border-white/10 dark:border-white/5'
            }`}
          >
            <Camera className="w-4 h-4 text-amber-500" />
            <span>Фотоархив</span>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/40">
              10
            </span>
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('detective'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'detective'
                ? 'bg-amber-500/90 text-white shadow-md shadow-amber-500/20 backdrop-blur-xs'
                : 'text-slate-800 dark:text-slate-200 bg-white/5 dark:bg-slate-800/10 hover:bg-white/20 dark:hover:bg-slate-800/30 backdrop-blur-xs border border-white/10 dark:border-white/5'
            }`}
          >
            <Search className="w-4 h-4 text-amber-500" />
            Музейный детектив
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('artifacts'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'artifacts'
                ? 'bg-amber-500/90 text-white shadow-md shadow-amber-500/20 backdrop-blur-xs'
                : 'text-slate-800 dark:text-slate-200 bg-white/5 dark:bg-slate-800/10 hover:bg-white/20 dark:hover:bg-slate-800/30 backdrop-blur-xs border border-white/10 dark:border-white/5'
            }`}
          >
            <Eye className="w-4 h-4 text-amber-500" />
            Угадай экспонат
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('certificate'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'certificate'
                ? 'bg-amber-500/90 text-white shadow-md shadow-amber-500/20 backdrop-blur-xs'
                : 'text-slate-800 dark:text-slate-200 bg-white/5 dark:bg-slate-800/10 hover:bg-white/20 dark:hover:bg-slate-800/30 backdrop-blur-xs border border-white/10 dark:border-white/5'
            }`}
          >
            <Scroll className="w-4 h-4 text-amber-500" />
            Именной диплом
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('ticket'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'ticket'
                ? 'bg-amber-500/90 text-white shadow-md shadow-amber-500/20 backdrop-blur-xs'
                : 'text-slate-800 dark:text-slate-200 bg-white/5 dark:bg-slate-800/10 hover:bg-white/20 dark:hover:bg-slate-800/30 backdrop-blur-xs border border-white/10 dark:border-white/5'
            }`}
          >
            <Ticket className={`w-4 h-4 ${completedHallsCount >= 2 ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500'}`} />
            <span>Билет в музей</span>
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full border ${
              completedHallsCount >= 2 
                ? 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-500/40'
            }`}>
              {completedHallsCount >= 2 ? '✓ Готов' : `${completedHallsCount}/2`}
            </span>
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('blitz'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'blitz'
                ? 'bg-amber-500/90 text-white shadow-md shadow-amber-500/20 backdrop-blur-xs'
                : 'text-slate-800 dark:text-slate-200 bg-white/5 dark:bg-slate-800/10 hover:bg-white/20 dark:hover:bg-slate-800/30 backdrop-blur-xs border border-white/10 dark:border-white/5'
            }`}
          >
            <Zap className="w-4 h-4" />
            Блиц-Спринт
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('leaderboard'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-amber-500/90 text-white shadow-md shadow-amber-500/20 backdrop-blur-xs'
                : 'text-slate-800 dark:text-slate-200 bg-white/5 dark:bg-slate-800/10 hover:bg-white/20 dark:hover:bg-slate-800/30 backdrop-blur-xs border border-white/10 dark:border-white/5'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Таблица Лидеров
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('badges'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'badges'
                ? 'bg-amber-500/90 text-white shadow-md shadow-amber-500/20 backdrop-blur-xs'
                : 'text-slate-800 dark:text-slate-200 bg-white/5 dark:bg-slate-800/10 hover:bg-white/20 dark:hover:bg-slate-800/30 backdrop-blur-xs border border-white/10 dark:border-white/5'
            }`}
          >
            <Award className="w-4 h-4" />
            Музей & Достижения
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('ai'); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'ai'
                ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-500/20 backdrop-blur-xs'
                : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/20 hover:bg-indigo-100/30 dark:hover:bg-indigo-900/30 backdrop-blur-xs border border-indigo-200/20 dark:border-indigo-800/20'
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
