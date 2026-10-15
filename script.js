/* PINKNOISE — script.js (versión final, archivo completo)
   1) DATOS (editá acá)  2) Reproductor  3) Tarjetas, filtros, archivo, menú */
(() => {
  'use strict';

  /* ---------- 1) DATOS ---------- */
  const FEATURED_ID = 'adela';   // id de la artista destacada

  const ARTISTS = [
    { id: 'rihanna', name: 'Rihanna', song: 'Disturbia', tags: ['POP Y2K', 'ICONO GLAM', 'ROCKSTAR'],
      bio: 'Si este archivo tuviera una chica de tapa, sería Rihanna. Paraguas en días de lluvia y Disturbia a las 2 a. m.' },
    { id: 'doja-cat', name: 'Doja Cat', song: 'Say So', tags: ['CLUB GIRL', 'ICONO GLAM'],
      bio: 'Rara, divertida y capaz de hacerte bailar y reír en la misma canción.' },
    { id: 'adela', name: 'ADÉLA', song: 'Nicole Kidman', tags: ['INTERNET GIRL', 'POP FEMME'],
      bio: 'Las canciones de ADÉLA son re adictivas, no las puedo dejar de escuchar.' },
    { id: 'karlee-girl', name: 'KARLEE GIRL', song: null, tags: ['INTERNET GIRL'],
      bio: 'Artista del archivo.' },
    { id: 'aespa', name: 'aespa', song: 'Supernova', tags: ['POP Y2K', 'CLUB GIRL'],
      bio: 'K-pop futurista con estética cyber y coros que se te quedan pegados toda la semana.' },
    { id: 'zara-larsson', name: 'Zara Larsson', song: 'Lush Life', tags: ['POP FEMME', 'CLUB GIRL'],
      bio: 'Lush Life es verano hecho canción. Punto.' },
    { id: 'slayyyter', name: 'Slayyyter', song: 'Mine', tags: ['CLUB GIRL', 'POP Y2K'],
      bio: 'Pop de club con alma de los 2000: brillo, glam y un poquito de caos.' },
    { id: 'pinkpantheress', name: 'PinkPantheress', song: "Boy's a liar", tags: ['INTERNET GIRL', 'NIGHT DRIVE'],
      bio: 'Canciones cortas, nostálgicas y muy de internet. Ideales para volver a casa de noche.' },
    { id: 'katseye', name: 'KATSEYE', song: 'Gnarly', tags: ['POP Y2K', 'POP FEMME'],
      bio: 'Energía de girl group nuevo, con mucha actitud y coreos para ensayar en el living.' },
    { id: 'troye-sivan', name: 'Troye Sivan', song: 'Rush', tags: ['NIGHT DRIVE', 'ICONO GLAM'],
      bio: 'Pop nocturno y brillante, perfecto para las playlists de después de medianoche.' },
    { id: 'sabrina-carpenter', name: 'Sabrina Carpenter', song: 'Espresso', tags: ['POP FEMME', 'DRAMA QUEEN'],
      bio: 'Brillitos, humor y siempre una frase más para dejarte pensando.' },
    { id: 'marina', name: 'MARINA', song: 'Primadonna', tags: ['DRAMA QUEEN', 'ALT / EMO'],
      bio: 'Primadonna es un himno para sentirse protagonista de una película pop.' },
    { id: 'laufey', name: 'Laufey', song: 'From the Start', tags: ['VINTAGE GIRL', 'NIGHT DRIVE'],
      bio: 'Melodías suaves con aire de jazz clásico, para días de lluvia y tazas de té.' }
  ];

  const FILTERS = ['TODOS', 'ROCKSTAR', 'POP Y2K', 'POP FEMME', 'CLUB GIRL', 'INTERNET GIRL',
                   'NIGHT DRIVE', 'VINTAGE GIRL', 'DRAMA QUEEN', 'ICONO GLAM', 'ALT / EMO'];

  const ACCENTS = ['var(--pink-2)', 'var(--aqua)', 'var(--lime)'];

  // Fotos del ARCHIVO (sin descripción)
  const PHOTOS = ['img/valen-2.jpg', 'img/valen-3.jpg', 'img/valen-4.jpg'];

  /* ---------- UTILIDADES ---------- */
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const byId = (id) => ARTISTS.find(a => a.id === id);
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  const fmt = (t) => {
    if (!isFinite(t)) return '0:00';
    return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  };
  const spotifyUrl = (a) => a.spotify ||
    'https://open.spotify.com/search/' + encodeURIComponent([a.name, a.song].filter(Boolean).join(' '));

  const PALETTES = [['#ff1493', '#050505'], ['#2ee6c5', '#050505'], ['#ff4da6', '#111111'], ['#b8ff1f', '#ff008c'], ['#a5fff0', '#ff1493']];
  const hash = (str) => { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; };

  /** Placeholder Y2K (SVG) cuando no hay foto */
  function placeholderArt(name) {
    const [a, b] = PALETTES[hash(name) % PALETTES.length];
    const ini = name.replace(/[^A-Za-zÀ-ÿ0-9 ]/g, '').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || '♪';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
      <rect width="300" height="300" fill="url(#g)"/>
      <path d="M230 30C234 60 246 72 276 76C246 80 234 92 230 122C226 92 214 80 184 76C214 72 226 60 230 30Z" fill="#fff" opacity=".9"/>
      <text x="150" y="196" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="150" fill="#fff" stroke="#050505" stroke-width="6" paint-order="stroke">${esc(ini)}</text>
      <text x="150" y="284" text-anchor="middle" font-family="VT323, monospace" font-size="20" fill="#fff" opacity=".85" letter-spacing="3">FOTO PRÓXIMAMENTE</text></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  const artistImage = (a) => a.image || `img/${a.id}.jpg`;

  /** Si la imagen no existe (o ya falló antes de que corra el script), pone el placeholder */
  function withFallback(img, name) {
    const ph = () => { img.src = placeholderArt(name); };
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) ph();
    else img.addEventListener('error', ph, { once: true });
  }

  /* ---------- 2) REPRODUCTOR ---------- */
  const audio = new Audio();
  audio.preload = 'metadata';
  audio.volume = 0.8;

  const state = { artistId: null, track: null };
  const previewCache = new Map();
  let reqId = 0;

  const els = {
    cover: $('#p-cover'), artist: $('#p-artist'), song: $('#p-song'), status: $('#p-status'),
    time: $('#p-time'), dur: $('#p-dur'), seek: $('#p-seek'), play: $('#p-play'),
    mute: $('#p-mute'), vol: $('#p-vol'), spotify: $('#p-spotify'),
    topNow: $('#topbar-now'), minibar: $('#minibar'), mbPlay: $('#mb-play'), mbText: $('#mb-text')
  };

  const setFill = (input) => {
    const min = +input.min || 0, max = +input.max || 100;
    input.style.setProperty('--fill', ((input.value - min) / (max - min) * 100) + '%');
  };
  const setStatus = (t) => { els.status.textContent = t || ''; };

  /** Busca una preview en iTunes. Devuelve {src,title,cover} o null (nunca lanza error). */
  async function fetchPreview(artist) {
    if (previewCache.has(artist.id)) return previewCache.get(artist.id);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const term = [artist.name, artist.song].filter(Boolean).join(' ');
      const url = 'https://itunes.apple.com/search?media=music&entity=song&limit=15&term=' + encodeURIComponent(term);
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) return null;
      const data = await res.json();
      const items = (data.results || []).filter(r => r.previewUrl);
      const mine = items.filter(r => norm(r.artistName).includes(norm(artist.name)) || norm(artist.name).includes(norm(r.artistName)));
      let pick = artist.song ? mine.find(r => norm(r.trackName).includes(norm(artist.song))) : null;
      pick = pick || mine[0];
      if (!pick) return null;
      const track = {
        src: pick.previewUrl,
        title: pick.trackName,
        cover: (pick.artworkUrl100 || '').replace('100x100bb', '400x400bb') || null
      };
      previewCache.set(artist.id, track);
      return track;
    } catch (_) {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  /** Intenta cargar una URL en el <audio>. Resuelve true/false. */
  function tryLoad(src) {
    return new Promise((resolve) => {
      let done = false;
      const finish = (ok) => {
        if (done) return;
        done = true;
        clearTimeout(t);
        audio.removeEventListener('loadedmetadata', onOk);
        audio.removeEventListener('error', onErr);
        resolve(ok);
      };
      const onOk = () => finish(true);
      const onErr = () => finish(false);
      const t = setTimeout(() => finish(false), 9000);
      audio.addEventListener('loadedmetadata', onOk);
      audio.addEventListener('error', onErr);
      audio.src = src;
      audio.load();
    });
  }

  function paintPlayer(artist, track) {
    els.artist.textContent = artist.name;
    els.song.textContent = track ? track.title : (artist.song || 'canción por elegir');
    els.cover.style.backgroundImage = `url("${(track && track.cover) || placeholderArt(artist.name)}")`;
    els.cover.setAttribute('aria-label', `Portada de ${artist.name}`);
    els.spotify.href = spotifyUrl(artist);
    els.spotify.hidden = false;
  }

  function resetProgress() {
    els.seek.value = 0; setFill(els.seek);
    els.time.textContent = '0:00';
    els.dur.textContent = '0:00';
  }

  /** Carga (y reproduce) la canción de un artista. Detiene la anterior. */
  async function loadArtist(id, { autoplay = true } = {}) {
    const artist = byId(id);
    if (!artist) return;
    const req = ++reqId;

    audio.pause();
    state.artistId = id;
    state.track = null;
    resetProgress();
    paintPlayer(artist, null);
    setStatus('buscando canción…');
    syncUI();

    const getters = [];
    if (artist.audio) getters.push(async () => ({ src: artist.audio, title: artist.song || artist.name, cover: null }));
    getters.push(() => fetchPreview(artist));

    let loaded = null;
    for (const get of getters) {
      const t = await get();
      if (req !== reqId) return;
      if (!t) continue;
      const ok = await tryLoad(t.src);
      if (req !== reqId) return;
      if (ok) { loaded = t; break; }
    }

    if (!loaded) {
      setStatus('No encontré audio para este tema. Probá en Spotify ↗');
      syncUI();
      return;
    }

    state.track = loaded;
    paintPlayer(artist, loaded);
    setStatus('');
    els.dur.textContent = fmt(audio.duration);

    if (autoplay) {
      try { await audio.play(); }
      catch (_) { setStatus('Tocá ▶ para reproducir'); }
    }
    syncUI();
  }

  function togglePlay() {
    if (!state.track) { loadArtist(state.artistId || FEATURED_ID, { autoplay: true }); return; }
    if (audio.paused) audio.play().catch(() => setStatus('Tocá ▶ para reproducir'));
    else audio.pause();
  }

  const isPlaying = () => !audio.paused && !audio.ended;

  /** Sincroniza todos los controles con el estado real del audio */
  function syncUI() {
    const playing = isPlaying();
    const artist = byId(state.artistId);

    els.play.textContent = playing ? '❚❚' : '▶';
    els.play.setAttribute('aria-label', playing ? 'Pausar' : 'Reproducir');
    els.mbPlay.textContent = els.play.textContent;
    els.mbPlay.setAttribute('aria-label', els.play.getAttribute('aria-label'));

    $$('.play-btn').forEach((btn) => {
      const on = playing && btn.dataset.id === state.artistId;
      const a = byId(btn.dataset.id);
      btn.classList.toggle('is-playing', on);
      $('.play-btn__icon', btn).textContent = on ? '❚❚' : '▶';
      $('.play-btn__text', btn).textContent = on ? 'PAUSAR' : 'ESCUCHAR';
      btn.setAttribute('aria-label', `${on ? 'Pausar' : 'Escuchar'} la canción de ${a.name}`);
    });

    const label = artist && state.track ? `${artist.name} — ${state.track.title}` : (artist ? artist.name : '');
    els.topNow.textContent = label || 'elegí un artista';
    els.mbText.textContent = label;
    els.minibar.classList.toggle('is-active', !!state.track);
    document.body.classList.toggle('has-minibar', !!state.track);
  }

  /* eventos del <audio> */
  audio.addEventListener('timeupdate', () => {
    if (!isFinite(audio.duration)) return;
    els.time.textContent = fmt(audio.currentTime);
    els.seek.value = (audio.currentTime / audio.duration) * 100;
    setFill(els.seek);
  });
  audio.addEventListener('loadedmetadata', () => { els.dur.textContent = fmt(audio.duration); });
  ['play', 'pause', 'ended'].forEach(ev => audio.addEventListener(ev, syncUI));
  audio.addEventListener('ended', () => { audio.currentTime = 0; resetProgress(); els.dur.textContent = fmt(audio.duration); });

  /* controles */
  els.play.addEventListener('click', togglePlay);
  els.mbPlay.addEventListener('click', togglePlay);
  els.seek.addEventListener('input', () => {
    setFill(els.seek);
    if (isFinite(audio.duration)) {
      audio.currentTime = (els.seek.value / 100) * audio.duration;
      els.time.textContent = fmt(audio.currentTime);
    }
  });
  els.vol.addEventListener('input', () => {
    audio.volume = +els.vol.value;
    audio.muted = audio.volume === 0;
    setFill(els.vol); syncMute();
  });
  els.mute.addEventListener('click', () => { audio.muted = !audio.muted; syncMute(); });
  function syncMute() {
    els.mute.textContent = audio.muted || audio.volume === 0 ? '🔇' : '🔊';
    els.mute.setAttribute('aria-label', audio.muted ? 'Activar sonido' : 'Silenciar');
  }

  /* botones ▶ de tarjetas y destacada (delegado) */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.play-btn');
    if (!btn) return;
    const id = btn.dataset.id;
    if (id === state.artistId && state.track) togglePlay();
    else loadArtist(id, { autoplay: true });
  });

  /* ---------- 3) DESTACADA, TARJETAS, FILTROS, ARCHIVO ---------- */
  const playBtn = (a, accent) => `
    <button class="play-btn" type="button" data-id="${esc(a.id)}" style="--accent:${accent}" aria-label="Escuchar la canción de ${esc(a.name)}">
      <span class="play-btn__icon" aria-hidden="true">▶</span><span class="play-btn__text">ESCUCHAR</span>
    </button>`;
  const spotifyLink = (a) => `<a class="link-btn" href="${esc(spotifyUrl(a))}" target="_blank" rel="noopener noreferrer">SPOTIFY ↗<span class="sr-only"> (se abre en una pestaña nueva)</span></a>`;
  const tagList = (a) => a.tags.map(t => `<li class="tag">${esc(t)}</li>`).join('');

  function renderFeatured() {
    const host = $('#feature-card');
    const a = byId(FEATURED_ID) || ARTISTS[0];
    host.innerHTML = `
      <div class="feature__img">
        <img src="${esc(artistImage(a))}" alt="Foto de ${esc(a.name)}" width="300" height="300" loading="lazy">
        <span class="feature__caption" aria-hidden="true">xoxo</span>
      </div>
      <div class="feature__body">
        <h3 class="feature__name">${esc(a.name)}</h3>
        <p class="feature__song">♪ ${esc(a.song || 'canción por elegir')}</p>
        <ul class="feature__tags" aria-label="Etiquetas">${tagList(a)}</ul>
        <p class="feature__desc">${esc(a.bio)}</p>
        <div class="feature__actions">${playBtn(a, 'var(--lime)')}${spotifyLink(a)}</div>
      </div>`;
    withFallback($('img', host), a.name);
  }

  function renderCards(filter = 'TODOS') {
    const host = $('#cards');
    const list = filter === 'TODOS' ? ARTISTS : ARTISTS.filter(a => a.tags.includes(filter));
    if (!list.length) {
      host.innerHTML = '<p class="cards__empty">Todavía no hay artistas con esa etiqueta.</p>';
      return;
    }
    host.innerHTML = list.map((a, i) => {
      const accent = ACCENTS[i % ACCENTS.length];
      return `
      <article class="card" style="--accent:${accent}">
        <div class="card__img"><img src="${esc(artistImage(a))}" alt="Foto de ${esc(a.name)}" width="300" height="300" loading="lazy"></div>
        <h3 class="card__name">${esc(a.name)}</h3>
        <p class="card__song">♪ ${esc(a.song || 'canción por elegir')}</p>
        <ul class="card__tags" aria-label="Etiquetas">${tagList(a)}</ul>
        <p class="card__bio">${esc(a.bio)}</p>
        <div class="card__actions">${playBtn(a, accent)}${spotifyLink(a)}</div>
      </article>`;
    }).join('');
    $$('.card', host).forEach((card, i) => withFallback($('img', card), list[i].name));
    syncUI();
  }

  function renderFilters() {
    const host = $('#filters');
    host.innerHTML = FILTERS.map((f, i) =>
      `<button class="chip" type="button" data-filter="${esc(f)}" aria-pressed="${i === 0}">${esc(f)}</button>`).join('');
    host.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      $$('.chip', host).forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      renderCards(chip.dataset.filter);
    });
  }

  function renderGallery() {
    const host = $('#gallery');
    host.innerHTML = PHOTOS.map(src =>
      `<li><img src="${esc(src)}" alt="Foto de valen" width="300" height="300" loading="lazy"></li>`).join('');
    $$('img', host).forEach(img => withFallback(img, 'valen'));
  }

  /* ---------- MENÚ ---------- */
  function initNav() {
    const toggle = $('.nav__toggle'), list = $('#nav-list');
    const close = () => { list.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', () => {
      const open = list.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    list.addEventListener('click', (e) => { if (e.target.closest('a[href^="#"]')) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && list.classList.contains('is-open')) { close(); toggle.focus(); }
    });
  }

  /** Marca en el menú la sección que se está viendo */
  function initSpy() {
    if (!('IntersectionObserver' in window)) return;
    const links = $$('.nav__link[href^="#"]');
    const map = new Map(links.map(l => [l.getAttribute('href').slice(1), l]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach(l => l.removeAttribute('aria-current'));
        const l = map.get(en.target.id);
        if (l) l.setAttribute('aria-current', 'page');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- MODO CLARO / OSCURO ---------- */
  function initTheme() {
    const root = document.documentElement, btn = $('#theme-toggle'), meta = $('meta[name="theme-color"]');
    const apply = (t, save) => {
      root.setAttribute('data-theme', t);
      btn.textContent = t === 'light' ? '☾ MODO OSCURO' : '☀ MODO CLARO';
      btn.setAttribute('aria-label', t === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
      if (meta) meta.setAttribute('content', t === 'light' ? '#fff0f7' : '#050505');
      if (save) { try { localStorage.setItem('pn-theme', t); } catch (_) {} }
    };
    apply(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark', false);
    btn.addEventListener('click', () => apply(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true));
  }

  /* ---------- MOVIMIENTO EN LAS IMÁGENES (inclinación que sigue al cursor) ---------- */
  function initTilt() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const SEL = '.hero__photo, .feature__img, .gallery li';
    document.addEventListener('pointermove', (e) => {
      const el = e.target.closest && e.target.closest(SEL);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', (x * 14).toFixed(1) + 'deg');
      el.style.setProperty('--rx', (-y * 14).toFixed(1) + 'deg');
    });
    document.addEventListener('pointerout', (e) => {
      const el = e.target.closest && e.target.closest(SEL);
      if (el && !el.contains(e.relatedTarget)) { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); }
    });
  }

  /* ---------- INICIO ---------- */
  function init() {
    document.documentElement.classList.add('js-ready');
    renderFeatured();
    renderFilters();
    renderCards();
    renderGallery();
    initNav();
    initSpy();
    initTheme();
    initTilt();
    $$('img[data-ph]').forEach(img => withFallback(img, img.dataset.ph));   // tu foto del inicio

    // el reproductor arranca mostrando la artista destacada, SIN sonar hasta tocar ▶
    const first = byId(FEATURED_ID) || ARTISTS[0];
    state.artistId = first.id;
    paintPlayer(first, null);
    setStatus('Tocá ▶ para escuchar una preview');
    setFill(els.seek); setFill(els.vol); syncMute();
    syncUI();

    $('#year').textContent = new Date().getFullYear();
    $('#to-top').addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0 }); });
  }

  init();
})();