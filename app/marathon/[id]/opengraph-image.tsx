import { ImageResponse } from "next/og";
import { fetchMarathons, formatKoreanDate } from "@/lib/marathons";

// Edge runtime 에선 우리 fetchMarathons (외부 GitHub raw URL fetch + ISR) 가
// 빈 응답을 내는 케이스가 있어서 nodejs runtime 으로 강제. ImageResponse 는
// 두 runtime 모두 지원.
export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * 마라톤별 동적 OG 이미지 — 카톡·트위터·페이스북 공유 시 미리보기.
 * 마라톤명·대회일·지역·코스 자동 표시.
 */
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = await fetchMarathons();
  const m = catalog.marathons.find((x) => x.id === id);

  if (!m) {
    return defaultImage();
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "70px 80px",
          background: "linear-gradient(135deg, #F9F8F3 0%, #D6EFB1 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Top brand bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 56 }}>🏃</span>
            <span style={{ fontSize: 32, fontWeight: 900, color: "#1F4F2A" }}>러닝메이트</span>
          </div>
          <span
            style={{
              padding: "10px 20px",
              borderRadius: 999,
              background: "rgba(31, 79, 42, 0.92)",
              color: "#F9F8F3",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {m.region}
          </span>
        </div>

        {/* Main marathon name + date */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 60, flex: 1, justifyContent: "center" }}>
          <div
            style={{
              fontSize: 28,
              color: "#475240",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            {formatKoreanDate(m.raceDate)} · D-day{" "}
            {Math.max(0, Math.round((new Date(m.raceDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 900,
              color: "#1F4F2A",
              letterSpacing: -2,
              lineHeight: 1.15,
              maxWidth: 1040,
            }}
          >
            {m.name}
          </div>
          {m.venue && (
            <div style={{ fontSize: 26, color: "#475240", marginTop: 24, fontWeight: 600 }}>
              📍 {m.venue}
            </div>
          )}
        </div>

        {/* Course chips at bottom */}
        <div style={{ display: "flex", gap: 12 }}>
          {m.courses.map((c) => (
            <span
              key={c}
              style={{
                background: "#FFFFFFCC",
                padding: "12px 26px",
                borderRadius: 999,
                fontSize: 28,
                fontWeight: 700,
                color: "#1F4F2A",
                border: "2px solid #1F4F2A22",
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    ),
    size
  );
}

function defaultImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F9F8F3",
          color: "#1F4F2A",
          fontSize: 56,
          fontWeight: 900,
          fontFamily: "system-ui",
        }}
      >
        🏃 러닝메이트
      </div>
    ),
    size
  );
}
