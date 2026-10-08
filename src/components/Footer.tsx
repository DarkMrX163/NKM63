import React from 'react';
import { BookOpen, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 px-4 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-slate-500 dark:text-slate-400">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-800 dark:text-slate-200 font-bold mb-1">
            <BookOpen className="w-4 h-4 text-amber-500" />
            Краеведческий Квест Самарского Края & Нефтегорского Района
          </div>
          <p>
            На основе исторических материалов, архивов и музейных фондов Нефтегорска и Самарской области.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href="https://nkm63.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-bold hover:bg-amber-100 transition-colors"
          >
            <span>Официальный сайт nkm63.ru</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-1">
            <span>Создано с любовью к родному краю</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
