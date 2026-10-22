# Spec: Real YouTube search in Streamline

## Goal
The search bar searches all of YouTube (not just the 8 built-in demo videos), and any
result plays inside the app's existing YouTube player. Free to run: uses the YouTube
Data API v3 free tier (no billing), with the key embedded at build time.

## Behaviour
1. Typing in the search bar keeps filtering the built-in videos instantly (no API call).
2. Pressing Enter / Search (iPhone keyboard "search" key) queries YouTube.
   - No search-as-you-type against YouTube: each search costs 100 of 10,000 free
     daily quota units (~100 searches/day), so only explicit submits call the API.
   - Identical searches in the same session are served from an in-memory cache.
3. While a YouTube search is showing, the results replace the feed, the "Up Next"
   list and the theater/compact lists. Category tabs don't filter YouTube results.
   Editing the query returns to local filtering; clearing it restores the demo feed.
4. Results show the real thumbnail, title, channel, view count, age and duration.
   Only embeddable videos are requested (videoEmbeddable=true), safeSearch=moderate.
5. Clicking a result loads it on the stage and switches the player to the YouTube
   embed engine automatically (playsinline so iPhone doesn't force fullscreen).
   Switching back to a demo video returns the player to its default engine.
6. Status line under the search bar: "Searching YouTube…", "N results from YouTube",
   "No YouTube results", or a plain-language error:
   - no key configured → explains VITE_YOUTUBE_API_KEY
   - quota exceeded → "Daily YouTube search limit reached…"
   - key rejected / network failure → short message.

## Configuration
- Key read from `import.meta.env.VITE_YOUTUBE_API_KEY` (inlined by Vite at build).
- Local: `.env.local` (already git-ignored). Netlify: Site configuration →
  Environment variables → `VITE_YOUTUBE_API_KEY`, then redeploy.
- The key is visible in the shipped JavaScript, so it must be restricted in Google
  Cloud to HTTP referrers (the Netlify domain + localhost) and to YouTube Data API v3.

## Mobile
- Search input uses 16px text on phones so iOS Safari doesn't zoom on focus.
- `type="search"` + `enterKeyHint="search"` for the iPhone keyboard.

## Files
- new `src/lib/youtubeSearch.ts` — API calls, mapping to `Video`, errors, cache
- `src/types.ts` — `Video.source?: 'youtube'`, `Video.thumbnailUrl?`
- `src/App.tsx` — search state, submit handler, results swap-in
- `src/components/SearchAndFilters.tsx` — form submit, status line, mobile input
- `src/components/FrontPageGrid.tsx`, Up Next list — real thumbnails
- `src/components/VideoPlayer.tsx` — auto-select YouTube engine, playsinline
- `src/components/VideoInfoBar.tsx` — "YouTube channel" instead of fake subscriber count
