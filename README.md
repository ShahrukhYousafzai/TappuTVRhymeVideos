# TappuTV Rhyme Videos

Self-hosted nursery rhyme videos for the [TappuTV](https://github.com/ShahrukhYousafzai/TappuTV) app.
This repo replaces the YouTube dependency with directly-serveable MP4 files, so playback is stable and offline-friendly.

## Structure

```
videos.json          # manifest consumed by the app
schema.json          # JSON schema for the manifest
videos/HindiRhymes/  # Hindi rhyme MP4s
videos/EnglishRhymes/# English rhyme MP4s (to be added)
thumbnails/          # poster images (jpg)
scripts/             # validation tooling
```

## Adding a video

1. Drop the MP4 into `videos/HindiRhymes/` or `videos/EnglishRhymes/` (H.264 + AAC recommended; keep files < 95 MB — GitHub rejects files > 100 MB).
2. Add a thumbnail to `thumbnails/`.
3. Add an entry to `videos.json`:

```json
{
  "id": "twinkle-twinkle",
  "title": "Twinkle Twinkle Little Star",
  "language": "en",
  "file": "videos/EnglishRhymes/twinkle-twinkle.mp4",
  "thumbnail": "thumbnails/twinkle-twinkle.jpg",
  "duration": 180,
  "channel": "@tapputv"
}
```

4. Validate:

```sh
node scripts/validate.js
```

## Consuming in TappuTV

The manifest resolves relative to its base URL. Once this repo is served via
GitHub Pages (`https://shahrukhyousafzai.github.io/TappuTVRhymeVideos/`),
point the app's data layer at it:

```ts
const MANIFEST_URL = 'https://shahrukhyousafzai.github.io/TappuTVRhymeVideos/videos.json';
```

Each entry's `file` and `thumbnail` resolve as `baseUrl + file`, and can be fed
straight into a native/HLS-capable `<video>` player — no YouTube SDK needed.

## GitHub limits to know

- Individual files must be < 100 MB.
- Repos are recommended to stay under 1–5 GB.
- For heavy catalogs, use [Git LFS](https://git-lfs.com) (free bandwith quotas apply) or a CDN/object storage and keep only the manifest here.

## License / rights

Only upload videos you own or have rights to distribute.
