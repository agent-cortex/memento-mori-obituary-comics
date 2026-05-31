import json
import unittest

from scripts import add_comic


ZEC_ADDRESS = "u1cyxqx2za9c7g2h7tjz0nn7rdf5fgykmqgw4eke7fvfa9pd7lynjkqfeq4hzd3tkys4pvku5xnmmwclm77jv9ljkhdefrvzc6pgehc63rcnmylqlxt0fmz55t6wdp6dyk5w2hzx06hs93xun5smexvwn04ju4ppy54gx477ftequajh0t"


SAMPLE_COMIC = {
    "slug": "sample-comic",
    "title": "Borrowed Light",
    "person": "Ada Example",
    "years": "1900-1950",
    "dek": "A sample comic for SEO rendering tests.",
    "mortality_event": "A near-fatal example event.",
    "published_at": "2026-05-30",
    "pages": ["pages/01-sample-comic.jpg"],
    "page_dimensions": {"pages/01-sample-comic.jpg": [768, 1408]},
    "pdf": "sample-comic.pdf",
    "contact_sheet": "contact-sheet.jpg",
    "sources": [
        {"name": "Example Archive", "url": "https://example.com/archive"}
    ],
    "citable_summary": [
        "Ada Example turned a close encounter with death into a lasting body of work."
    ],
    "story_notes": [
        "This crawlable note explains the image-only comic for search and AI systems."
    ],
    "closing_line": "The example remains.",
}


class SeoRenderingTests(unittest.TestCase):
    def test_homepage_includes_discovery_metadata_and_itemlist_schema(self):
        html = add_comic.render_index([SAMPLE_COMIC])

        self.assertIn('<link rel="canonical" href="https://memento-mori-obituary-comics.vercel.app/">', html)
        self.assertIn('property="og:title"', html)
        self.assertIn('name="twitter:card"', html)
        self.assertIn('type="application/ld+json"', html)
        self.assertIn('"@type": "ItemList"', html)
        self.assertIn('/about/', html)
        self.assertIn('openSupportModal()', html)
        self.assertIn('Support development', html)
        self.assertIn(ZEC_ADDRESS, html)
        self.assertIn('copySupportAddress()', html)

    def test_comic_page_includes_semantic_headings_schema_and_crawlable_sources(self):
        html = add_comic.render_comic(SAMPLE_COMIC)

        self.assertIn('<h1>Ada Example - Borrowed Light</h1>', html)
        self.assertIn('<h2>Story Notes</h2>', html)
        self.assertIn('<h2>Sources</h2>', html)
        self.assertIn('href="https://example.com/archive"', html)
        self.assertIn('This crawlable note explains', html)
        self.assertIn('width="768" height="1408"', html)
        self.assertIn('"@type": "CreativeWork"', html)
        self.assertIn('"@type": "BreadcrumbList"', html)
        self.assertIn('<link rel="canonical" href="https://memento-mori-obituary-comics.vercel.app/comics/sample-comic/">', html)
        self.assertIn('openSupportModal()', html)
        self.assertIn('Support development', html)
        self.assertIn(ZEC_ADDRESS, html)
        self.assertIn('copySupportAddress()', html)

    def test_public_discovery_files_reference_canonical_pages(self):
        comics = [SAMPLE_COMIC]

        sitemap = add_comic.render_sitemap(comics)
        self.assertIn("<loc>https://memento-mori-obituary-comics.vercel.app/</loc>", sitemap)
        self.assertIn("<loc>https://memento-mori-obituary-comics.vercel.app/comics/sample-comic/</loc>", sitemap)
        self.assertNotIn("<priority>", sitemap)
        self.assertNotIn("<changefreq>", sitemap)

        robots = add_comic.render_robots()
        self.assertIn("Sitemap: https://memento-mori-obituary-comics.vercel.app/sitemap.xml", robots)
        self.assertIn("User-agent: GPTBot", robots)

        llms = add_comic.render_llms(comics)
        self.assertIn("# Memento Mori Obituary Comics", llms)
        self.assertIn("[Ada Example - Borrowed Light](https://memento-mori-obituary-comics.vercel.app/comics/sample-comic/)", llms)


if __name__ == "__main__":
    unittest.main()
