# NutriVision

Клон FatSecret с современным, простым интерфейсом, веб и Android (Expo) + FastAPI backend. Поддерживает загрузку фото и распознавание (заглушка). Дальше можно подключить реальную ML‑модель и полный дневник калорий.

## Структура
- `server/`: FastAPI backend (`/health`, `/api/v1/recognize`)
- `web/`: Next.js 15 + Tailwind, страница загрузки и вызова API
- `mobile/`: Expo React Native (TypeScript), выбор фото и вызов API

## Быстрый старт

### 1) Backend (FastAPI)
Требуется Python 3.13+. Если нет прав на venv — используется локальная установка пакетов.

```bash
cd server
# Установка зависимостей (user install)
python3 -m pip install --break-system-packages -r requirements.txt

# Запуск (указывает каталог с приложением)
~/.local/bin/uvicorn app.main:app --app-dir server --reload --host 0.0.0.0 --port 8000
# Проверка
curl http://localhost:8000/health
```

Эндпоинты:
- `GET /health` → `{ "status": "ok" }`
- `POST /api/v1/recognize` form-data `image` → `{ items, total_calories }` (заглушка)

### 2) Web (Next.js)
```bash
cd web
npm install
npm run dev
# Откройте http://localhost:3000
```
По умолчанию фронт вызывает `http://localhost:8000`. Для продакшена используйте ENV:
- Создайте `.env.local` в `web/`:
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-host
```

### 3) Mobile (Expo, Android)
```bash
cd mobile
npm install
npx expo start
```
- Для эмулятора Android замените API адрес в `mobile/App.tsx`:
  - Эмулятор Android: `http://10.0.2.2:8000`
  - Физическое устройство: укажите IP вашей машины в одной сети, например `http://192.168.1.10:8000`

## Deploy Web на GitHub Pages (вариант)
- Рекомендуется деплой web через Vercel/Netlify. Для GitHub Pages можно настроить static export:
  1. В `web/next.config.ts` установить `output: "export"` и при необходимости `basePath`/`assetPrefix`.
  2. В `web/package.json` добавить скрипт `export` → `next build && next export`.
  3. Настроить GitHub Actions workflow для публикации содержимого `web/out/` в Pages.

Пример `.github/workflows/deploy-web.yml`:
```yaml
name: Deploy Web
on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install deps
        run: |
          cd web
          npm ci
      - name: Build and export
        run: |
          cd web
          npm run build
          npx next export
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: web/out
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```
В Settings → Pages выберите источник GitHub Actions.

## Дальшая дорожная карта
- Auth и профиль: Supabase/Firebase/Auth.js
- Дневник калорий: продукты, блюда, приёмы пищи, цели, графики
- Сканер штрих‑кода, голосовой ввод
- Реальное распознавание еды: облачные API или локальная модель
- Синхронизация данных между web и mobile

## Лицензия
MIT