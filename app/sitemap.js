import { getComics } from "../lib/comics.js";
import { absoluteUrl } from "../lib/site.js";

export default function sitemap() {
  const comics = getComics();
  const latest = comics.reduce((max, comic) => (comic.published_at > max ? comic.published_at : max), new Date().toISOString().slice(0, 10));
  return [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/obituary-stories/"), lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/obituary-articles/"), lastModified: latest, changeFrequency: "monthly", priority: 0.875 },
    { url: absoluteUrl("/obituary-lesson-plan/"), lastModified: latest, changeFrequency: "monthly", priority: 0.855 },
    { url: absoluteUrl("/obituary-research-guide/"), lastModified: latest, changeFrequency: "monthly", priority: 0.872 },
    { url: absoluteUrl("/obituary-vs-death-notice/"), lastModified: latest, changeFrequency: "monthly", priority: 0.868 },
    { url: absoluteUrl("/obituary-vs-eulogy/"), lastModified: latest, changeFrequency: "monthly", priority: 0.866 },
    { url: absoluteUrl("/what-not-to-include-in-an-obituary/"), lastModified: latest, changeFrequency: "monthly", priority: 0.864 },
    { url: absoluteUrl("/fake-obituary-sites/"), lastModified: latest, changeFrequency: "monthly", priority: 0.862 },
    { url: absoluteUrl("/how-to-submit-an-obituary-to-a-newspaper/"), lastModified: latest, changeFrequency: "monthly", priority: 0.863 },
    { url: absoluteUrl("/obituary-cost/"), lastModified: latest, changeFrequency: "monthly", priority: 0.867 },
    { url: absoluteUrl("/obituary-checklist/"), lastModified: latest, changeFrequency: "monthly", priority: 0.869 },
    { url: absoluteUrl("/memorial-donation-wording-obituary/"), lastModified: latest, changeFrequency: "monthly", priority: 0.861 },
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
