# Video Link Tracker

Embed YouTube videos on pages you control, and track views/plays/completion per link.

## What this does

- You paste a YouTube URL into the dashboard.
- You get back a link like `https://yourdomain.com/v/abc123`.
- Anyone who opens that link sees your video embedded on your own page (not youtube.com), and the visit gets logged: page view, referrer, play, and watch-progress (25/50/75/100%).
- The dashboard shows view/play/completion counts and top referrers per video.

**What this does *not* do:** it can't stop someone from finding the underlying YouTube URL (it's visible in the page's HTML) or from re-sharing it outside your tracked link. There's no domain-lock or DRM here — that's a Vimeo-only feature, tracked as a possible v2.

## Local development

```bash
npm install
cp .env.example .env
# edit .env and set a real DASHBOARD_PASSWORD
npm run dev
```

Visit `http://localhost:3000/dashboard` (Basic Auth: user/password from `.env`).

## Deploying to Render

1. Push this project to a git repo (GitHub/GitLab).
2. In Render: **New +** → **Web Service** → connect the repo.
3. Build command: `npm install`. Start command: `npm start`.
4. Set environment variables in Render's dashboard (do **not** commit `.env`):
   - `DASHBOARD_USER`
   - `DASHBOARD_PASSWORD`
   - `DB_PATH=/data/tracker.db`
5. **Add a persistent disk** (Render → your service → Disks): mount path `/data`, at least 1GB. Without this, the SQLite database is wiped on every deploy/restart because Render's default filesystem is ephemeral.
6. Deploy. Your dashboard is at `https://<your-service>.onrender.com/dashboard`, and tracked links are `https://<your-service>.onrender.com/v/<slug>`.

## Notes

- Auth is a single shared username/password (HTTP Basic Auth) — fine for one person, not built for a team.
- No YouTube API key or OAuth is required for v1; video titles are fetched via YouTube's public oEmbed endpoint.
