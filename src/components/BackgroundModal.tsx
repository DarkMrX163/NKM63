import React from 'react';
import { X, Image, Upload, RotateCcw, Check, Sparkles, Sliders, Link, Eye } from 'lucide-react';
import { soundFx } from '../utils/audio';

export interface BackgroundSettings {
  type: 'default' | 'preset' | 'custom';
  url: string;
  name: string;
  overlayOpacity: number; // 0 to 90
  blur: number; // 0 to 10
}

export const PRESET_BACKGROUNDS = [
  {
    id: 'default',
    name: 'По умолчанию (Нейтральный)',
    url: '',
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=200&q=60',
    description: 'Стандартный минималистичный фон викторины'
  },
  {
    id: 'parchment',
    name: 'Музейный пергамент',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=200&q=60',
    description: 'Старинная фактура бумаги и музейных архивов'
  },
  {
    id: 'barinovka',
    name: 'Бариновская мельница и поле',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=200&q=60',
    description: 'Золотые колосья и ветряная мельница Поволжья'
  },
  {
    id: 'utevka_church',
    name: 'Утёвка и храм Троицы',
    url: 'https://images.unsplash.com/photo-1548625361-195fe57876a3?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1548625361-195fe57876a3?auto=format&fit=crop&w=200&q=60',
    description: 'Троицкий храм, расписанный Григорием Журавлёвым'
  },
  {
    id: 'samara_river',
    name: 'Река Самара и степные дали',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=200&q=60',
    description: 'Живописная пойма заволжских степей и речные заводи'
  },
  {
    id: 'neftegorsk_night',
    name: 'Вечерний Нефтегорск и огни',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=60',
    description: 'Огни города нефтяников под звездным небом'
  },
  {
    id: 'steppes',
    name: 'Золотая заволжская степь',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=200&q=60',
    description: 'Бескрайние степные просторы Самарского края'
  }
];

export const DEFAULT_BG_SETTINGS: BackgroundSettings = {
  type: 'default',
  url: '',
  name: 'По умолчанию',
  overlayOpacity: 40,
  blur: 2
};

interface BackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: BackgroundSettings;
  onSave: (settings: BackgroundSettings) => void;
}

export const BackgroundModal: React.FC<BackgroundModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSave
}) => {
  const [selectedType, setSelectedType] = React.useState<BackgroundSettings['type']>(currentSettings.type);
  const [selectedUrl, setSelectedUrl] = React.useState(currentSettings.url);
  const [selectedName, setSelectedName] = React.useState(currentSettings.name);
  const [overlayOpacity, setOverlayOpacity] = React.useState(currentSettings.overlayOpacity);
  const [blur, setBlur] = React.useState(currentSettings.blur);
  const [customUrlInput, setCustomUrlInput] = React.useState('');
  const [fileError, setFileError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setSelectedType(currentSettings.type);
    setSelectedUrl(currentSettings.url);
    setSelectedName(currentSettings.name);
    setOverlayOpacity(currentSettings.overlayOpacity);
    setBlur(currentSettings.blur);
  }, [currentSettings, isOpen]);

  if (!isOpen) return null;

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Пожалуйста, выберите файл изображения (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError('Размер файла превышает 5 МБ. Рекомендуем файл меньшего размера.');
      return;
    }

    setFileError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSelectedType('custom');
      setSelectedUrl(result);
      setSelectedName(`Своё фото: ${file.name}`);
      soundFx.playClick();
    };
    reader.readAsDataURL(file);
  };

  // Handle URL submit
  const handleApplyUrl = () => {
    if (!customUrlInput.trim()) return;
    setSelectedType('custom');
    setSelectedUrl(customUrlInput.trim());
    setSelectedName('Картинка по ссылке');
    setCustomUrlInput('');
    soundFx.playClick();
  };

  const handleSave = () => {
    soundFx.playFanfare();
    onSave({
      type: selectedType,
      url: selectedUrl,
      name: selectedName,
      overlayOpacity,
      blur
    });
    onClose();
  };

  const handleReset = () => {
    soundFx.playClick();
    setSelectedType('default');
    setSelectedUrl('');
    setSelectedName('По умолчанию');
    setOverlayOpacity(40);
    setBlur(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                Настройка фона викторины
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Загрузите своё фото или выберите исторический пейзаж Нефтегорского края
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Section 1: Presets Gallery */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Коллекция краеведческих фонов
              </label>
              <span className="text-[11px] text-slate-400">
                Текущий: <span className="font-semibold text-amber-600 dark:text-amber-400">{selectedName}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESET_BACKGROUNDS.map((preset) => {
                const isSelected =
                  (preset.id === 'default' && selectedType === 'default') ||
                  (selectedType !== 'default' && selectedUrl === preset.url);

                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      soundFx.playClick();
                      if (preset.id === 'default') {
                        setSelectedType('default');
                        setSelectedUrl('');
                        setSelectedName('По умолчанию');
                      } else {
                        setSelectedType('preset');
                        setSelectedUrl(preset.url);
                        setSelectedName(preset.name);
                      }
                    }}
                    className={`relative group rounded-2xl overflow-hidden border-2 text-left p-2 transition-all ${
                      isSelected
                        ? 'border-amber-500 shadow-md shadow-amber-500/20 bg-amber-50 dark:bg-amber-950/40'
                        : 'border-slate-200 dark:border-slate-800 hover:border-amber-400/50 bg-slate-50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="relative h-20 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 mb-2">
                      <img
                        src={preset.thumbnail}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {preset.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {preset.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Upload Own Image */}
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800/60 border border-amber-200/80 dark:border-slate-700/80 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-amber-500" />
              Загрузить собственное фото с устройства
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Вы можете загрузить любое фото из краеведческого музея, села, школы или личного архива (до 5 МБ). Оно сохранится в вашем браузере.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-colors shadow-md shadow-amber-500/20">
                <Upload className="w-4 h-4" />
                Выбрать файл на компьютере / телефоне
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {selectedType === 'custom' && selectedUrl.startsWith('data:') && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Фото загружено
                </span>
              )}
            </div>
            {fileError && <p className="text-xs text-red-500">{fileError}</p>}
          </div>

          {/* Section 3: Custom URL input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-amber-500" />
              Или вставьте прямую ссылку на картинку в Интернете
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleApplyUrl}
                disabled={!customUrlInput.trim()}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 disabled:opacity-40 transition-colors"
              >
                Применить
              </button>
            </div>
          </div>

          {/* Section 4: Overlay & Blur Adjustments */}
          {selectedType !== 'default' && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-500" />
                  Удобство чтения (затемнение и размытие)
                </span>
                <span className="text-[11px] text-slate-400">
                  Гарантирует четкую читаемость текста вопросов
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Затемнение фона:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{overlayOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Размытие (блюр):</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{blur} px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    value={blur}
                    onChange={(e) => setBlur(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Сбросить фон
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all"
            >
              <Check className="w-4 h-4" />
              Применить фон
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
