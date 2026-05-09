import { ImageResponse } from "next/og";

// edge runtime — Satori 가 한글/이모지 fallback 폰트 자동 처리.
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATALOG_URL =
  "https://raw.githubusercontent.com/g1-ang/runningmate-data/main/data/marathons.json";

type Marathon = {
  id: string;
  name: string;
  region: string;
  raceDate: string;
  venue: string;
  courses: string[];
};

/**
 * 마라톤별 동적 OG 이미지. Satori 호환을 위해 단일 column flex column 구조,
 * `<span>` 대신 `<div>` 만 사용 (Satori 가 inline 요소 처리에 버그 있음).
 */
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  let m: Marathon | null = null;
  try {
    const { id } = await params;
    const res = await fetch(CATALOG_URL, { cache: "no-store" });
    if (res.ok) {
      const json = (await res.json()) as { marathons: Marathon[] };
      m = json.marathons.find((x) => x.id === id) ?? null;
    }
  } catch {
    // ignore
  }

  if (!m) return defaultImage();

  const dDay = Math.max(
    0,
    Math.round((new Date(m.raceDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );
  const koDate = formatKoDate(m.raceDate);
  const courses = m.courses.slice(0, 4).join("  ·  ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #F9F8F3 0%, #D6EFB1 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#1F4F2A", fontWeight: 700, marginBottom: 24 }}>
          🏃 러닝메이트  ·  {m.region}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#475240",
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          {koDate}  ·  D-{dDay}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 70,
            fontWeight: 900,
            color: "#1F4F2A",
            letterSpacing: -2,
            lineHeight: 1.15,
            marginBottom: 28,
          }}
        >
          {m.name}
        </div>

        {m.venue && (
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#475240",
              fontWeight: 600,
              marginBottom: 28,
            }}
          >
            📍 {m.venue}
          </div>
        )}

        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            color: "#1F4F2A",
            background: "#FFFFFFCC",
            padding: "12px 26px",
            borderRadius: 999,
          }}
        >
          {courses}
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #F9F8F3 0%, #D6EFB1 100%)",
          color: "#1F4F2A",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 160, display: "flex" }}>🏃</div>
        <div style={{ fontSize: 80, fontWeight: 900, marginTop: 24, display: "flex" }}>
          러닝메이트
        </div>
        <div style={{ fontSize: 32, color: "#475240", marginTop: 16, display: "flex" }}>
          한 걸음마다 꾸미는 러닝
        </div>
      </div>
    ),
    size
  );
}

function formatKoDate(iso: string): string {
  const d = new Date(iso);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const wd = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${d.getFullYear()}년 ${m}월 ${day}일 (${wd})`;
}
