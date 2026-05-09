"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type Marathon,
  dDayLabel,
  formatKoreanDate,
  formatKoreanDateRange,
  statusColorClass,
  statusLabel,
  statusOf,
} from "@/lib/marathons";
import { useCompare } from "@/lib/useCompare";

type Props = {
  marathons: Marathon[];
};

/**
 * 비교 카드들 가로 스크롤. 각 카드에서 "X 빼기" 가능 (큐에서 제거 +
 * URL 갱신).
 */
export function CompareClient({ marathons }: Props) {
  const { remove } = useCompare();
  const router = useRouter();

  function handleRemove(id: string) {
    remove(id);
    const remaining = marathons.filter((m) => m.id !== id).map((m) => m.id);
    if (remaining.length === 0) {
      router.push("/calendar");
    } else {
      router.replace(`/compare?ids=${remaining.join(",")}`);
    }
  }

  return (
    <div className="overflow-x-auto -mx-5 px-5 pb-4">
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${marathons.length}, minmax(280px, 1fr))`,
        }}
      >
        {marathons.map((m) => (
          <CompareCard key={m.id} marathon={m} onRemove={() => handleRemove(m.id)} />
        ))}
      </div>
    </div>
  );
}

function CompareCard({
  marathon: m,
  onRemove,
}: {
  marathon: Marathon;
  onRemove: () => void;
}) {
  const status = statusOf(m);
  const dDay = dDayLabel(m.raceDate);

  return (
    <article className="rounded-2xl border border-border bg-surface overflow-hidden flex flex-col">
      <div className="p-5 border-b border-border bg-cream/50">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColorClass(status)}`}
            >
              {statusLabel(status)}
            </span>
            <span className="inline-block rounded-full bg-pastelLilac text-[#5C2DAA] px-2 py-0.5 text-[10px] font-bold">
              {m.region}
            </span>
            <span className="text-deepGreen font-pixel text-xs">{dDay}</span>
          </div>
          <button
            onClick={onRemove}
            aria-label="비교에서 빼기"
            className="shrink-0 size-7 rounded-full text-textMuted hover:bg-surfaceMuted text-sm"
          >
            ✕
          </button>
        </div>
        <Link
          href={`/marathon/${m.id}`}
          className="font-pixel text-base text-textPrimary hover:text-deepGreen transition leading-snug block"
        >
          {m.name}
        </Link>
      </div>

      <dl className="p-5 space-y-4 text-xs flex-1">
        <Row label="대회일" highlight>
          {formatKoreanDate(m.raceDate)}
        </Row>
        <Row label="신청 접수">
          {formatKoreanDateRange(m.registrationOpenDate, m.registrationCloseDate)}
        </Row>
        <Row label="발표">{formatKoreanDate(m.announcementDate)}</Row>
        <Row label="코스">
          <div className="flex flex-wrap gap-1">
            {m.courses.map((c) => (
              <span
                key={c}
                className="inline-block rounded bg-pastelLime text-deepGreen px-1.5 py-0.5 text-[10px] font-bold"
              >
                {c}
              </span>
            ))}
          </div>
        </Row>
        <Row label="장소">{m.venue || "—"}</Row>
        <Row label="주최">{m.organizer || "—"}</Row>
        <Row label="참가비">{m.entryFee || "—"}</Row>
      </dl>

      <div className="p-5 border-t border-border bg-ivory">
        <a
          href={m.officialURL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-4 py-2.5 rounded-xl bg-deepGreen text-ivory text-xs font-bold hover:opacity-90 transition"
        >
          공식 사이트 →
        </a>
      </div>
    </article>
  );
}

function Row({
  label,
  highlight,
  children,
}: {
  label: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[10px] font-bold text-textMuted mb-1">{label}</dt>
      <dd className={highlight ? "text-deepGreen font-bold" : "text-textPrimary"}>
        {children}
      </dd>
    </div>
  );
}
