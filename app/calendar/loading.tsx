/**
 * /calendar 첫 진입 시 마라톤 184개 fetch 동안 보여지는 스켈레톤.
 *
 * Next.js App Router 의 loading.tsx 컨벤션 — page.tsx 의 Promise 가
 * 해석될 때까지 자동으로 이 컴포넌트가 fallback 으로 렌더링됨.
 * 실 컨텐츠와 동일한 레이아웃·간격을 유지해서 layout shift 최소화.
 */

import Link from "next/link";

export default function CalendarLoading() {
  return (
    <main className="min-h-screen bg-ivory text-textPrimary">
      <header className="sticky top-0 z-30 bg-ivory/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-5xl px-5 py-3.5 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🏃</span>
            <span className="font-pixel text-base md:text-lg text-deepGreen">
              러닝메이트
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-xs md:text-sm font-bold text-textSecondary">
            <Link href="/" className="hover:text-deepGreen">
              ← 홈으로
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-6 md:py-10 space-y-6">
        {/* 페이지 타이틀 자리 — 즉시 보임으로 사용자 인식을 빠르게 잡음 */}
        <div>
          <h1 className="font-pixel text-2xl md:text-3xl text-deepGreen mb-2">
            마라톤 달력
          </h1>
          <p className="text-sm text-textSecondary">
            전국 180+ 마라톤 일정 · 매주 자동 갱신
          </p>
        </div>

        {/* 필터 스켈레톤 */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 h-12 rounded-xl bg-surface animate-pulse" />
            <div className="size-12 rounded-xl bg-surface animate-pulse" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-7 w-20 rounded-full bg-surface animate-pulse" />
            <div className="h-4 w-24 rounded bg-surface animate-pulse" />
          </div>
        </div>

        {/* 카드 그리드 스켈레톤 — 6장 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} delay={i * 80} />
          ))}
        </div>

        <p className="text-center text-xs text-textMuted pt-4" aria-live="polite">
          마라톤 데이터를 가져오고 있어요…
        </p>
      </section>
    </main>
  );
}

function CardSkeleton({ delay }: { delay: number }) {
  // delay 살짝 어긋나게 줘서 동시 반짝임 대신 자연스러운 wave
  const style = { animationDelay: `${delay}ms` };
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
      <div className="flex gap-2">
        <div
          className="h-5 w-14 rounded-full bg-ivory animate-pulse"
          style={style}
        />
        <div
          className="h-5 w-14 rounded-full bg-ivory animate-pulse"
          style={style}
        />
      </div>
      <div
        className="h-6 w-3/4 rounded bg-ivory animate-pulse"
        style={style}
      />
      <div
        className="h-4 w-1/2 rounded bg-ivory animate-pulse"
        style={style}
      />
      <div className="flex gap-2 pt-1">
        <div
          className="h-7 w-16 rounded-lg bg-ivory animate-pulse"
          style={style}
        />
        <div
          className="h-7 w-16 rounded-lg bg-ivory animate-pulse"
          style={style}
        />
      </div>
    </div>
  );
}
