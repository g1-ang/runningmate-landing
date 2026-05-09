"use client";

import { useEffect } from "react";
import {
  type CalendarEvent,
  eventTypeLabel,
} from "@/lib/marathons";
import { eventTypeColorClass } from "./CalendarGrid";

type Props = {
  dayKey: string | null; // 'YYYY-MM-DD'
  events: CalendarEvent[];
  onClose: () => void;
  onSelectMarathon: (id: string) => void;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function DayOverviewSheet({ dayKey, events, onClose, onSelectMarathon }: Props) {
  useEffect(() => {
    if (!dayKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [dayKey, onClose]);

  if (!dayKey) return null;

  const headerLabel = labelOfDay(dayKey);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-xl bg-ivory rounded-t-3xl md:rounded-3xl border border-border max-h-[88vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-ivory/95 backdrop-blur z-10 px-6 pt-5 pb-4 border-b border-border flex items-center justify-between gap-3">
          <div>
            <h2 className="font-pixel text-lg md:text-xl text-deepGreen">{headerLabel}</h2>
            <p className="text-xs text-textMuted mt-1">
              총 {events.length}개 일정
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="shrink-0 size-9 rounded-full border border-border text-textMuted hover:bg-surface text-lg"
          >
            ✕
          </button>
        </div>

        <ul className="px-6 py-4 space-y-2">
          {events.map((e, idx) => (
            <li key={`${e.marathon.id}-${e.type}-${idx}`}>
              <button
                onClick={() => {
                  onSelectMarathon(e.marathon.id);
                  onClose();
                }}
                className="w-full flex items-start gap-3 rounded-xl border border-border bg-surface p-3 hover:border-deepGreen/40 hover:shadow-sm transition text-left"
              >
                <span
                  className={`shrink-0 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${eventTypeColorClass(e.type)}`}
                >
                  {eventTypeLabel(e.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-pixel text-sm text-textPrimary truncate">
                    {e.marathon.name}
                  </div>
                  <div className="text-[11px] text-textMuted mt-0.5 truncate">
                    {e.marathon.region} · {e.marathon.venue || "장소 미정"}
                  </div>
                </div>
                <span className="text-textMuted text-xs">›</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function labelOfDay(dayKey: string): string {
  const [yearStr, monthStr, dayStr] = dayKey.split("-");
  const date = new Date(
    Number(yearStr),
    Number(monthStr) - 1,
    Number(dayStr)
  );
  const weekday = WEEKDAYS[date.getDay()];
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday})`;
}
