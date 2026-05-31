import json
import unittest

from scripts import add_comic


ZEC_ADDRESS = "u1cyxqx2za9c7g2h7tjz0nn7rdf5fgykmqgw4eke7fvfa9pd7lynjkqfeq4hzd3tkys4pvku5xnmmwclm77jv9ljkhdefrvzc6pgehc63rcnmylqlxt0fmz55t6wdp6dyk5w2hzx06hs93xun5smexvwn04ju4ppy54gx477ftequajh0t"
SITE_URL = "https://obit.agentcortex.space"


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

NEXT_COMIC = {
    **SAMPLE_COMIC,
    "slug": "next-comic",
    "title": "Second Light",
    "person": "Grace Followup",
    "pages": ["pages/01-next-comic.jpg"],
    "page_dimensions": {"pages/01-next-comic.jpg": [768, 1408]},
    "pdf": "next-comic.pdf",
    "contact_sheet": "next-contact-sheet.jpg",
}


class SeoRenderingTests(unittest.TestCase):
    def test_homepage_includes_discovery_metadata_and_itemlist_schema(self):
        html = add_comic.render_index([SAMPLE_COMIC])

        self.assertIn(f'<link rel="canonical" href="{SITE_URL}/">', html)
        self.assertIn(f'property="og:image" content="{SITE_URL}/media/comics/sample-comic/pages/01-sample-comic.jpg"', html)
        self.assertIn('property="og:title"', html)
        self.assertIn('name="twitter:card"', html)
        self.assertIn('type="application/ld+json"', html)
        self.assertIn('"@type": "ItemList"', html)
        self.assertIn('src="/_vercel/image?url=%2Fmedia%2Fcomics%2Fsample-comic%2Fpages%2F01-sample-comic.jpg&amp;w=768&amp;q=75"', html)
        self.assertIn('srcset="/_vercel/image?url=%2Fmedia%2Fcomics%2Fsample-comic%2Fpages%2F01-sample-comic.jpg&amp;w=384&amp;q=75 384w', html)
        self.assertIn('sizes="(min-width: 900px) 25vw, 100vw"', html)
        self.assertIn('href="/media/comics/sample-comic/sample-comic.pdf"', html)
        self.assertIn('/about/', html)
        self.assertIn('openSupportModal()', html)
        self.assertIn('Support development', html)
        self.assertIn(ZEC_ADDRESS, html)
        self.assertIn('copySupportAddress()', html)
        self.assertIn('cdn.mxpnl.com/libs/mixpanel-2-latest.min.js', html)
        self.assertIn('/assets/analytics.js', html)

    def test_homepage_prioritizes_latest_comic_before_ritual_widgets(self):
        html = add_comic.render_index([SAMPLE_COMIC])

        self.assertIn('class="latest-specimen"', html)
        self.assertIn('href="/comics/sample-comic/#read"', html)
        self.assertIn('class="hero-secondary-links"', html)
        self.assertNotIn('<a class="btn" href="/about/">About</a>', html)

        latest_index = html.index('class="latest-specimen"')
        cta_index = html.index('class="btns"')
        archive_index = html.index('<main class="wrap section" id="archive">')
        rituals_index = html.index('class="wrap section homepage-rituals"')
        self.assertLess(latest_index, cta_index)
        self.assertLess(archive_index, rituals_index)

    def test_custom_analytics_forwards_events_to_mixpanel_eu(self):
        script = (add_comic.ROOT / "assets" / "analytics.js").read_text(encoding="utf-8")

        self.assertIn("api-eu.mixpanel.com", script)
        self.assertIn("mixpanel.init", script)
        self.assertIn("mixpanel.track(name, payload)", script)
        self.assertIn("ip: false", script)
        self.assertIn("globalPrivacyControl", script)
        self.assertIn("&ip=0", script)
        self.assertIn("value_moment_event: 'reader_finished'", script)
        self.assertIn("getAttribution", script)
        self.assertIn("utm_source", script)
        self.assertIn("utm_medium", script)
        self.assertIn("utm_campaign", script)
        self.assertIn("utm_term", script)
        self.assertIn("utm_content", script)
        self.assertIn("referrer_host", script)
        self.assertIn("landing_page", script)
        self.assertIn("channel", script)
        self.assertIn("support_modal_opened", script)
        self.assertIn("support_address_copied", script)
        self.assertIn("outbound_link_clicked", script)
        self.assertIn("share_clicked", script)
        self.assertIn("newsletter_clicked", script)
        self.assertNotIn("reflectionText", script)

    def test_comic_page_includes_semantic_headings_schema_and_crawlable_sources(self):
        html = add_comic.render_comic(SAMPLE_COMIC)

        self.assertIn('<h1>Ada Example - Borrowed Light</h1>', html)
        self.assertIn('<h2>Story Notes</h2>', html)
        self.assertIn('<h2>Sources</h2>', html)
        self.assertIn('href="https://example.com/archive"', html)
        self.assertIn('This crawlable note explains', html)
        self.assertIn('width="768" height="1408"', html)
        self.assertIn('src="/_vercel/image?url=%2Fmedia%2Fcomics%2Fsample-comic%2Fpages%2F01-sample-comic.jpg&amp;w=768&amp;q=75"', html)
        self.assertIn('srcset="/_vercel/image?url=%2Fmedia%2Fcomics%2Fsample-comic%2Fpages%2F01-sample-comic.jpg&amp;w=384&amp;q=75 384w', html)
        self.assertIn('sizes="(min-width: 900px) 80vw, 100vw"', html)
        self.assertIn('href="/media/comics/sample-comic/sample-comic.pdf"', html)
        self.assertIn('<a class="reader-btn" href="/media/comics/sample-comic/sample-comic.pdf"><svg', html)
        self.assertNotIn('<a class="reader-btn primary" href="/media/comics/sample-comic/sample-comic.pdf"><svg', html)
        self.assertNotIn('href="/media/comics/sample-comic/contact-sheet.jpg"', html)
        self.assertIn(f'"image": "{SITE_URL}/media/comics/sample-comic/pages/01-sample-comic.jpg"', html)
        self.assertIn('"@type": "CreativeWork"', html)
        self.assertIn('"@type": "BreadcrumbList"', html)
        self.assertIn(f'<link rel="canonical" href="{SITE_URL}/comics/sample-comic/">', html)
        self.assertIn('openSupportModal()', html)
        self.assertIn('Support development', html)
        self.assertIn(ZEC_ADDRESS, html)
        self.assertIn('copySupportAddress()', html)

    def test_reader_script_keeps_toolbar_controls_parseable(self):
        script = add_comic.reader_script()

        self.assertNotIn('})function setTheme', script)
        self.assertIn('});\nfunction setTheme', script)

    def test_comic_page_promotes_next_comic_before_reader_footer(self):
        html = add_comic.render_comic(SAMPLE_COMIC, NEXT_COMIC)

        self.assertIn('class="reader-continue-strip"', html)
        self.assertIn('href="/comics/next-comic/#read"', html)
        self.assertIn('Read next', html)
        self.assertLess(html.index('class="reader-continue-strip"'), html.index('<footer class="reader-footer">'))

    def test_public_discovery_files_reference_canonical_pages(self):
        comics = [SAMPLE_COMIC]

        sitemap = add_comic.render_sitemap(comics)
        self.assertIn(f"<loc>{SITE_URL}/</loc>", sitemap)
        self.assertIn(f"<loc>{SITE_URL}/comics/sample-comic/</loc>", sitemap)
        self.assertNotIn("<priority>", sitemap)
        self.assertNotIn("<changefreq>", sitemap)

        robots = add_comic.render_robots()
        self.assertIn(f"Sitemap: {SITE_URL}/sitemap.xml", robots)
        self.assertIn("User-agent: GPTBot", robots)

        llms = add_comic.render_llms(comics)
        self.assertIn("# Memento Mori Obituary Comics", llms)
        self.assertIn(f"[Ada Example - Borrowed Light]({SITE_URL}/comics/sample-comic/)", llms)

    def test_vercel_image_optimization_is_enabled_for_media_cdn_paths(self):
        config = json.loads((add_comic.ROOT / "vercel.json").read_text(encoding="utf-8"))

        images = config["images"]
        self.assertIn(768, images["sizes"])
        self.assertIn(1440, images["sizes"])
        self.assertEqual(images["qualities"], [75])
        self.assertEqual(images["formats"], ["image/avif", "image/webp"])
        self.assertEqual(images["minimumCacheTTL"], 31536000)
        self.assertIn(
            {"pathname": "^/media/comics/.*\\.(jpg|jpeg|png)$", "search": ""},
            images["localPatterns"],
        )

    def test_ux_css_uses_touch_sized_controls_and_reduced_motion_guards(self):
        css = (add_comic.ROOT / "assets" / "style.css").read_text(encoding="utf-8")
        home_script = add_comic.home_script()

        self.assertIn(".reader-btn, .toolbar-select-btn {\n  min-height: 44px;", css)
        self.assertIn(".option-group {\n  display: flex;\n  min-height: 44px;", css)
        self.assertIn(".hotkeys-helper-btn {\n  position: fixed;", css)
        self.assertIn("width: 44px;", css)
        self.assertIn("height: 44px;", css)
        self.assertIn("prefers-reduced-motion: reduce", css)
        self.assertIn("prefers-reduced-motion: reduce", home_script)
        self.assertIn("requestAnimationFrame(loop)", home_script)


if __name__ == "__main__":
    unittest.main()
