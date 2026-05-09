"use client";

import { useMemo, useState } from "react";
import {
  type Marathon,
  dayKeyOf,
  indexByDay,
  isSameMonth,
  isToday,
  monthGridDates,
  startOfMonth,
  statusOf,
  statusColorClass,
  statusLabel,
} from "@/lib/marathons";

type Props = {
  marathons: Marathon[];
  onSelect: (m: Marathon) => void;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function CalendarGrid({ marathons, onSelect }: Props) {
  const initialMonth = useMemo(() => {
    if (marathons.length === 0) return startOfMonth(new Date());
    const today = startOfMonth(new Date());
    const earliest = startOfMonth(new Date(marathons[0].raceDate));
    return today < earliest ? earliest : today;
  }, [marathons]);

  const [month, setMonth] = useState<Date>(initialMonth);
  const dates = useMemo(() => monthGridDates(month), [month]);
  const byDay = useMemo(() => indexByDay(marathons), [marathons]);

  const monthLabel = `${month.getFullYear()}년 ${month.getMonth() + 1}월`;

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          aria-label="이전 달"
          className="size-9 rounded-full hover:bg-surfaceMuted text-textSecondary text-lg"
        >
          ‹
        </button>
        <div className="flex items-center gap-3">
          <h2 className="font-pixel text-base md:text-lg text-deepGreen">{monthLabel}</h2>
          <button
            onClick={() => setMonth(startOfMonth(new Date()))}
            className="text-[11px] font-bold text-textMuted hover:text-deepGreen px-2 py-0.5 rounded-full border border-border"
          >
            오늘
          </button>
        </div>
        <button
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          aria-label="다음 달"
          className="size-9 rounded-full hover:bg-surfaceMuted text-textSecondary text-lg"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-[11px] font-bold text-textMuted border-b border-border bg-cream/50">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`py-2 ${i === 0 ? "text-[#B01760]" : i === 6 ? "text-[#1353A6]" : ""}`}
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-fr">
        {dates.map((d, i) => {
          const key = dayKeyOf(d);
          const dayMarathons = byDay.get(key) ?? [];
          const inMonth = isSameMonth(d, month);
          const today = isToday(d);
          const weekday = d.getDay();
          const showFirstN = 2;
          const overflow = dayMarathons.length - showFirstN;

          return (
            <div
              key={i}
              className={`min-h-[78px] md:min-h-[110px] border-r border-b border-border last:border-r-0 p-1.5 md:p-2 ${
                inMonth ? "bg-ivory" : "bg-surfaceMuted/40"
              } ${(i + 1) % 7 === 0 ? "border-r-0" : ""}`}
            >
              <div
                className={`text-[11px] font-bold mb-1 ${
                  !inMonth
                    ? "text-textMuted/50"
                    : today
                    ? "text-ivory bg-deepGreen rounded-full inline-flex items-center justify-center size-5"
                    : weekday === 0
                    ? "text-[#B01760]"
                    : weekday === 6
                    ? "text-[#1353A6]"
                    : "text-textPrimary"
                }`}
              >
                {d.getDate()}
              </div>
              <div className="space-y-0.5">
                {dayMarathons.slice(0, showFirstN).map((m) => (
                  <CalendarChip key={m.id} marathon={m} onClick={() => onSelect(m)} />
                ))}
                {overflow > 0 && (
                  <button
                    onClick={() => onSelect(dayMarathons[showFirstN])}
                    className="block w-full text-[10px] font-bold text-textMuted hover:text-deepGreen text-left truncate"
                  >
                    +{overflow}개 더
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarChip({ marathon, onClick }: { marathon: Marathon; onClick: () => void }) {
  const status = statusOf(marathon);
  return (
    <button
      onClick={onClick}
      title={`${marathon.name} (${statusLabel(status)})`}
      className={`block w-full rounded px-1 md:px-1.5 py-0.5 text-[10px] md:text-[11px] font-bold truncate text-left ${statusColorClass(status)} hover:opacity-80 transition`}
    >
      {marathon.name}
    </button>
  );
}
