import type { Course } from "./marathons";

/**
 * 쿠팡 파트너스 affiliate 인프라.
 *
 * 환경변수:
 *   NEXT_PUBLIC_COUPANG_AFFILIATE_ID - 쿠팡 파트너스 트래킹 코드.
 *   미설정 시 일반 쿠팡 검색 URL 로 fallback (링크는 작동하나 수익화 X).
 *
 * 의무 표기 (쿠팡 약관 + 표시광고법):
 *   "이 페이지는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
 *    수수료를 제공받습니다."
 */

export type Season = "spring" | "summer" | "fall" | "winter";

export type ProductCategory =
  | "shoes-casual"
  | "shoes-race"
  | "apparel-top"
  | "apparel-bottom"
  | "apparel-jacket"
  | "cap"
  | "gloves"
  | "socks"
  | "watch"
  | "earphones"
  | "nutrition"
  | "hydration"
  | "compression"
  | "recovery";

export type AffiliateProduct = {
  id: string;
  category: ProductCategory;
  name: string;
  description: string;
  searchQuery: string;
  emoji: string;
  /** 매칭하는 코스. undefined = 모든 코스 */
  applicableCourses?: Course[];
  /** 매칭하는 시즌. undefined = 모든 시즌 */
  applicableSeasons?: Season[];
  /** 가격대 안내 (대략) */
  priceRange?: string;
};

/**
 * 큐레이션 카탈로그. 검색어 기반이라 쿠팡 트렌드/재고에 따라 결과가
 * 달라짐 — 단종 의존성 ↓, 유연성 ↑.
 */
export const PRODUCTS: AffiliateProduct[] = [
  // ─── 신발 ─────────────────────────────────────────────
  {
    id: "shoes-cushion",
    category: "shoes-casual",
    name: "쿠셔닝 러닝화",
    description: "5/10km 일상 러닝, 발 부담 적게",
    searchQuery: "쿠셔닝 러닝화",
    emoji: "👟",
    applicableCourses: ["5km", "10km"],
    priceRange: "5~15만원대",
  },
  {
    id: "shoes-carbon",
    category: "shoes-race",
    name: "카본 레이싱화",
    description: "하프·풀 페이스 단축, 반발력 ↑",
    searchQuery: "카본 레이싱화",
    emoji: "🏃",
    applicableCourses: ["Half", "Full"],
    priceRange: "20~30만원대",
  },

  // ─── 의류 ─────────────────────────────────────────────
  {
    id: "running-tee",
    category: "apparel-top",
    name: "통기성 러닝 셔츠",
    description: "땀 빠른 건조, 더위 대비",
    searchQuery: "쿨 러닝 티셔츠",
    emoji: "👕",
    applicableSeasons: ["spring", "summer", "fall"],
    priceRange: "1~4만원대",
  },
  {
    id: "running-shorts",
    category: "apparel-bottom",
    name: "러닝 반바지",
    description: "통기성·움직임 자유",
    searchQuery: "러닝 반바지",
    emoji: "🩳",
    applicableSeasons: ["spring", "summer", "fall"],
    priceRange: "1~5만원대",
  },
  {
    id: "running-tights",
    category: "apparel-bottom",
    name: "러닝 타이즈 (기모)",
    description: "겨울 보온 + 근육 지지",
    searchQuery: "러닝 타이즈 기모",
    emoji: "🦵",
    applicableSeasons: ["winter"],
    priceRange: "3~8만원대",
  },
  {
    id: "windbreaker",
    category: "apparel-jacket",
    name: "윈드브레이커",
    description: "환절기 바람·미세한 비 방어",
    searchQuery: "러닝 바람막이 자켓",
    emoji: "🧥",
    applicableSeasons: ["spring", "fall", "winter"],
    priceRange: "3~10만원대",
  },

  // ─── 액세서리 ─────────────────────────────────────────
  {
    id: "cap-running",
    category: "cap",
    name: "러닝 캡",
    description: "햇빛·땀 차단",
    searchQuery: "러닝 캡 모자",
    emoji: "🧢",
    priceRange: "1~3만원대",
  },
  {
    id: "gloves-thermal",
    category: "gloves",
    name: "보온 러닝 장갑",
    description: "한겨울 손 보호",
    searchQuery: "러닝 장갑 보온 겨울",
    emoji: "🧤",
    applicableSeasons: ["winter"],
    priceRange: "1~3만원대",
  },
  {
    id: "socks-anti-blister",
    category: "socks",
    name: "러닝 양말",
    description: "물집 방지, 통기성",
    searchQuery: "러닝 양말 물집방지",
    emoji: "🧦",
    priceRange: "1~3만원대",
  },

  // ─── 디바이스 ─────────────────────────────────────────
  {
    id: "watch-gps",
    category: "watch",
    name: "러닝 GPS 워치",
    description: "심박·페이스·거리 자동 기록",
    searchQuery: "러닝 워치 가민 GPS",
    emoji: "⌚️",
    priceRange: "20~80만원대",
  },
  {
    id: "earphones-sport",
    category: "earphones",
    name: "스포츠 무선 이어폰",
    description: "땀 방수, 흘러내림 방지",
    searchQuery: "스포츠 무선 이어폰 방수",
    emoji: "🎧",
    priceRange: "5~30만원대",
  },

  // ─── 영양·수분 ────────────────────────────────────────
  {
    id: "energy-gel",
    category: "nutrition",
    name: "에너지 젤",
    description: "장거리 페이스 유지",
    searchQuery: "러닝 에너지젤",
    emoji: "🍯",
    applicableCourses: ["10km", "Half", "Full"],
    priceRange: "1~3만원대",
  },
  {
    id: "water-belt",
    category: "hydration",
    name: "워터 벨트",
    description: "여름·장거리 수분 보충",
    searchQuery: "러닝 워터 벨트 물병",
    emoji: "💧",
    applicableCourses: ["10km", "Half", "Full"],
    applicableSeasons: ["spring", "summer", "fall"],
    priceRange: "2~5만원대",
  },

  // ─── 회복·관리 ────────────────────────────────────────
  {
    id: "compression-calf",
    category: "compression",
    name: "컴프레션 종아리",
    description: "장거리 근피로 감소",
    searchQuery: "컴프레션 종아리 가드 러닝",
    emoji: "🩹",
    applicableCourses: ["Half", "Full"],
    priceRange: "1~3만원대",
  },
  {
    id: "foam-roller",
    category: "recovery",
    name: "폼롤러",
    description: "훈련 후 근육 회복",
    searchQuery: "폼롤러 마사지",
    emoji: "🪵",
    applicableCourses: ["Half", "Full"],
    priceRange: "2~5만원대",
  },
];

// MARK: - Season helpers

export function seasonOf(date: Date): Season {
  const m = date.getMonth() + 1;
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "fall";
  return "winter";
}

export function seasonLabel(s: Season): string {
  switch (s) {
    case "spring": return "봄";
    case "summer": return "여름";
    case "fall":   return "가을";
    case "winter": return "겨울";
  }
}

// MARK: - Recommendation

export type RecommendationContext = {
  courses: Course[];
  season: Season;
};

/**
 * 코스 + 시즌 양쪽으로 매칭. 부적합 (다른 코스/시즌 전용) 은 제외.
 * 매치 강도 순으로 정렬 후 최대 6개 반환.
 *
 * 우선순위:
 *  1. 코스 + 시즌 모두 명시 매치 (가장 추천)
 *  2. 코스만 명시 매치 (시즌 무관)
 *  3. 시즌만 명시 매치 (코스 무관)
 *  4. 공통 (코스·시즌 모두 X — 모든 마라톤 보편)
 */
export function recommendProducts(ctx: RecommendationContext): AffiliateProduct[] {
  const courseSet = new Set(ctx.courses);

  const candidates: { product: AffiliateProduct; score: number }[] = [];
  for (const p of PRODUCTS) {
    const hasCourseConstraint = !!p.applicableCourses;
    const hasSeasonConstraint = !!p.applicableSeasons;

    const courseOK =
      !hasCourseConstraint || p.applicableCourses!.some((c) => courseSet.has(c));
    const seasonOK =
      !hasSeasonConstraint || p.applicableSeasons!.includes(ctx.season);

    if (!courseOK || !seasonOK) continue;

    let score = 0;
    if (hasCourseConstraint) score += 2;
    if (hasSeasonConstraint) score += 1;
    candidates.push({ product: p, score });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, 6).map((c) => c.product);
}

// MARK: - Coupang URL + disclosure

export function coupangSearchURL(query: string): string {
  const base = `https://www.coupang.com/np/search?q=${encodeURIComponent(query)}&channel=user`;
  const id = process.env.NEXT_PUBLIC_COUPANG_AFFILIATE_ID;
  if (!id) return base;
  return `${base}&trackingCode=${encodeURIComponent(id)}`;
}

export const COUPANG_DISCLOSURE =
  "이 페이지는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";

// MARK: - Badge helpers (UI 가 호출)

/**
 * 카드에 표시할 배지 텍스트 결정.
 * "{시즌} · {코스} 추천" / "{시즌} 추천" / "{코스} 추천" / null.
 */
export function badgeFor(
  product: AffiliateProduct,
  ctx: RecommendationContext
): string | null {
  const seasonMatch =
    product.applicableSeasons?.includes(ctx.season) ?? false;
  const courseMatch =
    product.applicableCourses?.some((c) => ctx.courses.includes(c)) ?? false;

  if (seasonMatch && courseMatch) {
    const courseLabel = pickCourseLabel(product.applicableCourses!, ctx.courses);
    return `${seasonLabel(ctx.season)} · ${courseLabel} 추천`;
  }
  if (seasonMatch) return `${seasonLabel(ctx.season)} 추천`;
  if (courseMatch) {
    const courseLabel = pickCourseLabel(product.applicableCourses!, ctx.courses);
    return `${courseLabel} 추천`;
  }
  return null;
}

function pickCourseLabel(applicable: Course[], userCourses: Course[]): string {
  // 사용자 코스 중 product 가 추천하는 가장 긴 코스를 라벨로
  const order: Record<Course, number> = { Full: 4, Half: 3, "10km": 2, "5km": 1 };
  const intersection = applicable.filter((c) => userCourses.includes(c));
  intersection.sort((a, b) => order[b] - order[a]);
  return intersection[0] ?? applicable[0];
}
