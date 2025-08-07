# NutriVision Backend (FastAPI)

## Quickstart

```bash
cd server
python3 -m pip install --break-system-packages -r requirements.txt
~/.local/bin/uvicorn app.main:app --app-dir server --reload --host 0.0.0.0 --port 8000
```

Open docs at http://localhost:8000/docs

Health check:
```bash
curl http://localhost:8000/health
```