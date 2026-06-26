# LUMIS 

## Pages

| Page | Description |
|---|---|
| `index.html` | Home — live trending grid, hero feature, search, genre filters |
| `catalogue.html` | Full hand-curated catalogue of 65+ titles |
| `watch.html` | Full watch page — poster, metadata, player, season/episode picker |
| `history.html` | Watch history grouped by date with timestamps |
| `404.html` | Custom not-found page, auto-redirects home after 5s |

---

## Features

- **Live TMDB data** — posters, backdrops, ratings, genres and overviews fetched in real time
- **4 streaming servers** — switch between Server 1–4 inside any player if one isn't working
- **Proxy toggle** — routes any server through your Cloudflare Worker at `unblockedmovies.detlaffcameron.workers.dev`
- **Season & episode picker** — TV shows open with a full season dropdown and episode grid on the watch page
- **Watch history** — every title you play is saved locally with a timestamp, grouped into Today / This Week / Earlier
- **My List** — watchlist saved to localStorage, accessible from the avatar icon
- **Search** — live search on the home page hits the TMDB search endpoint; catalogue search filters instantly
- **Genre pills** — filter the home grid by Action, Sci-Fi, Horror, Drama, Animation, Comedy
- **Installable PWA** — add to home screen on iOS or install via Chrome/Edge; service worker caches core files for offline use
- **Mobile hamburger menu** — auto-detects mobile, slides in from the right
- **View Transitions** — smooth fade-and-scale animations between pages in supported browsers
- **Sandboxed iframes** — the player iframe blocks pop-ups and external navigation attempts

---

## Tech Stack

- Vanilla HTML / CSS / JavaScript — no frameworks or build tools
- [TMDB API](https://www.themoviedb.org/documentation/api) — movie data and images
- Cloudflare Workers — proxy for unblocking streams (`worker.js`)
- GitHub Pages — hosting
- PWA (Web App Manifest + Service Worker)

---

## Streaming Servers

| # | Movie URL pattern | TV URL pattern |
|---|---|---|
| 1 | `autoembed.co/movie/tmdb/{id}` | `autoembed.co/tv/tmdb/{id}-{s}-{e}` |
| 2 | `vidlink.pro/movie/{id}` | `vidlink.pro/tv/{id}/{s}/{e}` |
| 3 | `vidsrc.net/embed/movie?tmdb={id}` | `vidsrc.net/embed/tv?tmdb={id}&season={s}&episode={e}` |
| 4 | `multiembed.mov/...` | `multiembed.mov/...` |

---

## File Structure

```
├── index.html          Home page
├── catalogue.html      Full catalogue
├── watch.html          Watch / player page
├── history.html        Watch history
├── 404.html            Not found page
├── style.css           Global styles
├── catalogue.css       Catalogue-specific styles
├── main.js             Home page logic (TMDB, player, watchlist)
├── catalogue.js        Catalogue logic (filters, posters, navigation)
├── manifest.json       PWA manifest
├── sw.js               Service worker
├── worker.js           Cloudflare Worker proxy (deploy separately)
└── images/
    ├── logo.png        LUMIS logo / favicon
    └── endgame.jpg     Hero fallback image
```

---

## Deployment

1. Push all files to a GitHub repository
2. Enable GitHub Pages in **Settings → Pages → Source: main branch**
3. Deploy `worker.js` to Cloudflare Workers separately — it is not part of the site
4. `404.html` is picked up automatically by GitHub Pages for any missing URL

---

## Cloudflare Worker

The proxy (`worker.js`) routes embed URLs through your Cloudflare Worker to bypass blocks. It strips `X-Frame-Options` headers, forwards browser-like `User-Agent` and `Referer` headers, and rewrites relative paths so embedded pages load correctly.

Deploy at [workers.cloudflare.com](https://workers.cloudflare.com) and update the `PROXY_BASE` constant in `main.js`, `catalogue.js` and `watch.html` to your worker's domain if it changes.

---

## TMDB API

This site uses the TMDB API for non-commercial personal use. All movie and TV metadata and images are © their respective owners.

> This site does not host any video content. All streams are embedded from third-party sources.
