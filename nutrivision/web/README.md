# NutriVision Web (Next.js)

## Локальный запуск
```bash
npm install
npm run dev
# http://localhost:3000
```
API адрес по умолчанию — `http://localhost:8000`. Переопределить можно через `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-host
```

## Production
- Vercel/Netlify — простой способ деплоя (SSR/Static). Настройте переменные окружения.
- GitHub Pages — используйте статический экспорт (`next export`), см. корневой `README.md`.
