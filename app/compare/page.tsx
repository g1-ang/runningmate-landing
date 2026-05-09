import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  type Marathon,
  dDayLabel,
  fetchMarathons,
  formatKoreanDate,
  formatKoreanDateRange,
  statusColorClass,
  statusLabel,
  statusOf,
} from "@/lib/marathons";
import { SITE_URL } from "@/lib/site";
import { CompareClient } from "./CompareClient";

type Props = {
  searchParams: Promise<{ ids?: string }>;
};

export const metadata: Metadata = {
  title: "마라톤 비교",
  description: "여러 마라톤을 한 화면에 나란히 비교 — 일정·코스·장소·참가비.",
  alternates: { canonical: `${SITE_URL}/compare` },
  openGraph: {
    title: "마라톤 비교 · 러닝메이트",
    description: "여러 마라톤을 한 화면에 비교",
    url: `${SITE_URL}/compare`,
  },
};

export default async function ComparePage({ searchParams }: Props) {
  const { ids: idsParam } = await searchParams;
  const ids = (idsParam ?? "").split(",").filter(Boolean).slice(0, 3);
  if (ids.length === 0) {
    return <EmptyCompare />;
  }
  const catalog = await fetchMarathons();
  const marathons = ids
    .map((id) => catalog.marathons.find((m) => m.id === id))
    .filter((m): m is Marathon => Boolean(m));

  if (marathons.length === 0) notFound();

  return (
    <main className="min-h-screen bg-ivory text-textPrimary">
      <header className="sticky top-0 z-30 bg-ivory/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-3.5 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🏃</span>
            <span className="font-pixel text-base md:text-lg text-deepGreen">
              러닝메이트
            </span>
          </Link>
          <Link
            href="/calendar"
            className="text-xs md:text-sm font-bold text-deepGreen hover:underline"
          >
            ← 마라톤 달력으로
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-8 md:py-10">
        <h1 className="font-pixel text-2xl md:text-3xl text-deepGreen mb-2">
          ⚖️ 마라톤 비교
        </h1>
        <p className="text-sm text-textSecondary mb-8">
          {marathons.length}개 대회를 한 화면에. 가로로 스와이프해서 다 보세요.
        </p>

        <CompareClient marathons={marathons} />
      </section>
    </main>
  );
}

function EmptyCompare() {
  return (
    <main className="min-h-screen bg-ivory flex flex-col items-center justify-center px-5 text-center">
      <div className="text-5xl mb-4">⚖️</div>
      <h1 className="font-pixel text-xl text-deepGreen mb-2">
        비교할 마라톤이 없어요
      </h1>
      <p className="text-sm text-textMuted mb-8 max-w-sm">
        달력에서 마라톤 상세를 열고 "+ 비교" 버튼으로 추가해주세요. 최대 3개까지.
      </p>
      <Link
        href="/calendar"
        className="px-5 py-3 rounded-xl bg-deepGreen text-ivory text-sm font-bold hover:opacity-90"
      >
        📅 달력으로 가기
      </Link>
    </main>
  );
}

// helpers re-exported for CompareClient
export { dDayLabel, formatKoreanDate, formatKoreanDateRange, statusColorClass, statusLabel, statusOf };
