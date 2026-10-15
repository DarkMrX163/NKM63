import React from 'react';
import confetti from 'canvas-confetti';
import { MUSEUM_EXHIBITS, MuseumExhibit } from '../data/exhibits';
import { ExhibitIllustration } from './ExhibitIllustration';
import { soundFx } from '../utils/audio';
import { 
  ZoomIn, 
  ZoomOut, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Award, 
  Landmark, 
  Scroll, 
  Eye, 
  Lightbulb,
  ExternalLink,
  Camera
} from 'lucide-react';

interface ExhibitMiniGameProps {
  onScoreAwarded?: (scoreDelta: number) => void;
  onOpenCertificate?: () => void;
}

export const ExhibitMiniGame: React.FC<ExhibitMiniGameProps> = ({
  onScoreAwarded,
  onOpenCertificate
}) => {
  // Saved collection of solved exhibit IDs in localStorage
  const [unlockedExhibitIds, setUnlockedExhibitIds] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('unlocked_exhibits');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const currentExhibit: MuseumExhibit = MUSEUM_EXHIBITS[currentIndex];

  // Zoom levels: 3.4 (macro fragment), 2.2, 1.4, 1.0 (full view)
  const [currentZoom, setCurrentZoom] = React.useState(currentExhibit.zoomCoordinates.initialZoom);
  const [showClue, setShowClue] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [isAnswered, setIsAnswered] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [streak, setStreak] = React.useState(0);
  const [sessionPointsEarned, setSessionPointsEarned] = React.useState(0);
  const [showGalleryView, setShowGalleryView] = React.useState(false);
  const [shuffledOptions, setShuffledOptions] = React.useState<Array<{ text: string; originalIndex: number }>>([]);

  // Sync zoom and shuffle options when changing exhibit
  React.useEffect(() => {
    setCurrentZoom(currentExhibit.zoomCoordinates.initialZoom);
    setShowClue(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);

    // Create options array with original indices and shuffle
    const optionsWithIndex = currentExhibit.options.map((opt, idx) => ({
      text: opt,
      originalIndex: idx
    }));

    for (let i = optionsWithIndex.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
    }

    setShuffledOptions(optionsWithIndex);
  }, [currentIndex]);

  const handleZoomChange = (newZoom: number) => {
    soundFx.playClick();
    setCurrentZoom(newZoom);
  };

  const handleToggleClue = () => {
    soundFx.playClick();
    setShowClue((prev) => !prev);
  };

  const calculatePoints = () => {
    let pts = 30;
    if (currentZoom < 3.0) pts = 22;
    if (currentZoom < 2.0) pts = 16;
    if (currentZoom <= 1.2) pts = 10;
    if (showClue) pts = Math.max(8, pts - 5);
    return pts;
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const selectedOpt = shuffledOptions[index];
    const isRight = selectedOpt && selectedOpt.originalIndex === currentExhibit.correctOptionIndex;

    if (isRight) {
      soundFx.playCorrect();
      setIsCorrect(true);
      setCurrentZoom(1.0); // Smoothly zoom out to full exhibit view

      const pts = calculatePoints();
      setSessionPointsEarned((p) => p + pts);
      setStreak((s) => s + 1);

      if (onScoreAwarded) {
        onScoreAwarded(pts);
      }

      // Add to unlocked exhibits
      if (!unlockedExhibitIds.includes(currentExhibit.id)) {
        const updated = [...unlockedExhibitIds, currentExhibit.id];
        setUnlockedExhibitIds(updated);
        localStorage.setItem('unlocked_exhibits', JSON.stringify(updated));
      }

      // Celebrate
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      soundFx.playWrong();
      setIsCorrect(false);
      setStreak(0);
    }
  };

  const handleNextExhibit = () => {
    soundFx.playClick();
    if (currentIndex < MUSEUM_EXHIBITS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const isAlreadySolved = unlockedExhibitIds.includes(currentExhibit.id);

  return (
    <div className="py-6 px-4 max-w-5xl mx-auto space-y-6 animate-fade-in">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/10 dark:bg-slate-900/30 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-white/20 dark:border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              Мини-игра музейного сыщика
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-serif text-slate-900 dark:text-white">
              Угадай музейный экспонат по фрагменту
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Внимательно изучите деталь артефакта через музейную лупу и определите реликвию!
            </p>
          </div>
        </div>

        {/* Collection & Score Badges */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => { soundFx.playClick(); setShowGalleryView(!showGalleryView); }}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              showGalleryView
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-white/20 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 border border-white/20 dark:border-white/10 hover:bg-white/30'
            }`}
          >
            <Landmark className="w-4 h-4" />
            Витрина: {unlockedExhibitIds.length}/{MUSEUM_EXHIBITS.length}
          </button>

          {onOpenCertificate && (
            <button
              onClick={() => { soundFx.playClick(); onOpenCertificate(); }}
              className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md shadow-amber-500/20 hover:brightness-110 transition-all"
            >
              <Scroll className="w-4 h-4" />
              В диплом
            </button>
          )}
        </div>
      </div>

      {/* Main Mode Switch: Game Play or Collection Gallery */}
      {!showGalleryView ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Macro Exhibit Viewer with HUD Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative">
              <ExhibitIllustration
                type={currentExhibit.type}
                imageUrl={currentExhibit.imageUrl}
                imageSource={currentExhibit.imageSource}
                zoomScale={currentZoom}
                zoomX={currentExhibit.zoomCoordinates.x}
                zoomY={currentExhibit.zoomCoordinates.y}
                isRevealed={isAnswered && isCorrect}
                className="w-full max-w-md mx-auto aspect-square border-4 border-amber-600/30 shadow-2xl"
              />

              {/* Solved Stamp Badge */}
              {isAlreadySolved && !isAnswered && (
                <div className="absolute top-3 right-3 bg-amber-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-md">
                  ★ Уже в вашей коллекции
                </div>
              )}
            </div>

            {/* Zoom Slider and Controls */}
            <div className="bg-white/15 dark:bg-slate-900/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 dark:border-white/10 flex items-center justify-between gap-2 max-w-md mx-auto">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <ZoomIn className="w-4 h-4 text-amber-500" />
                Масштаб:
              </span>

              <div className="flex items-center gap-1.5">
                {[
                  { label: '3.4x (Макро)', zoom: 3.4 },
                  { label: '2.2x', zoom: 2.2 },
                  { label: '1.4x', zoom: 1.4 },
                  { label: '1.0x (Всё)', zoom: 1.0 }
                ].map((item) => (
                  <button
                    key={item.zoom}
                    onClick={() => handleZoomChange(item.zoom)}
                    disabled={isAnswered && isCorrect}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      Math.abs(currentZoom - item.zoom) < 0.2
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-white/10 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custodian Clue Toggle */}
            <div className="max-w-md mx-auto">
              <button
                onClick={handleToggleClue}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500/15 dark:bg-amber-400/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                {showClue ? 'Скрыть подсказку смотрителя' : '💡 Подсказка музейного смотрителя (-5 б.)'}
              </button>

              {showClue && (
                <div className="mt-2 p-3.5 rounded-xl bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-xs text-amber-950 dark:text-amber-200 animate-fade-in leading-relaxed">
                  <span className="font-bold">Фрагмент экспоната: </span>
                  {currentExhibit.fragmentClue}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Quiz Question, Multiple Choice, and Reveal Narrative */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Level Counter and Scoring */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 pb-2 border-b border-white/15 dark:border-white/10">
              <span>Экспонат {currentIndex + 1} из {MUSEUM_EXHIBITS.length}</span>
              <div className="flex items-center gap-3">
                <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Награда за ответ: +{calculatePoints()} б.
                </span>
                {streak > 1 && (
                  <span className="bg-red-500/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-md text-[11px]">
                    Серия: {streak} 🔥
                  </span>
                )}
              </div>
            </div>

            {/* Question Text */}
            <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-3xl border border-white/20 dark:border-white/10 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Зал: {currentExhibit.hall}
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white">
                Какой исторический экспонат изображен на этом фрагменте?
              </h2>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {shuffledOptions.map((optObj, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = optObj.originalIndex === currentExhibit.correctOptionIndex;

                let btnStyle = 'bg-white/25 dark:bg-slate-900/40 border-white/20 dark:border-white/10 text-slate-900 dark:text-white hover:bg-white/40 dark:hover:bg-slate-800/60';
                let animStyle = '';

                if (isAnswered) {
                  if (isCorrectOption) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30 font-black';
                    animStyle = 'animate-pulse-correct';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-600 text-white border-rose-500 font-bold';
                    animStyle = 'animate-shake-error';
                  } else {
                    btnStyle = 'opacity-40 bg-white/10 dark:bg-slate-900/20 border-transparent text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border backdrop-blur-md text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-3 ${btnStyle} ${animStyle}`}
                  >
                    <span>{optObj.text}</span>
                    {isAnswered && isCorrectOption && <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />}
                    {isAnswered && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 shrink-0 text-white text-rose-200" />}
                  </button>
                );
              })}
            </div>

            {/* Revealed Museum Plaque & Story (After Answering) */}
            {isAnswered && (
              <div className="p-5 rounded-3xl bg-amber-50/90 dark:bg-amber-950/50 border-2 border-amber-500/40 text-slate-900 dark:text-amber-100 space-y-3 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between border-b border-amber-800/20 pb-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      {currentExhibit.category} • {currentExhibit.period}
                    </span>
                    <h3 className="text-base sm:text-lg font-black font-serif text-slate-950 dark:text-white">
                      {currentExhibit.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {currentExhibit.location}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-amber-100 font-sans">
                  {currentExhibit.story}
                </p>

                <div className="p-3 rounded-xl bg-amber-100/80 dark:bg-amber-900/40 border border-amber-400/40 text-xs text-amber-950 dark:text-amber-200">
                  <span className="font-bold">✨ Любопытный факт: </span>
                  {currentExhibit.historicalFact}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-amber-900/80 dark:text-amber-300 font-medium bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                  <Camera className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span><strong>Подлинный экспонат:</strong> {currentExhibit.imageSource}</span>
                </div>

                {/* Next Button */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {isCorrect ? 'Экспонат добавлен в вашу витрину!' : 'Попробуйте следующий экспонат!'}
                  </span>
                  
                  <button
                    onClick={handleNextExhibit}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/25 transition-all"
                  >
                    <span>Следующий экспонат</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* Collection Showcase View: All 10 Exhibits */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black font-serif text-slate-900 dark:text-white">
              Личная Музейная Витрина Нефтегорского края ({unlockedExhibitIds.length} из {MUSEUM_EXHIBITS.length} открыто)
            </h2>
            <button
              onClick={() => setShowGalleryView(false)}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              ← Вернуться к игре
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {MUSEUM_EXHIBITS.map((item, idx) => {
              const isUnlocked = unlockedExhibitIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    soundFx.playClick();
                    setCurrentIndex(idx);
                    setShowGalleryView(false);
                  }}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer backdrop-blur-md relative flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-white/40 dark:bg-slate-900/60 border-amber-500/50 hover:scale-105 shadow-md'
                      : 'bg-white/10 dark:bg-slate-900/20 border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-2">
                    <ExhibitIllustration
                      type={item.type}
                      imageUrl={item.imageUrl}
                      imageSource={item.imageSource}
                      zoomScale={1.0}
                      isRevealed={isUnlocked}
                      className="w-full h-full"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block uppercase">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                      {item.shortName}
                    </h4>
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      {item.period}
                    </span>
                    {isUnlocked ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Открыт</span>
                    ) : (
                      <span className="text-amber-500 font-bold">Разгадать →</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
