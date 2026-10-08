import { LOCAL_KNOWLEDGE_BASE, KnowledgeEntry } from '../data/knowledgeBase';
import { EASY_QUESTIONS, MEDIUM_QUESTIONS, HARD_QUESTIONS } from '../data/questions';
import { fetchWikipediaInfo, WikipediaSearchResult } from './wikipedia';

/**
 * Searches the local knowledge base, Wikipedia, and quiz data to construct a rich, accurate answer.
 */
export function generateLocalKnowledgeAnswer(
  prompt: string,
  topic?: string,
  wikiData?: WikipediaSearchResult | null
): string {
  const cleanPrompt = (prompt + ' ' + (topic || '')).toLowerCase();

  // If Wikipedia returned valid information, prepend or highlight it
  let wikiPrefix = '';
  if (wikiData && wikiData.extract) {
    wikiPrefix = `🌐 Справка из Википедии («${wikiData.title}»):\n${wikiData.extract.slice(0, 450)}${wikiData.extract.length > 450 ? '...' : ''}\n🔗 Ссылка: ${wikiData.url}\n\n`;
  }

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
    return `${wikiPrefix}🏛️ Музейная справка: ${bestEntry.summary}\n\n📜 Из архивов музея: ${bestEntry.fullContent}\n\n💡 Интересный факт: ${bestEntry.historicalFact}`;
  }

  // Otherwise search in quiz questions & explanations
  const allQuestions = [...EASY_QUESTIONS, ...MEDIUM_QUESTIONS, ...HARD_QUESTIONS];
  for (const q of allQuestions) {
    const qText = (q.text + ' ' + q.explanation + ' ' + q.historicalFact + ' ' + q.categoryTitle).toLowerCase();
    const words = cleanPrompt.split(/\s+/).filter(w => w.length > 3);
    const matches = words.filter(w => qText.includes(w));

    if (matches.length >= 2 || (words.length === 1 && matches.length === 1)) {
      return `${wikiPrefix}🏛️ Экспозиция музея (nkm63.ru):\n${q.explanation}\n\n💡 Исторический факт: ${q.historicalFact}`;
    }
  }

  if (wikiData && wikiData.extract) {
    return `${wikiPrefix}🏛️ Краеведческий музей продолжит пополнять материалы по вашему запросу! Вы также можете узнать больше на официальном портале nkm63.ru.`;
  }

  // General default fallback response if no specific keyword matched
  return `Здравствуйте! В архивах Нефтегорского краеведческого музея хранится множество удивительных историй о нашем крае.\n\n` +
    `Нефтегорский район славен основанием города нефтяников в 1960 году, подвигом безрукого и безногого иконописца Григория Журавлёва из села Утёвка, ` +
    `уникальной Бариновской ветряной мельницей 1848 года, а также живописными берегами реки Самары и степями с сурками-байбаками!\n\n` +
    `Задайте уточняющий вопрос (например, про «Утёвку», «мельницу», «герб», «нефть» или «музей»), и я с радостью расскажу вам все детали!`;
}

/**
 * Robust hybrid function to query AI Historian with Wikipedia grounding and conversation history.
 * Works on server, on client with API key, or completely offline / static GitHub Pages host.
 */
export async function getAiHistorianResponse(
  prompt: string,
  topic?: string,
  history?: Array<{ role: 'user' | 'assistant'; text: string }>
): Promise<string> {
  // If the prompt is a follow-up (e.g. "расскажи подробнее"), extract key terms from history
  let searchSubject = prompt;
  if (prompt.trim().split(/\s+/).length <= 4 && Array.isArray(history) && history.length > 0) {
    const lastUserMsg = [...history].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      searchSubject = `${lastUserMsg.text} ${prompt}`;
    }
  }

  // Try fetching Wikipedia info first
  let wikiInfo: WikipediaSearchResult | null = null;
  try {
    wikiInfo = await fetchWikipediaInfo(searchSubject);
  } catch (err) {
    console.warn('Wikipedia pre-fetch error:', err);
  }

  // 1. Try server API route if available
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 sec timeout for internet search

    const res = await fetch('/api/ai-expert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        topic: topic || 'Краеведение Самарского края',
        history,
        wikiContext: wikiInfo ? { title: wikiInfo.title, extract: wikiInfo.extract, url: wikiInfo.url } : null
      }),
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
    console.log('Server AI endpoint unavailable, using client Wikipedia & local knowledge base engine.');
  }

  // 2. Try client-side Gemini if API Key is available in env
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (apiKey) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const wikiContextText = wikiInfo?.extract
        ? `\n[Данные из Википедии (${wikiInfo.title})]: ${wikiInfo.extract}`
        : '';

      let formattedContents: any = [];
      if (Array.isArray(history) && history.length > 0) {
        const pastTurns = history.slice(-6).map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        }));
        pastTurns.push({
          role: 'user',
          parts: [{ text: `Текущий вопрос пользователя: ${prompt}${wikiContextText}` }]
        });
        formattedContents = pastTurns;
      } else {
        formattedContents = `Тема: ${topic || 'История Нефтегорского района и Самарского края'}\nВопрос пользователя: ${prompt}${wikiContextText}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedContents,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: `Ты — виртуальный экскурсовод и музейный ИИ-Краевед Нефтегорского краеведческого музея (Самарская область, nkm63.ru).

КРИТИЧЕСКИ ВАЖНОЕ ПРАВИЛО ПО ГЕОГРАФИИ:
- Речь идет ИСКЛЮЧИТЕЛЬНО о городе Нефтегорск и Нефтегорском районе САМАРСКОЙ ОБЛАСТИ (Поволжье)!
- Нефть возле Нефтегорска (Самарская область) была открыта в 1959–1960 годах (знаменитое Кулешовское месторождение), и в 1960 году был основан рабочий посёлок Нефтегорск (с 1989 г. — город).
- КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО упоминать посёлок Нефтегорск Сахалинской области, город Оху или землетрясение 1995 года!

ПРАВИЛА ОТВЕТА:
- Ты свободно отвечаешь на любые уточняющие или дополнительные вопросы, учитывая историю текущего диалога.
- Используй встроенный интернет-поиск и данные Википедии для максимально полного ответа.`
        }
      });

      if (response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn('Client Gemini API error, using local database:', err);
    }
  }

  // 3. Fallback to rich local Knowledge Base Engine + Wikipedia (100% reliable on GitHub Pages)
  return generateLocalKnowledgeAnswer(searchSubject, topic, wikiInfo);
}

