import { getComics } from "../lib/comics.js";
import { absoluteUrl } from "../lib/site.js";

export default function sitemap() {
  const comics = getComics();
  const latest = comics.reduce((max, comic) => (comic.published_at > max ? comic.published_at : max), new Date().toISOString().slice(0, 10));
  return [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/obituary-stories/"), lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/about/"), lastModified: latest, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/press/"), lastModified: latest, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/newsletter/"), lastModified: latest, changeFrequency: "weekly", priority: 0.6 },
    ...comics.map((comic) => ({
      url: absoluteUrl(`/comics/${comic.slug}/`),
      lastModified: comic.published_at || latest,
      changeFrequency: "monthly",
      priority: 0.9,
    })),
  ];
}
