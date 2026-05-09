"use client";

import { useMemo, useState } from "react";
import {
  type CalendarEvent,
  type CalendarEventType,
  type Marathon,
  type MarathonStatus,
  calendarEventsForMarathons,
  dayKeyOf,
  eventTypeLabel,
  indexEventsByDay,
  isSameMonth,
  isToday,
  monthGridDates,
  startOfMonth,
} from "@/lib/marathons";

type Props = {
  marathons: Marathon[];
  selectedTypes: Set<MarathonStatus>;
  onSelectMarathon: (m: Marathon) => void;
  onSelectDay: (date: string, events: CalendarEvent[]) => void;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function CalendarGrid({
  marathons,
  selectedTypes,
  onSelectMarathon,
  onSelectDay,
}: Props) {
  const events = useMemo(
    () => calendarEventsForMarathons(marathons, selectedTypes),
    [marathons, selectedTypes]
  );
  const byDay = useMemo(() => indexEventsByDay(events), [events]);

  const initialMonth = useMemo(() => {
    const today = startOfMonth(new Date());
    if (events.length === 0) return today;
    const earliestDate = events.reduce((min, e) => (e.date < min ? e.date : min), events[0].date);
    const earliest = startOfMonth(new Date(earliestDate));
    return today < earliest ? earliest : today;
  }, [events]);

  const [month, setMonth] = useState<Date>(initialMonth);
  const dates = useMemo(() => monthGridDates(month), [month]);

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
          const dayEvents = byDay.get(key) ?? [];
          const inMonth = isSameMonth(d, month);
          const today = isToday(d);
          const weekday = d.getDay();
          const showFirstN = 2;
          const overflow = dayEvents.length - showFirstN;

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
                {dayEvents.slice(0, showFirstN).map((e, idx) => (
                  <CalendarEntry
                    key={`${e.marathon.id}-${e.type}-${idx}`}
                    event={e}
                    onClick={() => onSelectMarathon(e.marathon)}
                  />
                ))}
                {overflow > 0 && (
                  <button
                    onClick={() => onSelectDay(key, dayEvents)}
                    className="block w-full text-[10px] font-bold text-textMuted hover:text-deepGreen text-left truncate underline-offset-2 hover:underline"
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

function CalendarEntry({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={`${event.marathon.name} (${eventTypeLabel(event.type)})`}
      className={`block w-full rounded px-1 md:px-1.5 py-0.5 text-[10px] md:text-[11px] font-bold truncate text-left hover:opacity-80 transition ${eventTypeColorClass(event.type)}`}
    >
      {event.marathon.name}
    </button>
  );
}

export function eventTypeColorClass(type: CalendarEventType): string {
  switch (type) {
    case "before-open":     return "bg-pastelSky text-[#1353A6]";
    case "before-close":    return "bg-pastelLime text-deepGreen";
    case "before-announce": return "bg-pastelLilac text-[#5C2DAA]";
    case "before-race":     return "bg-pastelPink text-[#B01760]";
  }
}
