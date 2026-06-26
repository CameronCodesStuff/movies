const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
}, { passive: true });

const modal      = document.getElementById('player-modal');
const movieFrame = document.getElementById('movie-frame');
const modalTitle = document.getElementById('modal-title');

function openMovie(src, title) {
  movieFrame.src = src;
  modalTitle.textContent = title;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  addToHistory(title);
}

function closeMovie() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { movieFrame.src = ''; }, 300);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMovie();
    closeSearch();
  }
});

function getWatchlist() {
  try { return JSON.parse(localStorage.getItem('reel_watchlist') || '[]'); }
  catch { return []; }
}

function saveWatchlist(list) {
  localStorage.setItem('reel_watchlist', JSON.stringify(list));
}

function toggleWatchlist(btn) {
  const title = 'Avengers: Endgame';
  const list  = getWatchlist();
  const span  = btn.querySelector('span');
  const icon  = btn.querySelector('svg');
  const idx   = list.indexOf(title);

  if (idx === -1) {
    list.push(title);
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
  const btn  = document.querySelector('.btn-secondary');
  if (!btn) return;
  if (list.includes('Avengers: Endgame')) {
    btn.classList.add('added');
    btn.querySelector('span').textContent = 'Added';
    btn.querySelector('svg').innerHTML = '<polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2" fill="none"/>';
  }
}

function addToHistory(title) {
  try {
    const h = JSON.parse(localStorage.getItem('reel_history') || '[]');
    if (!h.includes(title)) h.unshift(title);
    localStorage.setItem('reel_history', JSON.stringify(h.slice(0, 50)));
  } catch {}
}

let toastTimer;
function showToast(message) {
  let toast = document.getElementById('reel-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'reel-toast';
    toast.style.cssText = `position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(20px);background:#1A1A1A;color:#F5F0E8;border:1px solid rgba(201,168,76,0.3);border-radius:8px;padding:12px 22px;font-family:'Inter',sans-serif;font-size:14px;z-index:99999;opacity:0;transition:opacity 0.25s ease,transform 0.25s ease;pointer-events:none;white-space:nowrap;`;
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
  showAllMovies();
  scrollToTop();
}

function navBrowse(e) {
  e.preventDefault();
  setActiveNav('nav-browse');
  closeSearch();
  showAllMovies();
  document.getElementById('movies-section').scrollIntoView({ behavior: 'smooth' });
}

function navNewReleases(e) {
  e.preventDefault();
  setActiveNav('nav-new');
  closeSearch();
  filterByYear(2019);
  document.getElementById('movies-section').scrollIntoView({ behavior: 'smooth' });
}

function navMyList(e) {
  e.preventDefault();
  setActiveNav('nav-mylist');
  closeSearch();
  showMyListMovies();
  document.getElementById('movies-section').scrollIntoView({ behavior: 'smooth' });
}

function showAllMovies() {
  document.getElementById('section-title').textContent = 'Now Showing';
  const cards = document.querySelectorAll('.movie-card');
  cards.forEach(c => c.style.display = '');
  document.getElementById('no-results').style.display = 'none';
  document.getElementById('coming-soon-hint').style.display = '';
}

function filterByYear(year) {
  document.getElementById('section-title').textContent = 'New Releases';
  const cards = document.querySelectorAll('.movie-card');
  let shown = 0;
  cards.forEach(c => {
    const match = parseInt(c.dataset.year) >= year;
    c.style.display = match ? '' : 'none';
    if (match) shown++;
  });
  document.getElementById('no-results').style.display = shown === 0 ? '' : 'none';
  document.getElementById('coming-soon-hint').style.display = shown === 0 ? 'none' : '';
}

function showMyListMovies() {
  document.getElementById('section-title').textContent = 'My List';
  const list  = getWatchlist();
  const cards = document.querySelectorAll('.movie-card');
  let shown   = 0;
  cards.forEach(c => {
    const match = list.includes(c.dataset.title);
    c.style.display = match ? '' : 'none';
    if (match) shown++;
  });
  document.getElementById('no-results').style.display = shown === 0 ? '' : 'none';
  document.getElementById('coming-soon-hint').style.display = 'none';
}

function filterMovies(query) {
  document.getElementById('section-title').textContent = query ? `Results for "${query}"` : 'Now Showing';
  const cards = document.querySelectorAll('.movie-card');
  let shown   = 0;
  cards.forEach(c => {
    const match = c.dataset.title.toLowerCase().includes(query.toLowerCase()) || c.dataset.genre?.toLowerCase().includes(query.toLowerCase());
    c.style.display = match ? '' : 'none';
    if (match) shown++;
  });
  document.getElementById('no-results').style.display = shown === 0 ? '' : 'none';
  document.getElementById('coming-soon-hint').style.display = shown === 0 ? 'none' : '';
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
    showAllMovies();
  }
}

function closeSearch() {
  const wrap  = document.getElementById('search-bar-wrap');
  const input = document.getElementById('search-input');
  wrap.classList.remove('open');
  input.value = '';
  showAllMovies();
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
    list.forEach(title => {
      const li = document.createElement('li');
      li.className = 'mylist-item';
      li.innerHTML = `<span>${title}</span><button onclick="removeFromListPanel('${title}')">✕</button>`;
      ul.appendChild(li);
    });
  }
}

function removeFromListPanel(title) {
  const list = getWatchlist().filter(t => t !== title);
  saveWatchlist(list);
  renderMyListPanel();
  restoreWatchlistBtn();
  showToast('Removed from your list');
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

  document.querySelectorAll('.movie-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = `opacity 0.5s ease ${0.1 + i * 0.08}s, transform 0.5s ease ${0.1 + i * 0.08}s`;
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100);
  });

  restoreWatchlistBtn();
});
