import React from 'react';
import { BookOpen, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent border-t border-white/10 dark:border-white/5 py-8 px-4 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-slate-800 dark:text-slate-200">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-900 dark:text-white font-bold mb-1">
            <BookOpen className="w-4 h-4 text-amber-500" />
            Краеведческий Квест Самарского Края & Нефтегорского Района
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            На основе исторических материалов, архивов и музейных фондов Нефтегорска и Самарской области.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href="https://nkm63.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-transparent hover:bg-white/20 dark:hover:bg-white/10 text-amber-800 dark:text-amber-300 border border-amber-600/30 dark:border-amber-400/30 font-bold transition-colors"
          >
            <span>Официальный сайт nkm63.ru</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
            <span>Создано с любовью к родному краю</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
