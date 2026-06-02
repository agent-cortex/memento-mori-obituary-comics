export const SITE_NAME = "Memento Mori Obituary Comics";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://finalnotes.page";
export const SITE_DESCRIPTION = "Daily obituary comics about people who faced death and made their work anyway.";
export const SUBSTACK_URL = "https://finalnotes.substack.com";
export const SUBSTACK_FORM_ACTION = `${SUBSTACK_URL}/api/v1/free?nojs=true`;
export const SUPPORT_ZEC_ADDRESS =
  "u1cyxqx2za9c7g2h7tjz0nn7rdf5fgykmqgw4eke7fvfa9pd7lynjkqfeq4hzd3tkys4pvku5xnmmwclm77jv9ljkhdefrvzc6pgehc63rcnmylqlxt0fmz55t6wdp6dyk5w2hzx06hs93xun5smexvwn04ju4ppy54gx477ftequajh0t";

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return new URL(clean, SITE_URL).toString();
}
