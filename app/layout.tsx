import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "러닝메이트 — 한 걸음마다 꾸미는 러닝",
  description:
    "한국 마라톤 일정 + 8-bit 픽셀 캐릭터 마이룸. 달린 만큼 자라는 나만의 러너.",
  openGraph: {
    title: "러닝메이트",
    description: "한 걸음마다 꾸미는 러닝",
    locale: "ko_KR",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
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
      <body className="font-sans">{children}</body>
    </html>
  );
}
