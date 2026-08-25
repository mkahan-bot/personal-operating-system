# Google OAuth setup for v0.8.1

## 1. Create or select a Google Cloud project

Enable these APIs:

- Gmail API
- Google Drive API
- Google Calendar API

## 2. Configure Google Auth Platform

Configure Branding, Audience, and Data Access. For an H&A-only pilot, use the narrowest audience permitted by the organization and add the intended test account.

Requested scopes:

- `openid`
- `email`
- `profile`
- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/gmail.compose`
- `https://www.googleapis.com/auth/drive.metadata.readonly`
- `https://www.googleapis.com/auth/calendar.readonly`

`gmail.compose` is required by Gmail to create a draft and also technically authorizes sending. This site deliberately contains no Gmail send endpoint or send control. Treat the OAuth client and deployed source as security-sensitive and keep the OAuth audience limited during testing.

## 3. Create a Web application OAuth client

Create an OAuth 2.0 Client ID with application type **Web application**.

Add the live site's origin, displayed in the Integrations screen, under **Authorized JavaScript origins**. For the current Pages deployment the origin is:

```text
https://mkahan-bot.github.io
```

No client secret is placed in the browser, repository, or dashboard. This static token-model pilot does not use a redirect URI.

## 4. Connect from the dashboard

1. Open **Connect**.
2. Paste the Web Client ID.
3. Optionally enter the only Google account that may connect.
4. Save.
5. Select **Connect / refresh consent**.
6. Run **Test connections**.

Access tokens are session-only. A new user gesture is needed when the token expires. The dashboard checks that every requested scope was actually granted before marking the Google connection usable.

Because `gmail.readonly`, `gmail.compose`, and `drive.metadata.readonly` are classified by Google as restricted scopes, keep the pilot in testing/internal use unless the OAuth application has completed the verification and policy steps applicable to its audience.

## Production replacement

For confidential or unattended operation, replace this static token model with the protected Hermes/Command Center backend, server-side authorization-code flow, encrypted refresh-token storage, workspace-scoped RBAC/ABAC, PostgreSQL RLS, guarded outbox, and append-only external audit anchoring.
