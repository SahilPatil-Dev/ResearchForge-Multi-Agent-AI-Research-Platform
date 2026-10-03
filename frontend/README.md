# ResearchForge frontend

The frontend is a Next.js App Router application using React, TypeScript,
Tailwind CSS, and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:3000`. The API defaults to
`http://localhost:8000/api/v1`; set `NEXT_PUBLIC_API_BASE_URL` in a local
`.env.local` file when the backend is hosted elsewhere.

Useful scripts:

```bash
npm run build
npm run start
npm run lint
npm run typecheck
```

The public landing page lives at `/`. The authenticated workspace is at
`/workspace`; research creation, history, report details, profile, and settings
remain available from the workspace navigation. Research details subscribe to
the backend's authenticated server-sent event stream, with API polling retained
as a fallback.
