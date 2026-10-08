import React from 'react';
import { BlitzStatement } from '../types/quiz';
import { BLITZ_STATEMENTS } from '../data/questions';
import { Zap, CheckCircle2, XCircle, Clock, Trophy, RotateCcw } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface BlitzGameProps {
  onFinishBlitz: (score: number) => void;
}

export const BlitzGame: React.FC<BlitzGameProps> = ({ onFinishBlitz }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(15);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [lastFeedback, setLastFeedback] = React.useState<{ isCorrect: boolean; text: string } | null>(null);

  const currentStatement: BlitzStatement | undefined = BLITZ_STATEMENTS[currentIndex];

  React.useEffect(() => {
    if (isGameOver || !currentStatement) return;

    setTimeLeft(15);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAnswer(false); // Time limit timeout counts as wrong
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, isGameOver]);

  const handleAnswer = (userSaidTrue: boolean) => {
    if (!currentStatement || isGameOver) return;

    const isCorrect = userSaidTrue === currentStatement.isTrue;

    if (isCorrect) {
      soundFx.playCorrect();
      setScore((s) => s + 150 + timeLeft * 10);
      setCorrectCount((c) => c + 1);
      setLastFeedback({ isCorrect: true, text: 'Верно! +150 б.' });
    } else {
      soundFx.playWrong();
      setLastFeedback({ isCorrect: false, text: currentStatement.explanation });
    }

    setTimeout(() => {
      setLastFeedback(null);
      if (currentIndex + 1 < BLITZ_STATEMENTS.length) {
        setCurrentIndex((idx) => idx + 1);
      } else {
        setIsGameOver(true);
        soundFx.playFanfare();
      }
    }, 1500);
  };

  const handleRestart = () => {
    soundFx.playClick();
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setIsGameOver(false);
    setLastFeedback(null);
  };

  if (isGameOver) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/30">
            <Trophy className="w-8 h-8 animate-bounce" />
          </div>

          <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
            Блиц-Спринт завершен!
          </h2>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
              {score} очков
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Верных ответов: {correctCount} из {BLITZ_STATEMENTS.length}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Снова
            </button>
            <button
              onClick={() => onFinishBlitz(score)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all"
            >
              Сохранить результат
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
          <Zap className="w-5 h-5 fill-amber-500" />
          <span>Блиц «Правда или Вымысел»</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
          <span>Вопрос {currentIndex + 1}/{BLITZ_STATEMENTS.length}</span>
          <div className="flex items-center gap-1 font-mono text-amber-500 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft} с</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 relative overflow-hidden">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          {currentStatement?.topic}
        </span>

        <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white leading-relaxed">
          «{currentStatement?.statement}»
        </h3>

        {/* Feedback Popup */}
        {lastFeedback && (
          <div className={`p-4 rounded-2xl text-xs font-bold border transition-all ${
            lastFeedback.isCorrect
              ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-300'
              : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300'
          }`}>
            {lastFeedback.text}
          </div>
        )}

        {/* Big True / False Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            onClick={() => handleAnswer(true)}
            disabled={lastFeedback !== null}
            className="p-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-lg sm:text-xl shadow-lg shadow-emerald-500/20 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="w-8 h-8" />
            ПРАВДА
          </button>

          <button
            onClick={() => handleAnswer(false)}
            disabled={lastFeedback !== null}
            className="p-5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-lg sm:text-xl shadow-lg shadow-rose-500/20 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 disabled:opacity-50"
          >
            <XCircle className="w-8 h-8" />
            ВЫМЫСЕЛ
          </button>
        </div>
      </div>
    </div>
  );
};
