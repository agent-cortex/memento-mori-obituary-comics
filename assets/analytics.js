(() => {
  const body = document.body;
  const pageType = body?.dataset.pageType || 'unknown';
  const slug = body?.dataset.comicSlug || '';
  const person = body?.dataset.person || '';
  const title = body?.dataset.title || document.title || '';
  const sent = new Set();

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
