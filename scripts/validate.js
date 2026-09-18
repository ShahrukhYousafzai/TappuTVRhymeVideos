#!/usr/bin/env node
/**
 * Validates videos.json against the files actually present in the repo.
 * Run: node scripts/validate.js
 * Exits non-zero if any referenced file is missing or any video file is unlisted.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'videos.json'), 'utf8'));

let errors = 0;
const referenced = new Set();

for (const v of manifest.videos) {
  if (!v.file) continue;
  referenced.add(path.normalize(v.file));
  const p = path.join(root, v.file);
  if (!fs.existsSync(p)) {
    console.error(`MISSING (file): ${v.id} -> ${v.file}`);
    errors++;
  }
  // thumbnail, if set, is also resolved relative to the repo root
  if (v.thumbnail) {
    referenced.add(path.normalize(v.thumbnail));
    const tp = path.join(root, v.thumbnail);
    if (!fs.existsSync(tp)) {
      console.error(`MISSING (thumbnail): ${v.id} -> ${v.thumbnail}`);
      errors++;
    }
  }
  if (v.file && !/\.(mp4|webm|m3u8)$/.test(v.file)) {
    console.error(`BAD EXTENSION: ${v.id} -> ${v.file}`);
    errors++;
  }
}

// Warn about unlisted media files
const walk = (dir) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) { walk(p); continue; }
    if (/\.(mp4|webm|m3u8|jpg|jpeg|png|webp)$/i.test(f.name)) {
      const rel = path.normalize(path.relative(root, p));
      if (!referenced.has(rel)) console.warn(`UNLISTED: ${rel}`);
    }
  }
};
['videos'].forEach((d) => {
  const p = path.join(root, d);
  if (fs.existsSync(p)) walk(p);
});

if (errors) {
  console.error(`\n${errors} error(s) found.`);
  process.exit(1);
}
console.log(`OK: ${manifest.videos.length} videos validated.`);
