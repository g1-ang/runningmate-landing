import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#F9F8F3",
    theme_color: "#1F4E3D",
    lang: "ko",
    orientation: "portrait",
    icons: [
      {
        src: "/app-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/app-icon-1024.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
    ],
    // Android Chrome "앱 설치" prompt 가 앱스토어처럼 미리보기를 풍부하게.
    // form_factor 가 narrow 면 모바일 phone, wide 면 desktop. 우리는 모바일
    // 사용 위주라 narrow 만 등록.
    screenshots: [
      {
        src: "/screenshots/01_달력_월뷰.png",
        sizes: "1320x2868",
        type: "image/png",
        form_factor: "narrow",
        label: "전국 마라톤 달력 — 월별 뷰",
      },
      {
        src: "/screenshots/06_마라톤_상세.png",
        sizes: "1320x2868",
        type: "image/png",
        form_factor: "narrow",
        label: "마라톤 상세 — 일정·신청·후기",
      },
      {
        src: "/screenshots/03_마이룸_메인.png",
        sizes: "1320x2868",
        type: "image/png",
        form_factor: "narrow",
        label: "픽셀 캐릭터 마이룸",
      },
    ],
  };
}
