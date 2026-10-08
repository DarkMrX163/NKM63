import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function aiExpertApiPlugin(): Plugin {
  return {
    name: 'ai-expert-api',
    configureServer(server) {
      server.middlewares.use('/api/ai-expert', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const { prompt, topic } = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                answer: 'Краеведческая справка: Нефтегорский район Самарской области богатеет традициями, нефтепромыслом и шедеврами Утёвки и Бариновки!'
              }));
              return;
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

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ answer: response.text }));
          } catch (err: any) {
            console.error('AI API error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'ошибка обработки запроса ИИ' }));
          }
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), aiExpertApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
