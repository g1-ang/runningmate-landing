const path = require("path");

/**
 * 보안 헤더 — 모든 응답에 적용. CSP 는 OG 이미지·Vercel Analytics 등 외부
 * 리소스를 다양하게 쓰는 사이트라 우선 보류 (false positive 위험). 나머지
 * 4종은 우리 사이트에 부작용 없는 표준 권장값.
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next 16 가 상위 디렉터리의 다른 package-lock.json 을 workspace root 로
  // 잘못 잡아서 react/jsx-runtime 해석이 깨지는 문제 회피.
  turbopack: {
    root: path.resolve(__dirname),
  },
  outputFileTracingRoot: path.resolve(__dirname),
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
