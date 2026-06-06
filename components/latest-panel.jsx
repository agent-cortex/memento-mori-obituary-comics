"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import { firstImagePath, imageSize } from "@/lib/comic-presenters";

export function LatestPanel({ comic }) {
  const panelRef = useRef(null);
  const copyRef = useRef(null);
  const labelRef = useRef(null);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const copy = copyRef.current;
    const label = labelRef.current;
    if (!panel || !copy || !label) return undefined;

    const heroGrid = panel.closest(".home-hero-grid");
    const heroCopy = heroGrid?.querySelector(".hero-copy");
    const panelGrid = panel.querySelector(".latest-panel-grid");
    if (!heroCopy || !panelGrid) return undefined;

    const syncHeight = () => {
      if (window.innerWidth <= 980) {
        panel.style.removeProperty("--latest-cover-height");
        return;
      }

      const copyHeight = heroCopy.getBoundingClientRect().height;
      const panelGridStyles = window.getComputedStyle(panelGrid);
      const labelStyles = window.getComputedStyle(label);
      const paddingTop = parseFloat(panelGridStyles.paddingTop) || 0;
      const paddingBottom = parseFloat(panelGridStyles.paddingBottom) || 0;
      const rowGap = parseFloat(panelGridStyles.rowGap || panelGridStyles.gap) || 0;
      const labelHeight = label.getBoundingClientRect().height + (parseFloat(labelStyles.marginBottom) || 0);
      const latestCopyHeight = copy.getBoundingClientRect().height;
      const coverHeight = Math.max(420, Math.round(copyHeight - labelHeight - paddingTop - paddingBottom - rowGap - latestCopyHeight));

      panel.style.setProperty("--latest-cover-height", `${coverHeight}px`);
    };

    window.requestAnimationFrame(syncHeight);

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(syncHeight);
    });

    resizeObserver.observe(heroCopy);
    resizeObserver.observe(copy);
    resizeObserver.observe(label);
    resizeObserver.observe(panelGrid);
    window.addEventListener("resize", syncHeight);
    window.addEventListener("load", syncHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncHeight);
      window.removeEventListener("load", syncHeight);
    };
  }, []);

  if (!comic) return null;
  const firstImage = comic.pages?.[0] || "";
  const size = imageSize(comic, firstImage);

  return (
    <Link className="latest-panel" href={`/comics/${comic.slug}/#read`} aria-label={`Read the latest obituary comic about ${comic.person}`} data-comic-slug={comic.slug} ref={panelRef}>
      <div className="latest-panel-label" ref={labelRef}>Latest issue</div>
      <div className="latest-panel-grid">
        <div className="latest-panel-cover">
          <Image
            src={firstImagePath(comic)}
            alt={`${comic.person} obituary comic cover`}
            width={size.width}
            height={size.height}
            sizes="(max-width: 900px) 100vw, 50vw"
            preload
            fetchPriority="high"
          />
        </div>
        <div className="latest-panel-copy" ref={copyRef}>
          <div className="latest-panel-date">{comic.published_at}</div>
          <h2>{comic.person}</h2>
          <div className="latest-panel-title">{comic.title}</div>
          <div className="latest-panel-years">{comic.years}</div>
          <p>{comic.dek}</p>
        </div>
      </div>
    </Link>
  );
}
