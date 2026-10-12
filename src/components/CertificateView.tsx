import React from 'react';
import { 
  Download, 
  Printer, 
  Share2, 
  Check, 
  Copy, 
  Sparkles, 
  Award, 
  MapPin, 
  User, 
  Palette, 
  ShieldCheck, 
  Landmark, 
  Calendar,
  FileCheck2,
  RefreshCw
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface CertificateViewProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  playerLocation: string;
  setPlayerLocation: (loc: string) => void;
  totalScore: number;
  unlockedExhibitsCount?: number;
}

export type CertificateTheme = 'gold' | 'sepia' | 'burgundy' | 'azure';

export const CertificateView: React.FC<CertificateViewProps> = ({
  playerName,
  setPlayerName,
  playerLocation,
  setPlayerLocation,
  totalScore,
  unlockedExhibitsCount = 0
}) => {
  const [theme, setTheme] = React.useState<CertificateTheme>('gold');
  const [nomination, setNomination] = React.useState('«Знаток Нефтегорского края и Самарской области»');
  const [copied, setCopied] = React.useState(false);
  const [isGeneratingPng, setIsGeneratingPng] = React.useState(false);

  // Stable document registration number
  const [certCode] = React.useState(() => {
    const saved = localStorage.getItem('user_cert_code');
    if (saved) return saved;
    const code = `МБУ-НКМ/2026-${Math.floor(100000 + Math.random() * 900000)}`;
    localStorage.setItem('user_cert_code', code);
    return code;
  });

  const currentDateStr = React.useMemo(() => {
    return new Date().toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, []);

  const nominationPresets = [
    '«Знаток Нефтегорского края и Самарской области»',
    '«Юный исследователь истории Поволжья»',
    '«Хранитель традиций и Бариновской мельницы»',
    '«Мастер краеведческой эрудиции»',
    '«Первооткрыватель нефтяного края»'
  ];

  const locationPresets = [
    'г. Нефтегорск',
    'с. Бариновка',
    'с. Утёвка',
    'с. Съезжее',
    'с. Богдановка',
    'с. Кулешовка',
    'г. Самара'
  ];

  // Theme-specific styles for on-screen preview
  const themeStyles = {
    gold: {
      bg: 'bg-[#FAF7EE]',
      border: 'border-[#B8860B]',
      outerBorder: 'border-[#8A6113]',
      ribbonBg: 'from-[#EAD3A6] via-[#D4AF37] to-[#B8860B]',
      textColor: 'text-[#3B0E17]',
      accentColor: 'text-[#8A6113]'
    },
    sepia: {
      bg: 'bg-[#F5EFE0]',
      border: 'border-[#704214]',
      outerBorder: 'border-[#4A2C0D]',
      ribbonBg: 'from-[#D2B48C] via-[#A07855] to-[#704214]',
      textColor: 'text-[#2D1B0D]',
      accentColor: 'text-[#704214]'
    },
    burgundy: {
      bg: 'bg-[#FCF8F5]',
      border: 'border-[#8B0000]',
      outerBorder: 'border-[#5B0000]',
      ribbonBg: 'from-[#D9534F] via-[#9B111E] to-[#600000]',
      textColor: 'text-[#4A0007]',
      accentColor: 'text-[#8B0000]'
    },
    azure: {
      bg: 'bg-[#F2F8FA]',
      border: 'border-[#1E5670]',
      outerBorder: 'border-[#0F3547]',
      ribbonBg: 'from-[#8AC4D0] via-[#28799E] to-[#124E66]',
      textColor: 'text-[#0E2F3D]',
      accentColor: 'text-[#1E5670]'
    }
  }[theme];

  // Canvas-based High-Res PNG Generator (2400 x 1700 px)
  const downloadHighResPng = () => {
    soundFx.playClick();
    setIsGeneratingPng(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 2400;
      canvas.height = 1700;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;

      // 1. Background fill
      let bgColor = '#FAF7EE';
      let mainBorderColor = '#B8860B';
      let darkTextColor = '#3B0E17';
      let ribbonGradColors = ['#EAD3A6', '#D4AF37', '#B8860B'];

      if (theme === 'sepia') {
        bgColor = '#F5EFE0';
        mainBorderColor = '#704214';
        darkTextColor = '#2D1B0D';
        ribbonGradColors = ['#D2B48C', '#A07855', '#704214'];
      } else if (theme === 'burgundy') {
        bgColor = '#FCF8F5';
        mainBorderColor = '#8B0000';
        darkTextColor = '#4A0007';
        ribbonGradColors = ['#D9534F', '#9B111E', '#600000'];
      } else if (theme === 'azure') {
        bgColor = '#F2F8FA';
        mainBorderColor = '#1E5670';
        darkTextColor = '#0E2F3D';
        ribbonGradColors = ['#8AC4D0', '#28799E', '#124E66'];
      }

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);

      // Subtle parchment texture dots
      ctx.fillStyle = 'rgba(0, 0, 0, 0.015)';
      for (let x = 0; x < W; x += 18) {
        for (let y = 0; y < H; y += 18) {
          ctx.fillRect(x, y, 2, 2);
        }
      }

      // 2. Outer Ornate Border
      ctx.lineWidth = 18;
      ctx.strokeStyle = mainBorderColor;
      ctx.strokeRect(50, 50, W - 100, H - 100);

      // Thin inner line
      ctx.lineWidth = 3;
      ctx.strokeStyle = mainBorderColor;
      ctx.strokeRect(75, 75, W - 150, H - 150);

      // Inset gold double frame
      ctx.lineWidth = 6;
      ctx.strokeRect(95, 95, W - 190, H - 190);

      // 3. Corner Rosettes & Flourishes
      const drawCorner = (cx: number, cy: number) => {
        ctx.save();
        ctx.strokeStyle = mainBorderColor;
        ctx.fillStyle = mainBorderColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, 26, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      drawCorner(95, 95);
      drawCorner(W - 95, 95);
      drawCorner(95, H - 95);
      drawCorner(W - 95, H - 95);

      // 4. Header: Authority
      ctx.textAlign = 'center';
      ctx.fillStyle = darkTextColor;
      ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
      ctx.fillText('МУНИЦИПАЛЬНОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ', W / 2, 175);

      ctx.font = '900 48px "Playfair Display", Georgia, serif';
      ctx.fillText('«НЕФТЕГОРСКИЙ КРАЕВЕДЧЕСКИЙ МУЗЕЙ»', W / 2, 235);

      ctx.font = 'bold 26px sans-serif';
      ctx.fillStyle = mainBorderColor;
      ctx.fillText('САМАРСКАЯ ОБЛАСТЬ • ОФИЦИАЛЬНАЯ ОНЛАЙН-ВИКТОРИНА • NKM63.RU', W / 2, 280);

      // Horizontal separator line with center star
      ctx.lineWidth = 3;
      ctx.strokeStyle = mainBorderColor;
      ctx.beginPath();
      ctx.moveTo(350, 310);
      ctx.lineTo(W - 350, 310);
      ctx.stroke();

      // 5. Ribbon Banner: ДИПЛОМ
      const ribbonY = 345;
      const ribbonW = 860;
      const ribbonH = 110;
      const ribbonX = (W - ribbonW) / 2;

      const ribbonGrad = ctx.createLinearGradient(ribbonX, ribbonY, ribbonX, ribbonY + ribbonH);
      ribbonGrad.addColorStop(0, ribbonGradColors[0]);
      ribbonGrad.addColorStop(0.5, ribbonGradColors[1]);
      ribbonGrad.addColorStop(1, ribbonGradColors[2]);

      ctx.fillStyle = ribbonGrad;
      ctx.strokeStyle = '#3B0E17';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(ribbonX, ribbonY, ribbonW, ribbonH, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 68px "Playfair Display", Georgia, serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
      ctx.fillText('ДИПЛОМ ЗНАТОКА', W / 2, ribbonY + 78);
      ctx.shadowColor = 'transparent';

      // 6. Subtext: НАГРАЖДАЕТСЯ
      ctx.fillStyle = darkTextColor;
      ctx.font = 'bold 34px "Playfair Display", Georgia, serif';
      ctx.fillText('НАСТОЯЩИМ ДИПЛОМОМ НАГРАЖДАЕТСЯ', W / 2, 530);

      // 7. Participant Name Box
      const nameY = 580;
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = mainBorderColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(W / 2 - 650, nameY, 1300, 110, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = darkTextColor;
      ctx.font = 'italic bold 64px "Cormorant Garamond", Georgia, serif';
      const displayName = playerName.trim() || 'Участник онлайн-викторины';
      ctx.fillText(displayName, W / 2, nameY + 76);

      // Settlement
      const locText = playerLocation.trim() ? `Населенный пункт: ${playerLocation}` : 'Самарская область';
      ctx.font = 'bold 28px Georgia, serif';
      ctx.fillStyle = mainBorderColor;
      ctx.fillText(locText, W / 2, 735);

      // 8. Nomination Badge
      ctx.font = '900 42px "Playfair Display", Georgia, serif';
      ctx.fillStyle = darkTextColor;
      ctx.fillText(`в номинации ${nomination}`, W / 2, 810);

      // 9. Merits Description
      ctx.font = 'normal 32px Georgia, serif';
      ctx.fillStyle = '#4A301E';
      ctx.fillText('За отличные знания истории, культуры, выдающихся личностей и музейных реликвий', W / 2, 885);
      ctx.fillText('Нефтегорского района и Самарской области.', W / 2, 930);

      // 10. Achievements Table / Badges
      const statBoxY = 990;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.strokeStyle = mainBorderColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(W / 2 - 550, statBoxY, 1100, 130, 20);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#6B4A2F';
      ctx.fillText('НАБРАНО БАЛЛОВ', W / 2 - 320, statBoxY + 45);
      ctx.fillText('МУЗЕЙНЫХ ЭКСПОНАТОВ', W / 2, statBoxY + 45);
      ctx.fillText('СТАТУС ЭРУДИТА', W / 2 + 320, statBoxY + 45);

      ctx.font = '900 50px sans-serif';
      ctx.fillStyle = darkTextColor;
      ctx.fillText(`${totalScore} б.`, W / 2 - 320, statBoxY + 105);
      ctx.fillText(`${unlockedExhibitsCount} из 10`, W / 2, statBoxY + 105);
      ctx.fillStyle = '#15803D';
      ctx.fillText('ПОДТВЕРЖДЁН', W / 2 + 320, statBoxY + 105);

      // 11. Official Museum Circular Seal (Blue ink)
      const sealX = W / 2;
      const sealY = 1350;
      const sealR = 120;

      ctx.save();
      ctx.translate(sealX, sealY);
      ctx.rotate(-0.08); // Slight realistic tilt

      // Blue stamp background & rings
      ctx.strokeStyle = '#1D4ED8';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 0, sealR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, sealR - 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, sealR - 22, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#1D4ED8';
      ctx.font = '900 13px sans-serif';
      ctx.fillText('МУНИЦИПАЛЬНОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ', 0, -sealR + 42);
      ctx.font = '900 15px sans-serif';
      ctx.fillText('МБУ «НЕФТЕГОРСКИЙ КРАЕВЕДЧЕСКИЙ МУЗЕЙ»', 0, -10);
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('ОГРН 1026303241512 • САМАРСКАЯ ОБЛ.', 0, 15);
      ctx.fillText('★ ОФИЦИАЛЬНО ЗАВЕРЕНО ★', 0, sealR - 38);
      ctx.restore();

      // 12. Bottom Document Info (Left & Right)
      // Left: Date & Registration Number
      ctx.textAlign = 'left';
      ctx.fillStyle = darkTextColor;
      ctx.font = 'bold 26px Georgia, serif';
      ctx.fillText(`Рег. номер: ${certCode}`, 160, 1420);
      ctx.font = 'normal 24px Georgia, serif';
      ctx.fillText(`Дата выдачи: ${currentDateStr}`, 160, 1460);
      ctx.fillText('г. Нефтегорск, Самарская область', 160, 1500);

      // Right: Signature line & Seal info
      ctx.textAlign = 'right';
      ctx.font = 'bold 26px Georgia, serif';
      ctx.fillText('Директор музея:', W - 160, 1420);
      ctx.font = 'italic bold 32px "Cormorant Garamond", cursive, serif';
      ctx.fillStyle = '#1E3A8A';
      ctx.fillText('/ М.И. Польникова /', W - 160, 1465);
      ctx.font = 'normal 22px Georgia, serif';
      ctx.fillStyle = darkTextColor;
      ctx.fillText('М.П. (печать учреждения)', W - 160, 1500);

      // 13. Trigger instant download
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const safeName = displayName.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_');
      link.download = `diplom_neftegorsk_${safeName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export certificate canvas', err);
    } finally {
      setIsGeneratingPng(false);
    }
  };

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  const handleCopyText = () => {
    soundFx.playClick();
    const shareText = `📜 Мой именной диплом от МБУ «Нефтегорский краеведческий музей»! Я подтвердил(а) звание в номинации ${nomination} с результатом ${totalScore} баллов. Проверь свои знания истории Самарского края на nkm63.ru!`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-6 px-4 max-w-5xl mx-auto space-y-6 animate-fade-in">
      
      {/* Control & Customization Toolbar */}
      <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-white/20 dark:border-white/10 shadow-xl space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                Официальный документ музея
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-serif text-slate-900 dark:text-white">
                Именной диплом / Сертификат знатока
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Персонализируйте диплом, выберите стиль оформления и скачайте в высоком разрешении для портфолио или школы!
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={downloadHighResPng}
              disabled={isGeneratingPng}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPng ? 'Создание PNG...' : 'Скачать PNG (Высокое качество)'}
            </button>

            <button
              onClick={handlePrint}
              className="py-2.5 px-4 rounded-xl bg-white/20 dark:bg-slate-800/60 hover:bg-white/30 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center gap-2 border border-white/20 dark:border-white/10 transition-all"
            >
              <Printer className="w-4 h-4" />
              Распечатать / PDF
            </button>
          </div>
        </div>

        {/* Customization Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Participant Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-500" />
              ФИО / Имя участника:
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Введите ФИО или имя..."
              className="w-full bg-white/40 dark:bg-slate-800/50 backdrop-blur-sm border border-white/30 dark:border-white/10 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Location / Settlement */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              Населенный пункт:
            </label>
            <input
              type="text"
              value={playerLocation}
              onChange={(e) => setPlayerLocation(e.target.value)}
              placeholder="г. Нефтегорск, с. Бариновка..."
              className="w-full bg-white/40 dark:bg-slate-800/50 backdrop-blur-sm border border-white/30 dark:border-white/10 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1 pt-1">
              {locationPresets.slice(0, 4).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setPlayerLocation(loc)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/20 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-amber-500 hover:text-white transition-colors"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Style Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-amber-500" />
              Стиль диплома:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'gold', label: '👑 Золотой', color: 'bg-amber-100 text-amber-900 border-amber-400' },
                { id: 'sepia', label: '📜 Винтаж', color: 'bg-stone-200 text-stone-900 border-stone-400' },
                { id: 'burgundy', label: '🏛️ Бордо', color: 'bg-rose-100 text-rose-900 border-rose-400' },
                { id: 'azure', label: '🌊 Лазурный', color: 'bg-cyan-100 text-cyan-900 border-cyan-400' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => { soundFx.playClick(); setTheme(t.id as CertificateTheme); }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${t.color} ${
                    theme === t.id ? 'ring-2 ring-amber-500 font-black shadow-md scale-102' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Nomination Selector */}
        <div className="space-y-1.5 pt-1 border-t border-white/10">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            Номинация:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {nominationPresets.map((nom) => (
              <button
                key={nom}
                onClick={() => { soundFx.playClick(); setNomination(nom); }}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  nomination === nom
                    ? 'bg-amber-500 text-white border-amber-600 font-black shadow-sm'
                    : 'bg-white/15 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 border-white/20 dark:border-white/10 hover:bg-white/30'
                }`}
              >
                {nom}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* DIPLOMA LIVE PREVIEW (Also matches print target #printable-certificate) */}
      <div 
        id="printable-certificate"
        className={`${themeStyles.bg} ${themeStyles.textColor} rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-2xl border-12 border-double ${themeStyles.border} transition-colors`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 0 40px rgba(184, 134, 11, 0.12)'
        }}
      >
        {/* Ornate Corner Elements in CSS */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-amber-600" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-amber-600" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-amber-600" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-amber-600" />

        <div className="relative z-10 text-center space-y-4">
          
          {/* Top Museum Header */}
          <div className="border-b-2 border-amber-800/20 pb-3">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest opacity-80 font-sans">
              МУНИЦИПАЛЬНОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ
            </p>
            <h2 className="text-base sm:text-2xl font-black font-serif uppercase tracking-widest mt-0.5">
              «НЕФТЕГОРСКИЙ КРАЕВЕДЧЕСКИЙ МУЗЕЙ»
            </h2>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-800 mt-0.5 font-sans">
              САМАРСКАЯ ОБЛАСТЬ • ОФИЦИАЛЬНАЯ ОНЛАЙН-ВИКТОРИНА • NKM63.RU
            </p>
          </div>

          {/* Central Ribbon Banner */}
          <div className="py-2">
            <div className={`museum-ribbon px-8 sm:px-14 py-3 rounded-2xl inline-block shadow-xl border-2 ${themeStyles.outerBorder}`}>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif uppercase tracking-widest text-white drop-shadow-md">
                ДИПЛОМ ЗНАТОКА
              </h1>
            </div>
          </div>

          {/* Subheader */}
          <p className="text-xs sm:text-sm font-black font-serif uppercase tracking-widest opacity-90">
            НАСТОЯЩИМ ДИПЛОМОМ НАГРАЖДАЕТСЯ
          </p>

          {/* Participant Cartouche */}
          <div className="max-w-xl mx-auto py-3 px-6 rounded-2xl bg-white border-2 border-amber-500/50 shadow-md">
            <h3 className="text-2xl sm:text-4xl font-extrabold font-serif italic text-slate-900">
              {playerName.trim() || 'Имя Участника'}
            </h3>

            {playerLocation.trim() && (
              <div className="mt-1 flex items-center justify-center gap-1 text-xs font-bold text-amber-900 font-serif">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>Населенный пункт: <strong>{playerLocation}</strong></span>
              </div>
            )}
          </div>

          {/* Nomination */}
          <div className="space-y-1 py-1">
            <div className="inline-block px-5 py-2 rounded-xl bg-amber-100/90 border-2 border-amber-700/60 font-black text-sm sm:text-lg font-serif shadow-sm">
              в номинации {nomination}
            </div>
            <p className="text-xs sm:text-sm font-serif font-bold text-slate-800 max-w-xl mx-auto leading-relaxed pt-1">
              за отличные знания истории, культуры, выдающихся личностей и памятных мест Нефтегорского района и Самарской области.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-center gap-6 sm:gap-12 my-2 py-3 px-6 rounded-xl bg-white/70 border border-amber-800/20 max-w-lg mx-auto">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500">Набрано баллов</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-800">{totalScore} б.</p>
            </div>
            <div className="h-8 w-px bg-amber-800/30" />
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500">Экспонатов открыто</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-800">{unlockedExhibitsCount} из 10</p>
            </div>
            <div className="h-8 w-px bg-amber-800/30" />
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500">Статус</p>
              <p className="text-sm sm:text-base font-black text-blue-800">ЭРУДИТ</p>
            </div>
          </div>

          {/* Footer Official Verification Block */}
          <div className="pt-6 border-t-2 border-amber-800/30 flex items-center justify-between text-left text-xs font-serif">
            
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500">Регистрационный номер документа:</p>
              <p className="font-mono text-xs font-black text-slate-900">{certCode}</p>
              <p className="text-[11px] text-slate-600 font-sans flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-700" />
                {currentDateStr}
              </p>
            </div>

            {/* Blue Official Stamp */}
            <div className="relative flex items-center justify-center shrink-0 mx-2">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-blue-700 bg-blue-50 text-blue-900 flex flex-col items-center justify-center p-1.5 text-center font-sans shadow-md transform -rotate-6">
                <div className="w-full h-full rounded-full border border-blue-600 p-1 flex flex-col items-center justify-center">
                  <p className="text-[6px] sm:text-[7px] font-black uppercase text-blue-800 leading-tight">
                    МУНИЦИПАЛЬНОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ
                  </p>
                  <p className="text-[7px] sm:text-[8px] font-black uppercase text-blue-950 my-0.5 border-y border-blue-500/50 py-0.5">
                    МБУ «Нефтегорский краеведческий музей»
                  </p>
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <p className="text-[6px] font-bold text-blue-800">
                    САМАРСКАЯ ОБЛАСТЬ
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <p className="text-[10px] font-bold text-slate-500">Директор музея:</p>
              <p className="font-serif italic font-bold text-xs text-blue-900">/ М.И. Польникова /</p>
              <p className="text-[10px] font-bold text-slate-600">г. Нефтегорск</p>
            </div>

          </div>

        </div>
      </div>

      {/* Share and Download bottom bar */}
      <div className="bg-white/10 dark:bg-slate-900/30 backdrop-blur-md p-4 rounded-2xl border border-white/20 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={downloadHighResPng}
            className="py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-4 h-4" />
            Скачать PNG
          </button>
          <button
            onClick={handlePrint}
            className="py-2.5 px-4 rounded-xl bg-white/20 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-1.5 border border-white/20"
          >
            <Printer className="w-4 h-4" />
            Сохранить в PDF
          </button>
          <button
            onClick={handleCopyText}
            className="py-2.5 px-3 rounded-xl bg-white/20 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-1.5 border border-white/20"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Скопировано!' : 'Копировать'}
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
          <span>Поделиться:</span>
          <button
            onClick={() => {
              const url = `https://vk.com/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('Диплом Знатока Нефтегорского Музея')}`;
              window.open(url, '_blank', 'width=600,height=400');
            }}
            className="px-2.5 py-1 rounded-lg bg-[#0077FF] text-white hover:brightness-110"
          >
            VK
          </button>
          <button
            onClick={() => {
              const text = `📜 Мой именной диплом от Нефтегорского музея (nkm63.ru): ${totalScore} баллов!`;
              const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
              window.open(url, '_blank', 'width=600,height=400');
            }}
            className="px-2.5 py-1 rounded-lg bg-[#229ED9] text-white hover:brightness-110"
          >
            Telegram
          </button>
        </div>
      </div>

    </div>
  );
};
