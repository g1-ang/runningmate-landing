import type { Metadata } from "next";
import Link from "next/link";
import {
  ALL_COURSES,
  ALL_REGIONS,
  type Course,
  type Marathon,
  type Region,
  dDayLabel,
  fetchMarathons,
  formatKoreanDate,
  statusOf,
} from "@/lib/marathons";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "2026 마라톤 통계 — 전국 대회 한눈에",
  description:
    "2026 한국 마라톤 전체 통계. 월별·지역별·코스별(5km·10km·하프·풀) 분포 인포그래픽. 매주 자동 갱신.",
  keywords: [
    "2026 마라톤 통계",
    "마라톤 통계",
    "한국 마라톤 분포",
    "월별 마라톤",
    "지역별 마라톤",
    "5km 대회 수",
    "하프 마라톤",
    "풀 마라톤",
  ],
  alternates: { canonical: `${SITE_URL}/stats` },
  openGraph: {
    title: "2026 마라톤 통계 · 러닝메이트",
    description: "전국 마라톤 월별·지역별·코스별 분포 인포그래픽",
    url: `${SITE_URL}/stats`,
    type: "website",
  },
};

export default async function StatsPage() {
  const catalog = await fetchMarathons();
  const now = new Date();

  const total = catalog.marathons.length;
  const upcoming = catalog.marathons.filter(
    (m) => statusOf(m, now) !== "finished"
  );
  const finished = total - upcoming.length;

  // 다음 대회 1개
  const next = [...upcoming]
    .sort((a, b) => a.raceDate.localeCompare(b.raceDate))[0];

  // 월별 분포 (upcoming only)
  const monthly = aggregateByMonth(upcoming);

  // 지역별 분포 (전체 기준 — 종료된 대회도 포함해서 "이 지역에서 1년간 N개 열렸어요")
  const regional = aggregateByRegion(catalog.marathons);

  // 코스별 분포 (전체 기준)
  const courseCount = aggregateByCourse(catalog.marathons);

  // 임박한 5개 대회
  const next5 = [...upcoming]
    .sort((a, b) => a.raceDate.localeCompare(b.raceDate))
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-ivory text-textPrimary">
      <header className="sticky top-0 z-30 bg-ivory/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-4xl px-5 py-3.5 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🏃</span>
            <span className="font-pixel text-base md:text-lg text-deepGreen">
              러닝메이트
            </span>
          </Link>
          <Link
            href="/calendar"
            className="text-xs md:text-sm font-bold text-deepGreen hover:underline"
          >
            ← 마라톤 달력
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-5 py-8 md:py-12 space-y-10">
        <header>
          <h1 className="font-pixel text-2xl md:text-3xl text-deepGreen mb-2">
            2026 마라톤 통계
          </h1>
          <p className="text-sm text-textSecondary">
            한국에서 열리는 전국 마라톤의 월별·지역별·코스별 분포 ·
            매주 일요일 자동 갱신
          </p>
        </header>

        {/* 요약 카드 4종 */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard
            label="전체 등록"
            value={total}
            unit="개"
            tone="bg-pastelLime text-deepGreen"
          />
          <SummaryCard
            label="다가오는 대회"
            value={upcoming.length}
            unit="개"
            tone="bg-pastelSky text-[#1353A6]"
          />
          <SummaryCard
            label="올해 종료"
            value={finished}
            unit="개"
            tone="bg-surfaceMuted text-textSecondary"
          />
          <SummaryCard
            label="다음 대회"
            value={next ? dDayLabel(next.raceDate) : "—"}
            tone="bg-pastelPink text-[#B01760]"
            isText
          />
        </section>

        {next && (
          <div className="rounded-2xl border border-border bg-cream p-5">
            <p className="text-xs font-bold text-textMuted mb-1">
              📅 다음 대회 — {dDayLabel(next.raceDate)}
            </p>
            <Link
              href={`/marathon/${next.id}`}
              className="block font-pixel text-lg md:text-xl text-deepGreen hover:underline"
            >
              {next.name}
            </Link>
            <p className="text-sm text-textSecondary mt-1">
              {formatKoreanDate(next.raceDate)} · {next.region}
              {next.venue ? ` · ${next.venue}` : ""}
            </p>
          </div>
        )}

        {/* 월별 분포 */}
        <section>
          <h2 className="font-pixel text-xl md:text-2xl text-deepGreen mb-1">
            📊 월별 마라톤 분포
          </h2>
          <p className="text-xs text-textMuted mb-4">
            다가오는 대회 {upcoming.length}개 기준 · 임박한 12개월
          </p>
          <Bars
            entries={monthly}
            colorClass="bg-deepGreen"
            renderLabel={(k) => monthDisplay(k)}
          />
        </section>

        {/* 지역별 분포 */}
        <section>
          <h2 className="font-pixel text-xl md:text-2xl text-deepGreen mb-1">
            🗺️ 지역별 분포
          </h2>
          <p className="text-xs text-textMuted mb-4">
            전체 {total}개 · 9개 광역시·도
          </p>
          <Bars
            entries={regional}
            colorClass="bg-[#5C2DAA]"
            renderLabel={(k) => k}
          />
        </section>

        {/* 코스별 분포 */}
        <section>
          <h2 className="font-pixel text-xl md:text-2xl text-deepGreen mb-1">
            🏃 코스별 분포
          </h2>
          <p className="text-xs text-textMuted mb-4">
            한 대회가 여러 코스를 제공할 수 있으므로 합계 ≠ {total}
          </p>
          <Bars
            entries={courseCount}
            colorClass="bg-[#B01760]"
            renderLabel={(k) => k}
          />
        </section>

        {/* 임박 5개 */}
        <section>
          <h2 className="font-pixel text-xl md:text-2xl text-deepGreen mb-3">
            ⏰ 가장 임박한 대회 5개
          </h2>
          <ol className="space-y-2">
            {next5.map((m, i) => (
              <li
                key={m.id}
                className="rounded-xl border border-border bg-surface p-4 flex items-center gap-3"
              >
                <span className="font-pixel text-deepGreen w-7 shrink-0">
                  {i + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/marathon/${m.id}`}
                    className="block font-bold text-sm md:text-base text-textPrimary hover:text-deepGreen truncate"
                  >
                    {m.name}
                  </Link>
                  <p className="text-xs text-textMuted mt-0.5 truncate">
                    {formatKoreanDate(m.raceDate)} · {m.region}
                    {m.courses.length > 0 ? ` · ${m.courses.join(", ")}` : ""}
                  </p>
                </div>
                <span className="text-deepGreen font-pixel text-sm shrink-0">
                  {dDayLabel(m.raceDate)}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/calendar"
            className="flex-1 text-center rounded-xl bg-deepGreen text-ivory px-5 py-3.5 text-sm font-bold hover:opacity-90 transition"
          >
            📅 전체 마라톤 달력 보기 →
          </Link>
          <a
            href="/rss.xml"
            className="flex-1 text-center rounded-xl bg-ivory text-deepGreen border border-deepGreen px-5 py-3.5 text-sm font-bold hover:bg-pastelLime transition"
          >
            📡 RSS 구독
          </a>
        </div>
      </article>

      <footer className="border-t border-border bg-cream py-10 mt-8">
        <div className="mx-auto max-w-4xl px-5 text-xs text-textMuted text-center leading-relaxed">
          <div className="mb-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/privacy" className="hover:text-deepGreen">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-deepGreen">
              이용약관
            </Link>
            <a href="mailto:runningmate.g1@gmail.com" className="hover:text-deepGreen">
              문의
            </a>
          </div>
          <p>© 2026 RunningMate · 일정 출처: 마라톤온라인 (roadrun.co.kr)</p>
        </div>
      </footer>
    </main>
  );
}

// MARK: - 데이터 집계

type Entry = { key: string; count: number };

function aggregateByMonth(marathons: Marathon[]): Entry[] {
  const map = new Map<string, number>();
  for (const m of marathons) {
    const d = new Date(m.raceDate);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => ({ key, count }));
}

function aggregateByRegion(marathons: Marathon[]): Entry[] {
  const map = new Map<Region, number>();
  for (const r of ALL_REGIONS) map.set(r, 0);
  for (const m of marathons) {
    map.set(m.region, (map.get(m.region) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([key, count]) => ({ key, count }));
}

function aggregateByCourse(marathons: Marathon[]): Entry[] {
  const map = new Map<Course, number>();
  for (const c of ALL_COURSES) map.set(c, 0);
  for (const m of marathons) {
    for (const c of m.courses) {
      map.set(c, (map.get(c) ?? 0) + 1);
    }
  }
  return Array.from(map.entries()).map(([key, count]) => ({ key, count }));
}

function monthDisplay(key: string): string {
  const [, mm] = key.split("-");
  return `${parseInt(mm, 10)}월`;
}

// MARK: - 시각화

function SummaryCard({
  label,
  value,
  unit,
  tone,
  isText,
}: {
  label: string;
  value: string | number;
  unit?: string;
  tone: string;
  isText?: boolean;
}) {
  return (
    <div className={`rounded-2xl ${tone} p-4`}>
      <div className="text-[10px] font-bold opacity-80 mb-1">{label}</div>
      <div className={`font-pixel ${isText ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"}`}>
        {value}
        {unit && <span className="text-xs ml-0.5 font-bold opacity-80">{unit}</span>}
      </div>
    </div>
  );
}

function Bars({
  entries,
  colorClass,
  renderLabel,
}: {
  entries: Entry[];
  colorClass: string;
  renderLabel: (key: string) => string;
}) {
  const max = entries.reduce((m, e) => Math.max(m, e.count), 0);
  return (
    <ol className="space-y-1.5">
      {entries.map((e) => {
        const pct = max > 0 ? (e.count / max) * 100 : 0;
        return (
          <li
            key={e.key}
            className="flex items-center gap-3 text-sm"
          >
            <span className="w-12 shrink-0 text-textSecondary font-bold text-xs">
              {renderLabel(e.key)}
            </span>
            <div className="flex-1 h-7 rounded-md bg-surface overflow-hidden relative">
              <div
                className={`h-full ${colorClass} transition-all`}
                style={{ width: `${pct}%` }}
              />
              <span className="absolute inset-0 flex items-center px-2 text-xs font-bold text-textPrimary">
                {e.count > 0 ? `${e.count}개` : ""}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
