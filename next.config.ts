import type { NextConfig } from "next";
import path from "node:path";

// ─── Security headers ─────────────────────────────────────────────────────────
// Defined here (not only in proxy.ts) so they apply to EVERY response, including
// static assets under /_next/static and /_next/image — which the proxy matcher
// deliberately excludes. The CSP keeps 'unsafe-inline' for scripts because the
// site relies on ISR/static rendering; switching to nonce-based CSP would force
// all pages to dynamic rendering. 'unsafe-eval' is dev-only (HMR).
const isDev = process.env.NODE_ENV !== "production";

// 'unsafe-inline' is required for script-src: App Router streams hydration via
// page-specific inline <script>self.__next_f.push(...)</script> tags whose
// content (RSC flight payload) changes per page/revalidation, so they cannot be
// hash-allowlisted. Removing 'unsafe-inline' here is only possible with a
// per-request nonce, which forces dynamic rendering and disables ISR — a
// tradeoff this site intentionally avoids. 'unsafe-eval' is dev-only (HMR).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co",
  "media-src 'self' https://*.supabase.co",
  "connect-src 'self' https://*.supabase.co https://api.resend.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "font-src 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  // Don't advertise the framework (removes the X-Powered-By: Next.js header).
  poweredByHeader: false,
  // NOTE: experimental.sri (SRI) was REMOVED — with Turbopack builds the
  // integrity hashes did not match the chunks Vercel serves, so the browser
  // blocked all JS in production and the site failed to hydrate. Do not re-add
  // it unless SRI+Turbopack is confirmed working on this Next version.
  // Pin the workspace root — a stray lockfile in the home dir made Next infer
  // C:\Users\TUF as the root, which breaks output file tracing on deploy.
  turbopack: { root: path.resolve(".") },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
};

export default nextConfig;
