import type { NextConfig } from "next";

import "./env";

const isDev = process.env.NODE_ENV === "development";

/**
 * Baseline Content Security Policy. Next.js needs inline scripts and styles for hydration.
 * Phase 8 tightens this with nonces and adds the GA4, Meta, Razorpay and Mux origins.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "media-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  typedRoutes: true,
  // next dev would write AGENTS.md and CLAUDE.md into apps/web; the repo CLAUDE.md already covers it.
  agentRules: false,
  transpilePackages: ["@ngb/ui", "@ngb/tokens"],
  experimental: {
    // The root layout sits under app/[lang], so unmatched URLs need a 404 page of their own (Next docs:
    // not-found.md, "global-not-found.js").
    globalNotFound: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  headers() {
    return Promise.resolve([{ source: "/:path*", headers: securityHeaders }]);
  },
  // Pages live under app/[lang]. English is served without a prefix, Telugu under /te (pages.md).
  redirects() {
    return Promise.resolve([
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ]);
  },
  rewrites() {
    return Promise.resolve({
      beforeFiles: [],
      // After files (so /robots.txt, /api and /_next are untouched), before the [lang] dynamic route.
      afterFiles: [
        { source: "/", destination: "/en" },
        { source: "/:path((?!te(?:/|$)|en(?:/|$)|api/|_next/).*)", destination: "/en/:path" },
      ],
      fallback: [],
    });
  },
};

export default nextConfig;
