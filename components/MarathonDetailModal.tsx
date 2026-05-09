"use client";

import { useEffect } from "react";
import {
  type Marathon,
  dDayLabel,
  formatKoreanDate,
  formatKoreanDateRange,
  statusOf,
  statusLabel,
  statusColorClass,
} from "@/lib/marathons";
import { GearRecommendations } from "./GearRecommendations";

type Props = {
  marathon: Marathon | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
};

export function MarathonDetailModal({
  marathon,
  isFavorite,
  onClose,
  onToggleFavorite,
}: Props) {
  useEffect(() => {
    if (!marathon) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [marathon, onClose]);

  if (!marathon) return null;
  const status = statusOf(marathon);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-2xl bg-ivory rounded-t-3xl md:rounded-3xl border border-border max-h-[92vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-ivory/95 backdrop-blur z-10 px-6 pt-5 pb-4 border-b border-border flex items-start justify-between gap-3">
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
            <h2 className="font-pixel text-xl md:text-2xl text-textPrimary leading-snug">
              {marathon.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="shrink-0 size-9 rounded-full border border-border text-textMuted hover:bg-surface text-lg"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <section>
            <h3 className="text-xs font-bold text-textMuted mb-3">코스</h3>
            <div className="flex flex-wrap gap-2">
              {marathon.courses.map((c) => (
                <span
                  key={c}
                  className="inline-block rounded-lg bg-pastelLime text-deepGreen px-3 py-1.5 text-sm font-bold"
                >
                  {c}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-textMuted mb-3">일정</h3>
            <ul className="space-y-2 text-sm">
              <ScheduleRow color="bg-pastelSky" label="신청 접수" value={formatKoreanDateRange(marathon.registrationOpenDate, marathon.registrationCloseDate)} />
              <ScheduleRow color="bg-pastelLilac" label="발표" value={formatKoreanDate(marathon.announcementDate)} />
              <ScheduleRow color="bg-pastelPink" label="대회일" value={formatKoreanDate(marathon.raceDate)} highlight />
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-bold text-textMuted mb-3">상세</h3>
            <dl className="space-y-2 text-sm">
              <DetailRow label="장소" value={marathon.venue || "미정"} />
              <DetailRow label="주최" value={marathon.organizer || "—"} />
              <DetailRow label="참가비" value={marathon.entryFee || "—"} />
            </dl>
          </section>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onToggleFavorite(marathon.id)}
              className={`flex-1 px-5 py-3.5 rounded-xl text-sm font-bold border transition ${
                isFavorite
                  ? "bg-deepGreen text-ivory border-deepGreen"
                  : "bg-ivory text-deepGreen border-deepGreen hover:bg-pastelLime"
              }`}
            >
              {isFavorite ? "♥ 찜 해제" : "♡ 찜하기"}
            </button>
            <a
              href={marathon.officialURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-5 py-3.5 rounded-xl text-sm font-bold bg-deepGreen text-ivory hover:opacity-90 transition text-center"
            >
              공식 사이트에서 신청 →
            </a>
          </div>

          <p className="text-xs text-textMuted leading-relaxed">
            ※ 일정 데이터는 마라톤온라인(roadrun.co.kr)에서 자동 수집된 정보입니다.
            정확한 신청·참가비·일정은 반드시 위 공식 사이트에서 확인해주세요.
          </p>

          <div className="border-t border-border pt-6">
            <GearRecommendations courses={marathon.courses} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ScheduleRow({
  color,
  label,
  value,
  highlight,
}: {
  color: string;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <li className="flex items-center gap-3">
      <span className={`size-2 rounded-full ${color}`} />
      <span className="text-textMuted w-20 shrink-0">{label}</span>
      <span className={highlight ? "text-deepGreen font-bold" : "text-textPrimary"}>
        {value}
      </span>
    </li>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="text-textMuted w-20 shrink-0">{label}</dt>
      <dd className="text-textPrimary">{value}</dd>
    </div>
  );
}
