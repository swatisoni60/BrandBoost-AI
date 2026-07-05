# BrandBoost AI — MVP

An AI marketing & sales optimization platform. This is a **working core build**, not a
mockup: real auth, a real MongoDB-backed API, and a real OpenAI integration for the two
flagship AI features.

## What's actually built and functional

- **Auth**: signup/login with JWT, bcrypt password hashing, role field (admin / marketing
  manager / sales executive), rate-limited endpoints.
- **Dashboard**: revenue, sales, conversion rate, visitors, active campaigns, ROI — all
  computed from real MongoDB aggregations, plus a revenue trend area chart and a
  category-breakdown pie chart (Recharts).
- **Product Management**: full CRUD, glassmorphic table UI, modal form.
- **AI Marketing Generator**: takes product / audience / budget / platform / goal, calls
  an AI model (OpenAI or the free Groq — see below), returns campaign strategy, Instagram
  caption, Facebook ad, LinkedIn post, Google ad copy, CTA, hashtags, best posting time.
- **AI SEO Assistant**: product description, meta title/description, keywords, blog topic
  ideas, landing page copy — same AI + save-to-DB pattern.
- **AI Poster Generator**: generates a promotional poster image from product + style +
  tagline, using Pollinations.ai — completely free, no API key required.
- **Mobile navigation**: hamburger menu + slide-in drawer below tablet width (the sidebar
  is desktop-only; without this, mobile users can't navigate at all).
- **UI**: dark theme, glassmorphism, gradient accents, Framer Motion micro-interactions,
  responsive layout, toasts, empty/loading states.

## AI provider setup — free option available

By default the code expects an OpenAI-style API. OpenAI itself is paid (no real free
tier), so this project is configured to also work with **Groq**, which is free and
uses an identical API format — no code changes needed, just different `.env` values:

```
# OpenAI (paid)
OPENAI_API_KEY=sk-...
AI_BASE_URL=
AI_MODEL=

# OR Groq (free) — get a key at https://console.groq.com
OPENAI_API_KEY=gsk_your_groq_key
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=llama-3.3-70b-versatile
```

The Poster Generator needs no key at all (Pollinations.ai is unauthenticated).

## What's intentionally NOT built yet (by design, not by accident)

The original brief listed 19 feature modules plus a Python/ML microservice. Building all
of that as genuinely working code in one pass would have meant shallow, non-functional
stubs everywhere instead of a few things that actually work end-to-end. I prioritized
depth over breadth. Not built: Google OAuth, OTP verification, Social Media Studio,
Competitor Analysis, Sentiment Analysis, Sales Prediction (Python/FastAPI/scikit-learn),
Recommendation Engine, Discount Engine, Email Marketing, Marketing Calendar, Chatbot,
Poster Generator, PDF/Excel Reports, real-time Notifications, Settings/API Keys page.

See **"Extending this"** below for how each of those slots into the existing structure.

## Folder structure

```
brandboost-ai/
├── backend/
│   ├── src/
│   │   ├── config/db.js           # Mongo connection
│   │   ├── models/                # User, Product, Campaign (Mongoose schemas)
│   │   ├── middleware/            # auth (JWT + role guard), error handler
│   │   ├── controllers/           # business logic per module
│   │   ├── routes/                # Express routers
│   │   ├── utils/generateToken.js
│   │   └── server.js              # app entry point
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── app/
    │   ├── page.tsx                # landing page
    │   ├── login/, signup/         # auth pages
    │   ├── dashboard/page.tsx
    │   ├── products/page.tsx
    │   ├── ai-marketing/page.tsx
    │   └── ai-seo/page.tsx
    ├── components/                 # Sidebar, Navbar, DashboardCard, Charts
    ├── lib/api.ts                  # fetch wrapper with JWT
    ├── tailwind.config.ts
    └── package.json
```

## Running it locally

### 1. Backend

```bash
cd backend
cp .env.example .env
# fill in MONGO_URI (MongoDB Atlas free tier is fine), JWT_SECRET, OPENAI_API_KEY
npm install
npm run dev        # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev        # http://localhost:3000
```

Sign up, add a couple of products (so the dashboard charts have data), then try the AI
Marketing Generator and AI SEO Assistant.

## Database schema (current)

**User**: name, email, password (hashed), role (enum), company, avatar, isVerified, timestamps

**Product**: owner (ref User), name, description, category, price, inventory, images[],
sales, revenue, status (enum), timestamps, text index on name+category

**Campaign**: owner (ref User), product (ref Product, optional), type ("marketing" | "seo"),
inputs (mixed — what the user typed), output (mixed — the AI's structured JSON), status,
timestamps

## Extending this (roadmap)

Each future module follows the same pattern already established: a Mongoose model → an
Express controller → a route file registered in `server.js` → a Next.js page that calls
`lib/api.ts`. A few notes per module:

- **Sales Prediction / Customer Segmentation / Sentiment Analysis** — these are the ones
  that genuinely need Python. Stand up a separate FastAPI service (`ml-service/`), expose
  `/predict-sales`, `/segment-customers`, `/analyze-sentiment` endpoints, and call them
  from a new `mlController.js` in the Node backend (or directly from the frontend if you
  add CORS to the FastAPI service). Scikit-learn's `LinearRegression`/`Prophet`-style
  models work for sales forecasting; `KMeans` for segmentation; a pretrained sentiment
  pipeline (e.g. from `transformers`) or a simple TF-IDF + Logistic Regression for reviews.
- **Google Login / OTP** — add `passport-google-oauth20` and an OTP model + email/SMS
  provider (e.g. Nodemailer + a 6-digit code with 10-min expiry stored on the User doc).
- **Social Media Studio, Poster Generator, Email Marketing** — same OpenAI pattern as the
  two AI features already built; poster generation would call an image model (DALL·E or
  similar) instead of text completion.
- **Notifications** — add a `Notification` model + Socket.io for real-time push instead of
  polling.
- **Reports (PDF/Excel)** — `pdfkit` or `puppeteer` for PDF, `exceljs` for Excel exports of
  the dashboard aggregations that already exist.

## Tech stack actually used

Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Recharts,
lucide-react, react-hot-toast.
Backend: Node.js, Express, MongoDB/Mongoose, JWT, bcrypt, OpenAI SDK, express-rate-limit.
Deploy targets: Vercel (frontend), Render (backend), MongoDB Atlas (database) — as
specified in the original brief.
