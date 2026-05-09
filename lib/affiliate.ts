import type { Course } from "./marathons";

/**
 * 쿠팡 파트너스 affiliate 인프라.
 *
 * 환경변수:
 *   NEXT_PUBLIC_COUPANG_AFFILIATE_ID - 쿠팡 파트너스 트래킹 코드.
 *   미설정 시 일반 쿠팡 검색 URL 로 fallback (링크는 작동하나 수익화 X).
 *
 * 가입 후 받은 ID 를 Vercel env 에 추가하면 즉시 모든 링크에 적용.
 *
 * 의무 표기 (쿠팡 약관 + 표시광고법):
 *   "이 페이지는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
 *    수수료를 제공받습니다."
 *   → GearRecommendations 컴포넌트 footer 에 자동 노출.
 */

export type ProductCategory =
  | "shoes-casual"   // 5/10km 일상 러닝화
  | "shoes-race"     // 하프·풀 레이싱화 (카본·고탄성)
  | "apparel-top"    // 러닝 상의
  | "apparel-bottom" // 반바지·타이즈
  | "cap"            // 모자·러닝캡
  | "socks"          // 러닝 양말
  | "watch"          // 러닝 워치 (Garmin·Apple Watch 등)
  | "earphones"      // 무선 이어폰
  | "nutrition"      // 에너지젤·보충제
  | "hydration"      // 워터벨트·수분
  | "compression"    // 컴프레션 가드 (하프·풀)
  | "reflective";    // 야간 러닝 안전용

export type AffiliateProduct = {
  id: string;
  category: ProductCategory;
  name: string;
  description: string;
  searchQuery: string;
  emoji: string;
  /** 어떤 코스에 우선 추천할지. 비어있으면 모든 코스에 노출. */
  applicableCourses?: Course[];
};

/**
 * 큐레이션된 추천 상품 목록. 검색어 기반이라 쿠팡 트렌드/재고에 따라
 * 결과가 달라짐 (구체 상품 ID 의존성 ↓, 유연성 ↑).
 */
export const PRODUCTS: AffiliateProduct[] = [
  {
    id: "shoes-cushion",
    category: "shoes-casual",
    name: "쿠셔닝 러닝화",
    description: "5/10km 캐주얼 러닝, 발 부담 적게",
    searchQuery: "쿠셔닝 러닝화",
    emoji: "👟",
    applicableCourses: ["5km", "10km"],
  },
  {
    id: "shoes-carbon",
    category: "shoes-race",
    name: "카본 레이싱화",
    description: "하프·풀 페이스 단축, 반발력",
    searchQuery: "카본 레이싱화",
    emoji: "🏃",
    applicableCourses: ["Half", "Full"],
  },
  {
    id: "cap-running",
    category: "cap",
    name: "러닝 캡",
    description: "햇빛·땀 차단",
    searchQuery: "러닝 캡 모자",
    emoji: "🧢",
  },
  {
    id: "socks-anti-blister",
    category: "socks",
    name: "러닝 양말",
    description: "물집 방지, 통기성",
    searchQuery: "러닝 양말 물집방지",
    emoji: "🧦",
  },
  {
    id: "watch-garmin",
    category: "watch",
    name: "러닝 워치",
    description: "GPS·심박·페이스 측정",
    searchQuery: "러닝 워치 가민",
    emoji: "⌚️",
  },
  {
    id: "earphones-sport",
    category: "earphones",
    name: "스포츠 이어폰",
    description: "땀 방수, 흘러내림 방지",
    searchQuery: "스포츠 무선 이어폰 방수",
    emoji: "🎧",
  },
  {
    id: "energy-gel",
    category: "nutrition",
    name: "에너지 젤",
    description: "장거리 페이스 유지",
    searchQuery: "러닝 에너지젤",
    emoji: "🍯",
    applicableCourses: ["10km", "Half", "Full"],
  },
  {
    id: "compression-calf",
    category: "compression",
    name: "컴프레션 종아리",
    description: "장거리 근피로 감소",
    searchQuery: "컴프레션 종아리 가드 러닝",
    emoji: "🦵",
    applicableCourses: ["Half", "Full"],
  },
];

/**
 * 마라톤 코스에 적합한 상품 추천. 코스 매칭 우선, 공통 (cap/socks 등) 후순위.
 * 최대 6개로 캡.
 */
export function recommendProducts(courses: Course[]): AffiliateProduct[] {
  const courseSet = new Set(courses);
  const matched: AffiliateProduct[] = [];
  const general: AffiliateProduct[] = [];

  for (const p of PRODUCTS) {
    if (!p.applicableCourses) {
      general.push(p);
    } else if (p.applicableCourses.some((c) => courseSet.has(c))) {
      matched.push(p);
    }
  }
  return [...matched, ...general].slice(0, 6);
}

/**
 * 쿠팡 검색 URL with affiliate 트래킹.
 * affiliate ID 미설정 시 일반 검색 URL (트래킹 X, 링크는 작동).
 */
export function coupangSearchURL(query: string): string {
  const base = `https://www.coupang.com/np/search?q=${encodeURIComponent(query)}&channel=user`;
  const id = process.env.NEXT_PUBLIC_COUPANG_AFFILIATE_ID;
  if (!id) return base;
  return `${base}&trackingCode=${encodeURIComponent(id)}`;
}

export const COUPANG_DISCLOSURE =
  "이 페이지는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";
