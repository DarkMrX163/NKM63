import React from 'react';
import { Question } from '../types/quiz';
import { CheckCircle2, XCircle, BookOpen, Sparkles, ArrowRight, Bot } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface ExplanationModalProps {
  question: Question;
  selectedOption: number | null;
  onNext: () => void;
  onAskAi: (topic: string, questionText: string) => void;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  question,
  selectedOption,
  onNext,
  onAskAi
}) => {
  const isCorrect = selectedOption === question.correctIndex;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden animate-scale-up">
        
        {/* Status Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isCorrect 
              ? 'bg-green-100 dark:bg-green-950 text-green-600 border border-green-300' 
              : 'bg-red-100 dark:bg-red-950 text-red-600 border border-red-300'
          }`}>
            {isCorrect ? (
              <CheckCircle2 className="w-7 h-7" />
            ) : (
              <XCircle className="w-7 h-7" />
            )}
          </div>
          <div>
            <h3 className={`text-xl font-extrabold font-serif ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isCorrect ? 'Совершенно верно! 🎉' : 'Увы, небольшая ошибка! 💡'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isCorrect ? '+100 очков за знание края!' : `Правильный ответ: "${question.options[question.correctIndex]}"`}
            </p>
          </div>
        </div>

        {/* Explanation Card */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-500" />
              Краеведческая справка:
            </h4>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {question.explanation}
            </p>
          </div>

          {/* Historical Fact */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Интересный архивный факт:
            </h4>
            <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed italic">
              «{question.historicalFact}»
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              soundFx.playClick();
              onAskAi(question.categoryTitle, question.text);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
          >
            <Bot className="w-4 h-4 text-indigo-500" />
            Узнать больше у ИИ-Краеведа
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onNext();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all hover:px-7"
          >
            Дальше
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
