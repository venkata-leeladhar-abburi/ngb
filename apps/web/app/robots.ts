import type { MetadataRoute } from "next";

import { env } from "@/env";

/** Private routes that must never appear in search results. */
const privatePaths = ["/checkout", "/welcome", "/account"];
/** The same routes under /te, plus the API. */
const disallowedPaths = [...privatePaths, ...privatePaths.map((path) => `/te${path}`), "/api"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: disallowedPaths }],
    sitemap: `${env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
