import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { buildOGUrl, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

const ROOT_OG_IMAGE = buildOGUrl("/opengraph-image");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "마라톤", "러닝", "마라톤 일정", "마라톤 달력",
    "한국 마라톤", "러닝 앱", "픽셀 캐릭터",
    SITE_NAME,
  ],
  authors: [{ name: SITE_NAME }],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    images: [{ url: ROOT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_TAGLINE,
    images: [ROOT_OG_IMAGE],
  },
  verification: {
    google: "zLfFGOZavWbtJsQjQ18tpyu74CVbs8x3M5iiHhlZ7DY",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F9F8F3",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard 본문 + Galmuri11 픽셀 (jsdelivr CDN). next/font 대신 link
            태그를 쓰는 이유: globals.css 의 @tailwind 지시문 뒤에 @import 는
            CSS 스펙 상 불허 + jsdelivr 호스팅이라 빌드 타임 fetch 도 불필요. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2107@1.1/Galmuri11.woff2"
        />
        <style>{`
          @font-face {
            font-family: "Galmuri11";
            src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2107@1.1/Galmuri11.woff2") format("woff2");
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
        `}</style>
      </head>
      <body className="font-sans">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
