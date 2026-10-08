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
    const { prompt, topic } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

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
      return res.json({ answer });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Тема: ${topic || 'История Нефтегорского района и Самарской области'}\nВопрос: ${prompt}`,
      config: {
        systemInstruction: `Ты — виртуальный экскурсовод и главный краевед Нефтегорского межпоселенческого краеведческого музея (nkm63.ru).
Твоя цель — лаконично (2-4 предложения), с теплотой и гордостью рассказать интересный исторический или краеведческий факт по теме вопроса пользователя. Отвечай всегда на русском языке.`
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
