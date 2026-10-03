# Regnify — Regulatory Intelligence Platform

**Know the Change. Take Action.**

Regnify continuously monitors regulatory updates, synthesizes what changed, maps exact enterprise relevancy, and converts dense government notifications into prioritized compliance tasks.

Core intelligence flow:
`DISCOVER → UNDERSTAND → CLASSIFY → MATCH → EXPLAIN → ALERT → ACT → TRACK`

## Completed Architecture

Regnify is a fully integrated, full-stack application built with React, FastAPI, Firebase, and Gemini AI.

*   **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS (using a custom Calm Regulatory Intelligence design system).
*   **Backend:** Python 3.12 + FastAPI + Firebase Admin SDK + Google Generative AI (Gemini).
*   **Database:** Firestore (with strict `firestore.rules` for authenticated users only).
*   **Authentication:** Firebase Auth (Email/Password & Google OAuth).
*   **AI Integration:** Gemini API (1.5 Flash) integrated via RAG to provide grounded regulatory Q&A natively in the app.

### Graceful Degradation (Demo Mode)
The entire application is built with a "dual-mode" architecture. If Firebase credentials or Gemini API keys are not provided, both the frontend and backend degrade gracefully to use a deterministic local seed corpus. The app is **guaranteed to run out of the box** without configuration.

## Features

- **Dashboard / Overview:** Real-time statistics, recent alerts, upcoming deadlines, and compliance status.
- **Regulatory Monitoring:** Browse, filter, and read detailed breakdowns of global regulatory changes, including exact relevancy mapping.
- **Compliance Tasks:** Auto-generated compliance tasks from regulatory updates, complete with tracking and evidence uploads.
- **Actionable Alerts:** High-priority alerts pushed to the user for critical compliance risks.
- **Calendar:** Visual timeline of upcoming regulatory effective dates and task deadlines.
- **AI Assistant:** Gemini-powered chat interface grounded in the regulatory corpus to answer specific compliance questions.
- **Business Profile:** Configurable profile detailing jurisdictions, industries, and business activities to personalize regulatory relevancy matching.
- **Authentication & Onboarding:** Secure Firebase authentication flow with a guided onboarding experience for new users.

## Repository Layout

```text
regnify/
├─ frontend/            React + Vite + TypeScript + Tailwind CSS
│  ├─ src/
│  │  ├─ components/    Reusable design-system + domain components (AppShell, UI)
│  │  ├─ context/       AuthContext for state & session management
│  │  ├─ data/          Seed corpus (deterministic demo dataset)
│  │  ├─ lib/           Firebase init, API client (api.ts with auth injection)
│  │  └─ pages/         Route-level screens (Overview, Regulations, Assistant, etc.)
│  └─ .env.example
├─ backend/             FastAPI service (Firebase Admin + AI interpretation)
│  ├─ app/
│  │  ├─ routers/       AI, dashboard, compliance, regulations, calendar, alerts, etc.
│  │  ├─ services/      Firestore helpers, corpus seeder, Gemini AI client
│  │  ├─ config.py      Pydantic settings for robust environment loading
│  │  ├─ auth.py        Firebase token verification FastAPI dependency
│  │  └─ models.py      Pydantic models strictly mirroring frontend TypeScript
│  └─ .env.example
├─ firebase/            firestore.rules (Security rules protecting all collections)
└─ design-reference/    Source-of-truth design package (DESIGN.md)
```

## Running Locally

### 1. Backend Setup

```bash
cd backend
# Use Python 3.12 to avoid compilation errors with pydantic-core on Windows
py -3.12 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

If you have Firebase Admin credentials and a Gemini API key, add them to `backend/.env`. Otherwise, the backend will serve the demo corpus.

```bash
uvicorn app.main:app --reload --port 8000
```
> The API will be available at `http://localhost:8000/docs`. The backend automatically seeds Firestore with the initial corpus on startup if Firebase is configured.

### 2. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
cp .env.example .env
```

If you have Firebase Web credentials, add them to `frontend/.env`.

```bash
npm run dev
```
> The app will be available at `http://localhost:5173`. Vite automatically proxies `/api` requests to the FastAPI backend running on port 8000.

## Connectivity Contract

| Concern        | Provider                       | Fallback when unconfigured |
| -------------- | ------------------------------ | -------------------------- |
| Auth           | Firebase Authentication        | Local persisted session    |
| Data           | Firestore via FastAPI          | Deterministic seed corpus  |
| AI synthesis   | Gemini API (via backend)       | Deterministic rule engine  |

No credentials are ever stored in frontend code — only `VITE_*` public config values, and all privileged access (including Gemini API calls and Firestore admin operations) happens securely behind the FastAPI layer.