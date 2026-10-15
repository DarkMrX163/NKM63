import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Puzzle, 
  History, 
  CheckCircle2, 
  RotateCcw, 
  ChevronUp, 
  ChevronDown, 
  HelpCircle, 
  Award, 
  Eye, 
  ArrowRight, 
  Flame, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';
import { PUZZLE_IMAGES } from '../data/detectiveImages';

interface MuseumDetectiveProps {
  onAddScore?: (points: number) => void;
  onUnlockBadge?: (badgeId: string) => void;
}

export type DetectiveSubTab = 'puzzle' | 'timeline';

// 1. «СОБЕРИ ЭКСПОНАТ» PUZZLE ITEMS
interface PuzzleArtifact {
  id: string;
  name: string;
  hall: string;
  era: string;
  description: string;
  imageUrl: string;
}

const PUZZLE_ARTIFACTS: PuzzleArtifact[] = [
  {
    id: 'spinning_wheel',
    name: 'Старинная резная прялка с донцем',
    hall: 'Зал этнографии и крестьянского быта',
    era: 'Конец XIX века',
    description: 'Прялка в поволжской избе была не просто орудием труда, но и семейной реликвией. Жених дарил невесте прялку, украшенную затейливой резьбой и росписью.',
    imageUrl: PUZZLE_IMAGES.spinning_wheel
  },
  {
    id: 'drill_bit',
    name: 'Буровое оборудование и станок нефтяников',
    hall: 'Зал геологии и нефтяного промысла',
    era: '1960-е годы (Основание Нефтегорска)',
    description: 'Тяжелый балансирный станок и буровые долота первопроходцев, пробивавшие скальные породы Самарского Заволжья на глубину свыше 2500 метров к нефтяным пластам.',
    imageUrl: PUZZLE_IMAGES.oilpump
  },
  {
    id: 'iron',
    name: 'Чугунный угольный утюг с заслонкой-петушком',
    hall: 'Коллекция старинного быта',
    era: 'Рубеж XIX–XX веков',
    description: 'Массивный утюг весом до 4 кг. Внутрь корпуса засыпались раскаленные древесные угли из печи, а боковые прорези служили поддувалом. Труба сверху регулировала тягу.',
    imageUrl: PUZZLE_IMAGES.iron
  }
];

// 3. «ХРОНОЛОГИЧЕСКАЯ ЛЕНТА» SETS
interface TimelineEvent {
  id: string;
  year: number;
  yearDisplay: string;
  title: string;
  description: string;
}

const TIMELINE_SETS: Array<{ id: string; title: string; events: TimelineEvent[] }> = [
  {
    id: 'district_history',
    title: 'Вехи истории Нефтегорского края',
    events: [
      {
        id: 'e1',
        year: 1848,
        yearDisplay: '1848 год',
        title: 'Строительство ветряной мельницы в селе Бариновка',
        description: 'Крестьянин Пётр Арапов возвёл голландскую шатровую мельницу, ставшую символом поволжского земледелия.'
      },
      {
        id: 'e2',
        year: 1892,
        yearDisplay: '1892 год',
        title: 'Освящение Свято-Троицкого собора в селе Утёвка',
        description: 'Завершение росписи купола и алтаря собора уникальным иконописцем Григорием Журавлёвым.'
      },
      {
        id: 'e3',
        year: 1960,
        yearDisplay: '1960 год',
        title: 'Открытие Мухановской нефти и основание Нефтегорска',
        description: 'Появление рабочего посёлка нефтяников у разведочных скважин Самарского Заволжья.'
      },
      {
        id: 'e4',
        year: 1989,
        yearDisplay: '1989 год',
        title: 'Присвоение Нефтегорску официального статуса города',
        description: 'Преобразование рабочего посёлка в полноценный индустриальный и культурный город Самарской области.'
      }
    ]
  },
  {
    id: 'culture_and_oil',
    title: 'От первых скважин до современных музеев',
    events: [
      {
        id: 'c1',
        year: 1936,
        yearDisplay: '1936 год',
        title: 'Начало разработки «Второго Баку» в Самарской Луке',
        description: 'Первые открытия большой промышленной нефти в волжских недрах перед освоением восточных степей.'
      },
      {
        id: 'c2',
        year: 1958,
        yearDisplay: '1958 год',
        title: 'Фонтан первой нефтегорской скважины №1',
        description: 'Бригада буровиков доказала наличие богатейших залежей углеводородов в районе.'
      },
      {
        id: 'c3',
        year: 1990,
        yearDisplay: '1990 год',
        title: 'Создание Нефтегорского краеведческого музея',
        description: 'Объединение энтузиастов и начало формирования официальных музейных фондов истории края.'
      },
      {
        id: 'c4',
        year: 2023,
        yearDisplay: '2023 год',
        title: 'Открытие обновленного эко-комплекса Бариновской мельницы',
        description: 'Возрождение исторической мельницы как туристического и гастрономического центра региона.'
      }
    ]
  }
];

export const MuseumDetective: React.FC<MuseumDetectiveProps> = ({ onAddScore, onUnlockBadge }) => {
  const [activeTab, setActiveTab] = useState<DetectiveSubTab>('puzzle');

  // SUBTAB 1: PUZZLE STATE
  const [currentArtifactIdx, setCurrentArtifactIdx] = useState(0);
  const activeArtifact = PUZZLE_ARTIFACTS[currentArtifactIdx];
  // 3x3 grid tiles indices [0..8]
  const [puzzleTiles, setPuzzleTiles] = useState<number[]>([2, 5, 0, 7, 1, 8, 3, 6, 4]);
  const [selectedTileIdx, setSelectedTileIdx] = useState<number | null>(null);
  const [puzzleSolved, setPuzzleSolved] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // SUBTAB 2: TIMELINE STATE
  const [currentTimelineSetIdx, setCurrentTimelineSetIdx] = useState(0);
  const activeTimelineSet = TIMELINE_SETS[currentTimelineSetIdx];
  // Shuffled event IDs
  const [timelineOrder, setTimelineOrder] = useState<string[]>(() => {
    return ['e3', 'e1', 'e4', 'e2'];
  });
  const [timelineChecked, setTimelineChecked] = useState<boolean>(false);
  const [timelineIsCorrect, setTimelineIsCorrect] = useState<boolean>(false);

  // --- PUZZLE LOGIC ---
  const handleTileClick = (index: number) => {
    soundFx.playClick();
    if (puzzleSolved) return;

    if (selectedTileIdx === null) {
      setSelectedTileIdx(index);
    } else {
      // Swap tiles
      const nextTiles = [...puzzleTiles];
      const temp = nextTiles[selectedTileIdx];
      nextTiles[selectedTileIdx] = nextTiles[index];
      nextTiles[index] = temp;
      setPuzzleTiles(nextTiles);
      setSelectedTileIdx(null);

      // Check if solved
      const isSolved = nextTiles.every((val, idx) => val === idx);
      if (isSolved) {
        setPuzzleSolved(true);
        soundFx.playFanfare();
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
        if (onAddScore) onAddScore(50);
        if (onUnlockBadge) onUnlockBadge('badge_restorer');
      }
    }
  };

  const resetPuzzle = () => {
    soundFx.playClick();
    // Deterministic shuffle
    setPuzzleTiles([3, 7, 1, 0, 8, 4, 6, 2, 5]);
    setSelectedTileIdx(null);
    setPuzzleSolved(false);
  };

  const switchArtifact = (idx: number) => {
    soundFx.playClick();
    setCurrentArtifactIdx(idx);
    setPuzzleTiles([2, 5, 0, 7, 1, 8, 3, 6, 4]);
    setSelectedTileIdx(null);
    setPuzzleSolved(false);
  };

  // --- TIMELINE LOGIC ---
  const moveTimelineItem = (index: number, direction: 'up' | 'down') => {
    soundFx.playClick();
    setTimelineChecked(false);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= timelineOrder.length) return;

    const nextOrder = [...timelineOrder];
    const temp = nextOrder[index];
    nextOrder[index] = nextOrder[targetIndex];
    nextOrder[targetIndex] = temp;
    setTimelineOrder(nextOrder);
  };

  const checkTimelineOrder = () => {
    soundFx.playClick();
    const sortedTarget = [...activeTimelineSet.events]
      .sort((a, b) => a.year - b.year)
      .map((e) => e.id);

    const isCorrect = timelineOrder.every((id, idx) => id === sortedTarget[idx]);
    setTimelineChecked(true);
    setTimelineIsCorrect(isCorrect);

    if (isCorrect) {
      soundFx.playFanfare();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
      if (onAddScore) onAddScore(40);
      if (onUnlockBadge) onUnlockBadge('badge_chronicler');
    } else {
      soundFx.playWrong();
    }
  };

  const switchTimelineSet = (idx: number) => {
    soundFx.playClick();
    setCurrentTimelineSetIdx(idx);
    setTimelineChecked(false);
    setTimelineIsCorrect(false);
    if (idx === 0) {
      setTimelineOrder(['e3', 'e1', 'e4', 'e2']);
    } else {
      setTimelineOrder(['c3', 'c1', 'c4', 'c2']);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/40 dark:border-slate-800 shadow-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold font-serif mb-2 border border-amber-500/20">
              <Search className="w-3.5 h-3.5" />
              Интерактивный кабинет краеведа-исследователя
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
              Музейный детектив / Архивариус
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Погрузитесь в работу музейного эксперта: собирайте старинные экспонаты из фрагментов в интерактивном пазле и выстраивайте ход истории края на хронологической ленте.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              Бонусы за задания
            </span>
          </div>
        </div>

        {/* 2 Detective Mode Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 mt-6 border-t border-slate-200/60 dark:border-slate-800/60">
          <button
            onClick={() => { soundFx.playClick(); setActiveTab('puzzle'); }}
            className={`p-4 rounded-2xl flex items-center gap-3.5 transition-all text-left border ${
              activeTab === 'puzzle'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/25 font-bold'
                : 'bg-white/60 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              activeTab === 'puzzle' ? 'bg-white/20 text-white' : 'bg-amber-500/10 text-amber-600'
            }`}>
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">1. «Собери экспонат»</p>
              <p className={`text-xs mt-0.5 ${activeTab === 'puzzle' ? 'text-amber-100' : 'text-slate-500'}`}>
                Интерактивный пазл (прялка, нефтяное долото, утюг)
              </p>
            </div>
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('timeline'); }}
            className={`p-4 rounded-2xl flex items-center gap-3.5 transition-all text-left border ${
              activeTab === 'timeline'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/25 font-bold'
                : 'bg-white/60 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              activeTab === 'timeline' ? 'bg-white/20 text-white' : 'bg-amber-500/10 text-amber-600'
            }`}>
              <History className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">2. «Хронологическая лента»</p>
              <p className={`text-xs mt-0.5 ${activeTab === 'timeline' ? 'text-amber-100' : 'text-slate-500'}`}>
                Расставить исторические вехи в верном порядке
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. РЕЖИМ «СОБЕРИ ЭКСПОНАТ» (JIGSAW ARTIFACT RESTORER)     */}
      {/* ======================================================== */}
      {activeTab === 'puzzle' && (
        <div className="space-y-6 animate-scale-up">
          {/* Artifact selector pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {PUZZLE_ARTIFACTS.map((art, idx) => (
              <button
                key={art.id}
                onClick={() => switchArtifact(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  currentArtifactIdx === idx
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {art.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Puzzle interactive grid */}
            <div className="lg:col-span-7 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-3xl p-6 border border-white/40 dark:border-slate-800 shadow-xl space-y-4 flex flex-col items-center">
              
              <div className="w-full flex items-center justify-between text-xs">
                <span className="font-bold text-amber-600 font-serif">
                  {activeArtifact.hall}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 hover:bg-slate-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {showPreview ? 'Скрыть оригинал' : 'Подсмотреть образец'}
                  </button>
                  <button
                    onClick={resetPuzzle}
                    title="Перемешать заново"
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-amber-500"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3x3 Puzzle Container */}
              <div className="relative w-72 sm:w-84 aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl p-2 border-2 border-amber-500/50 shadow-xl">
                {showPreview && (
                  <div className="absolute inset-2 rounded-xl overflow-hidden z-20 border-2 border-amber-500 shadow-2xl animate-fade-in">
                    <img
                      src={activeArtifact.imageUrl}
                      alt={activeArtifact.name}
                      onError={(e) => {
                        e.currentTarget.src = '/images/exhibits/spinning_wheel.jpg';
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4 text-center">
                      <p className="text-white text-xs font-bold font-serif bg-black/60 px-3 py-1.5 rounded-xl">
                        Оригинальный экспонат. Нажмите «Скрыть оригинал», чтобы продолжить сборку.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-full h-full">
                  {puzzleTiles.map((pieceNum, gridPos) => {
                    const row = Math.floor(pieceNum / 3);
                    const col = pieceNum % 3;
                    const isSelected = selectedTileIdx === gridPos;
                    const isInCorrectPlace = pieceNum === gridPos;

                    return (
                      <div
                        key={gridPos}
                        onClick={() => handleTileClick(gridPos)}
                        className={`relative rounded-lg overflow-hidden cursor-pointer transition-all border-2 select-none group ${
                          isSelected
                            ? 'border-amber-400 scale-105 z-10 shadow-lg ring-2 ring-amber-400'
                            : isInCorrectPlace && puzzleSolved
                            ? 'border-emerald-500'
                            : 'border-white/60 dark:border-slate-700 hover:border-amber-300'
                        }`}
                        style={{
                          backgroundImage: `url(${activeArtifact.imageUrl})`,
                          backgroundSize: '300% 300%',
                          backgroundPosition: `${col * 50}% ${row * 50}%`
                        }}
                      >
                        <div className={`absolute inset-0 transition-opacity ${
                          isSelected ? 'bg-amber-500/20' : 'group-hover:bg-white/10'
                        }`} />
                        <span className="absolute bottom-1 right-1 text-[9px] font-mono font-bold bg-black/60 text-white px-1 rounded">
                          #{gridPos + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructions */}
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-sm font-sans">
                💡 <strong>Как играть:</strong> Нажмите на любую плитку, затем на другую — они поменяются местами. Расставьте все 9 фрагментов на свои места!
              </p>
            </div>

            {/* Artifact description & Curator Notes */}
            <div className="lg:col-span-5 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-3xl p-6 border border-white/40 dark:border-slate-800 shadow-xl space-y-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider font-serif">
                  {activeArtifact.era}
                </span>
                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white mt-1 leading-snug">
                  {activeArtifact.name}
                </h3>
              </div>

              {puzzleSolved ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 space-y-2 animate-scale-up">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Экспонат успешно отреставрирован!
                  </div>
                  <p className="text-xs font-serif leading-relaxed">
                    Поздравляем! Вы вернули экспонату первозданный музейный вид и заработали <strong>+50 баллов</strong> в копилку исследователя.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-xs font-serif leading-relaxed">
                  <p className="font-bold mb-1">Задание реставратора:</p>
                  Соберите фрагменты старинного предмета, чтобы расшифровать его историю в фондах Нефтегорского краеведческого музея.
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Историческая справка экспоната:
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {activeArtifact.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. РЕЖИМ «ХРОНОЛОГИЧЕСКАЯ ЛЕНТА» (TIMELINE CHRONOLOGY)     */}
      {/* ======================================================== */}
      {activeTab === 'timeline' && (
        <div className="space-y-6 animate-scale-up">
          {/* Era Set Selector */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {TIMELINE_SETS.map((tset, idx) => (
              <button
                key={tset.id}
                onClick={() => switchTimelineSet(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  currentTimelineSetIdx === idx
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Лента #{idx + 1}: {tset.title}
              </button>
            ))}
          </div>

          <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/40 dark:border-slate-800 shadow-xl space-y-6 max-w-4xl mx-auto">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest font-serif">
                Испытание на знание хронологии края
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-serif text-slate-900 dark:text-white">
                {activeTimelineSet.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Используйте стрелочки <strong>▲ Вверх</strong> и <strong>▼ Вниз</strong>, чтобы выстроить 4 исторических события в порядке времени — от самого раннего к самому позднему.
              </p>
            </div>

            {/* Timeline Cards */}
            <div className="space-y-3">
              {timelineOrder.map((eventId, index) => {
                const event = activeTimelineSet.events.find((e) => e.id === eventId)!;
                const sortedTarget = [...activeTimelineSet.events].sort((a, b) => a.year - b.year);
                const isCorrectPosition = timelineChecked && sortedTarget[index].id === event.id;

                return (
                  <div
                    key={eventId}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                      timelineChecked
                        ? isCorrectPosition
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-md'
                          : 'bg-rose-500/10 border-rose-500/70 text-rose-950 dark:text-rose-100'
                        : 'bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-amber-400 shadow-sm'
                    }`}
                  >
                    {/* Index badge */}
                    <div className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center shrink-0 text-sm ${
                      timelineChecked
                        ? isCorrectPosition ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                        : 'bg-amber-500/20 text-amber-800 dark:text-amber-200'
                    }`}>
                      {index + 1}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-white leading-tight">
                          {event.title}
                        </h4>
                        {timelineChecked && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            isCorrectPosition
                              ? 'bg-emerald-500 text-white'
                              : 'bg-rose-500 text-white'
                          }`}>
                            {event.yearDisplay}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-normal">
                        {event.description}
                      </p>
                    </div>

                    {/* Up / Down Controls */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        disabled={index === 0}
                        onClick={() => moveTimelineItem(index, 'up')}
                        title="Переместить вверх (раньше)"
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-amber-500 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-100 transition-colors"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={index === timelineOrder.length - 1}
                        onClick={() => moveTimelineItem(index, 'down')}
                        title="Переместить вниз (позже)"
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-amber-500 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-100 transition-colors"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Check Button & Outcome */}
            <div className="pt-2 flex flex-col items-center gap-3">
              <button
                onClick={checkTimelineOrder}
                className="px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold font-serif shadow-lg shadow-amber-500/25 transition-all hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Проверить хронологию
              </button>

              {timelineChecked && (
                <div className={`p-4 rounded-2xl w-full text-center text-xs font-serif leading-relaxed animate-fade-in border-2 ${
                  timelineIsCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 border-emerald-500'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 border-rose-400'
                }`}>
                  <p className="font-bold text-sm mb-1">
                    {timelineIsCorrect
                      ? '🎉 Идеально! Вы абсолютно точно расставили исторические события во времени!'
                      : 'Пока есть ошибки в порядке событий. Внимательно посмотрите на подсказки и поменяйте карточки местами!'}
                  </p>
                  {timelineIsCorrect && (
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                      Вам начислено +40 баллов и открыто звание Летописца Самарского Заволжья.
                    </p>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
