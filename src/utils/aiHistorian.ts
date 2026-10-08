import { LOCAL_KNOWLEDGE_BASE, KnowledgeEntry } from '../data/knowledgeBase';
import { EASY_QUESTIONS, MEDIUM_QUESTIONS, HARD_QUESTIONS } from '../data/questions';

/**
 * Searches the local knowledge base and quiz data to construct a rich, accurate answer.
 */
export function generateLocalKnowledgeAnswer(prompt: string, topic?: string): string {
  const cleanPrompt = (prompt + ' ' + (topic || '')).toLowerCase();

  // Score each entry in local knowledge base based on matching keywords
  let bestEntry: KnowledgeEntry | null = null;
  let highestScore = 0;

  for (const entry of LOCAL_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (cleanPrompt.includes(kw)) {
        score += kw.length > 4 ? 3 : 2;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestEntry = entry;
    }
  }

  // If a good knowledge entry is found
  if (bestEntry && highestScore > 0) {
    return `${bestEntry.summary}\n\n🏛️ Подробнее из архива: ${bestEntry.fullContent}\n\n💡 Интересный факт: ${bestEntry.historicalFact}`;
  }

  // Otherwise search in quiz questions & explanations
  const allQuestions = [...EASY_QUESTIONS, ...MEDIUM_QUESTIONS, ...HARD_QUESTIONS];
  for (const q of allQuestions) {
    const qText = (q.text + ' ' + q.explanation + ' ' + q.historicalFact + ' ' + q.categoryTitle).toLowerCase();
    const words = cleanPrompt.split(/\s+/).filter(w => w.length > 3);
    const matches = words.filter(w => qText.includes(w));

    if (matches.length >= 2 || (words.length === 1 && matches.length === 1)) {
      return `По архивным данным нашего музея:\n\n${q.explanation}\n\n💡 Исторический факт: ${q.historicalFact}\n\nЗаходите в Нефтегорский краеведческий музей и на сайт nkm63.ru, чтобы узнать ещё больше интересного!`;
    }
  }

  // General default fallback response if no specific keyword matched
  return `Здравствуйте! В архивах Нефтегорского краеведческого музея хранится множество удивительных историй о нашем крае.\n\n` +
    `Нефтегорский район славен основанием города нефтяников в 1960 году, подвигом безрукого и безногого иконописца Григория Журавлёва из села Утёвка, ` +
    `уникальной Бариновской ветряной мельницей 1848 года, а также живописными берегами реки Самары и степями с сурками-байбаками!\n\n` +
    `Задайте уточняющий вопрос (например, про «Утёвку», «мельницу», «герб», «нефть» или «музей»), и я с радостью расскажу вам все детали!`;
}

/**
 * Robust hybrid function to query AI Historian.
 * Works on server, on client with API key, or completely offline / static GitHub Pages host.
 */
export async function getAiHistorianResponse(prompt: string, topic?: string): Promise<string> {
  // 1. Try server API route if available
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 sec timeout

    const res = await fetch('/api/ai-expert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, topic: topic || 'Краеведение Самарского края' }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.answer && typeof data.answer === 'string' && data.answer.trim().length > 0) {
        return data.answer;
      }
    }
  } catch (err) {
    // Server fetch unavailable or failed (e.g. static GitHub Pages) - fall through gracefully
    console.log('Server AI endpoint unavailable, using local knowledge base engine.');
  }

  // 2. Try client-side Gemini if API Key is available in env
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (apiKey) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Тема: ${topic || 'История Нефтегорского района и Самарского края'}\nВопрос пользователя: ${prompt}`,
        config: {
          systemInstruction: `Ты — виртуальный экскурсовод и музейный ИИ-Краевед Нефтегорского краеведческого музея.
Отвечай грамотно, увлекательно и познавательно (3-5 предложений) на русском языке. Используй исторические факты о Нефтегорске, Утёвке, Бариновской мельнице и Самарской области.`
        }
      });

      if (response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn('Client Gemini API error, using local database:', err);
    }
  }

  // 3. Fallback to rich local Knowledge Base Engine (100% reliable on GitHub Pages)
  return generateLocalKnowledgeAnswer(prompt, topic);
}
