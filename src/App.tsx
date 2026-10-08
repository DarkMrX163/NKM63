import React from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { LevelSelector } from './components/LevelSelector';
import { QuizCard } from './components/QuizCard';
import { ExplanationModal } from './components/ExplanationModal';
import { BlitzGame } from './components/BlitzGame';
import { Leaderboard } from './components/Leaderboard';
import { BadgeGallery } from './components/BadgeGallery';
import { AiExpertChat } from './components/AiExpertChat';
import { SocialShareModal } from './components/SocialShareModal';
import { RegistrationModal } from './components/RegistrationModal';
import { Footer } from './components/Footer';

import { Difficulty, Question } from './types/quiz';
import { EASY_QUESTIONS, MEDIUM_QUESTIONS, HARD_QUESTIONS } from './data/questions';
import { submitScore, LeaderboardRecord } from './firebase';
import { soundFx } from './utils/audio';
import { Trophy, RotateCcw, Share2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<'quiz' | 'blitz' | 'leaderboard' | 'badges' | 'ai'>('quiz');
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

  const [showRegistrationModal, setShowRegistrationModal] = React.useState(false);
  const [pendingLevel, setPendingLevel] = React.useState<Difficulty | 'mixed' | null>(null);

  // Quiz game state
  const [selectedLevel, setSelectedLevel] = React.useState<Difficulty | 'mixed' | null>(null);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [maxStreak, setMaxStreak] = React.useState(0);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [used5050, setUsed5050] = React.useState(false);
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [lastSelectedOption, setLastSelectedOption] = React.useState<number | null>(null);
  const [isQuizCompleted, setIsQuizCompleted] = React.useState(false);

  // AI & Badges & Sharing
  const [aiHintText, setAiHintText] = React.useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [unlockedBadgeIds, setUnlockedBadgeIds] = React.useState<string[]>(['badge_first_step']);
  const [showShareModal, setShowShareModal] = React.useState(false);
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

  // Handle level select
  const handleSelectLevel = (level: Difficulty | 'mixed') => {
    if (!playerName.trim() || !playerLocation.trim()) {
      setPendingLevel(level);
      setShowRegistrationModal(true);
      return;
    }

    startQuizWithLevel(level);
  };

  const startQuizWithLevel = (level: Difficulty | 'mixed') => {
    setSelectedLevel(level);
    let pool: Question[] = [];

    if (level === 'easy') pool = [...EASY_QUESTIONS];
    else if (level === 'medium') pool = [...MEDIUM_QUESTIONS];
    else if (level === 'hard') pool = [...HARD_QUESTIONS];
    else pool = [...EASY_QUESTIONS, ...MEDIUM_QUESTIONS, ...HARD_QUESTIONS];

    // Shuffle
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setUsed5050(false);
    setShowExplanation(false);
    setIsQuizCompleted(false);
    setAiHintText(null);
  };

  const handleSaveRegistration = (name: string, location: string) => {
    setPlayerName(name);
    setPlayerLocation(location);
    setShowRegistrationModal(false);

    if (pendingLevel) {
      startQuizWithLevel(pendingLevel);
      setPendingLevel(null);
    }
  };

  // Answer handler
  const handleAnswer = (selectedIndex: number, timeSpent: number) => {
    const currentQ = questions[currentIndex];
    setLastSelectedOption(selectedIndex);

    if (currentQ && selectedIndex === currentQ.correctIndex) {
      const timeBonus = Math.max(0, 30 - timeSpent) * 5;
      const streakBonus = streak * 20;
      const pointsEarned = 100 + timeBonus + streakBonus;

      setScore((prev) => prev + pointsEarned);
      setCorrectCount((prev) => prev + 1);
      setStreak((prev) => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
    } else {
      setStreak(0);
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
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn(e);
    }

    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

    // Badges check
    const newBadges = [...unlockedBadgeIds];
    if (selectedLevel === 'easy' && accuracy === 100) newBadges.push('badge_young_expert');
    if (selectedLevel === 'medium' && score >= 1000) newBadges.push('badge_region_master');
    if (selectedLevel === 'hard') newBadges.push('badge_history_keeper');
    setUnlockedBadgeIds(Array.from(new Set(newBadges)));

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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        playerName={playerName}
        setPlayerName={setPlayerName}
        totalScore={score}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* TAB 1: QUIZ */}
        {activeTab === 'quiz' && (
          <div>
            {!selectedLevel ? (
              <LevelSelector onSelectLevel={handleSelectLevel} />
            ) : isQuizCompleted ? (
              /* Quiz Summary Screen */
              <div className="py-12 px-4 max-w-xl mx-auto text-center animate-scale-up">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
                  
                  <div className="w-20 h-20 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
                    <Trophy className="w-10 h-10 animate-bounce" />
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                      Викторина завершена
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white mt-1">
                      Поздравляем, {playerName}!
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

                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                    Ваш результат сохранен в Облачной Таблице Лидеров.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setShowShareModal(true);
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all"
                    >
                      <Share2 className="w-4 h-4" />
                      Поделиться и получить Сертификат
                    </button>

                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedLevel(null);
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Выбрать другой уровень
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
                      className="text-xs font-bold text-slate-500 hover:text-amber-500 flex items-center gap-1"
                    >
                      ← Сменить уровень
                    </button>

                    <div className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900">
                      Счет: {score} б.
                    </div>
                  </div>

                  <QuizCard
                    question={questions[currentIndex]}
                    questionIndex={currentIndex}
                    totalQuestions={questions.length}
                    score={score}
                    streak={streak}
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

        {/* TAB 2: BLITZ */}
        {activeTab === 'blitz' && (
          <BlitzGame
            onFinishBlitz={(blitzScore) => {
              setScore((s) => s + blitzScore);
              // Unlock blitz badge if blitz played
              if (!unlockedBadgeIds.includes('badge_blitz_lightning')) {
                setUnlockedBadgeIds((prev) => [...prev, 'badge_blitz_lightning']);
              }
              setActiveTab('leaderboard');
            }}
          />
        )}

        {/* TAB 3: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <Leaderboard currentScoreRecord={lastRecord} />
        )}

        {/* TAB 5: BADGES & MUSEUM */}
        {activeTab === 'badges' && (
          <BadgeGallery unlockedBadgeIds={unlockedBadgeIds} />
        )}

        {/* TAB 6: AI EXPERT */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
