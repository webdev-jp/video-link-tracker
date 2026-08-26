const express = require('express');
const db = require('../db');

const router = express.Router();

const ALLOWED_TYPES = new Set(['play', 'progress_25', 'progress_50', 'progress_75', 'complete']);

router.post('/api/track/:slug', express.json(), (req, res) => {
  const video = db.prepare('SELECT id FROM videos WHERE id = ?').get(req.params.slug);
  if (!video) return res.status(404).json({ error: 'Video not found.' });

  const { type } = req.body || {};
  if (!ALLOWED_TYPES.has(type)) {
    return res.status(400).json({ error: 'Invalid event type.' });
  }

  db.prepare(
    'INSERT INTO events (video_id, type, referrer, user_agent) VALUES (?, ?, ?, ?)'
  ).run(video.id, type, req.get('referer') || null, req.get('user-agent') || null);

  res.status(204).end();
});

module.exports = router;
