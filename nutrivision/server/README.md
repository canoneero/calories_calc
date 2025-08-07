# NutriVision Backend (FastAPI)

## Quickstart

```bash
cd server
python3 -m venv .venv
./.venv/bin/pip install --upgrade pip
./.venv/bin/pip install -r requirements.txt
./.venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open docs at http://localhost:8000/docs