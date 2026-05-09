"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarFiltersBar } from "@/components/CalendarFilters";
import { MarathonCard } from "@/components/MarathonCard";
import { MarathonDetailModal } from "@/components/MarathonDetailModal";
import {
  type CalendarFilters,
  type Marathon,
  applyFilters,
  emptyFilters,
  groupByMonth,
  monthLabelOf,
} from "@/lib/marathons";
import { useFavorites } from "@/lib/useFavorites";

type Props = {
  marathons: Marathon[];
  generatedAt: string;
};

export function CalendarClient({ marathons, generatedAt }: Props) {
  const [filters, setFilters] = useState<CalendarFilters>(emptyFilters);
  const [selected, setSelected] = useState<Marathon | null>(null);
  const { ids: favoriteIDs, isFavorite, toggle, hydrated } = useFavorites();

  const filtered = useMemo(
    () => applyFilters(marathons, filters, favoriteIDs),
    [marathons, filters, favoriteIDs]
  );

  const grouped = useMemo(() => groupByMonth(filtered), [filtered]);
  const monthKeys = Array.from(grouped.keys()).sort();

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
        <div className="mx-auto max-w-5xl px-5 py-4">
          <CalendarFiltersBar
            filters={filters}
            onChange={setFilters}
            totalCount={marathons.length}
            filteredCount={filtered.length}
          />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8 md:py-12">
        {filtered.length === 0 && hydrated && (
          <EmptyState favoritesOnly={filters.favoritesOnly} />
        )}

        <div className="space-y-10">
          {monthKeys.map((key) => (
            <div key={key}>
              <h2 className="font-pixel text-lg md:text-xl text-deepGreen mb-4 sticky top-[calc(57px+115px)] md:top-[calc(57px+95px)] bg-ivory/95 backdrop-blur py-2 z-10">
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
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-textMuted text-center mt-12 leading-relaxed">
          일정 데이터 출처: 마라톤온라인(roadrun.co.kr) · 마지막 갱신:{" "}
          {new Date(generatedAt).toLocaleDateString("ko-KR")}
        </p>
      </section>

      <MarathonDetailModal
        marathon={selected}
        isFavorite={selected ? isFavorite(selected.id) : false}
        onClose={() => setSelected(null)}
        onToggleFavorite={toggle}
      />

      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 bg-ivory/90 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-5xl px-5 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏃</span>
          <span className="font-pixel text-lg text-deepGreen">러닝메이트</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-semibold text-textSecondary">
          <Link href="/calendar" className="text-deepGreen">
            달력
          </Link>
          <Link href="/#features" className="hover:text-deepGreen">
            기능
          </Link>
          <Link href="/#cta" className="hover:text-deepGreen">
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
        © 2026 RunningMate · 일정 출처: 마라톤온라인 (roadrun.co.kr)
      </div>
    </footer>
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
