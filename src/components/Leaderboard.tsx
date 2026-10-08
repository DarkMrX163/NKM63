import React from 'react';
import { LeaderboardRecord, fetchLeaderboard } from '../firebase';
import { Trophy, Medal, Search, Filter, RefreshCw, User, Award, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface LeaderboardProps {
  currentScoreRecord?: LeaderboardRecord | null;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentScoreRecord }) => {
  const [records, setRecords] = React.useState<LeaderboardRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filterLevel, setFilterLevel] = React.useState<'all' | 'easy' | 'medium' | 'hard' | 'mixed'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const loadLeaderboardData = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLeaderboard(50);
      setRecords(data);
    } catch (e) {
      console.warn('Leaderboard load note:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadLeaderboardData();
  }, [loadLeaderboardData]);

  // Combine with current score if provided and not yet in list
  const displayRecords = React.useMemo(() => {
    let list = [...records];
    if (currentScoreRecord && !list.some((r) => r.id === currentScoreRecord.id)) {
      list.unshift(currentScoreRecord);
    }

    if (filterLevel !== 'all') {
      list = list.filter((r) => r.level === filterLevel);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) => r.playerName.toLowerCase().includes(q));
    }

    return list.sort((a, b) => b.score - a.score);
  }, [records, currentScoreRecord, filterLevel, searchQuery]);

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase border border-amber-300 dark:border-amber-800">
          <Trophy className="w-3.5 h-3.5" />
          Облачная синхронизация Firestore
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
          Таблица Краеведческих Лидеров
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Соревнуйтесь с другими исследователями истории Нефтегорского района и Самарского края!
        </p>
      </div>

      {/* Controls Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по имени..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filter & Refresh */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">Все уровни</option>
              <option value="easy">Юный краевед</option>
              <option value="medium">Знаток края</option>
              <option value="hard">Хранитель истории</option>
              <option value="mixed">Микс</option>
            </select>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              loadLeaderboardData();
            }}
            title="Обновить"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-500" />
            <p className="text-xs">Загрузка рейтинга из облачного хранилища...</p>
          </div>
        ) : displayRecords.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Trophy className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Записей пока нет</p>
            <p className="text-xs">Пройдите викторину и первым займите верхнюю строчку!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {displayRecords.map((record, index) => {
              const rank = index + 1;
              let rankBadge = <span className="font-mono text-xs font-bold text-slate-400">#{rank}</span>;

              if (rank === 1) {
                rankBadge = <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-500 flex items-center justify-center font-bold text-xs"><Medal className="w-4 h-4" /></div>;
              } else if (rank === 2) {
                rankBadge = <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs"><Medal className="w-4 h-4" /></div>;
              } else if (rank === 3) {
                rankBadge = <div className="w-7 h-7 rounded-full bg-amber-900/20 text-amber-700 flex items-center justify-center font-bold text-xs"><Medal className="w-4 h-4" /></div>;
              }

              return (
                <div
                  key={record.id || index}
                  className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 shrink-0 flex items-center justify-center">
                      {rankBadge}
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-extrabold text-sm border border-amber-500/20 shrink-0">
                      <User className="w-5 h-5" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {record.playerName}
                        {rank <= 3 && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Точность: {record.accuracy}% • Уровень: {record.level}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-black text-amber-600 dark:text-amber-400 flex items-center justify-end gap-1">
                      <Award className="w-4 h-4" />
                      <span>{record.score} б.</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(record.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
