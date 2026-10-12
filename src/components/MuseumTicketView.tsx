import React from 'react';
import { 
  Ticket, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  Landmark, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Gift,
  Lock,
  Unlock,
  CheckCircle2,
  Award,
  ChevronRight,
  Compass
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { CompletedHallRecord, MUSEUM_HALLS } from '../data/halls';

interface MuseumTicketViewProps {
  playerName: string;
  playerLocation: string;
  totalScore: number;
  unlockedExhibitsCount?: number;
  completedHalls?: CompletedHallRecord[];
  onStartHall?: (hallId: string) => void;
  onNavigateToQuiz?: () => void;
}

export const MuseumTicketView: React.FC<MuseumTicketViewProps> = ({
  playerName,
  playerLocation,
  totalScore,
  unlockedExhibitsCount = 0,
  completedHalls = [],
  onStartHall,
  onNavigateToQuiz
}) => {
  const [copied, setCopied] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  const completedCount = completedHalls.length;
  const isTicketUnlocked = completedCount >= 2;

  // Determine promo discount tier: 100% Free pass if score >= 400 or >= 3 halls, else 50% discount
  const isFreePass = totalScore >= 400 || completedCount >= 3 || unlockedExhibitsCount >= 4;
  const discountPercent = isFreePass ? 100 : 50;

  // Stable promo code stored in localStorage
  const [promoCode] = React.useState(() => {
    const saved = localStorage.getItem('nkm_user_promocode');
    if (saved) return saved;
    const randPart = Math.floor(1000 + Math.random() * 9000);
    const code = `NKM-2026-${randPart}`;
    localStorage.setItem('nkm_user_promocode', code);
    return code;
  });

  const [ticketNumber] = React.useState(() => {
    const saved = localStorage.getItem('nkm_user_ticket_no');
    if (saved) return saved;
    const num = `№ ${Math.floor(100000 + Math.random() * 900000)}`;
    localStorage.setItem('nkm_user_ticket_no', num);
    return num;
  });

  const currentDateStr = React.useMemo(() => {
    return new Date().toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, []);

  const handleCopyPromo = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  // High-Resolution Canvas PNG Generator (2200 x 1000 px)
  const downloadTicketPng = () => {
    soundFx.playClick();
    setIsExporting(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 2200;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;

      // 1. Background
      ctx.fillStyle = '#FAF6EC';
      ctx.fillRect(0, 0, W, H);

      // Subtle vintage texture
      ctx.fillStyle = 'rgba(0, 0, 0, 0.015)';
      for (let x = 0; x < W; x += 16) {
        for (let y = 0; y < H; y += 16) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }

      // 2. Borders & Guilloche frame
      ctx.strokeStyle = '#8B5A2B';
      ctx.lineWidth = 10;
      ctx.strokeRect(30, 30, W - 60, H - 60);

      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 3;
      ctx.strokeRect(46, 46, W - 92, H - 92);

      // 3. Perforated stub line
      const stubX = 540;
      ctx.setLineDash([14, 10]);
      ctx.strokeStyle = '#B8860B';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(stubX, 46);
      ctx.lineTo(stubX, H - 46);
      ctx.stroke();
      ctx.setLineDash([]);

      // Top and bottom notch circle cuts
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(stubX, 30, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(stubX, H - 30, 24, 0, Math.PI * 2);
      ctx.fill();

      // --- LEFT STUB (КОНТРОЛЬ) ---
      ctx.fillStyle = '#3E2723';
      ctx.textAlign = 'center';
      ctx.font = '900 24px sans-serif';
      ctx.fillText('КОНТРОЛЬНЫЙ ТАЛОН', stubX / 2, 100);

      ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
      ctx.fillStyle = isFreePass ? '#15803D' : '#8B0000';
      ctx.fillText(discountPercent === 100 ? 'БЕСПЛАТНО' : 'СКИДКА 50%', stubX / 2, 170);

      // Barcode on Stub
      const barY = 230;
      const barH = 120;
      ctx.fillStyle = '#1A1A1A';
      for (let i = 80; i < stubX - 80; i += 7) {
        const w = (i % 3 === 0) ? 4 : (i % 2 === 0) ? 2 : 1;
        ctx.fillRect(i, barY, w, barH);
      }

      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = '#3E2723';
      ctx.fillText(promoCode, stubX / 2, barY + barH + 35);

      ctx.font = 'normal 18px Georgia, serif';
      ctx.fillText('Линия отрыва', stubX / 2, H - 110);
      ctx.font = 'bold 20px Georgia, serif';
      ctx.fillText(ticketNumber, stubX / 2, H - 75);

      // --- RIGHT MAIN TICKET BODY ---
      const mainCenterX = stubX + (W - stubX) / 2;

      // Header Ribbon
      ctx.font = 'bold 22px Georgia, serif';
      ctx.fillStyle = '#6D4C41';
      ctx.fillText('МУНИЦИПАЛЬНОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ', mainCenterX, 95);

      ctx.font = '900 38px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#271007';
      ctx.fillText('«НЕФТЕГОРСКИЙ КРАЕВЕДЧЕСКИЙ МУЗЕЙ»', mainCenterX, 145);

      ctx.font = 'italic 20px Georgia, serif';
      ctx.fillStyle = '#8B5A2B';
      ctx.fillText('Самарская область • nkm63.ru • Официальный входной билет знатока', mainCenterX, 180);

      // Gold badge for discount
      ctx.fillStyle = isFreePass ? '#15803D' : '#B45309';
      ctx.beginPath();
      ctx.roundRect(mainCenterX - 450, 215, 900, 105, 24);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 46px sans-serif';
      const privilegeTitle = isFreePass 
        ? '★ 100% БЕСПЛАТНЫЙ ВХОД В МУЗЕЙ ★' 
        : '★ 50% СКИДКА НА ВХОДНОЙ БИЛЕТ ★';
      ctx.fillText(privilegeTitle, mainCenterX, 282);

      // Passenger info
      ctx.fillStyle = '#271007';
      ctx.textAlign = 'left';
      const infoLeft = stubX + 70;
      
      ctx.font = 'bold 26px Georgia, serif';
      ctx.fillText('Посетитель:', infoLeft, 385);
      ctx.font = 'italic bold 32px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#1E3A8A';
      ctx.fillText(playerName.trim() || 'Знаток Самарского края', infoLeft + 180, 385);

      ctx.fillStyle = '#271007';
      ctx.font = 'bold 24px Georgia, serif';
      ctx.fillText('Населенный пункт:', infoLeft, 440);
      ctx.font = 'normal 26px Georgia, serif';
      ctx.fillText(playerLocation.trim() || 'Самарская область', infoLeft + 250, 440);

      // Completed halls validation line
      ctx.fillStyle = '#271007';
      ctx.font = 'bold 24px Georgia, serif';
      ctx.fillText('Пройденные залы:', infoLeft, 495);
      ctx.font = 'bold 22px Georgia, serif';
      ctx.fillStyle = '#047857';
      const hallsTitles = completedHalls.map((h) => h.hallTitle.replace(/Зал |«|»/g, '')).join(', ');
      ctx.fillText(`✓ ${hallsTitles || '2 тематических зала музея пройдены'}`, infoLeft + 245, 495);

      ctx.fillStyle = '#271007';
      ctx.font = 'bold 24px Georgia, serif';
      ctx.fillText('Основание льготы:', infoLeft, 550);
      ctx.font = 'normal 24px Georgia, serif';
      ctx.fillStyle = '#8B5A2B';
      ctx.fillText(`Успешное прохождение музейного квеста (${totalScore} б.)`, infoLeft + 245, 550);

      // Promo Box Right
      const promoBoxX = W - 430;
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#B8860B';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(promoBoxX, 355, 350, 180, 18);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#6B4A2F';
      ctx.fillText('ПРОМОКОД ДЛЯ КАССЫ', promoBoxX + 175, 395);

      ctx.font = '900 34px monospace';
      ctx.fillStyle = '#B45309';
      ctx.fillText(promoCode, promoBoxX + 175, 455);

      ctx.font = 'bold 15px sans-serif';
      ctx.fillStyle = '#15803D';
      ctx.fillText('✓ ПОДТВЕРЖДЕНО КВЕСТОМ', promoBoxX + 175, 498);

      // Footer Info
      ctx.textAlign = 'left';
      ctx.fillStyle = '#4B2E18';
      ctx.font = 'normal 22px Georgia, serif';
      ctx.fillText(`Дата выдачи: ${currentDateStr}`, infoLeft, 640);
      ctx.fillText('Срок действия: До 31 декабря 2026 г.', infoLeft, 680);
      ctx.fillText('Адрес: Самарская область, г. Нефтегорск, ул. Мира', infoLeft, 720);

      // Right Seal / Stamp
      const sealX = W - 230;
      const sealY = 730;
      ctx.save();
      ctx.translate(sealX, sealY);
      ctx.rotate(-0.06);
      ctx.strokeStyle = '#1D4ED8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 90, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#1D4ED8';
      ctx.textAlign = 'center';
      ctx.font = '900 11px sans-serif';
      ctx.fillText('МБУ «НЕФТЕГОРСКИЙ КРАЕВЕДЧЕСКИЙ МУЗЕЙ»', 0, -40);
      ctx.font = '900 20px sans-serif';
      ctx.fillText('ПРОЙДЕНО 2+ ЗАЛА', 0, 5);
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('ЛЬГОТА nkm63.ru', 0, 42);
      ctx.restore();

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `bilet_muzei_neftegorsk_${promoCode}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export ticket png', err);
    } finally {
      setIsExporting(false);
    }
  };

  // =========================================================================
  // VIEW 1: LOCKED STATE (Less than 2 thematic halls completed)
  // =========================================================================
  if (!isTicketUnlocked) {
    return (
      <div className="py-8 px-4 max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        {/* Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-black uppercase tracking-widest border border-amber-400/40 shadow-sm font-serif">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            Музейный Квест • Доступ к билету заблокирован
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white">
            Пройдите минимум 2 тематических зала
          </h2>

          <div className="max-w-2xl mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl p-5 border border-amber-300/40 dark:border-amber-700/30 shadow-lg">
            <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base font-medium leading-relaxed">
              Чтобы получить официальный именной билет с уникальным промокодом на <strong className="text-amber-600 dark:text-amber-400">скидку до 100%</strong> на посещение Нефтегорского краеведческого музея, необходимо пройти минимум <strong className="text-amber-700 dark:text-amber-300">два тематических зала</strong> экспозиции.
            </p>
          </div>
        </div>

        {/* QUEST STEP PROGRESS TRACKER */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-white/40 dark:border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base sm:text-lg font-serif text-slate-900 dark:text-white">
                Прогресс музейного квеста
              </h3>
            </div>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-400/30 font-mono">
              Пройдено: {completedCount} / 2 залов
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3.5 overflow-hidden p-0.5">
            <div 
              className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, (completedCount / 2) * 100)}%` }}
            />
          </div>

          {/* Step Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            {/* Step 1 */}
            <div className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3 ${
              completedCount >= 1 
                ? 'border-emerald-500/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                : 'border-amber-400/50 bg-amber-50/50 dark:bg-amber-950/20 text-slate-700 dark:text-slate-300'
            }`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                completedCount >= 1 ? 'bg-emerald-500 text-white' : 'bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
              }`}>
                {completedCount >= 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">Первый зал</p>
                <p className="text-sm font-semibold mt-0.5">
                  {completedCount >= 1 
                    ? `✓ ${completedHalls[0]?.hallTitle || 'Зал успешно пройден'}` 
                    : 'Пройдите любой зал'}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3 ${
              completedCount >= 2 
                ? 'border-emerald-500/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300'
            }`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                completedCount >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {completedCount >= 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">Второй зал</p>
                <p className="text-sm font-semibold mt-0.5">
                  {completedCount >= 2 
                    ? `✓ ${completedHalls[1]?.hallTitle || 'Второй зал пройден'}` 
                    : 'Ожидает прохождения'}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl border-2 border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 flex items-start gap-3 text-slate-500 dark:text-slate-400">
              <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">Билет в музей</p>
                <p className="text-sm font-semibold mt-0.5">
                  {completedCount >= 2 ? 'Разблокирован' : 'Откроется автоматически'}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* LIST OF THEMATIC HALLS TO PASS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-lg font-serif text-slate-900 dark:text-white flex items-center gap-2">
              <Landmark className="w-5 h-5 text-amber-500" />
              Тематические залы музея для прохождения квеста
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Выберите любой зал для старта
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MUSEUM_HALLS.map((hall) => {
              const record = completedHalls.find((h) => h.hallId === hall.id);
              const isPassed = !!record;

              return (
                <div 
                  key={hall.id}
                  className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between gap-4 backdrop-blur-md ${
                    isPassed 
                      ? 'border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20' 
                      : 'border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-amber-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{hall.emoji}</span>
                      {isPassed ? (
                        <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-400/40">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Зал пройден ({record.score} б.)
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-300/40">
                          {hall.badgeText}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold font-serif text-base text-slate-900 dark:text-white">
                      {hall.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {hall.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Экспонат: {hall.exhibitName}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        if (onStartHall) {
                          onStartHall(hall.id);
                        } else if (onNavigateToQuiz) {
                          onNavigateToQuiz();
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        isPassed 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : 'bg-amber-600 hover:bg-amber-700 text-white'
                      }`}
                    >
                      {isPassed ? 'Пройти повторно' : 'Пройти этот зал'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LOCKED TICKET SILHOUETTE PREVIEW */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-dashed border-amber-400/50 dark:border-amber-700/50 bg-amber-50/30 dark:bg-amber-950/10 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h4 className="font-serif font-black text-xl text-slate-900 dark:text-amber-100">
              Ваш персональный билет ожидает разблокировки
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto mt-1">
              После прохождения еще <strong>{2 - completedCount}</strong> зала(ов) здесь появится официальный билет на имя <strong className="text-amber-700 dark:text-amber-300">{playerName.trim() || 'Участника'}</strong> с промокодом для кассы, штрихкодом и печатью музея.
            </p>
          </div>

          {onNavigateToQuiz && (
            <button
              onClick={() => { soundFx.playClick(); onNavigateToQuiz(); }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-600/20 transition-all hover:scale-105"
            >
              <Compass className="w-4 h-4" />
              Перейти к залам экспозиции
            </button>
          )}
        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW 2: UNLOCKED STATE (At least 2 thematic halls completed!)
  // =========================================================================
  return (
    <div className="py-8 px-4 max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Celebratory Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 text-xs font-black uppercase tracking-widest border border-emerald-400/40 shadow-sm font-serif">
          <Unlock className="w-4 h-4 text-emerald-600" />
          Квест Выполнен • Билет Разблокирован!
        </div>
        
        <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white">
          Ваш Персональный Музейный Билет
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Поздравляем! Вы успешно прошли {completedCount} тематических зала(ов) музея. Предъявите этот билет на кассе Нефтегорского краеведческого музея или назовите уникальный промокод для получения льготного входа!
        </p>

        {/* Chips of Completed Halls */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {completedHalls.map((h, i) => (
            <span 
              key={i} 
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              {h.hallTitle.replace(/Зал |«|»/g, '')}
            </span>
          ))}
        </div>
      </div>

      {/* TICKET CARD (SKU / VINTAGE PERFORATED STYLE) */}
      <div className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/50 bg-[#FAF7EE] text-slate-900 dark:bg-[#1E1B18] dark:text-amber-100 dark:border-amber-600/40 transition-all">
        
        {/* Golden Guilloche Top Bar */}
        <div className="h-3 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700" />

        <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8 relative">
          
          {/* LEFT STUB (Tear-off / Control) */}
          <div className="md:w-64 border-b-2 md:border-b-0 md:border-r-2 border-dashed border-amber-400/60 pb-6 md:pb-0 md:pr-8 flex flex-col justify-between items-center text-center space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">
                КОНТРОЛЬНЫЙ ТАЛОН
              </span>
              <p className="font-serif font-black text-xs text-amber-900 dark:text-amber-300 mt-1 uppercase">
                МБУ «НКМ»
              </p>
            </div>

            {/* Privilege Stamp */}
            <div className={`p-3 rounded-2xl border-2 w-full ${
              isFreePass 
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200' 
                : 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
            }`}>
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase">
                <Gift className="w-4 h-4 text-amber-600" />
                {isFreePass ? 'Бесплатный вход' : 'Скидка 50%'}
              </div>
              <p className="text-2xl font-black font-serif mt-1">
                {discountPercent}%
              </p>
            </div>

            {/* Barcode Visualization */}
            <div className="w-full space-y-1">
              <div className="h-14 bg-repeat-x bg-[radial-gradient(black_1px,transparent_1px)] flex items-center justify-center gap-1 px-2 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700">
                <div className="w-1 h-full bg-slate-900 dark:bg-slate-100" />
                <div className="w-2 h-full bg-slate-900 dark:bg-slate-100" />
                <div className="w-0.5 h-full bg-slate-900 dark:bg-slate-100" />
                <div className="w-1.5 h-full bg-slate-900 dark:bg-slate-100" />
                <div className="w-0.5 h-full bg-slate-900 dark:bg-slate-100" />
                <div className="w-2.5 h-full bg-slate-900 dark:bg-slate-100" />
                <div className="w-1 h-full bg-slate-900 dark:bg-slate-100" />
                <div className="w-0.5 h-full bg-slate-900 dark:bg-slate-100" />
                <div className="w-2 h-full bg-slate-900 dark:bg-slate-100" />
                <div className="w-1.5 h-full bg-slate-900 dark:bg-slate-100" />
                <div className="w-0.5 h-full bg-slate-900 dark:bg-slate-100" />
                <div className="w-2 h-full bg-slate-900 dark:bg-slate-100" />
              </div>
              <p className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
                {promoCode}
              </p>
            </div>

            <span className="text-[10px] font-bold text-slate-400">
              {ticketNumber}
            </span>
          </div>

          {/* RIGHT MAIN BODY */}
          <div className="flex-1 space-y-5">
            
            {/* Header with Seal */}
            <div className="flex items-start justify-between gap-4 border-b border-amber-900/15 dark:border-amber-100/10 pb-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  МУНИЦИПАЛЬНОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ КУЛЬТУРЫ
                </p>
                <h3 className="text-xl sm:text-2xl font-black font-serif text-slate-900 dark:text-amber-100 leading-tight">
                  «НЕФТЕГОРСКИЙ КРАЕВЕДЧЕСКИЙ МУЗЕЙ»
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  г. Нефтегорск, Самарская область • nkm63.ru
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-600 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Landmark className="w-7 h-7" />
              </div>
            </div>

            {/* Privilege Notice Banner */}
            <div className={`p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner ${
              isFreePass 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white' 
                : 'bg-gradient-to-r from-amber-600 to-orange-700 text-white'
            }`}>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                  Категория билета
                </span>
                <p className="text-lg font-black font-serif mt-0.5">
                  {isFreePass ? '★ ПРИГЛАСИТЕЛЬНЫЙ ЭКСПЕРТА (100% БЕСПЛАТНО)' : '★ ЛЬГОТНЫЙ БИЛЕТ ЗНАТОКА (50% СКИДКА)'}
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/30 text-center">
                <p className="text-[10px] font-bold uppercase text-white/90">Квест</p>
                <p className="text-sm font-black text-white">ВЫПОЛНЕН</p>
              </div>
            </div>

            {/* Participant Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-serif">
              <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-amber-800/15 dark:border-amber-100/10">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Имя посетителя:</span>
                <p className="text-base font-bold text-slate-900 dark:text-amber-100 mt-0.5">
                  {playerName.trim() || 'Участник краеведческой викторины'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-amber-800/15 dark:border-amber-100/10">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Населенный пункт:</span>
                <p className="text-base font-bold text-slate-900 dark:text-amber-100 mt-0.5">
                  {playerLocation.trim() || 'Самарская область'}
                </p>
              </div>
            </div>

            {/* Completed Thematic Halls Badge */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-400/50 dark:border-emerald-800 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Пройденные залы экспозиции:
              </span>
              <p className="text-sm font-bold text-emerald-950 dark:text-emerald-100 mt-0.5 flex flex-wrap items-center gap-1.5">
                {completedHalls.map((h, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-white/80 dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-700">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {h.hallTitle.replace(/Зал |«|»/g, '')}
                  </span>
                ))}
              </p>
            </div>

            {/* Promo Code Box */}
            <div className="p-4 rounded-2xl bg-amber-100/60 dark:bg-amber-950/40 border-2 border-dashed border-amber-400 dark:border-amber-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-400">
                  Уникальный промокод для кассы:
                </span>
                <div className="text-2xl font-mono font-black text-amber-950 dark:text-amber-200 tracking-wider">
                  {promoCode}
                </div>
              </div>

              <button
                onClick={handleCopyPromo}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Промокод скопирован!' : 'Скопировать промокод'}
              </button>
            </div>

            {/* Validation & Expiry */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-900/15 dark:border-amber-100/10 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Действителен до 31 декабря 2026 г.
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                г. Нефтегорск, Самарская область, ул. Мира
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Action Buttons Toolbar */}
      <div className="max-w-4xl mx-auto bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/30 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={downloadTicketPng}
            disabled={isExporting}
            className="py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Создаем билет...' : 'Скачать билет (PNG)'}
          </button>

          <button
            onClick={handlePrint}
            className="py-2.5 px-4 rounded-xl bg-white/30 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition-all hover:bg-white/50"
          >
            <Printer className="w-4 h-4" />
            Распечатать / Сохранить в PDF
          </button>
        </div>

        {onNavigateToQuiz && (
          <button
            onClick={() => { soundFx.playClick(); onNavigateToQuiz(); }}
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1"
          >
            Пройти ещё один зал
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
};
