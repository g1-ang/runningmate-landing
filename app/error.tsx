"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Vercel 자동 캡처 — 콘솔에 남기면 빌드/배포 로그에서 검색 가능
    console.error("[error.tsx]", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-ivory text-textPrimary flex items-center justify-center px-5">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4" aria-hidden="true">
          😵‍💫
        </div>
        <h1 className="font-pixel text-3xl md:text-4xl text-deepGreen mb-3">
          잠시 문제가 생겼어요
        </h1>
        <p className="text-sm md:text-base text-textSecondary mb-2 leading-relaxed">
          일시적인 오류일 수 있어요. 다시 시도해 보거나, 홈으로 돌아가
          주세요.
        </p>
        {error.digest && (
          <p className="text-[10px] text-textMuted mb-6 font-mono">
            오류 ID: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            onClick={reset}
            className="rounded-xl bg-deepGreen text-ivory px-6 py-3 text-sm font-bold hover:opacity-90 transition"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="rounded-xl bg-ivory text-deepGreen border border-deepGreen px-6 py-3 text-sm font-bold hover:bg-pastelLime transition"
          >
            홈으로 돌아가기
          </Link>
        </div>
        <p className="text-xs text-textMuted mt-8">
          문제가 계속되면{" "}
          <a
            href="mailto:runningmate.g1@gmail.com"
            className="text-deepGreen hover:underline"
          >
            runningmate.g1@gmail.com
          </a>
          으로 알려주세요.
        </p>
      </div>
    </main>
  );
}
