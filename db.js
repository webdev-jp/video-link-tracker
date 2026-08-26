const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

const dbPath = process.env.DB_PATH || './data/tracker.db';
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const rawDb = new DatabaseSync(dbPath);
rawDb.exec('PRAGMA journal_mode = WAL;');

rawDb.exec(`
  CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    youtube_id TEXT NOT NULL,
    title TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_id TEXT NOT NULL REFERENCES videos(id),
    type TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_events_video_id ON events(video_id);
`);

// Thin wrapper so route code can use the same prepare().get/all/run shape
// as better-sqlite3 without binding positional params by hand everywhere.
const db = {
  prepare(sql) {
    const stmt = rawDb.prepare(sql);
    return {
      get: (...params) => stmt.get(...params),
      all: (...params) => stmt.all(...params),
      run: (...params) => stmt.run(...params),
    };
  },
  exec: (sql) => rawDb.exec(sql),
};

module.exports = db;
