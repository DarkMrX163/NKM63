import React from 'react';
import { Bot, Send, Sparkles, BookOpen, User, RefreshCw } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { getAiHistorianResponse } from '../utils/aiHistorian';

interface AiExpertChatProps {
  initialTopic?: string;
  initialQuestion?: string;
}

export const AiExpertChat: React.FC<AiExpertChatProps> = ({ initialTopic, initialQuestion }) => {
  const [messages, setMessages] = React.useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Здравствуйте! Я — ИИ-Краевед и виртуальный хранитель Нефтегорского краеведческого музея (nkm63.ru). Задайте мне любой вопрос об истории, реках, знаменитых людях (Григорий Журавлев), Бариновской мельнице или освоении нефти в нашем крае!'
    }
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // If provided initial topic/question
  React.useEffect(() => {
    if (initialQuestion) {
      handleSend(`Расскажи подробнее про тему: ${initialTopic || ''}. Вопрос: ${initialQuestion}`);
    }
  }, [initialQuestion]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    soundFx.playClick();
    if (!customPrompt) setInput('');

    setMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
    setLoading(true);

    try {
      const answer = await getAiHistorianResponse(textToSend, initialTopic);
      setMessages((prev) => [...prev, { role: 'assistant', text: answer }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Краевед обращается к архивным записям музея. Попробуйте еще раз!' }]);
    } finally {
      setLoading(false);
    }
  };

  const presets = [
    'Расскажи про Григория Журавлева из села Утёвка',
    'Как строилась Бариновская ветряная мельница?',
    'Когда открыли нефть в Нефтегорске?',
    'Какие животные и птицы живут на реке Самаре?'
  ];

  return (
    <div className="py-8 px-4 max-w-3xl mx-auto">
      {/* Title */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase border border-indigo-300 dark:border-indigo-800">
          <Bot className="w-3.5 h-3.5 text-indigo-500" />
          Музейный ИИ-Эксперт nkm63.ru
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
          Спросите Эксперта Музея
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Узнайте больше интересных историй и деталей о любом уголке Самарской земли и Нефтегорского района!
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[500px]">
        
        {/* Messages List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-white'
                  : 'bg-indigo-600 text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div className={`p-4 rounded-2xl max-w-[80%] text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-white rounded-tr-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs italic">
                Краевед ищет ответ в архивных книгах...
              </div>
            </div>
          )}
        </div>

        {/* Preset Questions */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Быстрые вопросы:</span>
          {presets.map((preset, i) => (
            <button
              key={i}
              onClick={() => handleSend(preset)}
              disabled={loading}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 whitespace-nowrap shrink-0 transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Напишите ваш вопрос краеведу..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-colors shadow-md shadow-indigo-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
