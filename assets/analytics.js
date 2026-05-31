(() => {
  const MIXPANEL_TOKEN = '58f4842ea22684a5a216331baa25a213';
  const MIXPANEL_API_HOST = 'https://api-eu.mixpanel.com';
  const body = document.body;
  const pageType = body?.dataset.pageType || 'unknown';
  const slug = body?.dataset.comicSlug || '';
  const person = body?.dataset.person || '';
  const title = body?.dataset.title || document.title || '';
  const sent = new Set();

  function hasPrivacySignal() {
    const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    return window.globalPrivacyControl === true || dnt === '1' || dnt === 'yes';
  }

  function initMixpanel() {
    if (hasPrivacySignal()) return false;
    if (typeof window.mixpanel?.init !== 'function') return false;
    if (window.__mementoMixpanelInitialized) return true;
    window.mixpanel.init(MIXPANEL_TOKEN, {
      api_host: MIXPANEL_API_HOST,
      persistence: 'localStorage',
      debug: false,
      ignore_dnt: false,
      ip: false,
    });
    window.mixpanel.register({
      site: 'memento_mori_obituary_comics',
      page_type: pageType,
      value_moment_event: 'reader_finished',
    });
    window.__mementoMixpanelInitialized = true;
    return true;
  }

  function getDistinctId() {
    const key = 'memento_mixpanel_distinct_id';
    try {
      const existing = localStorage.getItem(key);
      if (existing) return existing;
      const generated = crypto?.randomUUID?.() || `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(key, generated);
      return generated;
    } catch (_error) {
      return 'anonymous';
    }
  }

  function base64Json(value) {
    const json = JSON.stringify(value);
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  }

  function sendMixpanelFallback(name, payload) {
    if (hasPrivacySignal()) return;
    const event = {
      event: name,
      properties: {
        ...payload,
        token: MIXPANEL_TOKEN,
        distinct_id: getDistinctId(),
        $current_url: location.href,
        $pathname: location.pathname,
        mp_lib: 'memento_static_fallback',
        time: Math.floor(Date.now() / 1000),
      },
    };
    const url = `${MIXPANEL_API_HOST}/track/?data=${encodeURIComponent(base64Json(event))}&ip=0`;
    const beacon = new Image();
    beacon.src = url;
  }

  function cleanData(data = {}) {
    const out = { page_type: pageType };
    if (slug) out.slug = slug;
    if (person) out.person = person;
    if (title) out.title = title;
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === null || value === '') continue;
      if (typeof value === 'number' || typeof value === 'boolean') out[key] = value;
      else out[key] = String(value).slice(0, 120);
    }
    return out;
  }

  function track(name, data = {}, onceKey = '') {
    const key = onceKey || '';
    if (key) {
      if (sent.has(key)) return;
      sent.add(key);
    }
    const payload = cleanData(data);
    window.__mementoLastEvent = { name, data: payload, at: new Date().toISOString() };
    if (typeof window.va === 'function') {
      window.va('event', { name, data: payload });
    }
    if (initMixpanel() && typeof window.mixpanel?.track === 'function') {
      window.mixpanel.track(name, payload);
    } else {
      sendMixpanelFallback(name, payload);
    }
  }

  window.mementoTrack = track;

  track('memento_page_loaded', { path: location.pathname, hash: location.hash }, 'page_loaded');

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a,button');
    if (!link) return;
    const label = (link.textContent || link.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 80);
    const href = link.getAttribute('href') || '';
    if (link.id === 'fullscreenBtn') {
      track('reader_fullscreen_clicked', { label }, 'fullscreen_clicked');
      return;
    }
    if (href.includes('#read')) track('comic_read_clicked', { label, href });
    else if (href.toLowerCase().endsWith('.pdf')) track('comic_pdf_clicked', { label, href });
    else if (href.includes('contact-sheet')) track('comic_contact_sheet_clicked', { label, href });
    else if (href === '/' || href === '/#archive') track('navigation_clicked', { label, href });
  }, { passive: true });

  document.addEventListener('fullscreenchange', () => {
    track(document.fullscreenElement ? 'reader_fullscreen_entered' : 'reader_fullscreen_exited');
  });

  const timeBuckets = [15, 30, 60, 120, 300];
  for (const seconds of timeBuckets) {
    window.setTimeout(() => track('time_on_page_bucket', { seconds }, `time_${seconds}`), seconds * 1000);
  }

  if (pageType === 'archive') {
    const cards = document.querySelectorAll('.archive-card').length;
    track('archive_viewed', { cards }, 'archive_viewed');
  }

  if (pageType === 'reader') {
    const pages = Array.from(document.querySelectorAll('.reader-page'));
    track('reader_opened', { pages: pages.length }, 'reader_opened');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.55) continue;
          const index = pages.indexOf(entry.target) + 1;
          if (index < 1) continue;
          track('reader_page_seen', { page: index, total_pages: pages.length }, `page_seen_${index}`);
          if (index === pages.length) track('reader_finished', { total_pages: pages.length }, 'reader_finished');
        }
      }, { threshold: [0.55] });
      pages.forEach((page) => observer.observe(page));
    }

    const milestones = [25, 50, 75, 100];
    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.round((window.scrollY / max) * 100));
      for (const milestone of milestones) {
        if (pct >= milestone) track('reader_scroll_depth', { percent: milestone }, `scroll_${milestone}`);
      }
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
