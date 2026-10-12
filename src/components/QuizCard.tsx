import React from 'react';
import { Question, GameMode } from '../types/quiz';
import { 
  Flame, 
  Lightbulb, 
  Bot, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  HelpCircle,
  Shield,
  Heart,
  Volume2,
  VolumeX,
  Radio,
  Zap
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface QuizCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  gameMode?: GameMode;
  lives?: number;
  hasShield?: boolean;
  onUseShield?: () => void;
  onAnswer: (selectedIndex: number, timeSpent: number, usedShieldProtection?: boolean) => void;
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
  gameMode = 'classic',
  lives = 3,
  hasShield = false,
  onUseShield,
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
  const [shieldActiveForCurrent, setShieldActiveForCurrent] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  // Initial duration depends on mode: timed = 15s, survival = 20s, classic = 30s
  const initialTime = gameMode === 'timed' ? 15 : gameMode === 'survival' ? 20 : 30;
  const [timeLeft, setTimeLeft] = React.useState(initialTime);
  const [timeSpent, setTimeSpent] = React.useState(0);

  // Timer effect
  React.useEffect(() => {
    setTimeLeft(initialTime);
    setTimeSpent(0);
    setSelectedOption(null);
    setHiddenOptions([]);
    setShowHint(false);
    setShieldActiveForCurrent(false);
    soundFx.stopSpeech();
    setIsSpeaking(false);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Time out auto answer
          onAnswer(-1, initialTime, shieldActiveForCurrent);
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      soundFx.stopSpeech();
    };
  }, [question.id, initialTime]);

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    soundFx.stopSpeech();
    setIsSpeaking(false);

    const isCorrect = index === question.correctIndex;
    if (isCorrect) {
      if (streak >= 2) {
        soundFx.playCombo(streak + 1);
      } else {
        soundFx.playCorrect();
      }
    } else {
      if (shieldActiveForCurrent) {
        soundFx.playShield();
      } else {
        soundFx.playWrong();
      }
    }

    setTimeout(() => {
      onAnswer(index, timeSpent, shieldActiveForCurrent);
    }, 1200);
  };

  const handleUse5050 = () => {
    if (used5050 || selectedOption !== null) return;
    soundFx.playClick();
    setUsed5050(true);

    const wrongIndexes = question.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== question.correctIndex);

    const shuffled = [...wrongIndexes].sort(() => Math.random() - 0.5);
    setHiddenOptions([shuffled[0], shuffled[1]]);
  };

  const handleActivateShield = () => {
    if (!hasShield || shieldActiveForCurrent || selectedOption !== null) return;
    soundFx.playShield();
    setShieldActiveForCurrent(true);
    if (onUseShield) onUseShield();
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      soundFx.stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToRead = `Вопрос номер ${questionIndex + 1}. ${question.text}`;
      soundFx.speakText(textToRead, () => {
        setIsSpeaking(false);
      });
    }
  };

  // Combo multiplier calculation
  const comboMultiplier = streak >= 5 ? 3 : streak >= 3 ? 2 : streak >= 2 ? 1.5 : 1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 animate-fade-in">
      {/* Top Status Bar */}
      <div className="bg-white/65 dark:bg-slate-900/65 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/50 dark:border-slate-800 shadow-lg mb-6 flex flex-wrap items-center justify-between gap-4">
        
        {/* Progress & Mode badge */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
            Вопрос <span className="text-amber-500 text-base font-extrabold">{questionIndex + 1}</span> / {totalQuestions}
          </div>
          <div className="hidden sm:block w-28 h-2 bg-slate-100/70 dark:bg-slate-800/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
              style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {gameMode === 'timed' && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-600 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300">
              <Zap className="w-3 h-3" />
              Блиц-марафон
            </span>
          )}
        </div>

        {/* Dynamic status: Lives, Streak, Timer */}
        <div className="flex items-center gap-3">
          
          {/* Survival Hearts */}
          {gameMode === 'survival' && (
            <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-300 dark:border-rose-800">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 transition-all ${
                    i < lives
                      ? 'text-rose-500 fill-rose-500 animate-pulse'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Streak & Combo multiplier */}
          {streak > 1 && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs shadow-md animate-bounce">
              <Flame className="w-4 h-4 fill-white" />
              <span>x{comboMultiplier} КОМБО!</span>
            </div>
          )}

          {/* Timer */}
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
            <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-amber-500'}`} />
            <span className={timeLeft <= 5 ? 'text-red-500 font-black' : ''}>{timeLeft} с</span>
          </div>
        </div>
      </div>

      {/* Main Question Box */}
      <div className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-slate-800 shadow-2xl transition-all relative overflow-hidden">
        
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

          {/* Voice Narration Button */}
          <button
            onClick={handleToggleSpeech}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
              isSpeaking
                ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                : 'bg-white/40 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-white/80'
            }`}
            title="Озвучить вопрос голосом экскурсовода"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-500" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Остановить' : 'Озвучить'}</span>
          </button>
        </div>

        {/* Question Text */}
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white mb-6 leading-snug">
          {question.text}
        </h2>

        {/* Optional Image */}
        {question.imageUrl && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-64 shadow-inner">
            <img
              src={question.imageUrl}
              alt="Иллюстрация к вопросу"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Lifelines & Hints toolbar */}
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
            Подсказка 50:50 {used5050 ? '(исп.)' : ''}
          </button>

          {/* Defensive Shield (Second chance) */}
          {hasShield && (
            <button
              onClick={handleActivateShield}
              disabled={shieldActiveForCurrent || selectedOption !== null}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                shieldActiveForCurrent
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-md animate-pulse'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              {shieldActiveForCurrent ? 'Щит активен!' : 'Защитный щит'}
            </button>
          )}

          {/* Text Hint */}
          {question.hint && (
            <button
              onClick={() => { soundFx.playClick(); setShowHint(!showHint); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showHint ? 'Скрыть подсказку' : 'Подсказка экскурсовода'}
            </button>
          )}

          {/* AI Museum Guide Hint */}
          <button
            onClick={onRequestAiHint}
            disabled={isAiLoading || selectedOption !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-500" />
            {isAiLoading ? 'Музейщик думает...' : 'Спросить ИИ-Музейщика'}
          </button>
        </div>

        {/* Text Hint Box */}
        {showHint && question.hint && (
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5 shadow-sm">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span><strong>Совет экскурсовода:</strong> {question.hint}</span>
          </div>
        )}

        {/* AI Hint Response Box */}
        {aiHintText && (
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5 animate-spin" />
            <div>
              <p className="font-bold mb-1 text-indigo-700 dark:text-indigo-300">Наводка от ИИ-Краеведа:</p>
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
                  [Вариант исключен подсказкой 50:50]
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
