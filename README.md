# Property Command Center — Public Link Deployment

**Public dashboard:** https://mkahan-bot.github.io/personal-operating-system/

**Hosted application:** https://property-command-center.whole-isle-6550.chatgpt.site

The password gate has been removed from the application code. Anyone who has either published URL can view the dashboard without a ChatGPT, GitHub, workspace, email, or other account, provided the ChatGPT Site audience is also set to **Anyone on the Internet**.

## Public-access behavior

- GitHub Pages serves the dashboard directly and requires no password or account.
- The hosted application page and health endpoint do not enforce a password session.
- Former `/login` and authentication routes redirect to the dashboard.
- Responses and the static mirror include `noindex`, `nofollow`, and `noarchive` directives to discourage search-engine discovery; the URLs must still be treated as public and shareable.
- No OpenAI API key is delivered to the browser.
- The public AI advisor is disabled by default to prevent unrestricted visitors from consuming the OpenAI API balance.

## ChatGPT Sites configuration

For the hosted application URL, set the Site audience to **Anyone on the Internet** and publish the current `main` version.

The previous hosted secrets `SITE_ACCESS_PASSWORD` and `SITE_SESSION_SECRET` are no longer used and may be deleted from the Site settings.

Optional hosted settings:

- `OPENAI_API_KEY` — required only if the AI advisor will be enabled.
- `OPENAI_MODEL` — optional; defaults to `gpt-5`.
- `PUBLIC_AI_ENABLED` — defaults to `false`. Set to `true` only after accepting that anyone with the link can send AI requests against the configured API key.

Do not put API keys or other secrets in `.openai/hosting.json`, source files, prompts, GitHub Actions files, or repository content.

## Deployment controls

- Production source branch: `main`
- Route, public-access, and static-mirror tests run on every pull request to `main` and every push to `main`.
- GitHub Pages deploys `public/index.html` as the direct public dashboard.
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
