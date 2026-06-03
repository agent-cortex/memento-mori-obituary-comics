import Link from "next/link";

import { Button } from "@/components/ui/button";
import { firstImagePath, imageSize, mediaPath } from "@/lib/comic-presenters";

export function ArchiveCard({ comic, priority = false }) {
  const cover = firstImagePath(comic);
  const image = comic.pages?.[0] || "";
  const size = imageSize(comic, image);

  return (
    <article className="archive-card">
      <Link className="archive-cover" href={`/comics/${comic.slug}/`} aria-label={`Open ${comic.person} obituary comic`}>
        <img
          src={cover}
          alt={`${comic.person} obituary comic cover`}
          width={size.width}
          height={size.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
        />
      </Link>
      <div className="archive-copy">
        <div className="meta">
          {comic.published_at} · {comic.years}
        </div>
        <h3>{comic.person}</h3>
        <p>{comic.dek}</p>
        <div className="archive-actions">
          <Button asChild variant="miniPrimary">
            <Link href={`/comics/${comic.slug}/#read`}>Read</Link>
          </Button>
          {comic.pdf ? (
            <Button asChild variant="miniGhost">
              <a href={mediaPath(comic, comic.pdf)}>PDF</a>
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
