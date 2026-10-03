# Regnify — Regulatory Intelligence Platform

**Know the Change. Take Action.**

Regnify continuously monitors regulatory updates, synthesizes what changed, maps exact
enterprise relevancy, and converts dense government notifications into prioritized
compliance tasks.

Core intelligence flow:
`DISCOVER → UNDERSTAND → CLASSIFY → MATCH → EXPLAIN → ALERT → ACT → TRACK`

## Repository layout

```
regnify/
├─ frontend/            React + Vite + TypeScript + Tailwind CSS + Firebase
│  ├─ src/
│  │  ├─ components/    Reusable design-system + domain components
│  │  ├─ context/       Auth + App data providers
│  │  ├─ data/          Seed corpus (deterministic demo dataset)
│  │  ├─ lib/           Firebase, API client, formatters, design tokens
│  │  └─ pages/         Route-level screens
│  └─ .env.example
├─ backend/             FastAPI service (Firebase Admin + AI interpretation)
│  ├─ app/
│  │  ├─ routers/       regulations, alerts, compliance, ai, profile
│  │  └─ services/      Firestore + regulatory processing + AI synthesis
│  └─ .env.example
├─ firebase/            firestore.rules, storage.rules, firestore.indexes.json
└─ design-reference/    Source-of-truth design package (DESIGN.md + screen exports)
```

## Design source of truth

`design-reference/calm_regulatory_intelligence/DESIGN.md` plus the per-screen
`code.html` / `screen.png` exports define the UI. The frontend mirrors those
tokens (colors, radii, typography, elevation) exactly.

- Headlines: **Newsreader** (serif)
- Body / data: **Manrope** (sans, tabular numerics enabled)
- Icons: **Material Symbols Outlined**
- Canvas `#f2fcf8`, primary `#004541`, primary-container `#115e59`,
  accent teal `#14b8a6`, AI indigo `#6366f1`

## Running locally

### Frontend

```bash
cd frontend
npm install
cp .env.example .env      # fill in Firebase web config
npm run dev               # http://localhost:5173
```

The app runs fully without Firebase or a backend: `AuthContext` and the API client
fall back to a deterministic local dataset and a local auth session. Adding
credentials in `.env` and running the backend switches it to live mode
automatically.

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # fill in Firebase admin + AI keys
uvicorn app.main:app --reload --port 8000
```

The FastAPI service exposes `/api/*` and degrades gracefully to the same seed
corpus when Firebase credentials are absent, so the frontend always has a
working data path.

## Connectivity contract

| Concern        | Provider                       | Fallback when unconfigured |
| -------------- | ------------------------------ | -------------------------- |
| Auth           | Firebase Authentication        | Local persisted session    |
| Data           | Firestore via FastAPI          | Deterministic seed corpus  |
| AI synthesis   | Backend LLM service            | Deterministic rule engine  |

No credentials are ever stored in frontend code — only `VITE_*` public config
values, and all privileged access happens behind the API layer.