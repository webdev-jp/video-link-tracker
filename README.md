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

This repo includes a [`render.yaml`](render.yaml) Blueprint, so Render can set up the service, env vars, and persistent disk in one pass:

1. Push this repo to GitHub (already done if you're reading this from `webdev-jp/video-link-tracker`).
2. Go to [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints) → **New Blueprint Instance** → connect your GitHub account (if not already) → select this repo.
3. Render reads `render.yaml` and shows one field to fill in: `DASHBOARD_PASSWORD`. Set a real password there.
4. Click **Apply**. Render provisions the web service on the `starter` plan with a 1GB persistent disk mounted at `/data` (needed because Render's default filesystem is wiped on every deploy — the free plan doesn't support disks, which is why this uses `starter`, roughly $7/mo plus ~$0.25/mo for the disk).
5. Once deployed, your dashboard is at `https://<your-service>.onrender.com/dashboard` (user `admin`, password from step 3), and tracked links are `https://<your-service>.onrender.com/v/<slug>`.

If you'd rather not use the Blueprint, you can set the same things up manually: **New +** → **Web Service** → connect the repo → build command `npm install`, start command `npm start` → add env vars `DASHBOARD_USER`, `DASHBOARD_PASSWORD`, `DB_PATH=/data/tracker.db` → add a persistent disk mounted at `/data`.

## Notes

- Auth is a single shared username/password (HTTP Basic Auth) — fine for one person, not built for a team.
- No YouTube API key or OAuth is required for v1; video titles are fetched via YouTube's public oEmbed endpoint.
