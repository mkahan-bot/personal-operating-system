# Property Central Command OS — Password-Protected Deployment

**Production Site:** https://property-central-command-os.whole-isle-6550.chatgpt.site

This deployment uses a server-side shared-password gate. Visitors need only the Site URL and shared password; no ChatGPT, GitHub, workspace, email, or other account is required.

## Security behavior

- Every dashboard page and API route is protected.
- The Site fails closed with HTTP 503 if its password secrets are missing.
- A correct password creates a signed, `HttpOnly`, `Secure`, `SameSite=Lax` cookie valid for 24 hours.
- Passwords and signing secrets are read only from hosted environment secrets and are never committed to GitHub or sent back to the browser.
- The AI endpoint is protected by the same password session.
- GitHub Pages publishes only a redirect/entry page to the protected production Site. It does not publish the dashboard or its data.

## Required ChatGPT Sites configuration

In **Sites → Property Central Command OS → More actions → Settings**, add these hosted secrets:

- `SITE_ACCESS_PASSWORD` — the shared third-party password.
- `SITE_SESSION_SECRET` — a random value of at least 32 characters, separate from the password.
- `OPENAI_API_KEY` — required for the AI advisor.
- `OPENAI_MODEL` — optional; defaults to `gpt-5`.

Set the Site audience to **Anyone on the internet** and publish the approved version. The public audience setting lets unauthenticated visitors reach the built-in password screen; the built-in password gate then controls dashboard access.

Do not put secret values in `.openai/hosting.json`, source files, prompts, GitHub Actions files, or repository content.

## Deployment controls

- Production source branch: `main`
- Authentication tests run on every pull request to `main` and every push to `main`.
- GitHub Pages is not an application host; it redirects to the protected ChatGPT Site.
- The ChatGPT Sites deployment, hosted secrets, audience, and publishing state are managed in ChatGPT Sites.

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
