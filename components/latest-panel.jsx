import Link from "next/link";

import { firstImagePath, imageSize } from "@/lib/comic-presenters";

export function LatestPanel({ comic }) {
  if (!comic) return null;
  const firstImage = comic.pages?.[0] || "";
  const size = imageSize(comic, firstImage);

  return (
    <Link className="latest-panel" href={`/comics/${comic.slug}/#read`} aria-label={`Read the latest obituary comic about ${comic.person}`}>
      <div className="latest-panel-label">Latest issue</div>
      <div className="latest-panel-grid">
        <div className="latest-panel-cover">
          <img src={firstImagePath(comic)} alt={`${comic.person} obituary comic cover`} width={size.width} height={size.height} loading="eager" fetchPriority="high" />
        </div>
        <div className="latest-panel-copy">
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
