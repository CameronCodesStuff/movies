const TMDB_KEY  = '232a7338c36748bff95e5de149a21b95';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE  = 'https://image.tmdb.org/t/p/';

const SERVERS = [
  { name: 'Server 1', movie: (imdb, tmdb) => imdb ? `https://autoembed.co/movie/imdb/${imdb}` : `https://autoembed.co/movie/tmdb/${tmdb}`, tv: (imdb, s, e, tmdb) => imdb ? `https://autoembed.co/tv/imdb/${imdb}-${s}-${e}` : `https://autoembed.co/tv/tmdb/${tmdb}-${s}-${e}` },
  { name: 'Server 2', movie: (imdb, tmdb) => `https://vidlink.pro/movie/${tmdb}`,                                                          tv: (imdb, s, e, tmdb) => `https://vidlink.pro/tv/${tmdb}/${s}/${e}` },
  { name: 'Server 3', movie: (imdb, tmdb) => `https://vidsrc.net/embed/movie?tmdb=${tmdb}`,                                               tv: (imdb, s, e, tmdb) => `https://vidsrc.net/embed/tv?tmdb=${tmdb}&season=${s}&episode=${e}` },
  { name: 'Server 4', movie: (imdb, tmdb) => `https://multiembed.mov/directstream.php?video_id=${tmdb}&tmdb=1`,                           tv: (imdb, s, e, tmdb) => `https://multiembed.mov/directstream.php?video_id=${tmdb}&tmdb=1&s=${s}&e=${e}` }
];

let STATE = { page: 1, genre: '', query: '', totalPages: 1, loading: false };
let FEATURED = { tmdbId: null, imdbId: null, title: 'Avengers: Endgame' };

const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
}, { passive: true });

async function initHero() {
  try {
    const res  = await fetch(`${TMDB_BASE}/movie/299534?api_key=${TMDB_KEY}&append_to_response=external_ids`);
    const data = await res.json();
    const backdropUrl = data.backdrop_path ? `${IMG_BASE}original${data.backdrop_path}` : '';
    const posterUrl   = data.poster_path   ? `${IMG_BASE}w500${data.poster_path}`      : '';

    document.getElementById('hero-bg').src         = backdropUrl;
    document.getElementById('hero-rating').textContent = `★ ${data.vote_average?.toFixed(1) || '8.4'}`;
    document.getElementById('hero-year').textContent    = (data.release_date || '2019').split('-')[0];
    document.getElementById('hero-runtime').textContent = data.runtime ? `${Math.floor(data.runtime/60)}h ${data.runtime%60}m` : '3h 1m';
    document.getElementById('hero-genre').textContent   = data.genres?.slice(0,2).map(g => g.name).join(' / ') || 'Action / Sci-Fi';
    document.getElementById('hero-synopsis').textContent = data.overview || '';

    FEATURED.tmdbId = data.id;
    FEATURED.imdbId = data.external_ids?.imdb_id || '';
    FEATURED.posterUrl = posterUrl;
    FEATURED.backdropUrl = backdropUrl;

    restoreWatchlistBtn();
  } catch (e) {
    document.getElementById('hero-bg').src = 'images/endgame.jpg';
  }
}

async function loadMovies(reset = true) {
  if (STATE.loading) return;
  STATE.loading = true;

  const grid = document.getElementById('movies-grid');
  const loadingEl = document.getElementById('grid-loading');
  const noResults = document.getElementById('no-results');
  const loadBtn   = document.getElementById('load-more-btn');

  if (reset) {
    STATE.page = 1;
    grid.innerHTML = '<div class="grid-loading" id="grid-loading"><div class="loading-spinner"></div><span>Loading titles…</span></div>';
    noResults.style.display = 'none';
    loadBtn.style.display   = 'none';
  }

  let url;
  if (STATE.query) {
    url = `${TMDB_BASE}/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(STATE.query)}&page=${STATE.page}`;
  } else if (STATE.genre) {
    url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&with_genres=${STATE.genre}&page=${STATE.page}&sort_by=popularity.desc`;
  } else {
    url = `${TMDB_BASE}/trending/movie/week?api_key=${TMDB_KEY}&page=${STATE.page}`;
  }

  try {
    const res  = await fetch(url);
    const data = await res.json();

    const loader = document.getElementById('grid-loading');
    if (loader) loader.remove();

    STATE.totalPages = data.total_pages || 1;

    if (data.results?.length) {
      data.results.forEach(item => grid.appendChild(createCard(item)));
      loadBtn.style.display = STATE.page < STATE.totalPages ? 'block' : 'none';

      if (reset) {
        const titles = data.results.slice(0, 8).map(m => `★ ${(m.title||'').toUpperCase()}`).join(' &nbsp;&nbsp;·&nbsp;&nbsp; ');
        const doubled = `${titles} &nbsp;&nbsp;·&nbsp;&nbsp; ${titles} &nbsp;&nbsp;·&nbsp;&nbsp;`;
        document.getElementById('ticker-text').innerHTML = doubled;
      }
    } else if (reset) {
      noResults.style.display = 'block';
    }
  } catch (e) {
    const loader = document.getElementById('grid-loading');
    if (loader) loader.innerHTML = '<span style="color:#888">Failed to load — check your connection.</span>';
  } finally {
    STATE.loading = false;
  }
}

function createCard(item) {
  const title     = item.title || item.name || 'Unknown';
  const year      = (item.release_date || '').split('-')[0] || '';
  const rating    = item.vote_average ? item.vote_average.toFixed(1) : 'NR';
  const poster    = item.poster_path ? `${IMG_BASE}w342${item.poster_path}` : '';
  const tmdbId    = item.id;
  const safeTitle = title.replace(/'/g, "\\'");

  const article = document.createElement('article');
  article.className = 'movie-card';
  article.dataset.title = title;
  article.dataset.year  = year;
  article.dataset.tmdb  = tmdbId;
  article.onclick = () => openMovieByTmdb(tmdbId, title);

  article.innerHTML = `
    <div class="card-poster">
      ${poster
        ? `<img src="${poster}" alt="${title} poster" loading="lazy" onerror="this.parentElement.classList.add('no-image')" />`
        : ''}
      <div class="card-poster-fallback">
        <span class="fallback-icon">🎬</span>
        <span class="fallback-title">${title.toUpperCase()}</span>
      </div>
      <div class="card-overlay">
        <button class="card-play">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
        </button>
        <div class="card-overlay-meta">
          <span class="card-genre">${year}</span>
        </div>
      </div>
    </div>
    <div class="card-info">
      <h3 class="card-title">${title}</h3>
      <div class="card-details">
        <span class="card-rating">★ ${rating}</span>
        <span class="card-runtime">${year}</span>
      </div>
    </div>
  `;
  return article;
}

async function openMovieByTmdb(tmdbId, title) {
  showPlayerModal(title);
  try {
    const res  = await fetch(`${TMDB_BASE}/movie/${tmdbId}?api_key=${TMDB_KEY}&append_to_response=external_ids`);
    const data = await res.json();
    const imdbId = data.external_ids?.imdb_id || '';
    const poster = data.poster_path ? `https://image.tmdb.org/t/p/w342${data.poster_path}` : '';
    saveToHistory(title, String(tmdbId), poster, 'movie');
    loadMovieIframe(imdbId, tmdbId);
  } catch {
    loadMovieIframe('', tmdbId);
  }
}

const PROXY_BASE = 'https://unblockedmovies.detlaffcameron.workers.dev/';

let currentServer = 0;
let currentImdb   = '';
let currentTmdb   = '';
let useProxy      = false;

function showPlayerModal(title) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('player-modal').classList.add('open');
  document.getElementById('player-modal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  useProxy = false;
  const cb = document.getElementById('proxy-checkbox');
  if (cb) cb.checked = false;
  renderServerBtns();
}

function buildSrc(rawUrl) {
  if (useProxy) return PROXY_BASE + '?url=' + encodeURIComponent(rawUrl);
  return rawUrl;
}

function loadMovieIframe(imdbId, tmdbId) {
  currentImdb = imdbId;
  currentTmdb = tmdbId;
  const srv    = SERVERS[currentServer];
  const rawUrl = srv.movie(imdbId, tmdbId);
  document.getElementById('movie-frame').src = buildSrc(rawUrl);
}

function onProxyToggle() {
  useProxy = document.getElementById('proxy-checkbox').checked;
  const frame  = document.getElementById('movie-frame');
  frame.src = '';
  setTimeout(() => loadMovieIframe(currentImdb, currentTmdb), 100);
}

function renderServerBtns() {
  const btns = document.getElementById('server-btns');
  if (!btns) return;
  btns.innerHTML = SERVERS.map((s, i) =>
    `<button onclick="switchServer(${i})" style="font-size:11px;padding:4px 10px;border-radius:4px;border:1px solid ${i===currentServer?'var(--gold)':'rgba(255,255,255,0.15)'};background:${i===currentServer?'rgba(201,168,76,0.15)':'none'};color:${i===currentServer?'var(--gold)':'var(--grey)'};cursor:pointer;font-family:inherit;transition:all .2s">${s.name}</button>`
  ).join('');
}

window.switchServer = function(idx) {
  currentServer = idx;
  renderServerBtns();
  const frame = document.getElementById('movie-frame');
  frame.src = '';
  setTimeout(() => loadMovieIframe(currentImdb, currentTmdb), 100);
};

function closeMovie() {
  document.getElementById('player-modal').classList.remove('open');
  document.getElementById('player-modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { document.getElementById('movie-frame').src = ''; }, 300);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeMovie(); closeSearch(); }
});

function playFeatured() {
  showPlayerModal(FEATURED.title);
  if (FEATURED.tmdbId) {
    loadMovieIframe(FEATURED.imdbId, FEATURED.tmdbId);
  } else {
    document.getElementById('movie-frame').src = 'movies/movie.html';
  }
}

function getWatchlist() {
  try { return JSON.parse(localStorage.getItem('lumis_watchlist') || '[]'); } catch { return []; }
}

function saveWatchlist(list) {
  localStorage.setItem('lumis_watchlist', JSON.stringify(list));
}

function toggleWatchlist(btn) {
  const title = FEATURED.title;
  const list  = getWatchlist();
  const span  = btn.querySelector('span');
  const icon  = btn.querySelector('svg');
  const idx   = list.findIndex(i => i.title === title);

  if (idx === -1) {
    list.push({ title, tmdbId: FEATURED.tmdbId, imdbId: FEATURED.imdbId, posterUrl: FEATURED.posterUrl || '' });
    btn.classList.add('added');
    span.textContent = 'Added';
    icon.innerHTML = '<polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2" fill="none"/>';
    showToast(`"${title}" added to your list`);
  } else {
    list.splice(idx, 1);
    btn.classList.remove('added');
    span.textContent = 'My List';
    icon.innerHTML = '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>';
    showToast('Removed from your list');
  }
  saveWatchlist(list);
  renderMyListPanel();
}

function restoreWatchlistBtn() {
  const list = getWatchlist();
  const btn  = document.getElementById('hero-watchlist-btn');
  if (!btn) return;
  if (list.some(i => i.title === FEATURED.title)) {
    btn.classList.add('added');
    btn.querySelector('span').textContent = 'Added';
    btn.querySelector('svg').innerHTML = '<polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2" fill="none"/>';
  } else {
    btn.classList.remove('added');
    btn.querySelector('span').textContent = 'My List';
    btn.querySelector('svg').innerHTML = '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>';
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setActiveNav(id) {
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

function navHome(e) {
  e.preventDefault();
  setActiveNav('nav-home');
  closeSearch();
  STATE.query = '';
  STATE.genre = '';
  setActiveGenrePill('');
  document.getElementById('section-title').textContent = 'Now Showing';
  loadMovies(true);
  scrollToTop();
}

function navBrowse(e) {
  e.preventDefault();
  setActiveNav('nav-browse');
  closeSearch();
  STATE.query = '';
  STATE.genre = '';
  setActiveGenrePill('');
  document.getElementById('section-title').textContent = 'All Movies';
  loadMovies(true);
  document.getElementById('movies-section').scrollIntoView({ behavior: 'smooth' });
}

function navNewReleases(e) {
  e.preventDefault();
  setActiveNav('nav-new');
  closeSearch();
  STATE.query = '';
  STATE.genre = '27';
  setActiveGenrePill('27');
  document.getElementById('section-title').textContent = 'New Releases';
  loadMovies(true);
  document.getElementById('movies-section').scrollIntoView({ behavior: 'smooth' });
}

function navMyList(e) {
  e.preventDefault();
  setActiveNav('nav-mylist');
  closeSearch();
  showMyListGrid();
  document.getElementById('movies-section').scrollIntoView({ behavior: 'smooth' });
}

function showMyListGrid() {
  const list  = getWatchlist();
  const grid  = document.getElementById('movies-grid');
  const noRes = document.getElementById('no-results');
  const loadBtn = document.getElementById('load-more-btn');
  document.getElementById('section-title').textContent = 'My List';
  loadBtn.style.display = 'none';

  if (list.length === 0) {
    grid.innerHTML = '';
    noRes.style.display = 'block';
    noRes.textContent = 'Your list is empty. Add some movies!';
    return;
  }

  noRes.style.display = 'none';
  grid.innerHTML = list.map(item => `
    <article class="movie-card" onclick="openMovieByTmdb(${item.tmdbId}, '${(item.title||'').replace(/'/g,"\\'")}')">
      <div class="card-poster">
        ${item.posterUrl ? `<img src="${item.posterUrl}" alt="${item.title}" loading="lazy" onerror="this.parentElement.classList.add('no-image')" />` : ''}
        <div class="card-poster-fallback">
          <span class="fallback-icon">🎬</span>
          <span class="fallback-title">${(item.title||'').toUpperCase()}</span>
        </div>
        <div class="card-overlay">
          <button class="card-play">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
          </button>
        </div>
      </div>
      <div class="card-info">
        <h3 class="card-title">${item.title}</h3>
      </div>
    </article>
  `).join('');
}

function setActiveGenrePill(genre) {
  document.querySelectorAll('.genre-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.genre === genre);
  });
}

function switchGenre(btn, genre, label) {
  STATE.query = '';
  STATE.genre = genre;
  document.getElementById('search-input').value = '';
  setActiveGenrePill(genre);
  document.getElementById('section-title').textContent = label;
  loadMovies(true);
}

function loadMoreMovies() {
  STATE.page++;
  loadMovies(false);
}

let searchTimer;
function onSearchInput(val) {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    STATE.query = val.trim();
    STATE.genre = '';
    if (STATE.query) {
      setActiveGenrePill('');
      document.getElementById('section-title').textContent = `Results for "${STATE.query}"`;
      loadMovies(true);
    } else {
      document.getElementById('section-title').textContent = 'Now Showing';
      loadMovies(true);
    }
  }, 400);
}

function toggleSearch() {
  const wrap  = document.getElementById('search-bar-wrap');
  const input = document.getElementById('search-input');
  const open  = wrap.classList.toggle('open');
  if (open) {
    setTimeout(() => input.focus(), 200);
    document.getElementById('movies-section').scrollIntoView({ behavior: 'smooth' });
  } else {
    input.value = '';
    STATE.query = '';
    loadMovies(true);
  }
}

function closeSearch() {
  document.getElementById('search-bar-wrap').classList.remove('open');
  document.getElementById('search-input').value = '';
  STATE.query = '';
}

function toggleMyListPanel() {
  const panel   = document.getElementById('mylist-panel');
  const overlay = document.getElementById('mylist-overlay');
  const open    = panel.classList.toggle('open');
  overlay.classList.toggle('open', open);
  if (open) renderMyListPanel();
}

function renderMyListPanel() {
  const list  = getWatchlist();
  const ul    = document.getElementById('mylist-items');
  const empty = document.getElementById('mylist-empty');
  ul.innerHTML = '';
  if (list.length === 0) {
    empty.style.display = '';
  } else {
    empty.style.display = 'none';
    list.forEach(item => {
      const li = document.createElement('li');
      li.className = 'mylist-item';
      li.innerHTML = `<span>${item.title}</span><button onclick="removeFromListPanel('${(item.title||'').replace(/'/g,"\\'")}')">✕</button>`;
      ul.appendChild(li);
    });
  }
}

function removeFromListPanel(title) {
  saveWatchlist(getWatchlist().filter(i => i.title !== title));
  renderMyListPanel();
  restoreWatchlistBtn();
  showToast('Removed from your list');
}

let toastTimer;
function showToast(message) {
  let toast = document.getElementById('lumis-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'lumis-toast';
    toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(20px);background:#1A1A1A;color:#F5F0E8;border:1px solid rgba(201,168,76,0.3);border-radius:8px;padding:12px 22px;font-family:Inter,sans-serif;font-size:14px;z-index:99999;opacity:0;transition:opacity .25s ease,transform .25s ease;pointer-events:none;white-space:nowrap;';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2800);
}

window.addEventListener('DOMContentLoaded', () => {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(20px)';
    heroContent.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
    requestAnimationFrame(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    });
  }
  initHero();
  loadMovies(true);
});

function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
  document.getElementById('mobile-menu-overlay').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}

function closeMobileMenu() {
  document.getElementById('mobile-menu')?.classList.remove('open');
  document.getElementById('mobile-menu-overlay')?.classList.remove('open');
  document.getElementById('hamburger')?.classList.remove('open');
}

function saveToHistory(title, tmdbId, posterUrl, type) {
  try {
    const h = JSON.parse(localStorage.getItem('lumis_history') || '[]');
    const entry = { title, tmdbId, posterUrl: posterUrl || '', type: type || 'movie', watchedAt: Date.now() };
    const filtered = h.filter(i => i.tmdbId !== tmdbId);
    filtered.unshift(entry);
    localStorage.setItem('lumis_history', JSON.stringify(filtered.slice(0, 50)));
  } catch {}
}
