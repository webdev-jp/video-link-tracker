const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/v/:slug', (req, res) => {
  const video = db.prepare('SELECT * FROM videos WHERE id = ?').get(req.params.slug);
  if (!video) return res.status(404).send('Video not found.');

  db.prepare(
    'INSERT INTO events (video_id, type, referrer, user_agent) VALUES (?, ?, ?, ?)'
  ).run(video.id, 'page_view', req.get('referer') || null, req.get('user-agent') || null);

  res.render('embed', { video });
});

module.exports = router;
