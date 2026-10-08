import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/ai-expert', async (req, res) => {
  try {
    const { prompt, topic, history, wikiContext } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    let wikiText = '';
    if (wikiContext && wikiContext.extract) {
      wikiText = `\n[Справка из Википедии «${wikiContext.title}»]: ${wikiContext.extract}`;
    }

    if (!apiKey) {
      const p = (prompt || '').toLowerCase();
      let answer = 'Краеведческая справка музея (nkm63.ru): Нефтегорский район Самарской области славится богатой историей нефтепромысла (с 1960 г.), Утёвской иконописью Григория Журавлёва и Бариновской ветряной мельницей 1848 года!';
      if (p.includes('журавлев') || p.includes('утёвк') || p.includes('утевк') || p.includes('икон')) {
        answer = 'Григорий Николаевич Журавлёв (1858–1916) из села Утёвка родился без рук и ног, но с невероятным мужеством создал уникальные иконы и расписал Троицкий храм зубами, держа кисть в рту!';
      } else if (p.includes('мельниц') || p.includes('бариновк')) {
        answer = 'Бариновская ветряная мельница 1848 года — единственный сохранившийся деревянный памятник шатрового типа («голландка») в Поволжье со старинными уральскими жерновами!';
      } else if (p.includes('нефть') || p.includes('нефтегорск') || p.includes('город')) {
        answer = 'Рабочий посёлок Нефтегорск был основан в 1960 году после открытия Кулешовского месторождения лёгкой нефти и получил статус города в 1989 году.';
      } else if (p.includes('река') || p.includes('животное') || p.includes('природ') || p.includes('сурок')) {
        answer = 'По границам района протекает река Самара, а в заволжских степях живут сурки-байбаки и гнездятся редкие орлы-могильники!';
      }

      if (wikiText) {
        answer = `🌐 [Данные из Википедии]: ${wikiContext.extract.slice(0, 300)}...\n\n🏛️ ${answer}`;
      }

      return res.json({ answer });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format conversation history for Gemini multi-turn or context prompt
    let formattedContents: any = [];
    if (Array.isArray(history) && history.length > 0) {
      // Include past history turns
      const pastTurns = history.slice(-6).map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));
      pastTurns.push({
        role: 'user',
        parts: [{ text: `Текущий вопрос пользователя: ${prompt}${wikiText}` }]
      });
      formattedContents = pastTurns;
    } else {
      formattedContents = `Тема: ${topic || 'История Нефтегорского района и Самарской области'}\nВопрос: ${prompt}${wikiText}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContents,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `Ты — виртуальный экскурсовод и главный краевед Нефтегорского краеведческого музея (Самарская область, nkm63.ru).

КРИТИЧЕСКОЕ ПРАВИЛО ПО ГЕОГРАФИИ:
- Все вопросы касаются ИСКЛЮЧИТЕЛЬНО города Нефтегорск и Нефтегорского района САМАРСКОЙ ОБЛАСТИ (Поволжье)!
- Нефть здесь была открыта в 1959–1960 годах на Кулешовском месторождении, в 1960 г. основан посёлок Нефтегорск.
- НИ В КОЕМ СЛУЧАЕ не путай с Сахалинской областью, Охой или землетрясением 1995 года!

ПРАВИЛА ОТВЕТА:
- Ты умеешь отвечать как на основные, так и на любые УТОЧНЯЮЩИЕ / ДОПОЛНИТЕЛЬНЫЕ вопросы пользователя (используй контекст беседы).
- Активно используй встроенный ПОИСК В ИНТЕРНЕТЕ и данные Википедии для предоставления самых точных, свежих и подробных сведений.
- Отвечай дружелюбно, познавательно и грамотно на русском языке.`
      }
    });

    res.json({ answer: response.text });
  } catch (err: any) {
    console.error('AI API Error:', err);
    res.status(500).json({ error: 'Ошибка взаимодействия с ИИ-Краеведом' });
  }
});

// Serve static build files in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
