"use client";

import {
  type Marathon,
  dDayLabel,
  formatKoreanDate,
  statusOf,
  statusLabel,
  statusColorClass,
} from "@/lib/marathons";

type Props = {
  marathon: Marathon;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (m: Marathon) => void;
};

export function MarathonCard({ marathon, isFavorite, onToggleFavorite, onSelect }: Props) {
  const status = statusOf(marathon);

  return (
    <button
      onClick={() => onSelect(marathon)}
      className="w-full text-left rounded-2xl border border-border bg-surface p-5 hover:border-deepGreen/40 hover:shadow-sm transition group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusColorClass(status)}`}>
              {statusLabel(status)}
            </span>
            <span className="inline-block rounded-full bg-pastelLilac text-[#5C2DAA] px-2.5 py-0.5 text-[10px] font-bold">
              {marathon.region}
            </span>
            <span className="text-deepGreen font-pixel text-sm">
              {dDayLabel(marathon.raceDate)}
            </span>
          </div>
          <h3 className="font-pixel text-base md:text-lg text-textPrimary mb-1 group-hover:text-deepGreen transition truncate">
            {marathon.name}
          </h3>
          <div className="text-xs md:text-sm text-textSecondary mb-2">
            🗓️ {formatKoreanDate(marathon.raceDate)} · 📍 {marathon.venue || "장소 미정"}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {marathon.courses.map((c) => (
              <span
                key={c}
                className="inline-block rounded-md bg-surfaceMuted text-textSecondary px-2 py-0.5 text-[11px] font-semibold"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <FavoriteButton
          active={isFavorite}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(marathon.id);
          }}
        />
      </div>
    </button>
  );
}

function FavoriteButton({
  active,
  onClick,
}: {
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={active ? "찜 해제" : "찜하기"}
      className={`shrink-0 size-9 rounded-full border transition ${
        active
          ? "bg-deepGreen border-deepGreen text-ivory"
          : "bg-ivory border-border text-textMuted hover:border-deepGreen hover:text-deepGreen"
      }`}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}
