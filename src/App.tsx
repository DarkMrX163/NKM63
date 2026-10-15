import React from 'react';
import confetti from 'canvas-confetti';
import { Header, AppTab } from './components/Header';
import { LevelSelector } from './components/LevelSelector';
import { QuizCard } from './components/QuizCard';
import { ExplanationModal } from './components/ExplanationModal';
import { BlitzGame } from './components/BlitzGame';
import { ExhibitMiniGame } from './components/ExhibitMiniGame';
import { CertificateView } from './components/CertificateView';
import { MuseumTicketView } from './components/MuseumTicketView';
import { Leaderboard } from './components/Leaderboard';
import { BadgeGallery } from './components/BadgeGallery';
import { AiExpertChat } from './components/AiExpertChat';
import { SocialShareModal } from './components/SocialShareModal';
import { RegistrationModal } from './components/RegistrationModal';
import { BackgroundModal, BackgroundSettings, DEFAULT_BG_SETTINGS } from './components/BackgroundModal';
import { AchievementToast } from './components/AchievementToast';
import { Footer } from './components/Footer';

import { Difficulty, Question, GameMode, Badge, HallSelection } from './types/quiz';
import { EASY_QUESTIONS, MEDIUM_QUESTIONS, HARD_QUESTIONS, ALL_BADGES } from './data/questions';
import { CompletedHallRecord, MUSEUM_HALLS } from './data/halls';
import { submitScore, LeaderboardRecord } from './firebase';
import { soundFx } from './utils/audio';
import { Trophy, RotateCcw, Share2, Scroll, Ticket, Sparkles, Heart, Compass, CheckCircle2, Lock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<AppTab>('quiz');
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [playerName, setPlayerName] = React.useState(() => {
    return localStorage.getItem('player_name') || '';
  });
  const [playerLocation, setPlayerLocation] = React.useState(() => {
    return localStorage.getItem('player_location') || '';
  });

  const [unlockedExhibitsCount, setUnlockedExhibitsCount] = React.useState<number>(() => {
    try {
      const saved = localStorage.getItem('unlocked_exhibits');
      return saved ? JSON.parse(saved).length : 0;
    } catch {
      return 0;
    }
  });

  // Track completed thematic museum halls (minimum 2 halls needed for museum ticket)
  const [completedHalls, setCompletedHalls] = React.useState<CompletedHallRecord[]>(() => {
    try {
      const saved = localStorage.getItem('completed_museum_halls');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showRegistrationModal, setShowRegistrationModal] = React.useState(false);
  const [pendingLevel, setPendingLevel] = React.useState<HallSelection | null>(null);
  const [pendingMode, setPendingMode] = React.useState<GameMode>('classic');

  // Quiz game state
  const [selectedLevel, setSelectedLevel] = React.useState<HallSelection | null>(null);
  const [gameMode, setGameMode] = React.useState<GameMode>('classic');
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [maxStreak, setMaxStreak] = React.useState(0);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [used5050, setUsed5050] = React.useState(false);
  const [lives, setLives] = React.useState(3);
  const [hasShield, setHasShield] = React.useState(true);
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [lastSelectedOption, setLastSelectedOption] = React.useState<number | null>(null);
  const [isQuizCompleted, setIsQuizCompleted] = React.useState(false);

  // AI & Badges & Sharing
  const [aiHintText, setAiHintText] = React.useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [unlockedBadgeIds, setUnlockedBadgeIds] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('user_badges');
      return saved ? JSON.parse(saved) : ['badge_first_step'];
    } catch {
      return ['badge_first_step'];
    }
  });
  const [toastBadge, setToastBadge] = React.useState<Badge | null>(null);

  const [showShareModal, setShowShareModal] = React.useState(false);
  const [showBackgroundModal, setShowBackgroundModal] = React.useState(false);
  const [bgSettings, setBgSettings] = React.useState<BackgroundSettings>(() => {
    try {
      const saved = localStorage.getItem('quiz_bg_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically migrate to "Река Самара и заволжские степи" if unset or pointing to another theme
        if (
          !parsed.url || 
          parsed.type === 'default' || 
          parsed.name !== 'Река Самара и заволжские степи' ||
          !parsed.url.includes('samara_steppe')
        ) {
          localStorage.setItem('quiz_bg_settings', JSON.stringify(DEFAULT_BG_SETTINGS));
          return DEFAULT_BG_SETTINGS;
        }
        return {
          ...DEFAULT_BG_SETTINGS,
          ...parsed,
          url: DEFAULT_BG_SETTINGS.url,
          fit: parsed.fit || 'cover',
          glassEffect: parsed.glassEffect ?? true
        };
      }
    } catch (e) {
      console.warn('Failed to parse bg_settings', e);
    }
    localStorage.setItem('quiz_bg_settings', JSON.stringify(DEFAULT_BG_SETTINGS));
    return DEFAULT_BG_SETTINGS;
  });
  const [lastRecord, setLastRecord] = React.useState<LeaderboardRecord | null>(null);
  const [aiChatTopic, setAiChatTopic] = React.useState<string | undefined>(undefined);
  const [aiChatQuestion, setAiChatQuestion] = React.useState<string | undefined>(undefined);

  // Dark mode effect
  React.useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isDarkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Persist player name and location
  React.useEffect(() => {
    localStorage.setItem('player_name', playerName);
  }, [playerName]);

  React.useEffect(() => {
    localStorage.setItem('player_location', playerLocation);
  }, [playerLocation]);

  React.useEffect(() => {
    try {
      localStorage.setItem('user_badges', JSON.stringify(unlockedBadgeIds));
    } catch (e) {
      console.warn(e);
    }
  }, [unlockedBadgeIds]);

  React.useEffect(() => {
    try {
      localStorage.setItem('completed_museum_halls', JSON.stringify(completedHalls));
    } catch (e) {
      console.warn('Failed to save completed_museum_halls', e);
    }
  }, [completedHalls]);

  React.useEffect(() => {
    try {
      localStorage.setItem('quiz_bg_settings', JSON.stringify(bgSettings));
    } catch (e) {
      console.warn('Failed to save quiz_bg_settings to localStorage', e);
    }
  }, [bgSettings]);

  const handleSaveBackground = (newSettings: BackgroundSettings) => {
    setBgSettings(newSettings);
  };

  // Helper to trigger gamified badge unlocks with sound & toast banner
  const triggerUnlockBadge = (badgeId: string) => {
    if (!unlockedBadgeIds.includes(badgeId)) {
      setUnlockedBadgeIds((prev) => [...prev, badgeId]);
      const found = ALL_BADGES.find((b) => b.id === badgeId);
      if (found) {
        setToastBadge(found);
        soundFx.playAchievement();
        setTimeout(() => setToastBadge(null), 5000);
      }
    }
  };

  // Handle level & mode select
  const handleSelectLevel = (level: HallSelection, mode: GameMode = 'classic') => {
    if (!playerName.trim() || !playerLocation.trim()) {
      setPendingLevel(level);
      setPendingMode(mode);
      setShowRegistrationModal(true);
      return;
    }

    startQuizWithLevel(level, mode);
  };

  const startQuizWithLevel = (level: HallSelection, mode: GameMode = 'classic') => {
    setSelectedLevel(level);
    setGameMode(mode);
    let pool: Question[] = [];

    if (level === 'easy') {
      pool = [...EASY_QUESTIONS];
    } else if (level === 'medium') {
      pool = [...MEDIUM_QUESTIONS];
    } else if (level === 'hard') {
      pool = [...HARD_QUESTIONS];
    } else if (level === 'mixed') {
      pool = [...EASY_QUESTIONS, ...MEDIUM_QUESTIONS, ...HARD_QUESTIONS];
    } else if (typeof level === 'string' && level.startsWith('hall_')) {
      // Thematic Hall
      const hall = MUSEUM_HALLS.find((h) => h.id === level);
      const all = [...EASY_QUESTIONS, ...MEDIUM_QUESTIONS, ...HARD_QUESTIONS];
      if (hall) {
        pool = all.filter((q) => hall.categories.includes(q.category));
      }
      if (pool.length === 0) {
        pool = [...EASY_QUESTIONS];
      }
    } else {
      pool = [...EASY_QUESTIONS];
    }

    // Shuffle questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setUsed5050(false);
    setLives(3);
    setHasShield(true);
    setShowExplanation(false);
    setIsQuizCompleted(false);
    setAiHintText(null);
  };

  const handleSaveRegistration = (name: string, location: string) => {
    setPlayerName(name);
    setPlayerLocation(location);
    setShowRegistrationModal(false);

    if (pendingLevel) {
      startQuizWithLevel(pendingLevel, pendingMode);
      setPendingLevel(null);
    }
  };

  // Answer handler
  const handleAnswer = (selectedIndex: number, timeSpent: number, usedShieldProtection: boolean = false) => {
    const currentQ = questions[currentIndex];
    setLastSelectedOption(selectedIndex);

    if (currentQ && selectedIndex === currentQ.correctIndex) {
      // Dynamic speed and combo multipliers
      const maxTime = gameMode === 'timed' ? 15 : 30;
      const timeBonus = Math.max(0, maxTime - timeSpent) * (gameMode === 'timed' ? 10 : 5);
      const comboMultiplier = streak >= 5 ? 3 : streak >= 3 ? 2 : streak >= 2 ? 1.5 : 1;
      const streakBonus = Math.round(streak * 20 * comboMultiplier);
      const pointsEarned = 100 + timeBonus + streakBonus;

      setScore((prev) => {
        const nextScore = prev + pointsEarned;
        if (nextScore >= 1500) {
          triggerUnlockBadge('badge_grandmaster');
        }
        return nextScore;
      });
      setCorrectCount((prev) => prev + 1);

      setStreak((prev) => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        if (next >= 5) {
          triggerUnlockBadge('badge_combo_master');
        }
        return next;
      });
    } else {
      // Wrong answer or timed out
      if (usedShieldProtection) {
        // Shield absorbs the mistake!
        setHasShield(false);
      } else {
        setStreak(0);
        if (gameMode === 'survival') {
          soundFx.playLifeLost();
          const nextLives = lives - 1;
          setLives(nextLives);
          if (nextLives <= 0) {
            // Survival Game Over!
            setTimeout(() => {
              finishQuiz();
            }, 800);
            return;
          }
        }
      }
    }

    setShowExplanation(true);
  };

  // Next question
  const handleNextQuestion = () => {
    setShowExplanation(false);
    setLastSelectedOption(null);
    setAiHintText(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Quiz finish
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsQuizCompleted(true);
    soundFx.playFanfare();

    // Trigger Confetti
    try {
      confetti({
        particleCount: 140,
        spread: 85,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn(e);
    }

    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

    // Determine current hall title
    let currentHallTitle = 'Тематический зал экспозиции';
    if (typeof selectedLevel === 'string' && selectedLevel.startsWith('hall_')) {
      const hObj = MUSEUM_HALLS.find((h) => h.id === selectedLevel);
      if (hObj) currentHallTitle = hObj.title;
    } else if (selectedLevel === 'easy') {
      currentHallTitle = 'Зал «Юный Краевед»';
    } else if (selectedLevel === 'medium') {
      currentHallTitle = 'Экспозиционный зал «Знаток Края»';
    } else if (selectedLevel === 'hard') {
      currentHallTitle = 'Архивный зал «Хранитель Истории»';
    } else {
      currentHallTitle = 'Сборный зал «Микс-Экспозиция»';
    }

    // Register hall completion
    const hallRecord: CompletedHallRecord = {
      hallId: (selectedLevel as string) || 'hall_general',
      hallTitle: currentHallTitle,
      score,
      accuracy,
      completedAt: new Date().toISOString()
    };

    setCompletedHalls((prev) => {
      const existingIdx = prev.findIndex((h) => h.hallId === hallRecord.hallId);
      let updated: CompletedHallRecord[];
      if (existingIdx >= 0) {
        updated = [...prev];
        if (score > updated[existingIdx].score) {
          updated[existingIdx] = hallRecord;
        }
      } else {
        updated = [...prev, hallRecord];
      }

      // Check if minimum 2 thematic halls requirement reached!
      if (updated.length >= 2) {
        triggerUnlockBadge('badge_museum_ticket');
      }
      return updated;
    });

    // Badges check
    if (selectedLevel === 'easy' && accuracy === 100) triggerUnlockBadge('badge_young_expert');
    if (selectedLevel === 'medium' && score >= 1000) triggerUnlockBadge('badge_region_master');
    if (selectedLevel === 'hard') triggerUnlockBadge('badge_history_keeper');
    if (gameMode === 'survival' && correctCount >= 5) triggerUnlockBadge('badge_survival_hero');

    // Save record to Firebase
    const record: Omit<LeaderboardRecord, 'id'> = {
      playerName: playerName || 'Участник Викторины',
      playerLocation: playerLocation || '',
      score,
      level: selectedLevel as any,
      accuracy,
      correctAnswers: correctCount,
      totalQuestions: questions.length,
      createdAt: new Date().toISOString()
    };

    const docId = await submitScore(record);
    if (docId) {
      setLastRecord({ id: docId, ...record });
    }
  };

  // AI Hint request inside quiz card
  const handleRequestAiHint = async () => {
    const currentQ = questions[currentIndex];
    if (!currentQ || isAiLoading) return;

    soundFx.playClick();
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai-expert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Дай короткую загадочную подсказку (без прямых слов ответа) к вопросу: "${currentQ.text}"`,
          topic: currentQ.categoryTitle
        })
      });
      const data = await res.json();
      setAiHintText(data.answer || 'Краеведческая подсказка: Обратите внимание на ключевые исторические детали!');
    } catch (e) {
      setAiHintText('Не удалось получить ответ ИИ.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Open AI Chat from explanation
  const handleAskAiFromExplanation = (topic: string, questionText: string) => {
    setAiChatTopic(topic);
    setAiChatQuestion(questionText);
    setShowExplanation(false);
    setActiveTab('ai');
  };

  return (
    <div className={`min-h-screen flex flex-col text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 relative ${
      bgSettings.type === 'default' && !bgSettings.url ? 'bg-slate-50 dark:bg-slate-950' : 'bg-transparent'
    }`}>
      
      {/* Toast Notification for Unlocked Achievements */}
      <AchievementToast badge={toastBadge} onClose={() => setToastBadge(null)} />

      {/* Museum Thematic Wallpaper Layer */}
      {bgSettings.url && (
        <>
          <div
            className="fixed inset-0 pointer-events-none z-0 transition-all duration-700 ease-out"
            style={{
              backgroundImage: `url(${bgSettings.url}), url('/images/backgrounds/samara_steppe.jpg'), url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80')`,
              backgroundSize: bgSettings.fit === 'fill' ? '100% 100%' : bgSettings.fit === 'contain' ? 'contain' : 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
              filter: bgSettings.blur > 0 ? `blur(${bgSettings.blur}px)` : undefined,
              transform: bgSettings.blur > 0 ? 'scale(1.05)' : undefined
            }}
          />

          {/* Museum Exhibition Directional Warm Glow (Subtle) */}
          <div
            className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.08)_0%,_transparent_70%)]"
          />

          {/* Museum Contrast Tint (Delicate for high background visibility) */}
          <div
            className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
            style={{
              backgroundColor: isDarkMode ? '#020617' : '#0f172a',
              opacity: (bgSettings.overlayOpacity ?? 12) / 100
            }}
          />

          {/* Museum Watermark Seal at bottom */}
          <div className="fixed bottom-2.5 right-4 pointer-events-none z-0 text-[10px] uppercase font-mono tracking-widest text-amber-500/30 select-none hidden md:block">
            МБУ «Нефтегорский межпоселенческий краеведческий музей» • nkm63.ru
          </div>
        </>
      )}

      {/* Main App Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Header with Audio Widget */}
        <Header
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'ticket') {
              if (completedHalls.length >= 2) {
                triggerUnlockBadge('badge_museum_ticket');
              }
            }
            if (tab === 'certificate') {
              triggerUnlockBadge('badge_certified_scholar');
            }
            setActiveTab(tab);
          }}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          playerName={playerName}
          setPlayerName={setPlayerName}
          totalScore={score}
          completedHallsCount={completedHalls.length}
          onOpenBackgroundModal={() => setShowBackgroundModal(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1">
        {/* TAB 1: QUIZ */}
        {activeTab === 'quiz' && (
          <div>
            {!selectedLevel ? (
              <LevelSelector
                onSelectLevel={handleSelectLevel}
                onNavigateTab={(tab) => setActiveTab(tab)}
                completedHalls={completedHalls}
              />
            ) : isQuizCompleted ? (
              /* Quiz Summary Screen */
              <div className="py-12 px-4 max-w-xl mx-auto text-center animate-scale-up">
                <div className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-md rounded-3xl p-8 border border-white/40 dark:border-slate-800 shadow-2xl space-y-6">
                  
                  <div className="w-20 h-20 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
                    <Trophy className="w-10 h-10 animate-bounce" />
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                      {gameMode === 'survival' && lives <= 0 ? 'Испытание на выживание окончено' : 'Зал экспозиции успешно пройден'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white mt-1">
                      Поздравляем, {playerName || 'Участник'}!
                    </h2>
                  </div>

                  {/* Results stats box */}
                  <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Итоговый счет</p>
                      <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{score} б.</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Точность ответов</p>
                      <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                        {questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0}%
                      </p>
                    </div>
                  </div>

                  {/* Promo Privilege Alert / 2-hall requirement check */}
                  {completedHalls.length >= 2 ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 text-xs flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Ticket className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">🎉 Квест выполнен! Билет в музей разблокирован!</p>
                        <p className="text-[11px] opacity-90">
                          Вы успешно завершили {completedHalls.length} тематических залов музея. Персональный билет с промокодом доступен!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-100 text-xs flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Квест на билет: пройдено {completedHalls.length} из 2 залов</p>
                        <p className="text-[11px] opacity-90">
                          Пройдите ещё <strong>{2 - completedHalls.length}</strong> тематический зал, чтобы получить официальный именной билет со скидкой до 100%!
                        </p>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                    Ваш результат сохранен в Облачной Таблице Лидеров.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    {completedHalls.length >= 2 ? (
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          triggerUnlockBadge('badge_museum_ticket');
                          setActiveTab('ticket');
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
                      >
                        <Ticket className="w-4 h-4" />
                        Мой билет в музей
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedLevel(null);
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20 transition-all hover:scale-105"
                      >
                        <Compass className="w-4 h-4" />
                        Пройти 2-й зал для билета ({completedHalls.length}/2)
                      </button>
                    )}

                    <button
                      onClick={() => {
                        soundFx.playClick();
                        triggerUnlockBadge('badge_certified_scholar');
                        setActiveTab('certificate');
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all"
                    >
                      <Scroll className="w-4 h-4" />
                      Именной диплом
                    </button>

                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setShowShareModal(true);
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/20 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-white/30 border border-white/20 transition-all"
                    >
                      <Share2 className="w-4 h-4" />
                      Поделиться
                    </button>

                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedLevel(null);
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Выбрать зал
                    </button>
                  </div>

                </div>
              </div>
            ) : (
              /* Active Question */
              questions.length > 0 && (
                <div>
                  <div className="max-w-3xl mx-auto px-4 pt-4 flex items-center justify-between">
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedLevel(null);
                      }}
                      className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/30 dark:bg-slate-800/40 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/30 dark:border-slate-700/40 hover:bg-white/50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
                    >
                      ← Сменить уровень
                    </button>

                    <div className="flex items-center gap-2">
                      <div className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 dark:bg-amber-400/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-amber-500/30">
                        Счет: {score} б.
                      </div>
                    </div>
                  </div>

                  <QuizCard
                    question={questions[currentIndex]}
                    questionIndex={currentIndex}
                    totalQuestions={questions.length}
                    score={score}
                    streak={streak}
                    gameMode={gameMode}
                    lives={lives}
                    hasShield={hasShield}
                    onUseShield={() => setHasShield(false)}
                    onAnswer={handleAnswer}
                    used5050={used5050}
                    setUsed5050={setUsed5050}
                    onRequestAiHint={handleRequestAiHint}
                    aiHintText={aiHintText}
                    isAiLoading={isAiLoading}
                  />
                </div>
              )
            )}
          </div>
        )}

        {/* TAB 2: ARTIFACTS / EXHIBIT MINI-GAME */}
        {activeTab === 'artifacts' && (
          <ExhibitMiniGame
            onScoreAwarded={(pts) => {
              setScore((s) => s + pts);
              try {
                const saved = localStorage.getItem('unlocked_exhibits');
                if (saved) {
                  setUnlockedExhibitsCount(JSON.parse(saved).length);
                }
              } catch (e) {
                console.warn(e);
              }
              triggerUnlockBadge('badge_museum_keeper');
            }}
            onOpenCertificate={() => {
              triggerUnlockBadge('badge_certified_scholar');
              setActiveTab('certificate');
            }}
          />
        )}

        {/* TAB 3: PERSONAL CERTIFICATE / DIPLOMA */}
        {activeTab === 'certificate' && (
          <CertificateView
            playerName={playerName}
            setPlayerName={setPlayerName}
            playerLocation={playerLocation}
            setPlayerLocation={setPlayerLocation}
            totalScore={score}
            unlockedExhibitsCount={unlockedExhibitsCount}
          />
        )}

        {/* TAB 4: PERSONAL MUSEUM TICKET & PROMOCODE */}
        {activeTab === 'ticket' && (
          <MuseumTicketView
            playerName={playerName}
            playerLocation={playerLocation}
            totalScore={score}
            unlockedExhibitsCount={unlockedExhibitsCount}
            completedHalls={completedHalls}
            onStartHall={(hallId) => {
              handleSelectLevel(hallId, gameMode);
              setActiveTab('quiz');
            }}
            onNavigateToQuiz={() => {
              setSelectedLevel(null);
              setActiveTab('quiz');
            }}
          />
        )}

        {/* TAB 5: BLITZ */}
        {activeTab === 'blitz' && (
          <BlitzGame
            onFinishBlitz={(blitzScore) => {
              setScore((s) => s + blitzScore);
              triggerUnlockBadge('badge_blitz_lightning');
              setActiveTab('leaderboard');
            }}
          />
        )}

        {/* TAB 6: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <Leaderboard currentScoreRecord={lastRecord} />
        )}

        {/* TAB 7: BADGES & MUSEUM */}
        {activeTab === 'badges' && (
          <BadgeGallery 
            unlockedBadgeIds={unlockedBadgeIds} 
            onOpenCertificate={() => {
              triggerUnlockBadge('badge_certified_scholar');
              setActiveTab('certificate');
            }}
            onOpenMiniGame={() => setActiveTab('artifacts')}
            onOpenTicket={() => {
              triggerUnlockBadge('badge_museum_ticket');
              setActiveTab('ticket');
            }}
          />
        )}

        {/* TAB 8: AI EXPERT */}
        {activeTab === 'ai' && (
          <AiExpertChat initialTopic={aiChatTopic} initialQuestion={aiChatQuestion} />
        )}
      </main>

      {/* Educational Explanation Modal */}
      {showExplanation && questions[currentIndex] && (
        <ExplanationModal
          question={questions[currentIndex]}
          selectedOption={lastSelectedOption}
          onNext={handleNextQuestion}
          onAskAi={handleAskAiFromExplanation}
        />
      )}

      {/* Social Share Certificate Modal */}
      {showShareModal && (
        <SocialShareModal
          playerName={playerName}
          playerLocation={playerLocation}
          score={score}
          accuracy={questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 100}
          levelTitle={
            selectedLevel === 'easy'
              ? 'Юный Краевед'
              : selectedLevel === 'medium'
              ? 'Знаток Края'
              : selectedLevel === 'hard'
              ? 'Хранитель Истории'
              : 'Эрудит-Исследователь'
          }
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Participant Registration Modal */}
      {showRegistrationModal && (
        <RegistrationModal
          initialName={playerName}
          initialLocation={playerLocation}
          onSave={handleSaveRegistration}
          onCancel={() => setShowRegistrationModal(false)}
        />
      )}

      {/* Background Customizer Modal */}
      <BackgroundModal
        isOpen={showBackgroundModal}
        onClose={() => setShowBackgroundModal(false)}
        currentSettings={bgSettings}
        onSave={handleSaveBackground}
      />

      {/* Footer */}
      <Footer />
      </div>
    </div>
  );
}
