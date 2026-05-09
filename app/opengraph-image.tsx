import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

// edge runtime — Satori 가 한글/이모지 fallback 폰트 자동 처리.
export const runtime = "edge";
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * 카톡·트위터·페이스북 공유 시 미리보기 카드.
 * Next.js 가 /opengraph-image 라우트 자동 생성 → metadata 자동 연결.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #F9F8F3 0%, #D6EFB1 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 80,
            right: 80,
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(31, 79, 42, 0.92)",
            color: "#F9F8F3",
            padding: "10px 20px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          iOS · 출시 준비 중
        </div>
        <div style={{ fontSize: 180, marginBottom: 24 }}>🏃</div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#1F4F2A",
            letterSpacing: -2,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 44,
            color: "#475240",
            marginTop: 24,
            fontWeight: 600,
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 60,
            fontSize: 28,
            color: "#1F4F2A",
            fontWeight: 700,
          }}
        >
          <span style={{ background: "#FFFFFFAA", padding: "10px 24px", borderRadius: 999 }}>
            📅 마라톤 달력
          </span>
          <span style={{ background: "#FFFFFFAA", padding: "10px 24px", borderRadius: 999 }}>
            🏠 픽셀 마이룸
          </span>
        </div>
      </div>
    ),
    size
  );
}
