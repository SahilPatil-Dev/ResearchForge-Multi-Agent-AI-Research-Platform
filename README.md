# ResearchForge

ResearchForge is a full-stack, multi-agent research platform. A user submits a
question; specialized agents search the web, read selected sources, prepare a
structured report, and critique the result. While a job runs, its detail page
shows progress messages emitted by the actual backend pipeline.

> ResearchForge is an AI research aid, not an authority. Review the cited
> material and verify important claims, especially before making high-impact
> decisions. A critic score is feedback, not a guarantee of correctness.

**Live application:** https://researchforge-multi-agent-system.vercel.app/

## What it does

- Finds web material with the Tavily search tool.
- Reads selected URLs and extracts facts, dates, evidence, arguments, and
  limitations.
- Produces a Markdown report with an introduction, key findings, analysis,
  limitations, conclusion, and source URLs.
- Scores the draft and records critic feedback. If the score is below the
  configured threshold and revisions are enabled, the report is revised and
  reviewed again.
- Saves research jobs and reports to the database, scoped to the authenticated
  user's account.
- Streams persisted, real pipeline progress to the research detail view.
- Provides research history, searchable topics, profile settings, and report
  copy controls.
- Offers a responsive Next.js interface with animated transitions and
  persistent dark and light appearance settings.

## How a research run works

```text
Question
  → Search Agent (Tavily web search)
  → Reader Agent (selected source URLs)
  → Writer chain (structured report)
  → Critic (score and feedback)
  → Revision + another critique, when configured and needed
  → Completed report
```

The live activity view is not a timed animation. The pipeline publishes
messages as real steps begin and finish, including source-reading updates. The
backend stores the latest message on the research job. The authenticated
server-sent events (SSE) endpoint checks for changes and sends updated events;
the frontend falls back to API polling if its stream is unavailable.

## Architecture and technologies

| Area | Technologies |
| --- | --- |
| Frontend | Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion |
| API | FastAPI, Pydantic, SQLAlchemy async |
| Research | LangChain agents/chains, Mistral chat model, Tavily search, source scraping |
| Identity | JWT-based authentication |
| Database | SQLAlchemy-supported async database configured with `DATABASE_URL` |
| Progress | Authenticated Server-Sent Events (SSE) |

The Mistral model is configured with `MISTRAL_MODEL` (default: `codestral-2508`).
Search and source limits and the revision count are configurable in
`backend/app/core/config.py`.

## Application routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Product landing page |
| `/login` | Public | Sign in |
| `/register` | Public | Create an account |
| `/workspace` | Signed in | Dashboard and recent research |
| `/research/new` | Signed in | Submit a research question |
| `/research/[id]` | Signed in | Job status, live progress, report, and review |
| `/history` | Signed in | Search previous jobs |
| `/profile` | Signed in | Update account profile |
| `/settings` | Signed in | Redirects to profile |

## Run locally

### Requirements

- Node.js compatible with the installed Next.js release and npm.
- Python and the backend dependencies in `backend/requirements.txt`.
- A database URL accepted by SQLAlchemy's async engine.
- Mistral and Tavily API keys.

### Configure the backend

In a terminal, change to `backend/`, create a local `.env` file, and provide
the settings required by `backend/app/core/config.py`:

```dotenv
APP_NAME=ResearchForge API
APP_VERSION=1.0.0
DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/DATABASE
MISTRAL_API_KEY=replace-with-your-key
TAVILY_API_KEY=replace-with-your-key
MISTRAL_MODEL=codestral-2508
JWT_SECRET_KEY=replace-with-a-long-random-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
MAX_SEARCH_RESULTS=5
MAX_SOURCES_TO_READ=3
MAX_SCRAPED_CHARS=8000
MAX_REVISIONS=1
```

Install the backend dependencies and start the API:

```bash
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

Run those commands from the `backend/` directory. The API is served at
`http://localhost:8000`; interactive API documentation is available at
`http://localhost:8000/docs`. On startup, the application creates missing
tables and adds the `progress_message` column to an existing `research_jobs`
table when needed.

Keep API keys, database credentials, and the JWT signing secret in environment
configuration. Do not commit a populated `.env` file. Configure a strong,
unique `JWT_SECRET_KEY` for each deployed environment.

### Configure the frontend

In a second terminal:

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env.local` if the API is not at its
local default, and set the public API base URL:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

Start the Next.js development server:

```bash
npm run dev
```

Open `http://localhost:3000`. For production, build and start the app with
`npm run build` and `npm run start`. Set `NEXT_PUBLIC_API_BASE_URL` to the
deployed API URL at build time.

### Frontend scripts

Run these commands from `frontend/`:

```bash
npm run dev        # Next.js development server
npm run build      # Optimized production build
npm run start      # Serve the production build
npm run lint       # ESLint
npm run typecheck  # TypeScript
```

## API surface

API routes are prefixed with `/api/v1`.

### Authentication and users

```text
POST  /api/v1/auth/register
POST  /api/v1/auth/login
GET   /api/v1/users/me
PATCH /api/v1/users/me
PATCH /api/v1/users/me/password
```

### Research

```text
POST   /api/v1/research
GET    /api/v1/research
GET    /api/v1/research/{id}
GET    /api/v1/research/{id}/events
DELETE /api/v1/research/{id}
```

The events route requires the same bearer token as other protected API
operations. It returns `text/event-stream` data containing the job `status` and
latest `progress_message`; it closes when the job completes or fails. Access is
checked against the signed-in user's job ownership.

Other useful endpoints:

```text
GET /health
GET /docs
GET /openapi.json
```

## Configuration reference

These settings are defined in `backend/app/core/config.py`:

| Setting | Required | Default / description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | SQLAlchemy async database URL |
| `MISTRAL_API_KEY` | Yes | Mistral API credential |
| `TAVILY_API_KEY` | Yes | Tavily API credential |
| `JWT_SECRET_KEY` | Yes | JWT signing secret |
| `JWT_ALGORITHM` | No | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `30` |
| `MISTRAL_MODEL` | No | `codestral-2508` |
| `MAX_SEARCH_RESULTS` | No | `5` |
| `MAX_SOURCES_TO_READ` | No | `3` |
| `MAX_SCRAPED_CHARS` | No | `8000` |
| `MAX_REVISIONS` | No | `1` |

The frontend uses `NEXT_PUBLIC_API_BASE_URL`; when it is not set, the API
client defaults to `http://localhost:8000/api/v1`.

## Deployment notes

- Set the frontend's `NEXT_PUBLIC_API_BASE_URL` to the public API base URL and
  rebuild the Next.js frontend after changing it.
- Configure the backend CORS allowlist in `backend/app/main.py` to include the
  exact deployed frontend origin. The repository currently includes the
  existing Vercel origin and local development origins.
- Provide all backend secrets and the production database URL through the
  hosting provider's environment configuration.
- The current research runner uses FastAPI `BackgroundTasks` and executes
  within the API process; it is not a distributed job queue. Account for that
  when choosing deployment workers, timeouts, and restart behavior.
- If a reverse proxy is used, allow SSE responses through without buffering.
  The endpoint sends keep-alive comments during quiet intervals.
- Use HTTPS in production and keep the frontend and backend origins in sync
  with CORS and deployment configuration.

## Project structure

```text
ResearchForge-Multi-Agent-AI-Research-Platform/
├── backend/
│   └── app/
│       ├── agents/       # Search, reader, writer, critic, revision pipeline
│       ├── api/          # Versioned FastAPI endpoints
│       ├── core/         # Settings and security
│       ├── db/           # Async database setup and initialization
│       ├── models/       # SQLAlchemy models
│       ├── schemas/      # Pydantic request/response models
│       └── services/     # Research job lifecycle
└── frontend/
    ├── app/              # Next.js App Router layouts and route entries
    └── src/
        ├── components/   # Workspace UI and shared controls
        ├── context/      # Authentication and appearance state
        ├── hooks/        # Research queries and mutations
        ├── lib/          # API client
        ├── screens/      # Landing, workspace, account and report screens
        └── types/        # Frontend API types
```

## Responsible use

The research workflow asks agents to avoid inventing information, preserve
source URLs, and identify limitations. These are model instructions, not
formal guarantees. Websites can change, sources can be incomplete, and an AI
summary or quality score can be wrong. Read the primary sources when accuracy
matters.
