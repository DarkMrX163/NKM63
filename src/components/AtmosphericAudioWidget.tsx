import React from 'react';
import { Volume2, VolumeX, Music, Wind, Bell, Flame, Landmark, Play, Pause, Radio, Mic } from 'lucide-react';
import { soundFx, AmbientTrack } from '../utils/audio';

interface AtmosphericAudioWidgetProps {
  className?: string;
}

export const AtmosphericAudioWidget: React.FC<AtmosphericAudioWidgetProps> = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTrack, setCurrentTrack] = React.useState<AmbientTrack>('windmill');
  const [volume, setVolume] = React.useState(0.35);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const tracks: Array<{ id: AmbientTrack; label: string; sub: string; icon: React.ElementType }> = [
    {
      id: 'windmill',
      label: 'Мельница в Бариновке',
      sub: 'Шёпот степного ветра и шелест трав',
      icon: Wind
    },
    {
      id: 'bells',
      label: 'Благовест Утёвки',
      sub: 'Перезвон колоколов Троицкого храма',
      icon: Bell
    },
    {
      id: 'oil',
      label: 'Нефтяной промысел',
      sub: 'Пульс станка-качалки в степи',
      icon: Flame
    },
    {
      id: 'hall',
      label: 'Залы музея',
      sub: 'Акустика музейной тишины',
      icon: Landmark
    }
  ];

  const handleTogglePlay = () => {
    soundFx.playClick();
    if (isPlaying) {
      soundFx.stopAmbient();
      setIsPlaying(false);
    } else {
      soundFx.startAmbient(currentTrack);
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (trackId: AmbientTrack) => {
    soundFx.playClick();
    setCurrentTrack(trackId);
    if (isPlaying) {
      soundFx.startAmbient(trackId);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundFx.setAmbientVolume(newVol);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger pill */}
      <div className="flex items-center gap-1.5 bg-white/10 dark:bg-slate-800/20 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-white/20 dark:border-white/10 shadow-xs">
        <button
          onClick={handleTogglePlay}
          title={isPlaying ? 'Остановить фоновый звук' : 'Включить атмосферный звук'}
          className={`p-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all ${
            isPlaying
              ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30 animate-pulse'
              : 'text-slate-700 dark:text-slate-200 hover:bg-white/20'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline text-[11px]">
            {isPlaying ? 'Атмосфера: вкл' : 'Звуковой фон'}
          </span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            setIsExpanded(!isExpanded);
          }}
          title="Настройка звукового фона"
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white/20 text-xs flex items-center gap-1"
        >
          <Music className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[10px] hidden md:inline font-mono">
            {tracks.find((t) => t.id === currentTrack)?.label.split(' ')[0]}
          </span>
        </button>
      </div>

      {/* Expanded dropdown menu */}
      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-2xl z-50 text-slate-900 dark:text-slate-100 animate-scale-up">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-500 animate-spin" />
              <h4 className="text-xs font-black uppercase tracking-wider font-serif">
                Атмосферное погружение
              </h4>
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">
              Web Audio
            </span>
          </div>

          <div className="space-y-1.5 mb-4">
            {tracks.map((t) => {
              const Icon = t.icon;
              const isSelected = currentTrack === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTrack(t.id)}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 dark:bg-amber-400/15 border border-amber-500/40 text-amber-950 dark:text-amber-200 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-none font-bold truncate">{t.label}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-1">
                      {t.sub}
                    </p>
                  </div>
                  {isSelected && isPlaying && (
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Volume slider */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <span className="text-[10px] font-mono text-slate-500 w-8 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <span className="flex items-center gap-1">
              <Mic className="w-3 h-3 text-amber-500" />
              Озвучка доступна в карточках вопросов
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
