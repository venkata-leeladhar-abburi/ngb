import { localePath, type Content, type Lang } from "@/content";

import { TOOLS_ID } from "../ToolsBento";

import type { NotFoundCopy } from "./NotFound";

/** The 404 copy and links for a language. "Try free tools" goes to the homepage tools until the tools page exists. */
export function notFoundCopy(lang: Lang, t: Content): NotFoundCopy {
  const home = localePath(lang, "/");
  return {
    headline: t.notFound.headline,
    sub: t.notFound.sub,
    home: { href: home, label: t.notFound.home },
    tools: { href: `${home}#${TOOLS_ID}`, label: t.site.free },
  };
}
