import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

// edge runtime — Satori 가 한글/이모지 fallback 폰트 자동 처리.
export const runtime = "edge";
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://runningmate-landing.vercel.app";
const SCENE_IMAGE = `${SITE}/screenshots/03_마이룸_메인.png`;

/**
 * 랜딩페이지용 OG. 마라톤 OG 와 같은 비주얼 톤 (픽셀 씬 + 하단 그라데이션
 * 텍스트) 으로 일관된 브랜드 인상.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#F9F8F3",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        <img
          src={SCENE_IMAGE}
          alt=""
          style={{
            position: "absolute",
            width: 1500,
            top: -780,
            left: -150,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            padding: "60px 70px 50px",
            background:
              "linear-gradient(to top, rgba(31, 79, 42, 0.95) 0%, rgba(31, 79, 42, 0.78) 55%, rgba(31, 79, 42, 0) 100%)",
            color: "#F9F8F3",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              opacity: 0.9,
              marginBottom: 10,
              letterSpacing: 1,
            }}
          >
            {SITE_TAGLINE}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 80,
              fontWeight: 900,
              letterSpacing: -2,
            }}
          >
            {SITE_NAME}
          </div>
        </div>
      </div>
    ),
    size
  );
}
