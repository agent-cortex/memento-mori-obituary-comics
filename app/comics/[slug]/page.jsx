import { notFound } from "next/navigation";

import { ReaderShell } from "@/components/reader-shell";
import { comicDescription, comicImageMetadata, comicKeywords, comicSchema, getComic, getComics, getNextComic } from "@/lib/comics";
import { SITE_NAME } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getComics().map((comic) => ({ slug: comic.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const comic = getComic(slug);
  if (!comic) return {};
  const title = `${comic.person} Obituary Comic - ${comic.title}`;
  const description = comicDescription(comic);
  const images = comicImageMetadata(comic);
  return {
    title,
    description,
    keywords: comicKeywords(comic),
    authors: [{ name: SITE_NAME }],
    alternates: {
      canonical: `/comics/${comic.slug}/`,
    },
    openGraph: {
      type: "article",
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `/comics/${comic.slug}/`,
      publishedTime: comic.published_at,
      modifiedTime: comic.updated_at || comic.published_at,
      authors: [SITE_NAME],
      section: "Obituary Comics",
      tags: comicKeywords(comic),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
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
