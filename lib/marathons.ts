/**
 * 마라톤 데이터 fetcher + 도메인 helpers.
 *
 * 데이터 출처는 g1-ang/runningmate-data 의 raw URL — iOS 앱과 동일한 캐털로그.
 * Next.js 서버 측 fetch + 1시간 revalidate 로 매주 갱신되는 데이터를
 * 거의 즉시 반영하면서 Vercel CDN 으로 빠르게 서빙.
 */

export type Region =
  | "서울"
  | "경기"
  | "인천"
  | "부산"
  | "대구"
  | "광주"
  | "대전"
  | "강원"
  | "제주";

export type Course = "5km" | "10km" | "Half" | "Full";

export type Marathon = {
  id: string;
  name: string;
  region: Region;
  courses: Course[];
  registrationOpenDate: string;
  registrationCloseDate: string;
  announcementDate: string;
  raceDate: string;
  venue: string;
  officialURL: string;
  organizer: string;
  entryFee: string;
  sourceID: string;
  source: string;
};

export type MarathonCatalog = {
  schemaVersion: number;
  generatedAt: string;
  source: string;
  marathons: Marathon[];
};

const CATALOG_URL =
  "https://raw.githubusercontent.com/g1-ang/runningmate-data/main/data/marathons.json";

export async function fetchMarathons(): Promise<MarathonCatalog> {
  const res = await fetch(CATALOG_URL, {
    next: { revalidate: 3600 }, // 1h ISR — cron 은 주 1회지만 안전 마진
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch marathons: ${res.status}`);
  }
  return res.json();
}

// MARK: - Status / 시점 계산
//
// 각 마라톤은 4개의 마일스톤 일자가 있고, "지금 시점에서 다음에 도래할
// 마일스톤" 으로 한 가지 status 에 속한다 (mutually exclusive). 라벨이
// 곧 다음에 일어날 일을 가리키게 해서 사용자 직관성 ↑.

export type MarathonStatus =
  | "before-open"      // 신청 시작 — 아직 신청 안 열림 (next: registrationOpenDate)
  | "before-close"     // 신청 마감 — 현재 신청 중 (next: registrationCloseDate)
  | "before-announce"  // 발표 — 신청 끝, 발표 대기 (next: announcementDate)
  | "before-race"      // 대회일 — 발표 끝, 대회 대기 또는 당일 (next: raceDate)
  | "finished";        // 종료 — raceDate 지남

export function statusOf(m: Marathon, now: Date = new Date()): MarathonStatus {
  const today = startOfDay(now);
  const open = startOfDay(new Date(m.registrationOpenDate));
  const close = startOfDay(new Date(m.registrationCloseDate));
  const announce = startOfDay(new Date(m.announcementDate));
  const race = startOfDay(new Date(m.raceDate));

  if (today > race) return "finished";
  if (today >= announce) return "before-race";
  if (today > close) return "before-announce";
  if (today >= open) return "before-close";
  return "before-open";
}

export function statusLabel(status: MarathonStatus): string {
  switch (status) {
    case "before-open":
      return "신청 시작";
    case "before-close":
      return "신청 마감";
    case "before-announce":
      return "발표";
    case "before-race":
      return "대회일";
    case "finished":
      return "종료";
  }
}

export function statusColorClass(status: MarathonStatus): string {
  switch (status) {
    case "before-open":
      return "bg-pastelSky text-[#1353A6]"; // 미래 / 대기
    case "before-close":
      return "bg-pastelLime text-deepGreen"; // 신청 중! 적극
    case "before-announce":
      return "bg-pastelLilac text-[#5C2DAA]"; // 결과 대기
    case "before-race":
      return "bg-pastelPink text-[#B01760]"; // 대회 임박
    case "finished":
      return "bg-surfaceMuted text-textMuted";
  }
}

// MARK: - Date helpers

export function dDayLabel(raceDate: string, now: Date = new Date()): string {
  const today = startOfDay(now);
  const race = startOfDay(new Date(raceDate));
  const days = daysBetween(today, race);
  if (days === 0) return "오늘";
  if (days < 0) return `종료`;
  return `D-${days}`;
}

export function formatKoreanDate(iso: string): string {
  const d = new Date(iso);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${m}월 ${day}일 (${weekday})`;
}

export function formatKoreanDateRange(startISO: string, endISO: string): string {
  return `${formatKoreanDate(startISO)} ~ ${formatKoreanDate(endISO)}`;
}

export function monthKeyOf(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabelOf(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  return `${year}년 ${parseInt(month, 10)}월`;
}

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// MARK: - Filtering

export type CalendarFilters = {
  regions: Set<Region>;
  courses: Set<Course>;
  statuses: Set<MarathonStatus>;
  query: string;
  favoritesOnly: boolean;
  hideFinished: boolean;
};

export const emptyFilters: CalendarFilters = {
  regions: new Set(),
  courses: new Set(),
  statuses: new Set(),
  query: "",
  favoritesOnly: false,
  hideFinished: true,
};

export function applyFilters(
  marathons: Marathon[],
  filters: CalendarFilters,
  favoriteIDs: Set<string>,
  now: Date = new Date()
): Marathon[] {
  return marathons.filter((m) => {
    if (filters.regions.size > 0 && !filters.regions.has(m.region)) return false;

    if (filters.courses.size > 0) {
      const hasMatchingCourse = m.courses.some((c) => filters.courses.has(c));
      if (!hasMatchingCourse) return false;
    }

    if (filters.favoritesOnly && !favoriteIDs.has(m.id)) return false;

    const status = statusOf(m, now);

    if (filters.hideFinished && status === "finished") return false;

    if (filters.statuses.size > 0 && !filters.statuses.has(status)) return false;

    if (filters.query.trim()) {
      const q = filters.query.trim().toLowerCase();
      const haystack = `${m.name} ${m.venue} ${m.organizer}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

export function groupByMonth(marathons: Marathon[]): Map<string, Marathon[]> {
  const out = new Map<string, Marathon[]>();
  for (const m of marathons) {
    const key = monthKeyOf(m.raceDate);
    const arr = out.get(key) ?? [];
    arr.push(m);
    out.set(key, arr);
  }
  // Sort each bucket by raceDate asc
  for (const [k, arr] of out) {
    arr.sort((a, b) => a.raceDate.localeCompare(b.raceDate));
    out.set(k, arr);
  }
  return out;
}

export const ALL_REGIONS: Region[] = [
  "서울", "경기", "인천", "부산", "대구", "광주", "대전", "강원", "제주",
];

export const ALL_COURSES: Course[] = ["5km", "10km", "Half", "Full"];

// MARK: - Sort

export type SortMode = "date-asc" | "popularity-desc";

export function sortMarathons(
  marathons: Marathon[],
  mode: SortMode,
  counts: Map<string, number>,
  promotedIDs: Set<string>
): Marathon[] {
  // 추천 마라톤은 항상 최상단 (관리자 수동 지정). 그 안에서도
  // sortMode 에 따라 재정렬.
  const promoted: Marathon[] = [];
  const rest: Marathon[] = [];
  for (const m of marathons) {
    (promotedIDs.has(m.id) ? promoted : rest).push(m);
  }
  const sorter = makeComparator(mode, counts);
  promoted.sort(sorter);
  rest.sort(sorter);
  return [...promoted, ...rest];
}

function makeComparator(mode: SortMode, counts: Map<string, number>) {
  return (a: Marathon, b: Marathon): number => {
    if (mode === "popularity-desc") {
      const ca = counts.get(a.id) ?? 0;
      const cb = counts.get(b.id) ?? 0;
      if (ca !== cb) return cb - ca;
      // tie-break: 임박순
      return a.raceDate.localeCompare(b.raceDate);
    }
    // date-asc
    return a.raceDate.localeCompare(b.raceDate);
  };
}

/** 필터 칩으로 노출하는 상태들. `finished` 는 "+ 종료 포함" 토글로 별도 처리. */
export const FILTERABLE_STATUSES: MarathonStatus[] = [
  "before-open",
  "before-close",
  "before-announce",
  "before-race",
];

// MARK: - Calendar grid helpers (월간 뷰)

/** 주어진 날짜의 월 1일을 자정 기준으로 반환. */
export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** Sun(0)..Sat(6) 시작의 6주(42칸) 그리드 날짜 배열 생성. */
export function monthGridDates(month: Date): Date[] {
  const first = startOfMonth(month);
  const startWeekday = first.getDay(); // 0=Sun
  const dates: Date[] = [];
  // prev month padding
  for (let i = startWeekday; i > 0; i--) {
    dates.push(new Date(first.getFullYear(), first.getMonth(), 1 - i));
  }
  // current month days
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(new Date(first.getFullYear(), first.getMonth(), day));
  }
  // pad to 42 (6 weeks) so layout stable
  while (dates.length < 42) {
    const last = dates[dates.length - 1];
    dates.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
  }
  return dates;
}

/** raceDate 기준 일자별 그룹. key = 'YYYY-MM-DD' */
export function indexByDay(marathons: Marathon[]): Map<string, Marathon[]> {
  const out = new Map<string, Marathon[]>();
  for (const m of marathons) {
    const key = dayKeyOf(m.raceDate);
    const arr = out.get(key) ?? [];
    arr.push(m);
    out.set(key, arr);
  }
  return out;
}

export function dayKeyOf(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isToday(d: Date, now: Date = new Date()): boolean {
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}
