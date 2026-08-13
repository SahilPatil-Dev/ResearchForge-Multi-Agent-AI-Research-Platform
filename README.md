# ResearchForge

### Multi-Agent AI Research Platform

**ResearchForge** is a full-stack AI research platform that automatically searches the web, reads sources, generates a research report, and critically evaluates the result.

It is designed to provide a deeper research workflow than a simple chatbot response by combining multiple specialized AI agents into an iterative research pipeline.

**Live Project:** https://researchforge-multi-agent-system.vercel.app/

---

## Problem

AI platforms such as ChatGPT, Claude, and Perplexity provide powerful research capabilities, but research usage can be constrained by product plans, usage limits, context limits, or research-mode availability.

ResearchForge focuses on building a dedicated research system where users can perform **extended research workflows without an application-level fixed research-session limit**, subject to the limits and quotas of the underlying AI and search APIs.

The goal is not simply to generate an answer, but to:

- Search multiple sources
- Read relevant web content
- Generate a structured report
- Critically evaluate the report
- Automatically improve weak research
- Produce a higher-quality final result

---

## How ResearchForge Works

```text
User
 │
 │ Research Topic
 ▼
┌─────────────────────┐
│    FastAPI Backend   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Search Agent     │
│       Tavily        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Reader Agent     │
│   Web Scraping      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Writer Chain     │
│  Mistral Medium 3.5 │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Critic Agent     │
│  Quality Evaluation │
└──────────┬──────────┘
           │
       Score Good?
        /       \
      Yes        No
       │          │
       │          ▼
       │    ┌──────────────┐
       │    │ Revision /   │
       │    │ Re-execution │
       │    └──────┬───────┘
       │           │
       │           └──────► Research Pipeline
       │
       ▼
┌─────────────────────┐
│   Final Research    │
│       Report        │
└─────────────────────┘
```

---

## Multi-Agent Architecture

### 1. Search Agent

Uses Tavily to discover recent and relevant sources.

Responsibilities:

- Web search
- Source discovery
- URL collection
- Search-result summarization

### 2. Reader Agent

Reads selected web pages and extracts useful information.

Responsibilities:

- Source selection
- Web scraping
- Content extraction
- Deeper source analysis

### 3. Writer Chain

Uses **Mistral Medium 3.5** to transform the collected research into a structured report.

The generated report contains:

- Introduction
- Key findings
- Analysis
- Conclusion
- Sources

### 4. Critic Agent

The generated report is independently evaluated.

The critic checks:

- Accuracy
- Completeness
- Relevance
- Clarity
- Research quality
- Missing information

It produces a quality score and actionable feedback.

### 5. Automatic Revision Loop

ResearchForge does not blindly accept the first generated report.

If the critic determines that the report does not meet the required quality threshold, the system can send the research back through the appropriate research/revision chain.

```text
Research
   ↓
Report
   ↓
Critic
   ↓
Low Score?
   │
   ├── No ──► Final Report
   │
   └── Yes ─► Re-run / Revise
                  ↓
                Critic
                  ↓
             Final Report
```

This creates an **iterative research-and-evaluation workflow** instead of a single LLM generation step.

---

## Key Features

- Multi-agent AI research pipeline
- Web search with Tavily
- Web content extraction
- Mistral Medium 3.5 integration
- AI-generated research reports
- Critic-based quality evaluation
- Automatic revision workflow
- JWT authentication
- User accounts
- Research history
- Protected API endpoints
- REST API
- Interactive Swagger documentation
- React frontend
- Production deployment
- Environment-based configuration
- Error handling and validation

---

## Tech Stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT
- Uvicorn
- LangChain
- Mistral AI
- Tavily
- BeautifulSoup
- Requests

### Frontend

- React
- TypeScript
- Tailwind CSS 
- Vite
- CSS
- REST API

### Database

- SQLAlchemy ORM
- SQLite for development
- PostgresDB for Production
- Production database compatible architecture

### Deployment

- Vercel — Frontend
- Render — Backend
- GitHub — Source Control

---

## Project Structure

```text
Multi-Agent-System/
│
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── endpoints/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
```

---

## API

### Authentication

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Users

```text
GET   /api/v1/users/me
PATCH /api/v1/users/me
PATCH /api/v1/users/me/password
```

### Research

```text
POST   /api/v1/research
GET    /api/v1/research
GET    /api/v1/research/{id}
DELETE /api/v1/research/{id}
```

API documentation:

```text
/docs
/openapi.json
```

---

## Research Lifecycle

```text
pending
   ↓
running
   ↓
searching
   ↓
reading
   ↓
writing
   ↓
criticizing
   ↓
┌───────────────┐
│ Quality Check │
└───────┬───────┘
        │
   ┌────┴────┐
   │         │
 Good      Weak
   │         │
   │         ▼
   │      Revision
   │         │
   │         └──► Research
   │
   ▼
completed
```

If an unexpected error occurs:

```text
running → failed
```
---

## Why ResearchForge?

ResearchForge demonstrates how a modern AI application can move beyond a single LLM call and combine:

```text
LLMs
+
Agents
+
Web Search
+
Web Scraping
+
Critic Evaluation
+
Automatic Revision
+
Authentication
+
Database
+
REST API
+
React
+
Cloud Deployment
```

The result is an **iterative AI research system** designed to produce more structured, evaluated, and reliable research outputs.

---

## Author

**Sahil Patil**

Built as a full-stack AI engineering project demonstrating:

**AI Agents • LLM Integration • FastAPI • React • Authentication • Web Research • Database • Production Deployment**