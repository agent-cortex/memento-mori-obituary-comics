#!/usr/bin/env python3
"""Add or refresh an obituary comic for the Next.js app.

The Next app renders pages from comics.json and serves comic media from
private Vercel Blob storage through /media/comics/<slug>/... URLs. This script
updates metadata and stages local binaries under comics/<slug>/ for upload; it
does not generate HTML, robots.txt, sitemap.xml, or llms.txt.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import shutil
import struct
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
COMICS_JSON = ROOT / "comics.json"
COMICS_DIR = ROOT / "comics"

IMAGE_EXTENSIONS = {".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"}
PDF_EXTENSION = ".pdf"


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "comic"


def load_comics() -> list[dict[str, Any]]:
    if not COMICS_JSON.exists():
        return []
    return json.loads(COMICS_JSON.read_text(encoding="utf-8"))


def save_comics(comics: list[dict[str, Any]]) -> None:
    ordered = sorted(comics, key=lambda comic: comic.get("published_at", ""), reverse=True)
    COMICS_JSON.write_text(json.dumps(ordered, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def save_comic_file(comic: dict[str, Any]) -> None:
    slug = comic.get("slug")
    if not slug:
        return
    comic_dir = COMICS_DIR / slug
    comic_dir.mkdir(parents=True, exist_ok=True)
    (comic_dir / "comic.json").write_text(json.dumps(comic, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def parse_sources(value: str | None) -> list[str | dict[str, str]]:
    if not value:
        return []

    sources: list[str | dict[str, str]] = []
    for item in [part.strip() for part in value.split(";") if part.strip()]:
        if "=" in item:
            name, url = [part.strip() for part in item.split("=", 1)]
            if name and url:
                sources.append({"name": name, "url": url})
                continue
        sources.append(item)
    return sources


def image_size(path: Path) -> tuple[int, int] | None:
    try:
        with path.open("rb") as handle:
            header = handle.read(24)
            if header.startswith(b"\x89PNG\r\n\x1a\n"):
                width, height = struct.unpack(">II", header[16:24])
                return width, height

            if header[:2] != b"\xff\xd8":
                return None

            handle.seek(2)
            while True:
                marker_prefix = handle.read(1)
                if marker_prefix != b"\xff":
                    return None
                marker = handle.read(1)
                while marker == b"\xff":
                    marker = handle.read(1)
                if marker in {b"\xd8", b"\xd9"}:
                    continue

                length_bytes = handle.read(2)
                if len(length_bytes) != 2:
                    return None
                length = struct.unpack(">H", length_bytes)[0]
                if marker in {
                    b"\xc0",
                    b"\xc1",
                    b"\xc2",
                    b"\xc3",
                    b"\xc5",
                    b"\xc6",
                    b"\xc7",
                    b"\xc9",
                    b"\xca",
                    b"\xcb",
                    b"\xcd",
                    b"\xce",
                    b"\xcf",
                }:
                    payload = handle.read(5)
                    if len(payload) != 5:
                        return None
                    height, width = struct.unpack(">HH", payload[1:5])
                    return width, height
                handle.seek(length - 2, 1)
    except OSError:
        return None


def copy_file(source: Path, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)


def find_pages(source_dir: Path) -> list[Path]:
    page_root = source_dir / "pages"
    if page_root.exists():
        candidates = page_root.rglob("*")
    else:
        candidates = source_dir.iterdir()

    pages = [
        path
        for path in candidates
        if path.is_file()
        and path.suffix.lower() in IMAGE_EXTENSIONS
        and "contact" not in path.stem.lower()
    ]
    return sorted(pages)


def find_first(source_dir: Path, suffix: str, stem_contains: str | None = None) -> Path | None:
    for path in sorted(source_dir.rglob("*")):
        if not path.is_file() or path.suffix.lower() != suffix:
            continue
        if stem_contains and stem_contains not in path.stem.lower():
            continue
        return path
    return None


def resolve_optional_path(source_dir: Path, value: str | None) -> Path | None:
    if not value:
        return None
    path = Path(value)
    if not path.is_absolute():
        path = source_dir / path
    return path if path.exists() else None


def build_comic(args: argparse.Namespace, existing: dict[str, Any] | None) -> dict[str, Any]:
    source_dir = Path(args.source_dir).expanduser().resolve()
    if not source_dir.exists():
        raise SystemExit(f"source directory does not exist: {source_dir}")

    slug = args.slug or slugify(args.person or source_dir.name)
    target_dir = COMICS_DIR / slug
    if target_dir.exists():
        shutil.rmtree(target_dir)
    target_dir.mkdir(parents=True, exist_ok=True)

    pages = find_pages(source_dir)
    if not pages:
        raise SystemExit("no comic page images found; expected source/pages/*.jpg or similar")

    page_root = source_dir / "pages" if (source_dir / "pages").exists() else source_dir
    page_refs: list[str] = []
    page_dimensions: dict[str, list[int]] = {}
    for page in pages:
        relative = page.relative_to(page_root)
        target = target_dir / "pages" / relative
        copy_file(page, target)
        ref = f"pages/{relative.as_posix()}"
        page_refs.append(ref)
        size = image_size(page)
        if size:
            page_dimensions[ref] = [size[0], size[1]]

    pdf_path = resolve_optional_path(source_dir, args.pdf) or find_first(source_dir, PDF_EXTENSION)
    contact_path = resolve_optional_path(source_dir, args.contact_sheet) or find_first(source_dir, ".jpg", "contact")

    pdf_name = ""
    if pdf_path:
        pdf_name = pdf_path.name
        copy_file(pdf_path, target_dir / pdf_name)

    contact_name = ""
    if contact_path:
        contact_name = contact_path.name
        copy_file(contact_path, target_dir / contact_name)

    reel_dir = source_dir / "reel"
    if reel_dir.exists():
        shutil.copytree(reel_dir, target_dir / "reel")

    sources = parse_sources(args.sources)
    if not sources and existing:
        sources = existing.get("sources", [])

    comic = {
        **(existing or {}),
        "slug": slug,
        "title": args.title or (existing or {}).get("title") or slug.replace("-", " ").title(),
        "person": args.person or (existing or {}).get("person") or slug.replace("-", " ").title(),
        "years": args.years or (existing or {}).get("years", ""),
        "dek": args.dek or (existing or {}).get("dek", ""),
        "mortality_event": args.event or (existing or {}).get("mortality_event", ""),
        "published_at": args.published_at or (existing or {}).get("published_at") or dt.date.today().isoformat(),
        "pages": page_refs,
        "page_dimensions": page_dimensions or (existing or {}).get("page_dimensions", {}),
        "sources": sources,
    }
    if pdf_name:
        comic["pdf"] = pdf_name
    if contact_name:
        comic["contact_sheet"] = contact_name
    return comic


def validate_metadata(comics: list[dict[str, Any]]) -> None:
    errors: list[str] = []
    for comic in comics:
        slug = comic.get("slug", "")
        if not slug:
            errors.append("comic is missing slug")
        if not comic.get("person"):
            errors.append(f"{slug or 'comic'} is missing person")
        if not comic.get("title"):
            errors.append(f"{slug or 'comic'} is missing title")
        if not comic.get("published_at"):
            errors.append(f"{slug or 'comic'} is missing published_at")
        if not comic.get("pages"):
            errors.append(f"{slug or 'comic'} is missing pages")
    if errors:
        raise SystemExit("invalid comic metadata:\n" + "\n".join(errors))


def validate_media(comics: list[dict[str, Any]]) -> None:
    missing: list[str] = []
    for comic in comics:
        slug = comic.get("slug", "")
        for relative in list(comic.get("pages") or []) + [comic.get("pdf"), comic.get("contact_sheet")]:
            if not relative:
                continue
            path = COMICS_DIR / slug / relative
            if not path.exists():
                missing.append(path.relative_to(ROOT).as_posix())
    if missing:
        raise SystemExit("missing staged comic media:\n" + "\n".join(missing))


def main() -> None:
    parser = argparse.ArgumentParser(description="Add or refresh a comic for the Next.js app")
    parser.add_argument("source_dir", nargs="?", help="generated comic directory containing a pages/ folder")
    parser.add_argument("--render-only", action="store_true", help="validate metadata without generating static HTML")
    parser.add_argument("--slug")
    parser.add_argument("--person")
    parser.add_argument("--title")
    parser.add_argument("--years")
    parser.add_argument("--dek")
    parser.add_argument("--event")
    parser.add_argument("--sources", help="semicolon-separated names, or Name=https://source.url pairs")
    parser.add_argument("--published-at")
    parser.add_argument("--pdf", help="PDF path relative to source_dir")
    parser.add_argument("--contact-sheet", help="contact sheet path relative to source_dir")
    args = parser.parse_args()

    comics = load_comics()
    if args.render_only:
        validate_metadata(comics)
        print(f"validated {len(comics)} comics")
        return

    if not args.source_dir:
        raise SystemExit("source_dir is required unless --render-only is passed")

    slug = args.slug or slugify(args.person or Path(args.source_dir).name)
    existing = next((comic for comic in comics if comic.get("slug") == slug), None)
    updated = build_comic(args, existing)
    comics = [comic for comic in comics if comic.get("slug") != slug]
    comics.insert(0, updated)
    validate_metadata(comics)
    validate_media([updated])
    save_comics(comics)
    save_comic_file(updated)
    print(f"/comics/{slug}/")


if __name__ == "__main__":
    main()
