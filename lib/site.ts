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
  "2026 전국 마라톤 일정 달력 + 8-bit 픽셀 캐릭터 마이룸. 무료 러닝 앱 — 매주 자동 갱신, 찜·비교·후기까지 한 번에.";

/**
 * Deploy 별 OG 이미지 cache-buster.
 *
 * 카톡·페이스북 등 OG 크롤러는 og:image URL 단위로 이미지를 캐시.
 * URL 이 같으면 서버가 새 이미지를 서빙해도 며칠~몇주 동안 옛 캐시
 * 사용. 매 deploy 마다 query 가 바뀌게 해서 새 URL 로 인식 → 새 fetch.
 *
 * Vercel 자동 환경변수 VERCEL_GIT_COMMIT_SHA 가 build 시 inline 됨.
 * 미설정 (로컬 dev) 시 fallback.
 */
export const OG_VERSION =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? "dev";

export function buildOGUrl(path: string): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${SITE_URL}${path}${sep}v=${OG_VERSION}`;
}
