# Property Management Command Center — Password Access

This deployment uses a server-side shared-password gate. Visitors need only the Site URL and the shared password; no ChatGPT, GitHub, workspace, email, or other account is required.

## Security behavior

- Every page and API route is protected.
- The site fails closed with HTTP 503 if password secrets are missing.
- A correct password creates a signed, `HttpOnly`, `Secure`, `SameSite=Lax` cookie valid for 24 hours.
- Passwords and signing secrets are read only from hosted environment secrets and are never committed to GitHub or sent back to the browser.
- The AI endpoint is protected by the same password session.

## Required ChatGPT Sites configuration

In **Sites → Property Management Command Center → More actions → Settings**, add these hosted secrets:

- `SITE_ACCESS_PASSWORD` — the shared third-party password.
- `SITE_SESSION_SECRET` — a random value of at least 32 characters, separate from the password.
- `OPENAI_API_KEY` — required only for the AI advisor.
- `OPENAI_MODEL` — optional; defaults to `gpt-5`.

Then set the Site audience to **Anyone on the internet** and redeploy the approved saved version. The Site must be public at the platform-sharing layer so unauthenticated visitors can reach the built-in password page; the built-in password gate then controls dashboard access.

Do not put secret values in `.openai/hosting.json`, source files, prompts, or attachments.

## Local validation

Requires Node.js 20 or later.

```bash
npm run check
npm test
SITE_ACCESS_PASSWORD=test-password \
SITE_SESSION_SECRET=0123456789abcdef0123456789abcdef \
OPENAI_API_KEY=your-local-key \
npm run dev
```
