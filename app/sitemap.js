import { getComics } from "@/lib/comics";
import { SITE_URL } from "@/lib/site";

export default function sitemap() {
  const comics = getComics();
  const latest = comics.reduce((max, comic) => (comic.published_at > max ? comic.published_at : max), new Date().toISOString().slice(0, 10));
  return [
    { url: `${SITE_URL}/`, lastModified: latest },
    { url: `${SITE_URL}/about/`, lastModified: latest },
    { url: `${SITE_URL}/newsletter/`, lastModified: latest },
    ...comics.map((comic) => ({
      url: `${SITE_URL}/comics/${comic.slug}/`,
      lastModified: comic.published_at || latest,
    })),
  ];
}
