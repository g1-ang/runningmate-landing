/**
 * 사이트 baseURL — 메타데이터 / sitemap / OG 등에서 사용.
 *
 * 환경변수 NEXT_PUBLIC_SITE_URL 우선. 미설정 시 Vercel 자동 도메인.
 * 커스텀 도메인 연결 시 Vercel env 에 NEXT_PUBLIC_SITE_URL 추가하고
 * Redeploy 하면 모든 메타·sitemap·OG 자동 갱신.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://runningmate-landing.vercel.app";

export const SITE_NAME = "러닝메이트";
export const SITE_TAGLINE = "한 걸음마다 꾸미는 러닝";
export const SITE_DESCRIPTION =
  "한국 마라톤 일정 + 8-bit 픽셀 캐릭터 마이룸. 달린 만큼 자라는 나만의 러너.";
