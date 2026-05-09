"use client";

import Link from "next/link";
import { useCompare } from "@/lib/useCompare";

/**
 * 화면 하단 floating 배너. compare 큐 1+ 일 때만 노출.
 * 클릭 → /compare?ids=...
 */
export function CompareFAB() {
  const { ids, clear, hydrated } = useCompare();

  if (!hydrated || ids.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full bg-deepGreen text-ivory shadow-lg px-2 py-2 text-xs font-bold">
      <Link
        href={`/compare?ids=${ids.join(",")}`}
        className="px-3 py-1.5 rounded-full hover:bg-ivory/10 transition"
      >
        ⚖️ 비교 보기 ({ids.length})
      </Link>
      <button
        onClick={clear}
        aria-label="비교 큐 비우기"
        className="px-2 py-1 rounded-full hover:bg-ivory/10 text-ivory/80 hover:text-ivory transition"
      >
        ✕
      </button>
    </div>
  );
}
