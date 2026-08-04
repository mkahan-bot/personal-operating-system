# Personal Operating System — ChatGPT Sites API Migration

This branch adds a secure, server-side OpenAI API route for the Personal Operating System dashboard.

## What is included

- `worker.js` — full-stack JavaScript entry point
  - `GET /` serves the dashboard
  - `GET /api/health` reports whether the server secret is configured
  - `POST /api/ai` validates input and calls the OpenAI Responses API
- `dev-server.mjs` — zero-dependency local development server
- `test/worker.test.mjs` — route and response parsing tests
- `.openai/hosting.json` — ChatGPT Sites project metadata placeholder
- `.env.example` — required environment-variable names without secret values

## Security controls

- The OpenAI API key is read only from `OPENAI_API_KEY` on the server.
- No key is embedded in HTML, browser JavaScript, repository files, or `.openai/hosting.json`.
- API responses are not stored by OpenAI (`store: false`).
- Request size limits and content-type validation are enforced.
- `REQUIRE_AUTH=true` can restrict the AI endpoint to authenticated Site users.
- A hashed per-user safety identifier is sent when an authenticated user header is available.
- Browser responses include restrictive security headers.

## Local validation

Requires Node.js 20 or later.

```bash
npm run check
npm test
OPENAI_API_KEY=your-local-key REQUIRE_AUTH=false npm run dev
```

Do not commit a real key.

## ChatGPT Sites deployment

1. Open the existing Personal Operating System Site in ChatGPT Sites.
2. Import or attach this GitHub branch as the Site source.
3. In the Site's **Settings → Environment variables / Secrets**, add:
   - `OPENAI_API_KEY` as a secret
   - `OPENAI_MODEL` as `gpt-5` (optional)
   - `REQUIRE_AUTH` as `true`
4. Save a new version and deploy it.
5. Open `/api/health`; it should return `"configured": true`.
6. Submit a question through the dashboard and confirm `/api/ai` returns an answer.

The existing GitHub Pages deployment is static and cannot securely hold an OpenAI API key. Use ChatGPT Sites or another server-capable host for this branch.
