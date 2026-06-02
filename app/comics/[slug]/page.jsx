import { notFound } from "next/navigation";

import { ReaderShell } from "@/components/reader-shell";
import { comicDescription, comicSchema, firstImageUrl, getComic, getComics, getNextComic } from "@/lib/comics";
import { SITE_NAME } from "@/lib/site";

export function generateStaticParams() {
  return getComics().map((comic) => ({ slug: comic.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const comic = getComic(slug);
  if (!comic) return {};
  const title = `${comic.person} Obituary Comic - ${comic.title}`;
  const description = comicDescription(comic);
  return {
    title,
    description,
    alternates: {
      canonical: `/comics/${comic.slug}/`,
    },
    openGraph: {
      type: "article",
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `/comics/${comic.slug}/`,
      images: [firstImageUrl(comic)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [firstImageUrl(comic)],
    },
  };
}

export default async function ComicPage({ params }) {
  const { slug } = await params;
  const comic = getComic(slug);
  if (!comic) notFound();
  const nextComic = getNextComic(comic.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comicSchema(comic)) }} />
      <ReaderShell comic={comic} nextComic={nextComic} />
    </>
  );
}
