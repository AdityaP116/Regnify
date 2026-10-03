# Regnify Production Deployment

## Architecture

```text
Browser
   ↓ HTTPS
Frontend (Vite Static Site / Render)
   ↓ HTTPS API
FastAPI (Python Web Service / Render)
   ↓
Firebase (Firestore & Auth)
```

## Requirements

* Node version: 20+
* Python version: 3.12+
* Firebase project (Authentication, Firestore)
* Render account (or equivalent hosting for static sites and Python web services)

## Environment Variables

### Frontend (`render.yaml` envVars)

| Variable | Required | Where Used | Description | Example Format |
|---|---|---|---|---|
| `VITE_API_BASE_URL` | Yes | `api.ts` | Backend URL for API calls | `https://regnify-backend.onrender.com/api` |
| `VITE_FIREBASE_API_KEY` | Yes | `firebase.ts` | Public API Key for Firebase | `AIzaSyB...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | `firebase.ts` | Auth domain for Firebase | `regnify-abc.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Yes | `firebase.ts` | Firebase project ID | `regnify-abc` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Yes | `firebase.ts` | Firebase storage bucket | `regnify-abc.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | `firebase.ts` | Firebase messaging ID | `1234567890` |
| `VITE_FIREBASE_APP_ID` | Yes | `firebase.ts` | Firebase App ID | `1:123456:web:abcd` |

### Backend (`render.yaml` envVars)

| Variable | Required | Where Used | Description | Example Format |
|---|---|---|---|---|
| `FRONTEND_URL` | Yes | `main.py` (CORS) | Authorized frontend origin | `https://regnify.onrender.com` |
| `DEMO_MODE` | No | `main.py` | Run without Firebase connection | `"false"` |
| `FIREBASE_PROJECT_ID` | Yes* | `config.py` | Admin SDK Project ID | `regnify-abc` |
| `FIREBASE_CLIENT_EMAIL` | Yes* | `config.py` | Admin SDK Email | `firebase-adminsdk-xxx@regnify-abc.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | Yes* | `config.py` | Admin SDK Private Key | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` |
| `GEMINI_API_KEY` | No | `config.py` | Gemini API Key | `AIza...` |

*(Required if `DEMO_MODE=false`)*

## Local Production Build

To test the build locally:
1. `cd frontend && npm install && npm run build`
2. Validate output in `frontend/dist`.
3. `cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`

## Unified Render Deployment

We have configured a `render.yaml` at the repository root that deploys both the frontend and the backend automatically using Blueprint functionality.

1. Connect your GitHub repository to Render.
2. Select **Blueprint** and point it to `render.yaml`.
3. Render will provision two services:
   - `regnify-backend`: Python web service
   - `regnify-frontend`: Static site
4. The backend service is configured as follows:
   - **Root Directory**: `backend` (or uses `cd backend` in commands)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Python Version**: 3.12.10 (via `PYTHON_VERSION` env var)
5. After provisioning, set the required Environment Variables (Firebase secrets) via the Render Dashboard.
6. Update the `VITE_API_BASE_URL` in the frontend service settings to match the backend service URL (append `/api`).
7. Update the `FRONTEND_URL` in the backend service settings to match the frontend service URL.

## Firebase Configuration

* **Auth**: Enable Email/Password authentication in Firebase Console. Add your Render domain (`regnify.onrender.com`) to the Authorized Domains list in Firebase Auth settings.
* **Firestore**: Deploy the `firestore.rules` via Firebase CLI:
  `firebase deploy --only firestore:rules`

## Firestore Rules

The `firestore.rules` file locks down direct client-side access.
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false; // Route all via FastAPI
    }
  }
}
```

## CORS

The backend allows Cross-Origin requests exclusively from the URL specified in the `FRONTEND_URL` environment variable.

## Health Check

A health endpoint is available at `GET /health`.
```json
{
  "status": "ok",
  "version": "1.0.0",
  "environment": "production"
}
```

## Smoke Testing

1. Load Frontend URL (`https://regnify.onrender.com`)
2. Verify landing page renders cleanly.
3. Login or register a test account.
4. Complete Onboarding.
5. Verify Dashboard snapshot updates and reflects backend data.

## Troubleshooting

- **CORS Error on login**: Ensure `FRONTEND_URL` matches the frontend's exact origin.
- **500 Server Error**: Ensure `FIREBASE_PRIVATE_KEY` has proper line breaks (`\n`) if provided via raw string, or use the Base64/JSON file approach on Render.

## Rollback

To rollback a deployment:
- Go to Render Dashboard -> Events.
- Find a previous successful deployment and click "Deploy -> Rollback to this deploy".
