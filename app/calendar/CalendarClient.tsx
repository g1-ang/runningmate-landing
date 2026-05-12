"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarFiltersBar } from "@/components/CalendarFilters";
import { CalendarGrid } from "@/components/CalendarGrid";
import { CompareFAB } from "@/components/CompareFAB";
import { DayOverviewSheet } from "@/components/DayOverviewSheet";
import { MarathonCard } from "@/components/MarathonCard";
import { MarathonDetailModal } from "@/components/MarathonDetailModal";
import { ReportModal } from "@/components/ReportModal";
import {
  type CalendarEvent,
  type CalendarFilters,
  type Marathon,
  type SortMode,
  applyFilters,
  emptyFilters,
  groupByMonth,
  monthLabelOf,
  sortMarathons,
} from "@/lib/marathons";
import { useFavoriteCounts } from "@/lib/useFavoriteCounts";
import { useFavorites } from "@/lib/useFavorites";

type Props = {
  marathons: Marathon[];
  generatedAt: string;
};

type ViewMode = "calendar" | "list";

export function CalendarClient({ marathons, generatedAt }: Props) {
  const [filters, setFilters] = useState<CalendarFilters>(emptyFilters);
  const [view, setView] = useState<ViewMode>("calendar");
  const [viewWasUserSet, setViewWasUserSet] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("date-asc");
  const [selected, setSelected] = useState<Marathon | null>(null);
  const [dayOverview, setDayOverview] = useState<{ dayKey: string; events: CalendarEvent[] } | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const { ids: favoriteIDs, isFavorite, toggle, hydrated } = useFavorites();
  const { countsMap, promotedSet } = useFavoriteCounts();

  // 모바일은 캘린더 그리드(7칸)가 답답해서 기본 목록. 사용자가 토글로
  // 명시적으로 바꾸면 그 선택을 존중. 768px = Tailwind md 브레이크포인트.
  useEffect(() => {
    if (viewWasUserSet) return;
    const mql = window.matchMedia("(max-width: 767px)");
    setView(mql.matches ? "list" : "calendar");
    const onChange = (e: MediaQueryListEvent) => {
      if (!viewWasUserSet) setView(e.matches ? "list" : "calendar");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [viewWasUserSet]);

  const handleViewChange = (v: ViewMode) => {
    setView(v);
    setViewWasUserSet(true);
  };

  // 캘린더 뷰는 status chip 을 "이벤트 타입 필터" 로 해석하므로
  // applyFilters 는 status 체크 없이 동작해야 한다. List 뷰는 phase
  // 필터로 동작 (기존 의미 유지). 두 view 가 같은 chip 상태를 다르게
  // 해석하지만, 사용자 의도(예: "신청마감" → 신청 받는 마라톤들 또는
  // 그 마감일들)가 두 view 에서 일관되게 충족된다.
  const filtersForList = filters;
  const filtersForCalendar: CalendarFilters = useMemo(
    () => ({ ...filters, statuses: new Set() }),
    [filters]
  );

  const filteredForList = useMemo(
    () => applyFilters(marathons, filtersForList, favoriteIDs),
    [marathons, filtersForList, favoriteIDs]
  );
  const filteredForCalendar = useMemo(
    () => applyFilters(marathons, filtersForCalendar, favoriteIDs),
    [marathons, filtersForCalendar, favoriteIDs]
  );

  const filtered = view === "calendar" ? filteredForCalendar : filteredForList;

  const sorted = useMemo(
    () => sortMarathons(filtered, sortMode, countsMap, promotedSet),
    [filtered, sortMode, countsMap, promotedSet]
  );

  const grouped = useMemo(() => groupByMonth(sorted), [sorted]);
  const monthKeys =
    sortMode === "date-asc"
      ? Array.from(grouped.keys()).sort()
      : null; // 인기순일 땐 월 그룹 없이 일렬로 표시

  return (
    <main className="min-h-screen bg-ivory text-textPrimary">
      <Header />

      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
          <Link href="/" className="text-xs font-bold text-textMuted hover:text-deepGreen">
            ← 러닝메이트 홈
          </Link>
          <h1 className="font-pixel text-3xl md:text-4xl text-deepGreen mt-3 mb-3">
            전국 마라톤 달력
          </h1>
          <p className="text-sm md:text-base text-textSecondary">
            한국 마라톤 일정 {marathons.length}개를 한곳에. 매주 일요일 자동 갱신.
          </p>
        </div>
      </section>

      <section className="sticky top-[57px] z-20 bg-ivory/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-5xl px-5 py-4 space-y-4">
          <CalendarFiltersBar
            filters={filters}
            onChange={setFilters}
            totalCount={marathons.length}
            filteredCount={filtered.length}
          />
          <div className="flex items-center justify-between flex-wrap gap-2">
            <ViewToggle view={view} onChange={handleViewChange} />
            {view === "list" && <SortToggle mode={sortMode} onChange={setSortMode} />}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8 md:py-12">
        {filtered.length === 0 && hydrated && (
          <EmptyState favoritesOnly={filters.favoritesOnly} />
        )}

        {filtered.length > 0 && view === "calendar" && (
          <CalendarGrid
            marathons={sorted}
            selectedTypes={filters.statuses}
            onSelectMarathon={setSelected}
            onSelectDay={(dayKey, events) => setDayOverview({ dayKey, events })}
          />
        )}

        {filtered.length > 0 && view === "list" && sortMode === "date-asc" && monthKeys && (
          <div className="space-y-10">
            {monthKeys.map((key) => (
              <div key={key}>
                <h2 className="font-pixel text-lg md:text-xl text-deepGreen mb-4">
                  {monthLabelOf(key)}
                  <span className="ml-2 text-xs font-bold text-textMuted">
                    {grouped.get(key)!.length}개 대회
                  </span>
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {grouped.get(key)!.map((m) => (
                    <MarathonCard
                      key={m.id}
                      marathon={m}
                      isFavorite={isFavorite(m.id)}
                      onToggleFavorite={toggle}
                      onSelect={setSelected}
                      favoriteCount={countsMap.get(m.id) ?? 0}
                      isPromoted={promotedSet.has(m.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length > 0 && view === "list" && sortMode === "popularity-desc" && (
          <div>
            <h2 className="font-pixel text-lg md:text-xl text-deepGreen mb-4">
              🔥 인기 대회
              <span className="ml-2 text-xs font-bold text-textMuted">
                {sorted.length}개
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {sorted.map((m) => (
                <MarathonCard
                  key={m.id}
                  marathon={m}
                  isFavorite={isFavorite(m.id)}
                  onToggleFavorite={toggle}
                  onSelect={setSelected}
                  favoriteCount={countsMap.get(m.id) ?? 0}
                  isPromoted={promotedSet.has(m.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center space-y-3">
          <button
            onClick={() => setShowReportModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-pastelLime text-deepGreen text-sm font-bold border border-deepGreen/30 hover:bg-neon transition"
          >
            🙋 빠진 대회 제보하기
          </button>
          <p className="text-xs text-textMuted leading-relaxed">
            일정 데이터 출처: 마라톤온라인(roadrun.co.kr) · 마지막 갱신:{" "}
            {new Date(generatedAt).toLocaleDateString("ko-KR")}
          </p>
        </div>
      </section>

      <MarathonDetailModal
        marathon={selected}
        isFavorite={selected ? isFavorite(selected.id) : false}
        onClose={() => setSelected(null)}
        onToggleFavorite={toggle}
      />

      <DayOverviewSheet
        dayKey={dayOverview?.dayKey ?? null}
        events={dayOverview?.events ?? []}
        onClose={() => setDayOverview(null)}
        onSelectMarathon={(id) => {
          const m = marathons.find((x) => x.id === id);
          if (m) setSelected(m);
        }}
      />

      <ReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
      />

      <CompareFAB />

      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 bg-ivory/90 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-5xl px-5 py-3.5 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🏃</span>
          <span className="font-pixel text-base md:text-lg text-deepGreen">
            러닝메이트
          </span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6 text-xs md:text-sm font-semibold text-textSecondary">
          <Link href="/calendar" className="text-deepGreen">
            달력
          </Link>
          <Link href="/#features" className="hover:text-deepGreen hidden sm:inline">
            기능
          </Link>
          <Link
            href="/#cta"
            className="rounded-full bg-deepGreen text-ivory px-3 py-1.5 hover:opacity-90"
          >
            출시 알림
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-cream py-10">
      <div className="mx-auto max-w-5xl px-5 text-xs text-textMuted text-center leading-relaxed">
        <div className="mb-2">
          <span className="font-pixel text-sm text-deepGreen">🏃 러닝메이트</span>
        </div>
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
        © 2026 RunningMate · 일정 출처: 마라톤온라인 (roadrun.co.kr)
      </div>
    </footer>
  );
}

function ViewToggle({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="inline-flex rounded-full border border-border bg-ivory p-1 text-xs font-bold">
      <button
        onClick={() => onChange("calendar")}
        className={`px-4 py-1.5 rounded-full transition ${
          view === "calendar" ? "bg-deepGreen text-ivory" : "text-textSecondary hover:text-deepGreen"
        }`}
      >
        📅 달력
      </button>
      <button
        onClick={() => onChange("list")}
        className={`px-4 py-1.5 rounded-full transition ${
          view === "list" ? "bg-deepGreen text-ivory" : "text-textSecondary hover:text-deepGreen"
        }`}
      >
        ☰ 목록
      </button>
    </div>
  );
}

function SortToggle({ mode, onChange }: { mode: SortMode; onChange: (m: SortMode) => void }) {
  return (
    <div className="inline-flex rounded-full border border-border bg-ivory p-1 text-xs font-bold">
      <button
        onClick={() => onChange("date-asc")}
        className={`px-4 py-1.5 rounded-full transition ${
          mode === "date-asc" ? "bg-deepGreen text-ivory" : "text-textSecondary hover:text-deepGreen"
        }`}
      >
        🗓️ 날짜 임박순
      </button>
      <button
        onClick={() => onChange("popularity-desc")}
        className={`px-4 py-1.5 rounded-full transition ${
          mode === "popularity-desc" ? "bg-deepGreen text-ivory" : "text-textSecondary hover:text-deepGreen"
        }`}
      >
        🔥 인기순
      </button>
    </div>
  );
}

function EmptyState({ favoritesOnly }: { favoritesOnly: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-surface py-16 text-center">
      <div className="text-5xl mb-4">{favoritesOnly ? "♡" : "🔍"}</div>
      <p className="font-pixel text-base text-textPrimary mb-2">
        {favoritesOnly ? "찜한 대회가 아직 없어요" : "조건에 맞는 대회가 없어요"}
      </p>
      <p className="text-sm text-textMuted">
        {favoritesOnly
          ? "마음에 드는 대회의 ♡ 버튼을 눌러보세요."
          : "필터를 조정하거나 검색어를 바꿔보세요."}
      </p>
    </div>
  );
}
