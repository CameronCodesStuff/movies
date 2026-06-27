const ANILIST = 'https://graphql.anilist.co';

async function gql(query, vars = {}, _retry = 0) {
  const r = await fetch(ANILIST, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: vars })
  });
  if (r.status === 429 && _retry < 3) {
    await new Promise(res => setTimeout(res, 1500 * (_retry + 1)));
    return gql(query, vars, _retry + 1);
  }
  const j = await r.json();
  if (j.errors) throw new Error(j.errors[0].message);
  return j.data;
}

const MF = `
  id
  title { romaji english native }
  coverImage { extraLarge large color }
  bannerImage
  episodes
  status
  averageScore
  popularity
  genres
  season
  seasonYear
  format
  description(asHtml: false)
`;

const Q = {
  trending:    `{ Page(page:1,perPage:20){ media(type:ANIME,sort:TRENDING_DESC,status:RELEASING){ ${MF} } } }`,
  popular:     `{ Page(page:1,perPage:20){ media(type:ANIME,sort:POPULARITY_DESC){ ${MF} } } }`,
  topRated:    `{ Page(page:1,perPage:20){ media(type:ANIME,sort:SCORE_DESC,averageScore_greater:72){ ${MF} } } }`,
  newReleases: `{ Page(page:1,perPage:20){ media(type:ANIME,sort:START_DATE_DESC,status:RELEASING){ ${MF} } } }`,
  movies:      `{ Page(page:1,perPage:20){ media(type:ANIME,format:MOVIE,sort:POPULARITY_DESC){ ${MF} } } }`,

  seasonal: `query($season:MediaSeason,$year:Int){
    Page(page:1,perPage:20){
      media(type:ANIME,season:$season,seasonYear:$year,sort:POPULARITY_DESC,status_not:NOT_YET_RELEASED){ ${MF} }
    }
  }`,

  search: `query($s:String,$p:Int){
    Page(page:$p,perPage:24){
      pageInfo{ hasNextPage currentPage total }
      media(type:ANIME,search:$s,sort:SEARCH_MATCH){ ${MF} }
    }
  }`,

  genre: `query($g:String,$p:Int){
    Page(page:$p,perPage:24){
      pageInfo{ hasNextPage }
      media(type:ANIME,genre_in:[$g],sort:POPULARITY_DESC){ ${MF} }
    }
  }`,

  detail: `query($id:Int){
    Media(id:$id,type:ANIME){
      ${MF}
      trailer { id site thumbnail }
      studios(isMain:true){ nodes{ name } }
      nextAiringEpisode{ episode airingAt }
      characters(perPage:12,sort:ROLE){
        nodes{ id name{ full } image{ large } }
      }
      relations{
        edges{
          relationType
          node{ id title{ romaji } coverImage{ large } type format }
        }
      }
      recommendations(perPage:8){
        nodes{ mediaRecommendation{ id title{ romaji } coverImage{ large } } }
      }
    }
  }`,
};

function currentSeason() {
  const m = new Date().getMonth() + 1;
  if (m <= 3) return 'WINTER';
  if (m <= 6) return 'SPRING';
  if (m <= 9) return 'SUMMER';
  return 'FALL';
}

const AS = {
  _get: k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  _set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),

  history() { return this._get('lumis_anime_history') || []; },
  pushHistory(anime, ep) {
    let h = this.history().filter(x => x.id !== anime.id);
    h.unshift({ id: anime.id, ep, title: anime.title.english || anime.title.romaji, img: anime.coverImage?.large, ts: Date.now() });
    this._set('lumis_anime_history', h.slice(0, 30));
  },

  watchlist()       { return this._get('lumis_anime_wl') || []; },
  inWatchlist(id)   { return this.watchlist().some(x => x.id === id); },
  toggleWatchlist(a) {
    const wl = this.watchlist().filter(x => x.id !== a.id);
    if (!this.inWatchlist(a.id)) wl.unshift({ id: a.id, title: a.title.english || a.title.romaji, img: a.coverImage?.large, genres: a.genres, score: a.averageScore, ts: Date.now() });
    this._set('lumis_anime_wl', wl);
  },

  progress(id)      { return this._get(`lumis_ap${id}`) || { eps: [], last: null }; },
  saveProgress(id, ep) {
    const p = this.progress(id);
    p.last = ep;
    if (!p.eps.includes(ep)) p.eps.push(ep);
    this._set(`lumis_ap${id}`, p);
  },
  watched(id, ep)   { return this.progress(id).eps.includes(ep); },
};

const AP = {
  _navigating: false,
  get: n => new URLSearchParams(location.search).get(n),
  go(page, params) {
    if (this._navigating) return;
    this._navigating = true;
    const u = new URL(page, location.href);
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
    location.href = u.toString();
  }
};

const $a  = (s, ctx = document) => ctx.querySelector(s);
const $$a = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const mka = (tag, cls = '', html = '') => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
};

const afmt = {
  status: s => ({ RELEASING:'Airing', FINISHED:'Finished', NOT_YET_RELEASED:'Upcoming', CANCELLED:'Cancelled', HIATUS:'On Hiatus' }[s] || s || '—'),
  season: (s, y) => s ? `${s[0]}${s.slice(1).toLowerCase()} ${y||''}`.trim() : (y || '—'),
  score:  s => s ? (s / 10).toFixed(1) : null,
  plain:  h => h ? h.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim() : '',
};

function animeCard(a) {
  const title  = a.title.english || a.title.romaji;
  const img    = a.coverImage?.extraLarge || a.coverImage?.large || '';
  const score  = a.averageScore ? `<span class="ac-score">★ ${afmt.score(a.averageScore)}</span>` : '';
  const eps    = a.episodes ? `<span class="ac-eps">${a.episodes} ep</span>` : '';
  const saved  = AS.inWatchlist(a.id);
  const prog   = AS.progress(a.id);
  const pct    = (a.episodes && prog.eps?.length) ? Math.round((prog.eps.length / a.episodes) * 100) : 0;

  const c = mka('article', 'ac');
  c.innerHTML = `
    <div class="ac-poster">
      <img src="${img}" alt="${title}" loading="lazy" onerror="this.parentElement.classList.add('ac-no-img')" />
      <div class="ac-poster-fallback"><span>🎌</span><span class="ac-fallback-title">${title.toUpperCase()}</span></div>
      <div class="ac-overlay">
        <button class="ac-play-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
        </button>
      </div>
      ${pct > 0 ? `<div class="ac-prog"><div class="ac-prog-fill" style="width:${pct}%"></div></div>` : ''}
      <button class="ac-heart${saved ? ' saved' : ''}" title="${saved ? 'Remove' : 'Add to list'}">♥</button>
      ${a.format === 'MOVIE' ? '<span class="ac-badge movie">Movie</span>' : ''}
      ${a.status === 'RELEASING' ? '<span class="ac-badge airing">Airing</span>' : ''}
    </div>
    <div class="ac-info">
      <div class="ac-title">${title}</div>
      <div class="ac-meta">${score}${score && eps ? ' · ' : ''}${eps}</div>
    </div>`;

  c.querySelector('img').onerror = function() { this.style.display = 'none'; };
  c.querySelector('.ac-heart').addEventListener('click', e => {
    e.stopPropagation();
    AS.toggleWatchlist(a);
    const saved = AS.inWatchlist(a.id);
    e.currentTarget.classList.toggle('saved', saved);
    lumisToast(saved ? 'Added to Anime List' : 'Removed from Anime List');
  });
  c.addEventListener('click', () => AP.go('anime-detail.html', { id: a.id }));
  return c;
}

function animeSkel(el, n = 12) {
  el.innerHTML = Array(n).fill('<div class="ac ac-skel"></div>').join('');
}

function lumisToast(msg) {
  let t = document.getElementById('lumis-anime-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'lumis-anime-toast';
    t.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(20px);background:#1A1A1A;color:#F5F0E8;border:1px solid rgba(201,168,76,0.3);border-radius:8px;padding:12px 22px;font-family:Inter,sans-serif;font-size:14px;z-index:99999;opacity:0;transition:opacity .25s ease,transform .25s ease;pointer-events:none;white-space:nowrap;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; });
  clearTimeout(window._lumisToastTimer);
  window._lumisToastTimer = setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(20px)'; }, 2800);
}

const ANIME_SOURCES = [
  { name: 'AutoEmbed', url: (id, ep) => `https://autoembed.cc/anime/anilist/${id}-${ep}` },
  { name: 'VidBinge',  url: (id, ep) => `https://vidbinge.dev/embed/anime/${id}/${ep}` },
  { name: 'VidLink',   url: (id, ep) => `https://vidlink.pro/anime/${id}/${ep}` },
  { name: 'VidSrc',    url: (id, ep) => `https://vidsrc.dev/embed/anime?anilist=${id}&episode=${ep}` },
];
