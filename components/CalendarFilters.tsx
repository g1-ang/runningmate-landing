"use client";

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

  const hasActiveFilters =
    filters.regions.size > 0 ||
    filters.courses.size > 0 ||
    filters.statuses.size > 0 ||
    filters.query.trim().length > 0 ||
    filters.favoritesOnly;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="search"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="대회 이름·장소·주최로 검색"
          className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:outline-none focus:border-deepGreen"
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

      <div className="flex items-center justify-between text-xs text-textSecondary pt-1">
        <span>
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
    </div>
  );
}

function statusTone(s: MarathonStatus): ChipTone {
  switch (s) {
    case "open":
      return "lime";
    case "closing-soon":
      return "sand";
    case "upcoming-open":
      return "sky";
    case "closed":
      return "muted";
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

type ChipTone = "default" | "lime" | "sand" | "sky" | "muted";

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
