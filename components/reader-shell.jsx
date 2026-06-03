"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { ComicSubscribeDialog } from "@/components/comic-subscribe-dialog";
import { SupportDialog } from "@/components/support-dialog";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { citableSummary, comicDescription, firstImagePath, imageSize, mediaPath, pageSummary, sourceItems, storyNotes } from "@/lib/comic-presenters";

const READER_STORAGE = "memento_reader_settings_v1";

export function ReaderShell({ comic, nextComic }) {
  const [layout, setLayout] = useState("vertical");
  const [theme, setTheme] = useState("obsidian");
  const [textSize, setTextSize] = useState("md");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const pages = comic.pages || [];

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(READER_STORAGE) || "{}");
      if (saved.layout) setLayout(saved.layout);
      if (saved.theme) setTheme(saved.theme);
      if (saved.textSize) setTextSize(saved.textSize);
    } catch (_error) {
      // Ignore corrupt reader preferences.
    } finally {
      setSettingsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;
    localStorage.setItem(READER_STORAGE, JSON.stringify({ layout, theme, textSize }));
  }, [layout, settingsLoaded, theme, textSize]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.target?.matches?.("input, textarea")) return;
      if (layout !== "slide") return;
      if (event.key === "ArrowLeft") setCurrentSlide((index) => (index - 1 + pages.length) % pages.length);
      if (event.key === "ArrowRight") setCurrentSlide((index) => (index + 1) % pages.length);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [layout, pages.length]);

  const bodyClass = useMemo(() => ["reader-mode", theme !== "obsidian" ? `theme-${theme}` : "", `text-size-adjust-${textSize}`].filter(Boolean).join(" "), [theme, textSize]);
  const progress = layout === "slide" && pages.length ? ((currentSlide + 1) / pages.length) * 100 : 0;

  useEffect(() => {
    const classes = bodyClass.split(" ").filter(Boolean);
    document.body.classList.add(...classes);
    return () => {
      document.body.classList.remove(...classes);
    };
  }, [bodyClass]);

  function toggleFullscreen() {
    if (!document.fullscreenEnabled) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }

  return (
    <>
      <nav className="reader-toolbar" aria-label="Reader controls" id="readerToolbar">
        <Button asChild variant="reader" className="reader-back">
          <Link href="/">← Archive</Link>
        </Button>
        <div className="reader-title">
          {comic.person} · {comic.title}
        </div>
        <div className="reader-actions">
          <ToggleGroup className="option-group reader-layout-group main-toolbar-only" type="single" value={layout} onValueChange={(value) => value && setLayout(value)}>
            <ToggleGroupItem value="vertical">Scroll</ToggleGroupItem>
            <ToggleGroupItem value="spread">Book</ToggleGroupItem>
            <ToggleGroupItem value="slide">Slide</ToggleGroupItem>
          </ToggleGroup>
          {comic.pdf ? (
            <Button asChild variant="readerPrimary">
              <a href={mediaPath(comic, comic.pdf)}>PDF</a>
            </Button>
          ) : null}
          <details className="reader-more">
            <summary className="reader-btn reader-more-summary">More</summary>
            <div className="reader-more-menu">
              <div className="reader-menu-label mobile-only">Layout</div>
              <ToggleGroup className="option-group reader-layout-group mobile-only" type="single" value={layout} onValueChange={(value) => value && setLayout(value)}>
                <ToggleGroupItem value="vertical">Scroll</ToggleGroupItem>
                <ToggleGroupItem value="spread">Book</ToggleGroupItem>
                <ToggleGroupItem value="slide">Slide</ToggleGroupItem>
              </ToggleGroup>
              <div className="reader-menu-label">Theme</div>
              <ToggleGroup className="option-group reader-theme-group" type="single" value={theme} onValueChange={(value) => value && setTheme(value)}>
                <ToggleGroupItem value="obsidian">Obsidian</ToggleGroupItem>
                <ToggleGroupItem value="sepia">Sepia</ToggleGroupItem>
                <ToggleGroupItem value="stark">OLED</ToggleGroupItem>
              </ToggleGroup>
              <div className="reader-menu-label">Reading</div>
              <ToggleGroup className="option-group reader-theme-group" type="single" value={textSize} onValueChange={(value) => value && setTextSize(value)}>
                <ToggleGroupItem value="sm">A-</ToggleGroupItem>
                <ToggleGroupItem value="md">A</ToggleGroupItem>
                <ToggleGroupItem value="lg">A+</ToggleGroupItem>
              </ToggleGroup>
              <div className="reader-menu-row">
                <Button variant="reader" type="button" onClick={toggleFullscreen}>
                  Fullscreen
                </Button>
                {comic.contact_sheet ? (
                  <Button asChild variant="reader">
                    <a href={mediaPath(comic, comic.contact_sheet)}>Contact</a>
                  </Button>
                ) : null}
                <SupportDialog triggerClass="reader" />
              </div>
            </div>
          </details>
        </div>
      </nav>

      <div className="reader-progress-container">
        <div className="reader-progress-bar" id="readerProgressBar" style={{ width: `${progress}%` }} />
      </div>
      <div className="sr-only">
        <h1>
          {comic.person} - {comic.title}
        </h1>
      </div>

      <main id="read" className={`reader-pages layout-${layout}`} aria-label="Fullscreen scrollable comic pages">
        {pages.map((src, index) => {
          const summary = pageSummary(comic, index + 1);
          const size = imageSize(comic, src);
          const active = layout === "slide" && index === currentSlide;
          return (
            <figure className={`reader-page${active ? " active" : ""}`} id={`page-${String(index + 1).padStart(2, "0")}`} key={src}>
              <Image
                src={mediaPath(comic, src)}
                alt={`Page ${index + 1} of ${comic.person}: ${comic.title}${summary ? ` - ${summary}` : ""}`}
                width={size.width}
                height={size.height}
                sizes="(max-width: 900px) 100vw, 900px"
                preload={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                fetchPriority={index === 0 ? "high" : undefined}
              />
              <figcaption>{summary || `Page ${index + 1}`}</figcaption>
            </figure>
          );
        })}
      </main>

      {layout === "slide" ? (
        <>
          <button className="slide-nav-overlay slide-nav-prev" type="button" onClick={() => setCurrentSlide((index) => (index - 1 + pages.length) % pages.length)} aria-label="Previous page">
            ←
          </button>
          <button className="slide-nav-overlay slide-nav-next" type="button" onClick={() => setCurrentSlide((index) => (index + 1) % pages.length)} aria-label="Next page">
            →
          </button>
        </>
      ) : null}

      <ReaderFooter comic={comic} nextComic={nextComic} />
    </>
  );
}

function ReaderFooter({ comic, nextComic }) {
  const sources = sourceItems(comic);
  return (
    <footer className="reader-footer">
      <div className="epilogue-card">
        <div className="epilogue-quote">“{comic.closing_line || ""}”</div>
        <div className="epilogue-sources">
          {sources.map((source) => (
            source.url ? (
              <a className="source-chip" href={source.url} rel="noopener noreferrer" target="_blank" key={source.name}>
                {source.name}
              </a>
            ) : (
              <span className="source-chip" key={source.name}>
                {source.name}
              </span>
            )
          ))}
        </div>
      </div>
      <section className="reader-context" aria-label="Comic notes and sources">
        <p className="reader-source-line">{comicDescription(comic)}</p>
        <h2>Citable Summary</h2>
        <ul className="summary-list">
          {citableSummary(comic).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h2>Story Notes</h2>
        {storyNotes(comic).map((item) => (
          <p key={item}>{item}</p>
        ))}
        <h2>Sources</h2>
        <ul className="source-list">
          {sources.map((source) => (
            <li key={source.name}>
              {source.url ? (
                <a href={source.url} rel="noopener noreferrer" target="_blank">
                  {source.name}
                </a>
              ) : (
                source.name
              )}
            </li>
          ))}
        </ul>
        {comic.pdf ? (
          <>
            <h2>Download PDF</h2>
            <p>
              <Button asChild variant="miniPrimary">
                <a href={mediaPath(comic, comic.pdf)}>Download the PDF</a>
              </Button>
            </p>
          </>
        ) : null}
      </section>
      <ComicSubscribeDialog comic={comic} />
      {nextComic ? (
        <div className="next-comic-teaser">
          <div className="next-kicker">Up Next</div>
          <Link href={`/comics/${nextComic.slug}/#read`} className="next-comic-link">
            <div className="next-cover">
              <Image
                src={firstImagePath(nextComic)}
                alt={`${nextComic.person} cover`}
                width={imageSize(nextComic, nextComic.pages?.[0] || "").width}
                height={imageSize(nextComic, nextComic.pages?.[0] || "").height}
                sizes="(max-width: 760px) 45vw, 220px"
                loading="lazy"
              />
            </div>
            <div className="next-info">
              <h4>{nextComic.person}</h4>
              <p>{nextComic.dek}</p>
            </div>
          </Link>
        </div>
      ) : null}
    </footer>
  );
}
