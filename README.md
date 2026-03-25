# Hiring Form App

A full-stack hiring application form — React frontend + Express backend + PostgreSQL database.
Deployable on Render.com in minutes.

---

## Project Structure

```
hiring-form/
├── server.js           ← Express API server
├── package.json        ← Root (server) dependencies
├── render.yaml         ← Render.com deployment config
├── .env.example        ← Copy to .env for local dev
└── client/
    ├── package.json    ← React (Vite) dependencies
    ├── vite.config.js  ← Dev proxy to Express
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx     ← The hiring form UI
        └── index.css
```

---

## What the form collects

| Field | Type |
|---|---|
| Full Name | Text |
| Phone Number | Text |
| Date of Birth | Date |
| Government ID photo | Image upload (stored as base64 in DB) |
| Marital Status | Dropdown |
| Available Weekends | Toggle |
| Available Evenings | Toggle |
| On-call for emergencies | Toggle |
| Valid Driver's License | Toggle |
| Startup mindset (fast-changing environment) | Toggle |
| NDA Agreement | Checkbox (required) |

---

## Deploy on Render.com (Recommended)

### Option A — Automatic via render.yaml (easiest)

1. Push this folder to a **GitHub repo**
2. Go to [render.com](https://render.com) → New → **Blueprint**
3. Connect your GitHub repo
4. Render will read `render.yaml` and auto-create:
   - A **Web Service** (Node.js)
   - A **PostgreSQL Database**
5. After deploy, go to the Web Service → **Environment** tab
6. Note your `ADMIN_TOKEN` (auto-generated) — you'll use it to view submissions

### Option B — Manual setup on Render

1. Create a **PostgreSQL** database on Render (free tier)
2. Create a **Web Service**:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Environment: Node
3. Add environment variables:
   - `DATABASE_URL` → paste from your Render Postgres "Internal Database URL"
   - `ADMIN_TOKEN` → any secret string you choose
   - `NODE_ENV` → `production`

---

## Run Locally

```bash
# 1. Install server deps
npm install

# 2. Install client deps
cd client && npm install && cd ..

# 3. Copy env file and fill in your local DB URL
cp .env.example .env

# 4. Start server (port 3001)
npm run dev

# 5. In another terminal, start the React dev server (port 5173)
cd client && npm run dev
```

Visit: http://localhost:5173

---

## View Submissions (Admin)

```bash
curl https://your-app.onrender.com/api/applicants \
  -H "x-admin-token: YOUR_ADMIN_TOKEN"
```

Returns JSON with all applicants (no ID images — those are fetched separately).

### Fetch an applicant's ID image

```
GET /api/applicants/:id/id-image
Header: x-admin-token: YOUR_ADMIN_TOKEN
```

---

## Database Schema

```sql
CREATE TABLE applicants (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,
  id_image TEXT,              -- base64 encoded
  id_image_type VARCHAR(50),  -- image/jpeg etc
  marital_status VARCHAR(50),
  available_weekends BOOLEAN,
  available_evenings BOOLEAN,
  on_call_emergencies BOOLEAN,
  has_drivers_license BOOLEAN,
  startup_mindset BOOLEAN,
  nda_agreed BOOLEAN,
  submitted_at TIMESTAMP DEFAULT NOW()
);
```

The table is **auto-created** on first server start. No migrations needed.
