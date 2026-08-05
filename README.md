# Property Central Command OS — Public Link Deployment

**Production Site:** https://property-central-command-os.whole-isle-6550.chatgpt.site

The password gate has been removed. Anyone who has the published Site URL can view the dashboard without a ChatGPT, GitHub, workspace, email, or other account.

## Public-access behavior

- The dashboard page and health endpoint are publicly accessible.
- Former `/login` and authentication routes redirect to the dashboard.
- Responses include `noindex`, `nofollow`, and `noarchive` directives to discourage search-engine discovery; the URL should still be treated as shareable public access.
- No API key is delivered to the browser.
- The public AI advisor is disabled by default to prevent unrestricted visitors from consuming the OpenAI API balance.
- GitHub Pages publishes only a redirect/entry page to the production Site and does not publish dashboard data.

## ChatGPT Sites configuration

Set the Site audience to **Anyone on the Internet** and publish the current `main` version. OpenAI describes this audience as publicly accessible to anyone through the Site URL.

The previous hosted secrets `SITE_ACCESS_PASSWORD` and `SITE_SESSION_SECRET` are no longer used and may be deleted from the Site settings.

Optional hosted settings:

- `OPENAI_API_KEY` — required only if the AI advisor will be enabled.
- `OPENAI_MODEL` — optional; defaults to `gpt-5`.
- `PUBLIC_AI_ENABLED` — defaults to `false`. Set to `true` only after accepting that anyone with the link can send AI requests against the configured API key.

Do not put API keys or other secrets in `.openai/hosting.json`, source files, prompts, GitHub Actions files, or repository content.

## Deployment controls

- Production source branch: `main`
- Route and public-access tests run on every pull request to `main` and every push to `main`.
- GitHub Pages redirects to the ChatGPT Site.
- The ChatGPT Sites audience and Publish state are managed in ChatGPT Sites.

## Local validation

Requires Node.js 20 or later.

```bash
npm run check
npm test
OPENAI_API_KEY=your-local-key \
PUBLIC_AI_ENABLED=false \
npm run dev
```
