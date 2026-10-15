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
  }, [questionIndex, gameMode]);

  // Keyboard shortcut listener (1, 2, 3, 4 or А, Б, В, Г or A, B, C, D)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedOption !== null) return;
      // Ignore if typing in input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toLowerCase();
      let index: number | null = null;
      if (key === '1' || key === 'a' || key === 'а') index = 0;
      else if (key === '2' || key === 'b' || key === 'б') index = 1;
      else if (key === '3' || key === 'c' || key === 'в') index = 2;
      else if (key === '4' || key === 'd' || key === 'г') index = 3;

      if (index !== null && index < question.options.length && !hiddenOptions.includes(index)) {
        handleSelectOption(index);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, question.options, hiddenOptions, question.correctIndex]);

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
    }, 2500);
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
  const isAnswered = selectedOption !== null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 animate-fade-in">
      {/* Top Status Bar - Zero Pill Discipline */}
      <div className={`bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border transition-all duration-300 shadow-xl mb-6 ${
        shieldActiveForCurrent 
          ? 'border-emerald-500/80 shadow-emerald-500/20 ring-2 ring-emerald-500/30' 
          : 'border-white/60 dark:border-slate-800'
      }`}>
        
        {/* Progress HUD Zone */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Архивный вопрос <span className="text-amber-500 text-base font-extrabold font-mono">{questionIndex + 1}</span> из {totalQuestions}
            </div>
            
            <div className="w-28 sm:w-36 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>

            {gameMode === 'timed' && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                Блиц
              </span>
            )}
          </div>

          {/* Dynamic indicators: Hearts, Combo Streak, Timer */}
          <div className="flex items-center gap-3">
            {/* Hearts in Survival Mode */}
            {gameMode === 'survival' && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 transition-all duration-300 ${
                      i < lives
                        ? 'text-rose-500 fill-rose-500 animate-pulse scale-110'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Streak & Multiplier */}
            {streak > 1 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs shadow-lg shadow-amber-500/25 animate-bounce">
                <Flame className="w-4 h-4 fill-white" />
                <span>x{comboMultiplier} КОМБО!</span>
              </div>
            )}

            {/* Timer Badge */}
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-amber-500'}`} />
              <span className={timeLeft <= 5 ? 'text-red-500 font-extrabold' : ''}>{timeLeft}с</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Glass Card */}
      <div className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border transition-all duration-300 shadow-2xl relative overflow-hidden ${
        shieldActiveForCurrent
          ? 'border-emerald-500/40 ring-1 ring-emerald-500/20'
          : 'border-white/70 dark:border-slate-800'
      }`}>
        
        {/* Category Header & Metadata - Clean Unboxed Discipline */}
        <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="text-amber-700 dark:text-amber-300 font-serif font-bold">
              Архивная карточка № {questionIndex + 1}
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span>{question.categoryTitle}</span>
          </div>

          {/* Voice Narration Button with Live Audio Waveform Visualizer */}
          <button
            onClick={handleToggleSpeech}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isSpeaking
                ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/30'
                : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:bg-slate-200/80'
            }`}
            title="Озвучить вопрос голосом гида"
          >
            {isSpeaking ? (
              <>
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-3 bg-white animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-0.5 h-3 bg-white animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-0.5 h-3 bg-white animate-bounce" />
                </div>
                <span className="text-[11px]">Стоп</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline text-[11px]">Голос гида</span>
              </>
            )}
          </button>
        </div>

        {/* Question Heading */}
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white mb-6 leading-relaxed tracking-tight">
          {question.text}
        </h2>

        {/* Optional Question Photograph */}
        {question.imageUrl && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-72 shadow-lg relative group">
            <img
              src={question.imageUrl}
              alt="Иллюстрация к вопросу"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {question.imageCaption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-xs font-medium">
                {question.imageCaption}
              </div>
            )}
          </div>
        )}

        {/* Lifelines Toolbar */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={handleUse5050}
            disabled={used5050 || isAnswered}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              used5050
                ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700/60 hover:bg-amber-100 dark:hover:bg-amber-900/50 shadow-sm'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            50:50 {used5050 ? '(исп.)' : ''}
          </button>

          {hasShield && (
            <button
              onClick={handleActivateShield}
              disabled={shieldActiveForCurrent || isAnswered}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                shieldActiveForCurrent
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100 shadow-sm'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              {shieldActiveForCurrent ? 'Щит активен!' : 'Защитный щит'}
            </button>
          )}

          {question.hint && (
            <button
              onClick={() => { soundFx.playClick(); setShowHint(!showHint); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700/60 hover:bg-amber-100 transition-colors shadow-sm"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              {showHint ? 'Скрыть наводку' : 'Подсказка музея'}
            </button>
          )}

          <button
            onClick={onRequestAiHint}
            disabled={isAiLoading || isAnswered}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700/60 hover:bg-indigo-100 transition-colors shadow-sm"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-500" />
            {isAiLoading ? 'Краевед думает...' : 'Спросить ИИ-Краеведа'}
          </button>
        </div>

        {/* Human Hint Box */}
        {showHint && question.hint && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-3 shadow-inner">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-amber-800 dark:text-amber-300 font-serif">Подсказка экскурсовода:</strong> {question.hint}
            </div>
          </div>
        )}

        {/* AI Hint Response */}
        {aiHintText && (
          <div className="mb-6 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-3 shadow-inner">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5 animate-spin" />
            <div className="leading-relaxed">
              <strong className="text-indigo-800 dark:text-indigo-300 font-serif">Наводка ИИ-Музейщика:</strong> {aiHintText}
            </div>
          </div>
        )}

        {/* Answer Options Grid */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-6">
          {question.options.map((option, index) => {
            const isHidden = hiddenOptions.includes(index);
            const isSelected = selectedOption === index;
            const isCorrect = index === question.correctIndex;

            if (isHidden) {
              return (
                <div
                  key={index}
                  className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 text-xs sm:text-sm opacity-40 select-none text-center font-mono"
                >
                  [ Исключено подсказкой 50:50 ]
                </div>
              );
            }

            const cyrillicLetters = ['А', 'Б', 'В', 'Г'];
            let btnStyle = 'border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 hover:border-amber-400/80 hover:shadow-md text-slate-800 dark:text-slate-100';
            let animStyle = '';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-500/30 shadow-md shadow-emerald-500/20';
                animStyle = 'animate-pulse-correct';
              } else if (isSelected) {
                btnStyle = 'border-rose-500 bg-rose-500/15 text-rose-950 dark:text-rose-100 font-bold ring-2 ring-rose-500/30 shadow-md shadow-rose-500/20';
                animStyle = 'animate-shake-error';
              } else {
                btnStyle = 'border-slate-200/40 dark:border-slate-800/40 opacity-40 bg-slate-50/30 dark:bg-slate-900/30';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                disabled={isAnswered}
                className={`group w-full p-4 sm:p-5 rounded-2xl border-2 text-left font-medium text-sm sm:text-base transition-all duration-200 flex items-center justify-between gap-4 ${btnStyle} ${animStyle}`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition-all ${
                    isAnswered && isCorrect
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : isAnswered && isSelected
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white'
                  }`}>
                    {cyrillicLetters[index] || String.fromCharCode(65 + index)}
                  </span>
                  <span className="leading-snug">{option}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isAnswered && (
                    <span className="hidden sm:inline-block font-mono text-[10px] text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                      [{index + 1}]
                    </span>
                  )}
                  {isAnswered && (
                    <div>
                      {isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 animate-bounce" />}
                      {isSelected && !isCorrect && <XCircle className="w-6 h-6 text-rose-500 shrink-0" />}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Immediate Post-Answer Historical Context Box */}
        {isAnswered && (
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 animate-fade-in space-y-4">
            <div className={`p-5 rounded-2xl border ${
              selectedOption === question.correctIndex
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <h4 className="font-bold font-serif text-sm">
                  Историческая справка экспозиции:
                </h4>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed mb-2 opacity-95">
                {question.historicalFact || question.explanation}
              </p>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {question.explanation}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => onAnswer(selectedOption, timeSpent, shieldActiveForCurrent)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-2"
              >
                <span>Следующий вопрос</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

