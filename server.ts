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
      return res.json({
        answer: 'Краеведческая справка: Нефтегорский район Самарской области славен историей нефтепромысла, Утёвской иконописью и Бариновской ветряной мельницей XIX века!'
      });
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
