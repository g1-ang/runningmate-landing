import { ImageResponse } from "next/og";

// edge runtime — Satori 가 한글/이모지 fallback 폰트 자동 처리.
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATALOG_URL =
  "https://raw.githubusercontent.com/g1-ang/runningmate-data/main/data/marathons.json";

// 같은 도메인 기준 절대 URL — Satori `<img src>` 는 절대 URL 필요.
const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://runningmate-landing.vercel.app";
const SCENE_IMAGE = `${SITE}/screenshots/03_마이룸_메인.png`;

type Marathon = {
  id: string;
  name: string;
  region: string;
  raceDate: string;
  venue: string;
  courses: string[];
};

/**
 * 마라톤별 OG 이미지 — iOS 앱의 픽셀 씬 (캐릭터·남산·한강 배경) 을
 * 배경으로 깔고, 하단 그라디언트 위에 마라톤 이름만 작게 오버레이.
 *
 * 카톡이 이미 캡션·URL 카드에 마라톤 텍스트를 3번 반복 노출하므로
 * OG 카드는 정보 반복 대신 브랜드 정체성에 집중.
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
        {/* 배경: iOS 앱 마이룸 스크린샷 (1320×2868). 상단 픽셀 씬이
            드러나도록 가로로 채우고 위로 음수 오프셋. 1320 → 1300 폭
            으로 살짝 축소 + 좌측 -50px 으로 중앙 정렬. */}
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

        {/* 하단 그라디언트 + 마라톤명 오버레이 */}
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
            러닝메이트 · 마라톤 일정
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontWeight: 900,
              letterSpacing: -1.5,
              lineHeight: 1.1,
            }}
          >
            {m.name}
          </div>
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
            한 걸음마다 꾸미는 러닝
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: -1.5,
            }}
          >
            러닝메이트
          </div>
        </div>
      </div>
    ),
    size
  );
}
