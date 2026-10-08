import React from 'react';
import { User, MapPin, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface RegistrationModalProps {
  initialName: string;
  initialLocation: string;
  onSave: (fullName: string, location: string) => void;
  onCancel?: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  initialName,
  initialLocation,
  onSave,
  onCancel
}) => {
  const [fullName, setFullName] = React.useState(initialName || '');
  const [location, setLocation] = React.useState(initialLocation || '');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Пожалуйста, введите ваше имя и отчество');
      return;
    }
    if (!location.trim()) {
      setError('Пожалуйста, введите ваш населенный пункт');
      return;
    }

    soundFx.playClick();
    onSave(fullName.trim(), location.trim());
  };

  const presetLocations = [
    'г. Нефтегорск',
    'с. Утёвка',
    'с. Бариновка',
    'с. Кулешовка',
    'с. Семеновка',
    'г. Самара'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-amber-600/40 shadow-2xl relative my-6 animate-scale-up">
        
        {/* Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-400/40 shadow-sm">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-serif text-slate-900 dark:text-amber-100">
            Регистрация Участника
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Введите ваши данные для внесения в Книгу участников и оформления именного музейного Сертификата!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name / Name and Patronymic */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-600" />
              Имя и Отчество (или ФИО):
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Например: Иван Иванович"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
              required
            />
          </div>

          {/* Settlement / City */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-600" />
              Населенный пункт (Город / Село):
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (error) setError('');
              }}
              placeholder="Например: г. Нефтегорск"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
              required
            />

            {/* Quick preset locations */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 self-center">Быстрый выбор:</span>
              {presetLocations.map((loc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setLocation(loc);
                    if (error) setError('');
                  }}
                  className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 hover:bg-amber-100 transition-colors"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/50 p-2.5 rounded-xl border border-red-200 dark:border-red-800 text-center">
              {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Отмена
              </button>
            )}
            
            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-5 h-5" />
              Подтвердить и начать
            </button>
          </div>

          {/* Quick guest play */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onSave('Краевед-Гость', 'Нефтегорский район');
              }}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 underline underline-offset-4 font-semibold transition-colors cursor-pointer"
            >
              Быстрый старт без ввода данных (играть как Гость)
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
