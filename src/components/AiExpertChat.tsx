import React from 'react';
import { Bot, Send, Sparkles, BookOpen, User, RefreshCw, Globe, Search, MessageSquare } from 'lucide-react';
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
      text: 'Здравствуйте! Я — ИИ-Краевед и виртуальный хранитель Нефтегорского краеведческого музея (nkm63.ru).\n\nЯ могу ответить на любые основные и уточняющие вопросы с поиском информации в Интернете и Википедии! Спросите меня об истории Нефтегорска, Утёвки, Бариновской мельнице, реке Самаре или задайте уточняющий вопрос по нашей беседе.'
    }
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Auto-scroll chat container
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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

    const updatedMessages = [...messages, { role: 'user' as const, text: textToSend }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Pass updated messages as conversation history to support follow-up questions
      const answer = await getAiHistorianResponse(textToSend, initialTopic, updatedMessages);
      setMessages((prev) => [...prev, { role: 'assistant', text: answer }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Краевед обращается к архивным записям и сети Интернет. Попробуйте ещё раз!' }]);
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

  const followUpPrompts = [
    'Расскажи подробнее об этом!',
    'Какие ещё интересные факты есть?',
    'Как добраться из Самары?',
    'Свяжи это с историей музея nkm63.ru'
  ];

  return (
    <div className="py-8 px-4 max-w-3xl mx-auto">
      {/* Title */}
      <div className="text-center mb-6 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase border border-indigo-300 dark:border-indigo-800">
            <Bot className="w-3.5 h-3.5 text-indigo-500" />
            Музейный ИИ-Краевед nkm63.ru
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-300 dark:border-blue-800">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            Википедия
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-800">
            <Search className="w-3.5 h-3.5 text-amber-500" />
            Интернет-поиск
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
          Спросите ИИ-Краеведа
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Задавайте любые основные и уточняющие вопросы — ИИ даёт ответы с опорой на архивные факты музея и данные из Интернета!
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl border border-white/40 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[520px]">
        
        {/* Messages List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-white'
                  : 'bg-indigo-600 text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div className={`p-4 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-white rounded-tr-none shadow-sm font-medium'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80 shadow-sm'
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
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-medium italic flex items-center gap-2 border border-slate-200 dark:border-slate-700">
                <Search className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                ИИ-Краевед ищет информацию в Интернете, Википедии и архивах музея...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Follow-up / Preset Questions */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
          {messages.length > 2 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <span className="text-[10px] font-bold uppercase text-indigo-500 shrink-0 flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> Уточнить:
              </span>
              {followUpPrompts.map((promptText, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(promptText)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 whitespace-nowrap shrink-0 transition-colors"
                >
                  {promptText}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Темы:</span>
            {presets.map((preset, i) => (
              <button
                key={i}
                onClick={() => handleSend(preset)}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 whitespace-nowrap shrink-0 transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Задайте главный или уточняющий вопрос..."
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
