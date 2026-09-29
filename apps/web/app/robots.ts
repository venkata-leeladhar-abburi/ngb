import type { MetadataRoute } from "next";

/** Private routes that must never appear in search results. */
const disallowedPaths = ["/checkout", "/welcome", "/account", "/api"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: disallowedPaths }],
  };
}
