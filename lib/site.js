const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.finalnotes.page";

export const SITE_NAME = "Memento Mori Obituary Comics";
export const SITE_SHORT_NAME = "Memento Mori";
export const SITE_URL = configuredSiteUrl.replace(/\/+$/, "");
export const SITE_TITLE = `${SITE_NAME} - Daily Biographical Comics About Mortality and Work`;
export const SITE_DESCRIPTION =
  "Source-backed obituary comics about people who faced death, illness, exile, or loss and made work that outlived them.";
export const SITE_LANGUAGE = "en";
export const SITE_LOCALE = "en_US";
export const SITE_CATEGORY = "Arts & Culture";
export const SITE_KEYWORDS = [
  "obituary comics",
  "memento mori",
  "biographical comics",
  "obituary stories",
  "obituary articles",
  "visual obituaries",
  "mortality",
  "visual biography",
  "source-backed comics",
  "daily comics",
];
export const REPOSITORY_URL = "https://github.com/megabyte0x/memento-mori-obituary-comics";
export const SUBSTACK_URL = "https://finalnotes.substack.com";
export const SUBSTACK_FORM_ACTION = `${SUBSTACK_URL}/api/v1/free?nojs=true`;
export const SUPPORT_ZEC_ADDRESS =
  "u1cyxqx2za9c7g2h7tjz0nn7rdf5fgykmqgw4eke7fvfa9pd7lynjkqfeq4hzd3tkys4pvku5xnmmwclm77jv9ljkhdefrvzc6pgehc63rcnmylqlxt0fmz55t6wdp6dyk5w2hzx06hs93xun5smexvwn04ju4ppy54gx477ftequajh0t";
export const SAME_AS_URLS = [SUBSTACK_URL, REPOSITORY_URL];

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return new URL(clean, SITE_URL).toString();
}

export function canonicalPath(path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean.endsWith("/") || clean.includes(".") ? clean : `${clean}/`;
}

export function publisherSchema() {
  return {
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_DESCRIPTION,
    sameAs: SAME_AS_URLS,
  };
}
