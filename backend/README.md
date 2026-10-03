# Regnify — Backend

FastAPI backend that serves all `/api/*` endpoints consumed by the Regnify React frontend.

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Configuration

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

### Firebase Admin SDK

You need a Firebase service account to enable real Firestore access and token verification.

1. Go to [Firebase Console](https://console.firebase.google.com/) → **regnify-48493** → **Project Settings** → **Service Accounts**
2. Click **Generate new private key** → download the JSON
3. Either:
   - Set `GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccountKey.json`, OR
   - Copy `project_id`, `client_email`, `private_key` fields into `.env`

### Gemini API Key

Get a key from [Google AI Studio](https://aistudio.google.com/app/apikey) and set `GEMINI_API_KEY`.

### Demo Mode (No Credentials)

If Firebase and Gemini are not configured, the backend automatically serves the deterministic seed corpus from `app/data/seed_corpus.json`. All endpoints work in this mode.

## Running

```bash
# From the backend directory, with venv activated
uvicorn app.main:app --reload --port 8000
```

The Vite dev server proxies `/api` → `http://localhost:8000`, so no CORS issues during development.

## API Documentation

With the server running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health:** http://localhost:8000/health

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/dashboard` | Dashboard snapshot |
| GET | `/api/regulations` | All regulations |
| GET | `/api/regulations/domains` | Domain concentration |
| GET | `/api/regulations/{id}` | Single regulation |
| GET | `/api/sources` | Government sources |
| GET | `/api/alerts` | Regulatory alerts |
| GET | `/api/compliance/tasks` | Compliance tasks |
| POST | `/api/compliance/tasks` | Create task |
| PUT | `/api/compliance/tasks/{id}` | Update task status |
| GET | `/api/calendar` | Calendar deadlines |
| GET | `/api/business-profile` | Business profile |
| GET | `/api/notifications` | Notifications |
| POST | `/api/ai/query` | AI regulatory assistant |

## Architecture

```
app/
├── main.py          — FastAPI app, CORS, startup seeding
├── config.py        — Pydantic-settings configuration
├── auth.py          — Firebase token verification dependency
├── models.py        — Pydantic models (mirrors frontend types.ts)
├── routers/         — One file per resource group
└── services/
    ├── firebase.py  — Admin SDK init + Firestore helpers
    ├── seed.py      — Corpus loader + Firestore seeder
    └── gemini.py    — Gemini AI client with RAG
```
