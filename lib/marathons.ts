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

export type MarathonStatus =
  | "upcoming-open" // 아직 신청 안 열림
  | "open" // 신청 중
  | "closing-soon" // 신청 마감 D-7 이내
  | "closed" // 신청 마감, 대회 전
  | "race-day" // 오늘이 대회일
  | "finished"; // 끝남

export function statusOf(m: Marathon, now: Date = new Date()): MarathonStatus {
  const today = startOfDay(now);
  const open = startOfDay(new Date(m.registrationOpenDate));
  const close = startOfDay(new Date(m.registrationCloseDate));
  const race = startOfDay(new Date(m.raceDate));

  if (today.getTime() === race.getTime()) return "race-day";
  if (today > race) return "finished";
  if (today < open) return "upcoming-open";
  if (today <= close) {
    const daysToClose = daysBetween(today, close);
    return daysToClose <= 7 ? "closing-soon" : "open";
  }
  return "closed";
}

export function statusLabel(status: MarathonStatus): string {
  switch (status) {
    case "upcoming-open":
      return "신청 예정";
    case "open":
      return "신청 중";
    case "closing-soon":
      return "마감 임박";
    case "closed":
      return "신청 마감";
    case "race-day":
      return "오늘 대회";
    case "finished":
      return "종료";
  }
}

export function statusColorClass(status: MarathonStatus): string {
  switch (status) {
    case "open":
      return "bg-pastelLime text-deepGreen";
    case "closing-soon":
      return "bg-pastelSand text-[#7A4400]";
    case "upcoming-open":
      return "bg-pastelSky text-[#1353A6]";
    case "closed":
      return "bg-surfaceMuted text-textMuted";
    case "race-day":
      return "bg-pastelPink text-[#B01760]";
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

/** 필터 칩으로 노출하는 상태들. `race-day`/`finished` 는 별도 처리. */
export const FILTERABLE_STATUSES: MarathonStatus[] = [
  "open",
  "closing-soon",
  "upcoming-open",
  "closed",
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
