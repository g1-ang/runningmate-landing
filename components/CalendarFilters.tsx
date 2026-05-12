"use client";

import { useEffect, useState } from "react";
import {
  ALL_COURSES,
  ALL_REGIONS,
  FILTERABLE_STATUSES,
  type CalendarFilters,
  type Course,
  type MarathonStatus,
  type Region,
  statusLabel,
} from "@/lib/marathons";

type Props = {
  filters: CalendarFilters;
  onChange: (next: CalendarFilters) => void;
  totalCount: number;
  filteredCount: number;
};

export function CalendarFiltersBar({ filters, onChange, totalCount, filteredCount }: Props) {
  // 모바일은 기본 접힘 (검색·찜 + 토글만 보임). 사용자가 명시적으로
  // 토글하면 그 선택 존중. 화면 크기 변화 시 자동 재조정.
  const [expanded, setExpanded] = useState(true);
  const [userToggled, setUserToggled] = useState(false);

  useEffect(() => {
    if (userToggled) return;
    const mql = window.matchMedia("(max-width: 767px)");
    setExpanded(!mql.matches);
    const onChangeMql = (e: MediaQueryListEvent) => {
      if (!userToggled) setExpanded(!e.matches);
    };
    mql.addEventListener("change", onChangeMql);
    return () => mql.removeEventListener("change", onChangeMql);
  }, [userToggled]);

  const handleToggleExpanded = () => {
    setExpanded((p) => !p);
    setUserToggled(true);
  };

  const toggleRegion = (r: Region) => {
    const next = new Set(filters.regions);
    next.has(r) ? next.delete(r) : next.add(r);
    onChange({ ...filters, regions: next });
  };
  const toggleCourse = (c: Course) => {
    const next = new Set(filters.courses);
    next.has(c) ? next.delete(c) : next.add(c);
    onChange({ ...filters, courses: next });
  };
  const toggleStatus = (s: MarathonStatus) => {
    const next = new Set(filters.statuses);
    next.has(s) ? next.delete(s) : next.add(s);
    onChange({ ...filters, statuses: next });
  };

  const activeCount =
    filters.regions.size +
    filters.courses.size +
    filters.statuses.size +
    (filters.query.trim() ? 1 : 0) +
    (filters.favoritesOnly ? 1 : 0);
  const hasActiveFilters = activeCount > 0;

  return (
    <div className="space-y-3">
      {/* 항상 보이는 row: 검색 + 찜 */}
      <div className="flex gap-2">
        <input
          type="search"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="대회 이름·장소·주최로 검색"
          aria-label="마라톤 검색"
          className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:outline-none focus:border-deepGreen focus:ring-2 focus:ring-deepGreen/20"
        />
        <button
          onClick={() => onChange({ ...filters, favoritesOnly: !filters.favoritesOnly })}
          className={`shrink-0 px-4 py-3 rounded-xl text-sm font-bold transition border ${
            filters.favoritesOnly
              ? "bg-deepGreen text-ivory border-deepGreen"
              : "bg-ivory text-textSecondary border-border hover:border-deepGreen"
          }`}
        >
          ♥ 찜
        </button>
      </div>

      {/* 항상 보이는 row: 토글 + 요약 + 초기화 */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        <button
          onClick={handleToggleExpanded}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-ivory hover:border-deepGreen text-textSecondary font-bold"
        >
          <span>⚙️ 필터</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-deepGreen text-ivory text-[10px] px-1">
              {activeCount}
            </span>
          )}
          <span className="text-textMuted">{expanded ? "▴" : "▾"}</span>
        </button>

        <span className="text-textSecondary">
          총 <strong className="text-deepGreen">{filteredCount}</strong>개
          {filteredCount !== totalCount && (
            <span className="text-textMuted"> / {totalCount}</span>
          )}
        </span>

        {hasActiveFilters && (
          <button
            onClick={() =>
              onChange({
                ...filters,
                regions: new Set(),
                courses: new Set(),
                statuses: new Set(),
                query: "",
                favoritesOnly: false,
              })
            }
            className="text-deepGreen font-bold hover:underline"
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* 펼친 상태에서만 보이는 chip rows */}
      {expanded && (
        <div className="space-y-3 pt-1">
          <ChipRow label="지역">
            {ALL_REGIONS.map((r) => (
              <Chip key={r} active={filters.regions.has(r)} onClick={() => toggleRegion(r)}>
                {r}
              </Chip>
            ))}
          </ChipRow>

          <ChipRow label="코스">
            {ALL_COURSES.map((c) => (
              <Chip key={c} active={filters.courses.has(c)} onClick={() => toggleCourse(c)}>
                {c}
              </Chip>
            ))}
          </ChipRow>

          <ChipRow label="상태">
            {FILTERABLE_STATUSES.map((s) => (
              <Chip
                key={s}
                active={filters.statuses.has(s)}
                onClick={() => toggleStatus(s)}
                tone={statusTone(s)}
              >
                {statusLabel(s)}
              </Chip>
            ))}
            <Chip
              active={!filters.hideFinished}
              onClick={() => onChange({ ...filters, hideFinished: !filters.hideFinished })}
              tone="muted"
            >
              {filters.hideFinished ? "+ 종료 포함" : "✓ 종료 포함됨"}
            </Chip>
          </ChipRow>
        </div>
      )}
    </div>
  );
}

function statusTone(s: MarathonStatus): ChipTone {
  switch (s) {
    case "before-open":
      return "sky";
    case "before-close":
      return "lime";
    case "before-announce":
      return "lilac";
    case "before-race":
      return "pink";
    default:
      return "muted";
  }
}

function ChipRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs font-bold text-textMuted shrink-0 w-8 pt-1.5">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

type ChipTone = "default" | "lime" | "sand" | "sky" | "lilac" | "pink" | "muted";

function Chip({
  active,
  onClick,
  children,
  tone = "default",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: ChipTone;
}) {
  let activeClass = "bg-deepGreen text-ivory border-deepGreen";
  if (active) {
    if (tone === "lime") activeClass = "bg-pastelLime text-deepGreen border-deepGreen/40";
    else if (tone === "sand") activeClass = "bg-pastelSand text-[#7A4400] border-[#7A4400]/40";
    else if (tone === "sky") activeClass = "bg-pastelSky text-[#1353A6] border-[#1353A6]/40";
    else if (tone === "lilac") activeClass = "bg-pastelLilac text-[#5C2DAA] border-[#5C2DAA]/40";
    else if (tone === "pink") activeClass = "bg-pastelPink text-[#B01760] border-[#B01760]/40";
    else if (tone === "muted") activeClass = "bg-surfaceMuted text-textPrimary border-textPrimary/30";
  }

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-bold transition border ${
        active ? activeClass : "bg-ivory text-textSecondary border-border hover:border-deepGreen"
      }`}
    >
      {children}
    </button>
  );
}
