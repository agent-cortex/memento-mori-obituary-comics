#!/usr/bin/env python3
"""Add a generated obituary comic directory to this static site.

Expected source directory: contains pages/*.jpg and optionally a PDF/contact sheet.
Usage:
  python scripts/add_comic.py SOURCE_DIR --slug person-slug --person "Name" --title "Title" --years "1900–2000" --dek "Short dek" --event "mortality event" --sources "A; B; C"
"""
from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "comic"


def load_comics() -> list[dict]:
    path = ROOT / "comics.json"
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8"))


def save_comics(comics: list[dict]) -> None:
    (ROOT / "comics.json").write_text(json.dumps(comics, indent=2, ensure_ascii=False), encoding="utf-8")


def analytics_head() -> str:
    return '''<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};window.si=window.si||function(){(window.siq=window.siq||[]).push(arguments);};</script><script defer src="/_vercel/insights/script.js"></script><script defer src="/_vercel/speed-insights/script.js"></script><script defer src="/assets/analytics.js"></script>'''


def render_index(comics: list[dict]) -> str:
    latest = comics[0] if comics else None
    cards: list[str] = []
    for comic in comics:
        cover = f"/comics/{comic['slug']}/{comic['pages'][0]}" if comic.get("pages") else ""
        reader_href = f"/comics/{esc(comic['slug'])}/#read"
        pdf_href = f"/comics/{esc(comic['slug'])}/{esc(comic.get('pdf', ''))}" if comic.get("pdf") else ""
        pdf_button = f'<a class="mini-btn ghost" href="{pdf_href}">PDF</a>' if pdf_href else ""
        cards.append(
            '<article class="archive-card">'
            f'<a class="archive-cover" href="{reader_href}" aria-label="Read {esc(comic["person"])} fullscreen">'
            f'<img src="{esc(cover)}" alt="{esc(comic["person"])} comic cover" loading="lazy">'
            '</a>'
            '<div class="archive-copy">'
            f'<div class="meta">{esc(comic.get("published_at", ""))} · {esc(comic.get("years", ""))}</div>'
            f'<h3>{esc(comic["person"])}</h3>'
            f'<p>{esc(comic.get("dek", ""))}</p>'
            '<div class="archive-actions">'
            f'<a class="mini-btn primary" href="{reader_href}">Read</a>'
            f'{pdf_button}'
            '</div></div></article>'
        )
    latest_button = ""
    if latest:
        latest_button = f'<a class="btn primary" href="/comics/{esc(latest["slug"])}/#read">Read latest</a>'
    archive = "".join(cards) if cards else '<div class="empty">No comics published yet.</div>'
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Memento Mori Obituary Comics</title><meta name="description" content="Daily obituary comics about people who faced death and made their work anyway."><link rel="stylesheet" href="/assets/style.css">{analytics_head()}</head><body data-page-type="archive"><header class="hero"><div class="wrap"><div class="kicker">Daily memento mori</div><h1>Obituary Comics</h1><p>Lives that met death early, then used borrowed time to make something that outlived them.</p><div class="rule"></div><div class="btns">{latest_button}<a class="btn" href="#archive">Browse archive</a></div></div></header><main class="wrap section" id="archive"><div class="section-head"><div><div class="kicker">Small shelf, not doomscroll</div><h2>Archive</h2></div><p>Compact comic/PDF cards. Open a reader only when you choose it.</p></div><div class="archive-grid">{archive}</div></main><footer>Built for Megabyte’s morning death-reminder ritual. Clean comics, verified lives, no motivational slop.</footer></body></html>'''


def render_comic(comic: dict) -> str:
    pages = "".join(
        f'<figure class="reader-page" id="page-{i:02d}"><img src="{esc(src)}" alt="Page {i} of {esc(comic["person"])}: {esc(comic["title"])}" loading="{"eager" if i == 1 else "lazy"}"><figcaption>Page {i:02d}</figcaption></figure>'
        for i, src in enumerate(comic.get("pages", []), 1)
    )
    sources = "; ".join(comic.get("sources", []))
    pdf_button = f'<a class="reader-btn primary" href="{esc(comic["pdf"])}">PDF</a>' if comic.get("pdf") else ""
    contact_button = f'<a class="reader-btn" href="{esc(comic["contact_sheet"])}">Contact</a>' if comic.get("contact_sheet") else ""
    fullscreen_button = '<button class="reader-btn" id="fullscreenBtn" type="button">Fullscreen</button>'
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>{esc(comic["person"])} — {esc(comic["title"])}</title><meta name="description" content="{esc(comic.get("dek", ""))}"><link rel="stylesheet" href="/assets/style.css">{analytics_head()}</head><body class="reader-mode" data-page-type="reader" data-comic-slug="{esc(comic['slug'])}" data-person="{esc(comic['person'])}" data-title="{esc(comic['title'])}"><nav class="reader-toolbar" aria-label="Reader controls"><a class="reader-btn" href="/">← Archive</a><div class="reader-title">{esc(comic["person"])} · {esc(comic["title"])}</div><div class="reader-actions">{fullscreen_button}{pdf_button}{contact_button}</div></nav><main id="read" class="reader-pages" aria-label="Fullscreen scrollable comic pages">{pages}</main><footer class="reader-footer"><div class="reader-source-line">{esc(comic.get("closing_line", ""))}<br><span class="small">Sources: {esc(sources)}</span></div></footer><script>(function(){{const btn=document.getElementById('fullscreenBtn');const root=document.documentElement;function setState(){{document.body.classList.toggle('fullscreen-active',!!document.fullscreenElement)}}if(btn&&document.fullscreenEnabled){{btn.addEventListener('click',async()=>{{try{{if(document.fullscreenElement){{await document.exitFullscreen();}}else{{await root.requestFullscreen();}}}}catch(e){{console.warn('fullscreen failed',e)}}}});document.addEventListener('fullscreenchange',setState)}}else if(btn){{btn.style.display='none'}}}})();</script></body></html>'''


def find_optional(source: Path, patterns: list[str]) -> Path | None:
    for pattern in patterns:
        hits = sorted(source.glob(pattern))
        if hits:
            return hits[0]
    return None


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source_dir")
    parser.add_argument("--slug")
    parser.add_argument("--person", required=True)
    parser.add_argument("--title", default="Borrowed Time")
    parser.add_argument("--years", default="")
    parser.add_argument("--dek", default="")
    parser.add_argument("--event", default="")
    parser.add_argument("--sources", default="")
    parser.add_argument("--closing-line", default="The reprieve was one moment. The work was the rest of his life.")
    args = parser.parse_args()

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
    for index, page in enumerate(page_sources, 1):
        name = f"{index:02d}-{slug}.jpg"
        shutil.copy2(page, dest / "pages" / name)
        pages.append(f"pages/{name}")

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
        "pdf": pdf_name,
        "contact_sheet": contact_name,
        "sources": [s.strip() for s in re.split(r";|,", args.sources) if s.strip()],
        "closing_line": args.closing_line,
    }

    (dest / "comic.json").write_text(json.dumps(comic, indent=2, ensure_ascii=False), encoding="utf-8")
    (dest / "index.html").write_text(render_comic(comic), encoding="utf-8")

    comics = [item for item in load_comics() if item.get("slug") != slug]
    comics.insert(0, comic)
    save_comics(comics)
    (ROOT / "index.html").write_text(render_index(comics), encoding="utf-8")

    print(f"/comics/{slug}/")


if __name__ == "__main__":
    main()
