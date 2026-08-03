# H&A Command Center — Personal Operating System

An editable, mobile-friendly operating dashboard for business execution, compliance, delegation, and protected family priorities.

## Current beta

- Three configurable workspaces: Personal Operating System, Jefferson Compliance, and H&A Weekly Execution
- Inline editing plus full add/edit forms
- Editable workspaces, branding, and categories
- Search and filters for category, status, and priority
- Live operational metrics
- Browser persistence via `localStorage`
- Full JSON import/export
- AI-ready JSON command interface for add, update, and archive actions
- Seed records reconstructed from prior command-center materials and project conversations

The beta intentionally flags historical deadlines for review. Seeded facts should be validated in the dashboard rather than assumed current.

## Run locally

Open `index.html` directly in a modern browser. No build step or package installation is required.

## Deploy

GitHub Pages deploys automatically from `main` using `.github/workflows/pages.yml`.

Repository settings required: **Settings → Pages → Source: GitHub Actions**.

## Data and privacy

This beta stores changes only in the current browser. Use **Export** regularly. JSON files may contain private operational information and should not be committed to this public repository.

## Next production phase

Add authentication, role-based permissions, shared real-time storage, audit history, archived-record recovery, and a protected server-side AI update endpoint. Supabase is the recommended shared data layer.
