#!/usr/bin/env python3
"""Add a generated obituary comic directory to this static site.

Expected source directory: contains pages/*.jpg and optionally a PDF/contact sheet.
Usage:
  python scripts/add_comic.py SOURCE_DIR --slug person-slug --person "Name" --title "Title" --years "1900-2000" --dek "Short dek" --event "mortality event" --sources "A; B; C"
  python scripts/add_comic.py --render-only
"""
from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import re
import shutil
from pathlib import Path
from typing import Any
from xml.sax.saxutils import escape as xml_escape

ROOT = Path(__file__).resolve().parents[1]
SITE_URL = "https://memento-mori-obituary-comics.vercel.app"
SITE_NAME = "Memento Mori Obituary Comics"
SITE_DESCRIPTION = "Daily obituary comics about people who faced death and made their work anyway."
SUPPORT_ZEC_ADDRESS = "u1cyxqx2za9c7g2h7tjz0nn7rdf5fgykmqgw4eke7fvfa9pd7lynjkqfeq4hzd3tkys4pvku5xnmmwclm77jv9ljkhdefrvzc6pgehc63rcnmylqlxt0fmz55t6wdp6dyk5w2hzx06hs93xun5smexvwn04ju4ppy54gx477ftequajh0t"
PUBLISHER = {
    "@type": "Organization",
    "name": SITE_NAME,
    "url": f"{SITE_URL}/",
}


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "comic"


def abs_url(path: str = "") -> str:
    if path.startswith("http://") or path.startswith("https://"):
        return path
    clean = path.lstrip("/")
    if not clean:
        return f"{SITE_URL}/"
    return f"{SITE_URL}/{clean}"


def comic_path(comic: dict[str, Any]) -> str:
    return f"/comics/{comic['slug']}/"


def comic_url(comic: dict[str, Any]) -> str:
    return abs_url(comic_path(comic))


def load_comics() -> list[dict[str, Any]]:
    path = ROOT / "comics.json"
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8"))


def save_comics(comics: list[dict[str, Any]]) -> None:
    (ROOT / "comics.json").write_text(json.dumps(comics, indent=2, ensure_ascii=False), encoding="utf-8")


def analytics_head() -> str:
    return (
        "<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};"
        "window.si=window.si||function(){(window.siq=window.siq||[]).push(arguments);};</script>"
        '<script defer src="/_vercel/insights/script.js"></script>'
        '<script defer src="/_vercel/speed-insights/script.js"></script>'
        '<script defer src="/assets/analytics.js"></script>'
    )


def json_script(data: Any) -> str:
    payload = json.dumps(data, indent=2, ensure_ascii=False).replace("<", "\\u003c")
    return f'<script type="application/ld+json">{payload}</script>'


def support_button(css_class: str = "btn") -> str:
    return f'<button class="{css_class} support-open-btn" type="button" onclick="openSupportModal()">Support</button>'


def support_modal() -> str:
    return (
        '<div class="support-modal" id="supportModal" hidden>'
        '<div class="support-dialog" role="dialog" aria-modal="true" aria-labelledby="supportTitle">'
        '<button class="support-close" type="button" aria-label="Close support modal" onclick="closeSupportModal()">×</button>'
        '<div class="kicker">Support development</div>'
        '<h2 id="supportTitle">Support development</h2>'
        '<p>Help keep new obituary comics, source work, and reader tooling moving. Send ZEC to this shielded address:</p>'
        f'<code class="support-address" id="supportZecAddress">{esc(SUPPORT_ZEC_ADDRESS)}</code>'
        '<div class="support-actions">'
        '<button class="mini-btn primary" type="button" onclick="copySupportAddress()">Copy ZEC address</button>'
        '<button class="mini-btn ghost" type="button" onclick="closeSupportModal()">Close</button>'
        '</div>'
        '<p class="support-copy-status" id="supportCopyStatus" aria-live="polite"></p>'
        '</div></div>'
    )


def support_script() -> str:
    return f"""
const supportZecAddress = "{SUPPORT_ZEC_ADDRESS}";
function openSupportModal() {{
  const modal = document.getElementById('supportModal');
  if (!modal) return;
  modal.hidden = false;
  document.body.classList.add('support-modal-open');
  const status = document.getElementById('supportCopyStatus');
  if (status) status.textContent = '';
  const copyBtn = modal.querySelector('.support-actions .primary');
  setTimeout(() => copyBtn && copyBtn.focus(), 0);
}}
function closeSupportModal() {{
  const modal = document.getElementById('supportModal');
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove('support-modal-open');
}}
async function copySupportAddress() {{
  const status = document.getElementById('supportCopyStatus');
  try {{
    await navigator.clipboard.writeText(supportZecAddress);
    if (status) status.textContent = 'ZEC address copied.';
  }} catch (error) {{
    if (status) status.textContent = supportZecAddress;
  }}
}}
document.addEventListener('keydown', (event) => {{
  if (event.key === 'Escape') closeSupportModal();
}});
document.addEventListener('click', (event) => {{
  const modal = document.getElementById('supportModal');
  if (modal && event.target === modal) closeSupportModal();
}});
"""


def meta_head(
    title: str,
    description: str,
    canonical: str,
    image: str,
    page_type: str,
    schema: list[dict[str, Any]],
) -> str:
    image_tag = f'<meta property="og:image" content="{esc(image)}"><meta name="twitter:image" content="{esc(image)}">' if image else ""
    return (
        f"<title>{esc(title)}</title>"
        f'<meta name="description" content="{esc(description)}">'
        f'<link rel="canonical" href="{esc(canonical)}">'
        f'<meta property="og:type" content="{esc(page_type)}">'
        f'<meta property="og:title" content="{esc(title)}">'
        f'<meta property="og:description" content="{esc(description)}">'
        f'<meta property="og:url" content="{esc(canonical)}">'
        f"{image_tag}"
        '<meta name="twitter:card" content="summary_large_image">'
        f'<meta name="twitter:title" content="{esc(title)}">'
        f'<meta name="twitter:description" content="{esc(description)}">'
        '<link rel="stylesheet" href="/assets/style.css">'
        f'{json_script({"@context": "https://schema.org", "@graph": schema})}'
        f"{analytics_head()}"
    )


def comic_description(comic: dict[str, Any]) -> str:
    dek = comic.get("dek", "").rstrip(".")
    event = comic.get("mortality_event", "").rstrip(".")
    if event:
        return f"{dek}. A memento mori obituary comic centered on {event}."
    return f"{dek}. A memento mori obituary comic."


def first_image_path(comic: dict[str, Any]) -> str:
    pages = comic.get("pages") or []
    if not pages:
        return ""
    return f"/comics/{comic['slug']}/{pages[0]}"


def first_image_url(comic: dict[str, Any]) -> str:
    path = first_image_path(comic)
    return abs_url(path) if path else ""


def parse_years(years: str) -> tuple[str, str]:
    values = re.findall(r"\d{4}", years or "")
    if len(values) >= 2:
        return values[0], values[1]
    if len(values) == 1:
        return values[0], ""
    return "", ""


def source_items(comic: dict[str, Any]) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    for source in comic.get("sources", []):
        if isinstance(source, dict):
            name = str(source.get("name", "")).strip()
            url = str(source.get("url", "")).strip()
        else:
            name = str(source).strip()
            url = ""
        if name:
            items.append({"name": name, "url": url})
    return items


def source_names(comic: dict[str, Any]) -> str:
    return "; ".join(item["name"] for item in source_items(comic))


def source_urls(comic: dict[str, Any]) -> list[str]:
    return [item["url"] for item in source_items(comic) if item.get("url")]


def default_citable_summary(comic: dict[str, Any]) -> list[str]:
    event = comic.get("mortality_event", "")
    dek = comic.get("dek", "")
    return [
        f"{comic['person']} ({comic.get('years', '').strip()}) is featured in an obituary comic about mortality, work, and what remains.",
        f"The comic centers on this mortality event: {event}" if event else dek,
        f"The reader version includes image pages, a PDF, and sources including {source_names(comic)}.",
    ]


def citable_summary(comic: dict[str, Any]) -> list[str]:
    return [str(item).strip() for item in comic.get("citable_summary", []) if str(item).strip()] or default_citable_summary(comic)


def default_story_notes(comic: dict[str, Any]) -> list[str]:
    event = comic.get("mortality_event", "")
    notes = [
        f"This comic follows {comic['person']}, {comic.get('dek', '').rstrip('.')}.",
    ]
    if event:
        notes.append(f"The story turns on {event.rstrip('.')}, treating that encounter with death as the pressure point for the work that followed.")
    notes.append(f"The source trail for this page includes {source_names(comic)}.")
    return notes


def story_notes(comic: dict[str, Any]) -> list[str]:
    return [str(item).strip() for item in comic.get("story_notes", []) if str(item).strip()] or default_story_notes(comic)


def page_summary(comic: dict[str, Any], index: int) -> str:
    summaries = comic.get("page_summaries", [])
    if 0 <= index - 1 < len(summaries):
        return str(summaries[index - 1]).strip()
    return ""


def jpeg_size(path: Path) -> tuple[int, int] | None:
    data = path.read_bytes()
    if data[:2] != b"\xff\xd8":
        return None
    index = 2
    markers = {0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF}
    while index < len(data) - 1:
        if data[index] != 0xFF:
            index += 1
            continue
        while index < len(data) and data[index] == 0xFF:
            index += 1
        if index >= len(data):
            break
        marker = data[index]
        index += 1
        if marker in {0xD8, 0xD9}:
            continue
        if index + 2 > len(data):
            break
        length = int.from_bytes(data[index:index + 2], "big")
        if marker in markers and index + 7 <= len(data):
            height = int.from_bytes(data[index + 3:index + 5], "big")
            width = int.from_bytes(data[index + 5:index + 7], "big")
            return width, height
        index += length
    return None


def image_dimensions(comic: dict[str, Any], src: str) -> tuple[int, int] | None:
    dimensions = comic.get("page_dimensions", {})
    if isinstance(dimensions, dict) and src in dimensions:
        value = dimensions[src]
        if isinstance(value, list | tuple) and len(value) == 2:
            return int(value[0]), int(value[1])
    path = ROOT / "comics" / comic["slug"] / src
    if path.exists():
        return jpeg_size(path)
    return None


def ensure_page_dimensions(comic: dict[str, Any]) -> dict[str, Any]:
    out = dict(comic)
    dimensions = dict(out.get("page_dimensions", {}))
    for src in out.get("pages", []):
        if src not in dimensions:
            size = image_dimensions(out, src)
            if size:
                dimensions[src] = [size[0], size[1]]
    if dimensions:
        out["page_dimensions"] = dimensions
    return out


def image_attrs(comic: dict[str, Any], src: str) -> str:
    size = image_dimensions(comic, src)
    if not size:
        return ""
    return f' width="{size[0]}" height="{size[1]}"'


def home_schema(comics: list[dict[str, Any]]) -> list[dict[str, Any]]:
    items = [
        {
            "@type": "ListItem",
            "position": index,
            "url": comic_url(comic),
            "name": f"{comic['person']} - {comic['title']}",
        }
        for index, comic in enumerate(comics, 1)
    ]
    return [
        {
            "@type": "WebSite",
            "@id": f"{SITE_URL}/#website",
            "name": SITE_NAME,
            "url": f"{SITE_URL}/",
            "description": SITE_DESCRIPTION,
            "publisher": PUBLISHER,
        },
        {
            "@type": "CollectionPage",
            "@id": f"{SITE_URL}/#collection",
            "name": SITE_NAME,
            "url": f"{SITE_URL}/",
            "description": SITE_DESCRIPTION,
            "isPartOf": {"@id": f"{SITE_URL}/#website"},
            "mainEntity": {
                "@type": "ItemList",
                "name": "Obituary comic archive",
                "itemListElement": items,
            },
        },
    ]


def comic_schema(comic: dict[str, Any]) -> list[dict[str, Any]]:
    birth, death = parse_years(comic.get("years", ""))
    subject: dict[str, Any] = {
        "@type": "Person",
        "name": comic["person"],
        "description": comic.get("dek", ""),
    }
    if birth:
        subject["birthDate"] = birth
    if death:
        subject["deathDate"] = death
    return [
        {
            "@type": "CreativeWork",
            "@id": f"{comic_url(comic)}#creative-work",
            "name": f"{comic['person']} - {comic['title']}",
            "headline": f"{comic['person']} Obituary Comic - {comic['title']}",
            "description": comic.get("dek", ""),
            "url": comic_url(comic),
            "image": first_image_url(comic),
            "datePublished": comic.get("published_at", ""),
            "publisher": PUBLISHER,
            "about": subject,
            "citation": source_urls(comic),
        },
        {
            "@type": "BreadcrumbList",
            "@id": f"{comic_url(comic)}#breadcrumb",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE_URL}/"},
                {"@type": "ListItem", "position": 2, "name": comic["person"], "item": comic_url(comic)},
            ],
        },
    ]


def about_schema() -> list[dict[str, Any]]:
    return [
        {
            "@type": "AboutPage",
            "@id": f"{SITE_URL}/about/#about",
            "name": "About Memento Mori Obituary Comics",
            "url": f"{SITE_URL}/about/",
            "description": "Editorial method and source standards for Memento Mori Obituary Comics.",
            "publisher": PUBLISHER,
        }
    ]


def home_script() -> str:
    return """
const quotes = [
  { text: "You could leave life right now. Let that determine what you do and say and think.", author: "Marcus Aurelius" },
  { text: "We are not given a short life but we make it short, and we are not ill-supplied but wasteful of it.", author: "Seneca" },
  { text: "It is not death that a man should fear, but he should fear never beginning to live.", author: "Marcus Aurelius" },
  { text: "Remember that you are dying. Focus on what matters.", author: "Memento Mori" },
  { text: "The reprieve was one moment. The work was the rest of their lives.", author: "Obituary Chronicles" },
  { text: "They took my manuscript, my family, my health. The work is what remains.", author: "Viktor Frankl" },
  { text: "I paint self-portraits because I am so often alone, because I am the person I know best.", author: "Frida Kahlo" }
];
let quoteIdx = 0;
function cycleQuote() {
  const textEl = document.getElementById('quoteText');
  const authEl = document.getElementById('quoteAuthor');
  if (!textEl || !authEl) return;
  quoteIdx = (quoteIdx + 1) % quotes.length;
  textEl.style.opacity = 0;
  setTimeout(() => {
    textEl.textContent = `"${quotes[quoteIdx].text}"`;
    authEl.textContent = quotes[quoteIdx].author;
    textEl.style.opacity = 1;
  }, 200);
}
(function() {
  const container = document.getElementById('particles-js');
  if (!container) return;
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let width = canvas.width = container.offsetWidth;
  let height = canvas.height = container.offsetHeight;
  window.addEventListener('resize', () => {
    width = canvas.width = container.offsetWidth;
    height = canvas.height = container.offsetHeight;
  });
  const particles = [];
  const particleCount = 45;
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      vy: Math.random() * 0.4 + 0.1,
      vx: Math.random() * 0.2 - 0.1
    });
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(223, 177, 91, 0.22)';
    ctx.beginPath();
    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
    }
    ctx.fill();
    update();
  }
  function update() {
    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];
      p.y += p.vy;
      p.x += p.vx;
      if (p.y > height) {
        particles[i] = {
          x: Math.random() * width,
          y: -10,
          r: p.r,
          vy: p.vy,
          vx: p.vx
        };
      }
      if (p.x > width) p.x = 0;
      else if (p.x < 0) p.x = width;
    }
  }
  function loop() {
    draw();
    requestAnimationFrame(loop);
  }
  loop();
})();
""" + support_script()


def reader_script() -> str:
    return """
(function(){
const btn=document.getElementById('fullscreenBtn');
const root=document.documentElement;
function setState(){document.body.classList.toggle('fullscreen-active',!!document.fullscreenElement)}
if(btn&&document.fullscreenEnabled){
  btn.addEventListener('click',async()=>{
    try{if(document.fullscreenElement){await document.exitFullscreen();}else{await root.requestFullscreen();}}
    catch(e){console.warn('fullscreen failed',e)}
  });
  document.addEventListener('fullscreenchange',setState);
}else if(btn){btn.style.display='none'}
})();

let lastScrollY = window.scrollY;
const toolbar = document.getElementById('readerToolbar');
window.addEventListener('scroll', () => {
  if (!toolbar) return;
  const currentScrollY = window.scrollY;
  if (currentScrollY > 120 && currentScrollY > lastScrollY) {
    toolbar.classList.add('toolbar-hidden');
  } else {
    toolbar.classList.remove('toolbar-hidden');
  }
  lastScrollY = currentScrollY;
}, { passive: true });
window.addEventListener('mousemove', (e) => {
  if (e.clientY < 40 && toolbar) {
    toolbar.classList.remove('toolbar-hidden');
  }
});

function setTheme(theme) {
  document.body.classList.remove('theme-sepia', 'theme-stark');
  if (theme === 'sepia') document.body.classList.add('theme-sepia');
  if (theme === 'stark') document.body.classList.add('theme-stark');
  document.querySelectorAll('[id^="theme-btn-"]').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`theme-btn-${theme}`);
  if (activeBtn) activeBtn.classList.add('active');
  localStorage.setItem('memento-theme', theme);
}
const savedTheme = localStorage.getItem('memento-theme') || 'obsidian';
setTheme(savedTheme);

let currentSlideIdx = 0;
const pagesContainer = document.getElementById('read');
function setLayout(layout) {
  if (!pagesContainer) return;
  pagesContainer.classList.remove('layout-vertical', 'layout-spread', 'layout-slide');
  pagesContainer.classList.add(`layout-${layout}`);
  document.querySelectorAll('[id^="layout-btn-"]').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`layout-btn-${layout}`);
  if (activeBtn) activeBtn.classList.add('active');
  const pages = pagesContainer.querySelectorAll('.reader-page');
  if (layout === 'slide') {
    pages.forEach((p, idx) => {
      if (idx === currentSlideIdx) p.classList.add('active');
      else p.classList.remove('active');
    });
    updateProgress(currentSlideIdx + 1, pages.length);
  } else {
    pages.forEach(p => p.classList.remove('active'));
    updateProgressFromScroll();
  }
  localStorage.setItem('memento-layout', layout);
}
function navigateSlide(direction) {
  if (!pagesContainer) return;
  const pages = pagesContainer.querySelectorAll('.reader-page');
  if (pages.length === 0) return;
  currentSlideIdx = (currentSlideIdx + direction + pages.length) % pages.length;
  pages.forEach((p, idx) => {
    if (idx === currentSlideIdx) p.classList.add('active');
    else p.classList.remove('active');
  });
  updateProgress(currentSlideIdx + 1, pages.length);
  window.scrollTo({ top: 0, behavior: 'instant' });
}
document.addEventListener('keydown', (e) => {
  if (!pagesContainer || !pagesContainer.classList.contains('layout-slide')) return;
  if (e.key === 'ArrowLeft') navigateSlide(-1);
  if (e.key === 'ArrowRight') navigateSlide(1);
});

const progressBar = document.getElementById('readerProgressBar');
function updateProgress(current, total) {
  if (!progressBar) return;
  const pct = Math.min(100, Math.max(0, (current / total) * 100));
  progressBar.style.width = `${pct}%`;
}
function updateProgressFromScroll() {
  if (!pagesContainer || pagesContainer.classList.contains('layout-slide')) return;
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - window.innerHeight);
  const pct = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
  if (progressBar) progressBar.style.width = `${pct}%`;
}
window.addEventListener('scroll', updateProgressFromScroll, { passive: true });
window.addEventListener('resize', updateProgressFromScroll, { passive: true });
const savedLayout = localStorage.getItem('memento-layout') || 'vertical';
setTimeout(() => {
  setLayout(savedLayout);
}, 20);
""" + support_script()


def render_index(comics: list[dict[str, Any]]) -> str:
    latest = comics[0] if comics else None
    cards: list[str] = []
    for index, comic in enumerate(comics):
        cover = first_image_path(comic)
        page_href = comic_path(comic)
        reader_href = f"{page_href}#read"
        pdf_href = f"/comics/{esc(comic['slug'])}/{esc(comic.get('pdf', ''))}" if comic.get("pdf") else ""
        pdf_button = f'<a class="mini-btn ghost" href="{pdf_href}">PDF</a>' if pdf_href else ""
        image_extra = image_attrs(comic, comic["pages"][0]) if comic.get("pages") else ""
        priority = ' fetchpriority="high"' if index == 0 else ""
        loading = "eager" if index == 0 else "lazy"
        mortality_event = comic.get("mortality_event", "")
        mortality_badge = ""
        if mortality_event:
            mortality_badge = f'<div class="mortality-badge"><span class="badge-icon">⏳</span><span><em>{esc(mortality_event)}</em></span></div>'
        cards.append(
            '<article class="archive-card">'
            f'<a class="archive-cover" href="{page_href}" aria-label="Open {esc(comic["person"])} obituary comic">'
            f'<img src="{esc(cover)}" alt="{esc(comic["person"])} obituary comic cover"{image_extra} loading="{loading}"{priority}>'
            "</a>"
            '<div class="archive-copy">'
            f'<div class="meta">{esc(comic.get("published_at", ""))} · {esc(comic.get("years", ""))}</div>'
            f'<h3>{esc(comic["person"])}</h3>'
            f'<p>{esc(comic.get("dek", ""))}</p>'
            f'{mortality_badge}'
            '<div class="archive-actions">'
            f'<a class="mini-btn primary" href="{reader_href}">Read</a>'
            f"{pdf_button}"
            "</div></div></article>"
        )
    latest_button = ""
    if latest:
        latest_button = f'<a class="btn primary" href="/comics/{esc(latest["slug"])}/#read">Read latest</a>'
    archive = "".join(cards) if cards else '<div class="empty">No comics published yet.</div>'
    head = meta_head(
        f"{SITE_NAME} - Daily Biographical Comics About Mortality and Work",
        SITE_DESCRIPTION,
        abs_url("/"),
        first_image_url(latest) if latest else "",
        "website",
        home_schema(comics),
    )
    return (
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">{head}</head>'
        '<body data-page-type="archive"><div class="bg-particles" id="particles-js"></div><header class="hero"><div class="hero-content wrap">'
        '<div class="hourglass-loader" aria-hidden="true"></div><div class="kicker">Daily memento mori</div><h1>Obituary Comics</h1>'
        '<p>Lives that met death early, then used borrowed time to make something that outlived them.</p>'
        '<div class="rule-container"><div class="rule-line"></div><div class="rule-icon">⏳</div><div class="rule-line"></div></div>'
        '<div class="quote-widget" id="quoteWidget" onclick="cycleQuote()"><p class="quote-text" id="quoteText">"You could leave life right now. Let that determine what you do and say and think."</p><p class="quote-author" id="quoteAuthor">Marcus Aurelius</p><div class="quote-tip">Reflect further</div></div>'
        f'<div class="btns">{latest_button}<a class="btn" href="#archive">Browse archive</a><a class="btn" href="/about/">About</a>{support_button()}</div>'
        '</div></header><main class="wrap section" id="archive"><div class="section-head"><div><div class="kicker">Small shelf, not doomscroll</div><h2>Archive</h2></div>'
        '<p>Compact comic/PDF cards. Open a reader only when you choose it.</p></div>'
        f'<div class="archive-grid">{archive}</div></main>'
        f'<footer>Built for the morning death-reminder ritual. Clean comics, verified lives, no motivational slop. <a href="/about/">Editorial method</a>.</footer>{support_modal()}<script>{home_script()}</script></body></html>'
    )


def render_comic(comic: dict[str, Any], next_comic: dict[str, Any] | None = None) -> str:
    figures: list[str] = []
    for index, src in enumerate(comic.get("pages", []), 1):
        summary = page_summary(comic, index)
        alt = f"Page {index} of {comic['person']}: {comic['title']}"
        if summary:
            alt = f"{alt} - {summary}"
        loading = "eager" if index == 1 else "lazy"
        priority = ' fetchpriority="high"' if index == 1 else ""
        figures.append(
            f'<figure class="reader-page" id="page-{index:02d}">'
            f'<img src="{esc(src)}" alt="{esc(alt)}"{image_attrs(comic, src)} loading="{loading}"{priority}>'
            f'<figcaption>{esc(summary or f"Page {index:02d}")}</figcaption></figure>'
        )
    pages = "".join(figures)
    sources_html = "".join(f'<span class="source-chip">{esc(item["name"])}</span>' for item in source_items(comic))
    pdf_button = f'<a class="reader-btn primary" href="{esc(comic["pdf"])}">PDF</a>' if comic.get("pdf") else ""
    contact_button = f'<a class="reader-btn" href="{esc(comic["contact_sheet"])}">Contact</a>' if comic.get("contact_sheet") else ""
    fullscreen_button = '<button class="reader-btn" id="fullscreenBtn" type="button">Fullscreen</button>'
    next_teaser = ""
    if next_comic:
        next_cover = first_image_path(next_comic)
        next_image_extra = image_attrs(next_comic, next_comic["pages"][0]) if next_comic.get("pages") else ""
        next_teaser = (
            '<div class="next-comic-teaser"><div class="next-kicker">Up Next</div>'
            f'<a href="/comics/{esc(next_comic["slug"])}/#read" class="next-comic-link">'
            f'<div class="next-cover"><img src="{esc(next_cover)}" alt="{esc(next_comic["person"])} cover"{next_image_extra} loading="lazy"></div>'
            f'<div class="next-info"><h4>{esc(next_comic["person"])}</h4><p>{esc(next_comic.get("dek", ""))}</p></div>'
            '</a></div>'
        )
    title = f"{comic['person']} Obituary Comic - {comic['title']} | {SITE_NAME}"
    description = comic_description(comic)
    head = meta_head(title, description, comic_url(comic), first_image_url(comic), "article", comic_schema(comic))
    summary_items = "".join(f"<li>{esc(item)}</li>" for item in citable_summary(comic))
    note_items = "".join(f"<p>{esc(item)}</p>" for item in story_notes(comic))
    source_links = "".join(
        f'<li><a href="{esc(item["url"])}" rel="noopener noreferrer" target="_blank">{esc(item["name"])}</a></li>'
        if item.get("url") else f"<li>{esc(item['name'])}</li>"
        for item in source_items(comic)
    )
    pdf_download = f'<p><a class="mini-btn primary" href="{esc(comic["pdf"])}">Download the PDF</a></p>' if comic.get("pdf") else ""
    return (
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">{head}</head>'
        f'<body class="reader-mode" data-page-type="reader" data-comic-slug="{esc(comic["slug"])}" data-person="{esc(comic["person"])}" data-title="{esc(comic["title"])}">'
        '<nav class="reader-toolbar" aria-label="Reader controls" id="readerToolbar"><a class="reader-btn" href="/">← Archive</a>'
        f'<div class="reader-title">{esc(comic["person"])} · {esc(comic["title"])}</div>'
        '<div class="reader-actions"><div class="option-group" aria-label="Theme selector">'
        '<button class="option-btn active" id="theme-btn-obsidian" onclick="setTheme(\'obsidian\')" title="Obsidian Ashes theme">Obsidian</button>'
        '<button class="option-btn" id="theme-btn-sepia" onclick="setTheme(\'sepia\')" title="Sepia Dust theme">Sepia</button>'
        '<button class="option-btn" id="theme-btn-stark" onclick="setTheme(\'stark\')" title="Stark Grave theme">OLED</button></div>'
        '<div class="option-group" aria-label="Layout selector">'
        '<button class="option-btn active" id="layout-btn-vertical" onclick="setLayout(\'vertical\')" title="Continuous scroll layout">Scroll</button>'
        '<button class="option-btn" id="layout-btn-spread" onclick="setLayout(\'spread\')" title="Dual page spread layout">Book</button>'
        '<button class="option-btn" id="layout-btn-slide" onclick="setLayout(\'slide\')" title="Slideshow layout">Slide</button></div>'
        f'{fullscreen_button}{pdf_button}{contact_button}{support_button("reader-btn")}</div></nav>'
        '<div class="reader-progress-container"><div class="reader-progress-bar" id="readerProgressBar"></div></div>'
        f'<div class="sr-only"><h1>{esc(comic["person"])} - {esc(comic["title"])}</h1></div>'
        f'<main id="read" class="reader-pages layout-vertical" aria-label="Fullscreen scrollable comic pages">{pages}</main>'
        '<div class="slide-nav-overlay slide-nav-prev" id="slideNavPrev" onclick="navigateSlide(-1)" aria-label="Previous page">←</div>'
        '<div class="slide-nav-overlay slide-nav-next" id="slideNavNext" onclick="navigateSlide(1)" aria-label="Next page">→</div>'
        '<footer class="reader-footer">'
        f'<div class="epilogue-card"><div class="epilogue-quote">“{esc(comic.get("closing_line", ""))}”</div><div class="epilogue-sources">{sources_html}</div></div>'
        '<section class="reader-context" aria-label="Comic notes and sources">'
        f'<p class="reader-source-line">{esc(comic.get("closing_line", ""))}</p>'
        '<h2>Citable Summary</h2>'
        f'<ul class="summary-list">{summary_items}</ul>'
        '<h2>Story Notes</h2>'
        f'{note_items}'
        '<h2>Sources</h2>'
        f'<ul class="source-list">{source_links}</ul>'
        '<h2>Download PDF</h2>'
        f'{pdf_download}'
        f'</section>{next_teaser}</footer>{support_modal()}<script>{reader_script()}</script></body></html>'
    )


def render_about(comics: list[dict[str, Any]]) -> str:
    latest = comics[0] if comics else None
    head = meta_head(
        f"About | {SITE_NAME}",
        "Editorial method, source standards, and publishing notes for Memento Mori Obituary Comics.",
        abs_url("/about/"),
        first_image_url(latest) if latest else "",
        "website",
        about_schema(),
    )
    return (
        f'<!doctype html><html lang="en"><head><meta charset="utf-8">'
        f'<meta name="viewport" content="width=device-width, initial-scale=1">{head}</head>'
        '<body data-page-type="about"><main class="wrap section about-page">'
        '<div class="kicker">Editorial method</div><h1>About Memento Mori Obituary Comics</h1>'
        '<p>Memento Mori Obituary Comics is a static visual archive of short biographical comics about people who faced death, illness, violence, exile, or loss and still made work that survived them.</p>'
        '<h2>How subjects are selected</h2>'
        '<p>Each subject needs a clear mortality pressure point and a body of work or thought that changed after, survived beyond, or was clarified by that encounter.</p>'
        '<h2>Source standards</h2>'
        '<p>Each comic page lists sources in crawlable HTML. The preferred source trail is a mix of reference works, museums, primary collections, and reputable editorial accounts.</p>'
        '<h2>Format</h2>'
        '<p>The reader preserves the comic as images and PDF, while the page also includes text summaries, story notes, and structured data so search engines and AI systems can understand the work without relying on image OCR.</p>'
        '<p><a class="btn primary" href="/">Back to archive</a></p>'
        '</main><footer>Clean comics, verified lives, no motivational slop.</footer></body></html>'
    )


def render_sitemap(comics: list[dict[str, Any]]) -> str:
    latest = max([comic.get("published_at", "") for comic in comics] or [dt.date.today().isoformat()])
    urls = [
        (abs_url("/"), latest),
        (abs_url("/about/"), latest),
        *[(comic_url(comic), comic.get("published_at", latest)) for comic in comics],
    ]
    entries = "".join(
        f"  <url>\n    <loc>{xml_escape(url)}</loc>\n    <lastmod>{xml_escape(lastmod)}</lastmod>\n  </url>\n"
        for url, lastmod in urls
    )
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{entries}</urlset>\n'


def render_robots() -> str:
    return f"""User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

Sitemap: {SITE_URL}/sitemap.xml
"""


def render_llms(comics: list[dict[str, Any]]) -> str:
    comic_links = "\n".join(
        f"- [{comic['person']} - {comic['title']}]({comic_url(comic)}): {comic.get('dek', '')}"
        for comic in comics
    )
    return f"""# {SITE_NAME}
> {SITE_DESCRIPTION}

## Main pages
- [Archive]({SITE_URL}/): Current comic archive and latest issue.
- [Editorial method]({SITE_URL}/about/): Source standards and publishing notes.

## Comics
{comic_links}

## Citation guidance
- Prefer the canonical comic reader URL over direct image or PDF URLs.
- Cite the linked source list on each comic page for factual claims about the subject.
- The comic images are the creative presentation; the citable summaries and story notes are provided for text extraction.
"""


def next_for(comics: list[dict[str, Any]], slug: str) -> dict[str, Any] | None:
    if len(comics) < 2:
        return None
    slugs = [comic.get("slug") for comic in comics]
    try:
        index = slugs.index(slug)
    except ValueError:
        return comics[0]
    return comics[(index + 1) % len(comics)]


def render_site(comics: list[dict[str, Any]]) -> list[dict[str, Any]]:
    normalized = [ensure_page_dimensions(comic) for comic in comics]
    save_comics(normalized)
    (ROOT / "index.html").write_text(render_index(normalized), encoding="utf-8")
    about_dir = ROOT / "about"
    about_dir.mkdir(exist_ok=True)
    (about_dir / "index.html").write_text(render_about(normalized), encoding="utf-8")
    (ROOT / "sitemap.xml").write_text(render_sitemap(normalized), encoding="utf-8")
    (ROOT / "robots.txt").write_text(render_robots(), encoding="utf-8")
    (ROOT / "llms.txt").write_text(render_llms(normalized), encoding="utf-8")
    for comic in normalized:
        dest = ROOT / "comics" / comic["slug"]
        dest.mkdir(parents=True, exist_ok=True)
        (dest / "comic.json").write_text(json.dumps(comic, indent=2, ensure_ascii=False), encoding="utf-8")
        (dest / "index.html").write_text(render_comic(comic, next_for(normalized, comic["slug"])), encoding="utf-8")
    return normalized

def find_optional(source: Path, patterns: list[str]) -> Path | None:
    for pattern in patterns:
        hits = sorted(source.glob(pattern))
        if hits:
            return hits[0]
    return None


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source_dir", nargs="?")
    parser.add_argument("--render-only", action="store_true")
    parser.add_argument("--slug")
    parser.add_argument("--person")
    parser.add_argument("--title", default="Borrowed Time")
    parser.add_argument("--years", default="")
    parser.add_argument("--dek", default="")
    parser.add_argument("--event", default="")
    parser.add_argument("--sources", default="")
    parser.add_argument("--closing-line", default="The reprieve was one moment. The work was the rest of his life.")
    args = parser.parse_args()

    if args.render_only:
        render_site(load_comics())
        print("/")
        return

    if not args.source_dir or not args.person:
        raise SystemExit("source_dir and --person are required unless --render-only is used")

    source = Path(args.source_dir).expanduser().resolve()
    if not source.exists():
        raise SystemExit(f"source not found: {source}")

    slug = args.slug or slugify(f"{args.person}-{args.title}")
    dest = ROOT / "comics" / slug
    (dest / "pages").mkdir(parents=True, exist_ok=True)

    page_sources = sorted((source / "pages").glob("*.jpg")) or sorted(source.glob("page*.jpg")) or sorted(source.glob("*.jpg"))
    if not page_sources:
        raise SystemExit("no page JPGs found in source_dir/pages or source_dir")

    pages: list[str] = []
    page_dimensions: dict[str, list[int]] = {}
    for index, page in enumerate(page_sources, 1):
        name = f"{index:02d}-{slug}.jpg"
        target = dest / "pages" / name
        shutil.copy2(page, target)
        src = f"pages/{name}"
        pages.append(src)
        size = jpeg_size(target)
        if size:
            page_dimensions[src] = [size[0], size[1]]

    pdf = find_optional(source, ["*.pdf", "**/*.pdf"])
    pdf_name = None
    if pdf:
        pdf_name = f"{slug}.pdf"
        shutil.copy2(pdf, dest / pdf_name)

    contact = find_optional(source, ["*contact*.jpg", "*contact*.png", "**/*contact*.jpg", "**/*contact*.png"])
    contact_name = None
    if contact:
        contact_name = "contact-sheet" + contact.suffix.lower()
        shutil.copy2(contact, dest / contact_name)

    comic = {
        "slug": slug,
        "title": args.title,
        "person": args.person,
        "years": args.years,
        "dek": args.dek,
        "mortality_event": args.event,
        "published_at": dt.date.today().isoformat(),
        "pages": pages,
        "page_dimensions": page_dimensions,
        "pdf": pdf_name,
        "contact_sheet": contact_name,
        "sources": [s.strip() for s in re.split(r";|,", args.sources) if s.strip()],
        "closing_line": args.closing_line,
    }

    comics = [item for item in load_comics() if item.get("slug") != slug]
    comics.insert(0, comic)
    render_site(comics)

    print(f"/comics/{slug}/")


if __name__ == "__main__":
    main()
