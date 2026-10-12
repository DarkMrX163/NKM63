import React from 'react';
import { Camera, Search, Sparkles, CheckCircle2 } from 'lucide-react';

interface ExhibitIllustrationProps {
  type: string;
  imageUrl?: string;
  imageSource?: string;
  zoomScale?: number;
  zoomX?: number;
  zoomY?: number;
  isRevealed?: boolean;
  className?: string;
}

const EXHIBIT_IMAGE_MAP: Record<string, { src: string; alt: string; sourceText: string }> = {
  windmill: {
    src: '/images/exhibits/windmill.jpg',
    alt: 'Бариновская ветряная мельница (1848 г.)',
    sourceText: 'Реальное фото: с. Бариновка, Нефтегорский район'
  },
  iron: {
    src: '/images/exhibits/iron.jpg',
    alt: 'Старинный чугунный угольный утюг',
    sourceText: 'Реальное фото: Музейный фонд Поволжья'
  },
  oilpump: {
    src: '/images/exhibits/oilpump.jpg',
    alt: 'Станок-качалка нефтяников',
    sourceText: 'Реальное фото: Нефтепромысел Заволжья'
  },
  icon: {
    src: '/images/exhibits/icon.jpg',
    alt: 'Старинная русская икона конца XIX века',
    sourceText: 'Реальное фото: Сакральное искусство'
  },
  samovar: {
    src: '/images/exhibits/samovar.jpg',
    alt: 'Жаровой медный самовар с медалями',
    sourceText: 'Реальное фото: Экспонат музея купеческого быта'
  },
  spinning_wheel: {
    src: '/images/exhibits/spinning_wheel.jpg',
    alt: 'Деревянная резная прялка с солярным узором',
    sourceText: 'Реальное фото: Музей этнографии'
  },
  arrowhead: {
    src: '/images/exhibits/arrowhead.jpg',
    alt: 'Сарматские бронзовые наконечники стрел',
    sourceText: 'Реальное фото: Археологический фонд'
  },
  ammonite: {
    src: '/images/exhibits/ammonite.jpg',
    alt: 'Окаменелость раковины аммонита с перламутром',
    sourceText: 'Реальное фото: Палеонтологическая коллекция'
  },
  pottery: {
    src: '/images/exhibits/pottery.jpg',
    alt: 'Глиняная гончарная крынка для молока',
    sourceText: 'Реальное фото: Традиционная керамика'
  },
  lamp: {
    src: '/images/exhibits/lamp.jpg',
    alt: 'Керосиновая лампа «Летучая мышь»',
    sourceText: 'Реальное фото: Светильник первопроходцев-буровиков'
  }
};

export const ExhibitIllustration: React.FC<ExhibitIllustrationProps> = ({
  type,
  imageUrl,
  imageSource,
  zoomScale = 1,
  zoomX = 50,
  zoomY = 50,
  isRevealed = false,
  className = ''
}) => {
  const itemInfo = EXHIBIT_IMAGE_MAP[type] || {
    src: imageUrl || `/images/exhibits/${type}.jpg`,
    alt: 'Музейный экспонат',
    sourceText: 'Реальное архивное фото'
  };

  const imageSrc = imageUrl || itemInfo.src;
  const sourceLabel = imageSource || itemInfo.sourceText;

  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [loadError, setLoadError] = React.useState(false);

  // Reset load state when type or url changes
  React.useEffect(() => {
    setImageLoaded(false);
    setLoadError(false);
  }, [type, imageSrc]);

  // Transform style for zooming on the focal point
  const transformStyle: React.CSSProperties = {
    transform: `scale(${zoomScale})`,
    transformOrigin: `${zoomX}% ${zoomY}%`,
    transition: 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)'
  };

  const isZoomed = zoomScale > 1.2 && !isRevealed;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-neutral-900 border-2 border-amber-600/40 shadow-2xl select-none group ${className}`}
    >
      {/* Background radial atmosphere & vintage texture */}
      <div className="absolute inset-0 bg-radial from-neutral-800/80 via-neutral-900 to-black pointer-events-none z-0" />

      {/* Loading Skeleton */}
      {!imageLoaded && !loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/90 z-20">
          <div className="w-10 h-10 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-3" />
          <span className="text-xs font-semibold text-amber-300/80 tracking-wide">
            Загрузка подлинного фото...
          </span>
        </div>
      )}

      {/* Real Museum Photograph */}
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <img
          src={imageSrc}
          alt={itemInfo.alt}
          onLoad={() => setImageLoaded(true)}
          onError={() => setLoadError(true)}
          style={transformStyle}
          className={`w-full h-full object-cover sm:object-contain transition-opacity duration-500 will-change-transform ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="eager"
        />
      </div>

      {/* Loupe Optics Overlay (Visible when zoomed in during discovery mode) */}
      {isZoomed && (
        <div className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300">
          {/* Vignette shadow to focus gaze on the center */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.65)_85%,rgba(0,0,0,0.9)_100%)]" />

          {/* Optical Glass Lens Ring in the Center */}
          <div className="absolute inset-6 rounded-2xl border border-amber-500/30 shadow-[inset_0_0_30px_rgba(245,158,11,0.15)] flex items-center justify-center">
            {/* Center Crosshair Target */}
            <div className="relative w-8 h-8 opacity-60">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-amber-400 -translate-y-1/2" />
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-amber-400 -translate-x-1/2" />
              <div className="absolute inset-1.5 rounded-full border border-amber-400" />
            </div>

            {/* Corner Optics Reticle Marks */}
            <div className="absolute top-2 left-2 text-[10px] font-mono text-amber-400/70">
              [MACRO ×{zoomScale.toFixed(1)}]
            </div>
            <div className="absolute top-2 right-2 text-[10px] font-mono text-amber-400/70 flex items-center gap-1">
              <Search className="w-3 h-3" />
              ФОКУС
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-400/70">
              ФРАГМЕНТ
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-amber-400/70">
              МБУ НКМ
            </div>
          </div>
        </div>
      )}

      {/* Top Banner: Authentic Photo Indicator Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-md">
        <Camera className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[11px] font-bold tracking-wide">
          Реальное музейное фото
        </span>
      </div>

      {/* Zoom Scale Pill Indicator */}
      <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-amber-500/90 text-white backdrop-blur-md shadow-md text-[11px] font-bold flex items-center gap-1">
        <Sparkles className="w-3 h-3" />
        {zoomScale > 1.0 ? `Увеличение ×${zoomScale.toFixed(1)}` : 'Полный обзор'}
      </div>

      {/* Bottom Bar: Museum Credit / Caption (Always authentic) */}
      <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-6 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] text-amber-300 font-semibold tracking-wider uppercase truncate">
            {sourceLabel}
          </p>
          <p className="text-xs text-white/90 font-medium truncate">
            {isRevealed ? itemInfo.alt : 'Изучите текстуру, материал и детали экспоната'}
          </p>
        </div>

        {isRevealed && (
          <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Определен!
          </div>
        )}
      </div>
    </div>
  );
};
