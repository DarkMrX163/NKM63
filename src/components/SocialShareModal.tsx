import React from 'react';
import { Award, Share2, Copy, Check, X, Printer, ShieldCheck, MapPin, User, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface SocialShareModalProps {
  playerName: string;
  playerLocation?: string;
  score: number;
  accuracy: number;
  levelTitle: string;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  playerName,
  playerLocation,
  score,
  accuracy,
  levelTitle,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);

  // Dynamic nomination name based on levelTitle
  const nominationName = React.useMemo(() => {
    if (levelTitle.includes('Юный')) return '«Юный Краевед»';
    if (levelTitle.includes('Знаток')) return '«Знаток Нефтегорского Края»';
    if (levelTitle.includes('Хранитель')) return '«Хранитель Истории и Культуры»';
    if (levelTitle.includes('Блиц')) return '«Блиц-Эрудит Краеведения»';
    return '«Краеведческий Исследователь»';
  }, [levelTitle]);

  const certificateCode = React.useMemo(() => {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    return `МБУ-НКМ/2026-${randomCode}`;
  }, []);

  const locationText = playerLocation ? ` (${playerLocation})` : '';
  const shareText = `📜 Мой Сертификат от МБУ «Нефтегорский краеведческий музей»! Я, ${playerName}${locationText}, принял(а) участие в онлайн-викторине в номинации ${nominationName} и набрал(а) ${score} очков. Проверь свои знания на nkm63.ru!`;

  const handleCopy = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  const handleShareVk = () => {
    soundFx.playClick();
    const url = `https://vk.com/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('Сертификат Нефтегорского Краеведческого Музея')}&comment=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleShareTelegram = () => {
    soundFx.playClick();
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleShareWhatsapp = () => {
    soundFx.playClick();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 max-w-3xl w-full border-2 border-amber-600/40 shadow-2xl relative my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* PRINTABLE LIGHT/BRIGHT MUSEUM CERTIFICATE */}
        <div 
          id="printable-certificate"
          className="bg-[#FAF8F0] p-6 sm:p-10 rounded-2xl certificate-frame text-slate-900 shadow-2xl relative overflow-hidden mb-6 border-8 border-[#A37B28]"
        >
          
          {/* Light Ornamental Header & Content Stack */}
          <div className="relative z-10 text-center space-y-3">
            
            {/* Top Authority Header */}
            <div className="border-b-2 border-amber-800/20 pb-2">
              <p className="text-xs sm:text-sm font-black font-serif tracking-widest text-[#3B0E17] uppercase">
                МБУ «НЕФТЕГОРСКИЙ КРАЕВЕДЧЕСКИЙ МУЗЕЙ»
              </p>
              <p className="text-[10px] text-amber-900/70 uppercase tracking-widest font-sans font-bold">
                Официальный сертификат онлайн-викторины
              </p>
            </div>

            {/* Central Grand Ribbon Banner Header */}
            <div className="py-2">
              <div className="museum-ribbon px-8 py-2.5 rounded-xl inline-block shadow-lg border-2 border-[#8A6113]">
                <h2 className="text-2xl sm:text-4xl font-black font-serif-display tracking-widest text-[#3B0E17] uppercase">
                  СЕРТИФИКАТ
                </h2>
              </div>
            </div>

            {/* Certification Subtext */}
            <p className="text-xs sm:text-sm font-black font-serif uppercase tracking-wider text-[#3B0E17] my-1">
              НАСТОЯЩИЙ СЕРТИФИКАТ ПОДТВЕРЖДАЕТ, ЧТО
            </p>

            {/* Participant Name & Settlement Box / Cartouche */}
            <div className="max-w-lg mx-auto my-3 py-3 px-6 rounded-2xl bg-white border-2 border-[#A37B28]/60 shadow-md">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-garamond text-[#3B0E17] italic">
                {playerName || 'Имя Фамилия Отчество'}
              </h3>

              {playerLocation && (
                <div className="mt-1 flex items-center justify-center gap-1 text-xs font-bold text-amber-900 font-serif">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>Населенный пункт: <strong>{playerLocation}</strong></span>
                </div>
              )}
            </div>

            {/* Participation Text with DYNAMIC NOMINATION */}
            <div className="space-y-1.5 py-1">
              <p className="text-sm sm:text-base font-serif font-bold text-[#3B0E17]">
                принял(а) активное участие в онлайн-викторине
              </p>
              
              {/* Dynamic Nomination Tag */}
              <div className="inline-block my-1 px-5 py-1.5 rounded-xl bg-amber-100/90 border-2 border-[#8A6113] text-[#3B0E17] font-black text-sm sm:text-base font-serif shadow-sm">
                в номинации {nominationName}
              </div>

              <p className="text-xs sm:text-sm font-serif font-bold text-amber-950 leading-relaxed max-w-xl mx-auto">
                и показал(а) отличные знания истории, культуры, географии и памятных мест Нефтегорского края
              </p>
            </div>

            {/* Score & Accuracy Badges */}
            <div className="flex items-center justify-center gap-8 my-2 pt-3 border-t border-amber-800/20 max-w-sm mx-auto">
              <div>
                <p className="text-[10px] font-bold uppercase text-amber-900/80">Набранные баллы</p>
                <p className="text-2xl font-black text-[#3B0E17]">{score} б.</p>
              </div>
              <div className="h-8 w-px bg-amber-800/30" />
              <div>
                <p className="text-[10px] font-bold uppercase text-amber-900/80">Точность ответов</p>
                <p className="text-2xl font-black text-emerald-800">{accuracy}%</p>
              </div>
            </div>

            {/* Footer with Blue Circular Official Museum Stamp & City */}
            <div className="pt-4 border-t-2 border-amber-800/30 flex items-center justify-between text-left text-xs font-serif text-[#3B0E17]">
              
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-amber-900/70">Рег. код документа:</p>
                <p className="font-mono text-xs font-black text-[#3B0E17]">{certificateCode}</p>
                <p className="text-[10px] text-amber-900/70 font-sans">{new Date().toLocaleDateString('ru-RU')}</p>
              </div>

              {/* Blue Official Museum Stamp */}
              <div className="relative flex items-center justify-center shrink-0 mx-2">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-dashed border-blue-700 bg-blue-50/90 text-blue-900 flex flex-col items-center justify-center p-1 text-center font-sans shadow-md transform -rotate-6">
                  <div className="w-full h-full rounded-full border border-blue-600 p-1 flex flex-col items-center justify-center">
                    <p className="text-[6px] font-black uppercase text-blue-800 leading-tight">
                      МУНИЦИПАЛЬНОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ
                    </p>
                    <p className="text-[7px] font-black uppercase text-blue-900 my-0.5 border-y border-blue-500/50 py-0.5">
                      МБУ «Нефтегорский краеведческий музей»
                    </p>
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="font-extrabold text-sm text-[#3B0E17]">г. Нефтегорск</p>
              </div>

            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              Распечатать / Сохранить Сертификат (PDF)
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Скопировано!' : 'Скопировать текст'}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-bold uppercase text-slate-400 text-center mb-2">
              Поделиться результатом с друзьями:
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleShareVk}
                className="py-2.5 px-3 rounded-xl bg-[#0077FF] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-[#0066DD] transition-colors"
              >
                ВКонтакте
              </button>
              <button
                onClick={handleShareTelegram}
                className="py-2.5 px-3 rounded-xl bg-[#229ED9] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-[#1D8CBF] transition-colors"
              >
                Telegram
              </button>
              <button
                onClick={handleShareWhatsapp}
                className="py-2.5 px-3 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-[#20BD5A] transition-colors"
              >
                WhatsApp
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
