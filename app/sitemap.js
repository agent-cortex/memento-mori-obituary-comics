import { getComics } from "../lib/comics.js";
import { absoluteUrl } from "../lib/site.js";

export default function sitemap() {
  const comics = getComics();
  const latest = comics.reduce((max, comic) => (comic.published_at > max ? comic.published_at : max), new Date().toISOString().slice(0, 10));
  return [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/obituary-stories/"), lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/how-to-write-an-obituary-story/"), lastModified: latest, changeFrequency: "monthly", priority: 0.88 },
    { url: absoluteUrl("/obituary-writing-prompts/"), lastModified: latest, changeFrequency: "monthly", priority: 0.87 },
    { url: absoluteUrl("/life-story-obituary-template/"), lastModified: latest, changeFrequency: "monthly", priority: 0.865 },
    { url: absoluteUrl("/obituary-examples/"), lastModified: latest, changeFrequency: "monthly", priority: 0.86 },
    { url: absoluteUrl("/obituary-story-worksheet/"), lastModified: latest, changeFrequency: "monthly", priority: 0.84 },
    { url: absoluteUrl("/what-are-obituary-comics/"), lastModified: latest, changeFrequency: "monthly", priority: 0.85 },
    { url: absoluteUrl("/educators-libraries/"), lastModified: latest, changeFrequency: "monthly", priority: 0.82 },
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
