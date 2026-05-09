/**
 * 외부 지도 앱·웹으로 venue 검색을 보내는 URL helpers.
 *
 * V1: API 키 / 임베드 0. 사용자에게 익숙한 한국 지도 앱으로 직접 이동.
 * 모바일에선 OS 가 web URL 을 자동으로 설치된 앱으로 라우팅.
 */

export function naverMapSearchURL(venue: string): string {
  return `https://map.naver.com/p/search/${encodeURIComponent(venue)}`;
}

export function kakaoMapSearchURL(venue: string): string {
  return `https://map.kakao.com/?q=${encodeURIComponent(venue)}`;
}

export function googleMapsSearchURL(venue: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`;
}
