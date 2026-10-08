import React from 'react';
import { Question } from '../types/quiz';
import { Flame, Lightbulb, Bot, CheckCircle2, XCircle, Clock, Sparkles, HelpCircle } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface QuizCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  onAnswer: (selectedIndex: number, timeSpent: number) => void;
  used5050: boolean;
  setUsed5050: (val: boolean) => void;
  onRequestAiHint: () => void;
  aiHintText: string | null;
  isAiLoading: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  score,
  streak,
  onAnswer,
  used5050,
  setUsed5050,
  onRequestAiHint,
  aiHintText,
  isAiLoading
}) => {
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [hiddenOptions, setHiddenOptions] = React.useState<number[]>([]);
  const [showHint, setShowHint] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(30);
  const [timeSpent, setTimeSpent] = React.useState(0);

  // Timer effect
  React.useEffect(() => {
    setTimeLeft(30);
    setTimeSpent(0);
    setSelectedOption(null);
    setHiddenOptions([]);
    setShowHint(false);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Time out auto answer
          onAnswer(-1, 30);
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [question.id]);

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return; // Prevent multiple clicks
    setSelectedOption(index);

    if (index === question.correctIndex) {
      soundFx.playCorrect();
    } else {
      soundFx.playWrong();
    }

    setTimeout(() => {
      onAnswer(index, timeSpent);
    }, 1200);
  };

  const handleUse5050 = () => {
    if (used5050 || selectedOption !== null) return;
    soundFx.playClick();
    setUsed5050(true);

    const wrongIndexes = question.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== question.correctIndex);

    // Pick 2 random wrong options to hide
    const shuffled = [...wrongIndexes].sort(() => Math.random() - 0.5);
    setHiddenOptions([shuffled[0], shuffled[1]]);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Top Status Bar */}
      <div className="bg-white/65 dark:bg-slate-900/65 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/50 dark:border-slate-800 shadow-lg mb-6 flex items-center justify-between gap-4">
        
        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
            Вопрос <span className="text-amber-500 text-base font-extrabold">{questionIndex + 1}</span> / {totalQuestions}
          </div>
          <div className="hidden sm:block w-32 h-2 bg-slate-100/70 dark:bg-slate-800/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Streak & Timer */}
        <div className="flex items-center gap-3">
          {streak > 1 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 font-extrabold text-xs animate-bounce border border-orange-300/80 dark:border-orange-800">
              <Flame className="w-4 h-4 fill-orange-500" />
              Стрик x{streak}!
            </div>
          )}

          <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1 rounded-full">
            <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-amber-500'}`} />
            <span className={timeLeft <= 5 ? 'text-red-500 font-black' : ''}>{timeLeft} с</span>
          </div>
        </div>
      </div>

      {/* Main Question Box */}
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/50 dark:border-slate-800 shadow-2xl transition-all relative overflow-hidden">
        
        {/* Category Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-1 rounded border border-amber-300 dark:border-amber-800 font-serif">
              Архивная карточка № {questionIndex + 1}
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              • {question.categoryTitle}
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Зал: {question.level === 'easy' ? '🟢 Юный краевед' : question.level === 'medium' ? '🟡 Знаток края' : '🔴 Хранитель истории'}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white mb-6 leading-snug">
          {question.text}
        </h2>

        {/* Optional Image */}
        {question.imageUrl && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-64">
            <img
              src={question.imageUrl}
              alt="Иллюстрация к вопросу"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Lifelines & Hints */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {/* 50:50 Lifeline */}
          <button
            onClick={handleUse5050}
            disabled={used5050 || selectedOption !== null}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              used5050
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Подсказка 50:50 {used5050 ? '(использовано)' : ''}
          </button>

          {/* Text Hint */}
          {question.hint && (
            <button
              onClick={() => { soundFx.playClick(); setShowHint(!showHint); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showHint ? 'Скрыть подсказку' : 'Текстовая подсказка'}
            </button>
          )}

          {/* AI Museum Guide Hint */}
          <button
            onClick={onRequestAiHint}
            disabled={isAiLoading || selectedOption !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-500" />
            {isAiLoading ? 'ИИ думает...' : 'Спросить ИИ-Музейщика'}
          </button>
        </div>

        {/* Text Hint Box */}
        {showHint && question.hint && (
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span><strong>Подсказка:</strong> {question.hint}</span>
          </div>
        )}

        {/* AI Hint Response Box */}
        {aiHintText && (
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5 animate-spin" />
            <div>
              <p className="font-bold mb-1 text-indigo-700 dark:text-indigo-300">Совет от ИИ-Краеведа:</p>
              <p className="leading-relaxed">{aiHintText}</p>
            </div>
          </div>
        )}

        {/* Answer Options Grid */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {question.options.map((option, index) => {
            const isHidden = hiddenOptions.includes(index);
            const isSelected = selectedOption === index;
            const isCorrect = index === question.correctIndex;
            const showFeedback = selectedOption !== null;

            if (isHidden) {
              return (
                <div
                  key={index}
                  className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-400 text-sm opacity-40 select-none"
                >
                  [Вариант скрыт подсказкой 50:50]
                </div>
              );
            }

            let btnStyle = 'border-slate-200/80 dark:border-slate-700/70 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 hover:border-amber-400 text-slate-800 dark:text-slate-100 shadow-sm';

            if (showFeedback) {
              if (isCorrect) {
                btnStyle = 'border-green-500 bg-green-50/90 dark:bg-green-950/90 text-green-900 dark:text-green-100 font-bold shadow-md shadow-green-500/10 backdrop-blur-sm';
              } else if (isSelected) {
                btnStyle = 'border-red-500 bg-red-50/90 dark:bg-red-950/90 text-red-900 dark:text-red-100 font-bold backdrop-blur-sm';
              } else {
                btnStyle = 'border-slate-200/60 dark:border-slate-800/60 opacity-50 bg-slate-50/40 dark:bg-slate-900/40';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                disabled={selectedOption !== null}
                className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left font-medium text-sm sm:text-base transition-all duration-200 flex items-center justify-between gap-3 ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>

                {showFeedback && (
                  <div>
                    {isCorrect && <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 animate-bounce" />}
                    {isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500 shrink-0" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
