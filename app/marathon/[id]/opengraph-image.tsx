import { ImageResponse } from "next/og";

export const runtime = "nodejs";
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
 * 마라톤별 동적 OG 이미지 — 카톡·트위터·페이스북 공유 시 미리보기.
 * 데이터 fetch 실패 시 기본 브랜드 카드로 fallback.
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
    // ignore — fallback image 로 보냄
  }

  if (!m) return defaultImage();

  const dDay = Math.max(
    0,
    Math.round((new Date(m.raceDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );
  const koDate = formatKoDate(m.raceDate);

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
        }}
      >
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

        <div style={{ display: "flex", flexDirection: "column", marginTop: 60, flex: 1, justifyContent: "center" }}>
          <div style={{ fontSize: 28, color: "#475240", fontWeight: 700, marginBottom: 16 }}>
            {koDate} · D-{dDay}
          </div>
          <div
            style={{
              fontSize: 70,
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

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {m.courses.slice(0, 4).map((c) => (
            <span
              key={c}
              style={{
                background: "#FFFFFFCC",
                padding: "12px 26px",
                borderRadius: 999,
                fontSize: 28,
                fontWeight: 700,
                color: "#1F4F2A",
                border: "2px solid rgba(31, 79, 42, 0.13)",
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #F9F8F3 0%, #D6EFB1 100%)",
          color: "#1F4F2A",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ fontSize: 160 }}>🏃</div>
        <div style={{ fontSize: 80, fontWeight: 900, marginTop: 24 }}>러닝메이트</div>
        <div style={{ fontSize: 32, color: "#475240", marginTop: 16 }}>
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
