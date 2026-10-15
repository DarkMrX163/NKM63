import React from 'react';
import { Volume2, Music, Wind, Bell, Flame, Landmark, Play, Pause, Radio, Mic, Waves, Check } from 'lucide-react';
import { soundFx, AmbientTrack } from '../utils/audio';

interface AtmosphericAudioWidgetProps {
  className?: string;
}

export const AtmosphericAudioWidget: React.FC<AtmosphericAudioWidgetProps> = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTrack, setCurrentTrack] = React.useState<AmbientTrack>(() => {
    try {
      const saved = localStorage.getItem('quiz_ambient_track');
      if (saved && ['windmill', 'bells', 'oil', 'hall', 'river'].includes(saved)) {
        return saved as AmbientTrack;
      }
    } catch {}
    return 'windmill';
  });

  const [volume, setVolume] = React.useState(() => {
    try {
      const saved = localStorage.getItem('quiz_ambient_volume');
      if (saved !== null) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val >= 0 && val <= 1) return val;
      }
    } catch {}
    return 0.45;
  });

  const [isExpanded, setIsExpanded] = React.useState(false);
  const widgetRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Sync volume on mount
  React.useEffect(() => {
    soundFx.setAmbientVolume(volume);
  }, [volume]);

  const tracks: Array<{ id: AmbientTrack; label: string; sub: string; icon: React.ElementType; tag: string }> = [
    {
      id: 'windmill',
      label: 'Мельница в Бариновке',
      sub: 'Шёпот степного ветра, шелест трав и скрип крыльев 1848 г.',
      icon: Wind,
      tag: 'Степь и ветер'
    },
    {
      id: 'bells',
      label: 'Благовест Утёвки',
      sub: 'Торжественный колокольный перезвон Троицкого храма',
      icon: Bell,
      tag: 'Храм и колокола'
    },
    {
      id: 'oil',
      label: 'Нефтяной промысел',
      sub: 'Чёткий ритм станка-качалки СКД и дыхание недр',
      icon: Flame,
      tag: 'Индустрия'
    },
    {
      id: 'hall',
      label: 'Залы музея',
      sub: 'Акустика музейных залов и старинная музыкальная шкатулка',
      icon: Landmark,
      tag: 'Музей'
    },
    {
      id: 'river',
      label: 'Река Самара и волны',
      sub: 'Плеск речной волны у песчаного берега и речной бриз',
      icon: Waves,
      tag: 'Природа'
    }
  ];

  const handleTogglePlay = () => {
    soundFx.playClick();
    if (isPlaying) {
      soundFx.stopAmbient();
      setIsPlaying(false);
    } else {
      soundFx.setAmbientVolume(volume);
      soundFx.startAmbient(currentTrack);
      setIsPlaying(true);
      try {
        localStorage.setItem('quiz_ambient_track', currentTrack);
      } catch {}
    }
  };

  const handleSelectTrack = (trackId: AmbientTrack) => {
    soundFx.playClick();
    setCurrentTrack(trackId);
    try {
      localStorage.setItem('quiz_ambient_track', trackId);
    } catch {}

    // Immediately start playing the selected track clearly
    soundFx.setAmbientVolume(volume);
    soundFx.startAmbient(trackId);
    setIsPlaying(true);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundFx.setAmbientVolume(newVol);
    try {
      localStorage.setItem('quiz_ambient_volume', String(newVol));
    } catch {}
  };

  const activeTrackObj = tracks.find((t) => t.id === currentTrack) || tracks[0];

  return (
    <div ref={widgetRef} className={`relative ${className}`}>
      {/* Trigger pill */}
      <div className="flex items-center gap-1 sm:gap-1.5 bg-white/10 dark:bg-slate-800/20 backdrop-blur-xs px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border border-white/20 dark:border-white/10 shadow-xs">
        <button
          onClick={handleTogglePlay}
          title={isPlaying ? `Остановить: ${activeTrackObj.label}` : `Включить звук: ${activeTrackObj.label}`}
          className={`p-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all ${
            isPlaying
              ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/40'
              : 'text-slate-700 dark:text-slate-200 hover:bg-white/20'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              {/* Animated Sound Wave Equalizer Bars */}
              <span className="flex items-end gap-0.5 h-3 px-0.5">
                <span className="w-0.5 h-full bg-white animate-pulse" />
                <span className="w-0.5 h-2 bg-white animate-pulse delay-75" />
                <span className="w-0.5 h-3 bg-white animate-pulse delay-150" />
              </span>
            </>
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline text-[11px]">
            {isPlaying ? activeTrackObj.label.split(' ')[0] : 'Атмосфера'}
          </span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            setIsExpanded(!isExpanded);
          }}
          title="Выбрать атмосферный звук (колокола, мельница, нефть, музей, река)"
          className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
            isExpanded
              ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200'
              : 'text-slate-700 dark:text-slate-200 hover:bg-white/20'
          }`}
        >
          <Music className={`w-3.5 h-3.5 text-amber-500 ${isPlaying ? 'animate-bounce' : ''}`} />
          <span className="text-[10px] hidden md:inline font-mono">
            {activeTrackObj.tag}
          </span>
        </button>
      </div>

      {/* Expanded dropdown menu */}
      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-2xl z-50 text-slate-900 dark:text-slate-100 animate-scale-up">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Radio className={`w-4 h-4 text-amber-500 ${isPlaying ? 'animate-spin' : ''}`} />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider font-serif">
                  Атмосферное погружение
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Кликните на звук — он сразу заиграет
                </p>
              </div>
            </div>
            {isPlaying && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Играет
              </span>
            )}
          </div>

          <div className="space-y-2 mb-4">
            {tracks.map((t) => {
              const Icon = t.icon;
              const isSelected = currentTrack === t.id;
              const isCurrentlyPlayingThis = isSelected && isPlaying;

              return (
                <div
                  key={t.id}
                  onClick={() => handleSelectTrack(t.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectTrack(t.id);
                    }
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center gap-3 transition-all cursor-pointer group select-none border ${
                    isSelected
                      ? 'bg-amber-500/15 dark:bg-amber-400/15 border-amber-500/50 text-amber-950 dark:text-amber-100 shadow-sm'
                      : 'border-slate-200/50 dark:border-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {/* Icon or Play/Pause indicator */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      isCurrentlyPlayingThis
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/40'
                        : isSelected
                        ? 'bg-amber-500/30 text-amber-900 dark:text-amber-200'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-amber-500'
                    }`}
                  >
                    {isCurrentlyPlayingThis ? (
                      <Pause className="w-4 h-4 fill-white" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>

                  {/* Text labels */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold leading-tight truncate">{t.label}</p>
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 bg-slate-200/70 dark:bg-slate-800 rounded font-semibold text-slate-600 dark:text-slate-400">
                        {t.tag}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-1 mt-0.5">
                      {t.sub}
                    </p>
                  </div>

                  {/* Visualizer animation or Check indicator */}
                  {isCurrentlyPlayingThis ? (
                    <div className="flex items-end gap-0.5 h-4 px-1 shrink-0">
                      <div className="w-1 h-3 bg-amber-500 rounded-full animate-bounce" />
                      <div className="w-1 h-4 bg-amber-600 rounded-full animate-bounce delay-100" />
                      <div className="w-1 h-2 bg-amber-500 rounded-full animate-bounce delay-200" />
                    </div>
                  ) : isSelected ? (
                    <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Volume slider */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                Громкость атмосферы
              </span>
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <span className="flex items-center gap-1">
              <Mic className="w-3 h-3 text-amber-500" />
              Озвучка доступна в карточках викторины
            </span>
            <div className="flex items-center gap-2">
              {isPlaying && (
                <button
                  onClick={() => {
                    soundFx.stopAmbient();
                    setIsPlaying(false);
                  }}
                  className="text-red-500 hover:underline font-bold"
                >
                  Остановить
                </button>
              )}
              <button
                onClick={() => setIsExpanded(false)}
                className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

