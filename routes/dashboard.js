const express = require('express');
const { nanoid } = require('nanoid');
const db = require('../db');
const { dashboardAuth } = require('../middleware/auth');
const { extractYoutubeId, fetchTitle } = require('../lib/youtube');

const router = express.Router();

router.use(dashboardAuth);
router.use(express.json());

router.get('/dashboard', (req, res) => {
  const videos = db
    .prepare(
      `SELECT
         v.*,
         SUM(CASE WHEN e.type = 'page_view' THEN 1 ELSE 0 END) AS views,
         SUM(CASE WHEN e.type = 'play' THEN 1 ELSE 0 END) AS plays,
         SUM(CASE WHEN e.type = 'complete' THEN 1 ELSE 0 END) AS completes
       FROM videos v
       LEFT JOIN events e ON e.video_id = v.id
       GROUP BY v.id
       ORDER BY v.created_at DESC`
    )
    .all();

  const referrersByVideo = {};
  for (const video of videos) {
    referrersByVideo[video.id] = db
      .prepare(
        `SELECT COALESCE(NULLIF(referrer, ''), '(direct)') AS referrer, COUNT(*) AS count
         FROM events
         WHERE video_id = ? AND type = 'page_view'
         GROUP BY referrer
         ORDER BY count DESC
         LIMIT 5`
      )
      .all(video.id);
  }

  res.render('dashboard', { videos, referrersByVideo });
});

router.post('/api/videos', async (req, res) => {
  const { youtubeUrl } = req.body || {};
  const youtubeId = extractYoutubeId(youtubeUrl || '');

  if (!youtubeId) {
    return res.status(400).json({ error: 'Could not parse a YouTube video ID from that URL.' });
  }

  const slug = nanoid(8);
  const title = await fetchTitle(youtubeId);

  db.prepare('INSERT INTO videos (id, youtube_id, title) VALUES (?, ?, ?)').run(
    slug,
    youtubeId,
    title
  );

  res.status(201).json({ slug, path: `/v/${slug}` });
});

module.exports = router;
