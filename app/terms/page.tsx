import type { Metadata } from "next";
import Link from "next/link";
import { LegalContent } from "@/components/LegalContent";
import { LEGAL_EFFECTIVE_DATE, TERMS_OF_SERVICE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "이용약관",
  description: "러닝메이트 웹사이트 이용약관",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-ivory text-textPrimary">
      <header className="sticky top-0 z-30 bg-ivory/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-3xl px-5 py-3.5 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🏃</span>
            <span className="font-pixel text-base md:text-lg text-deepGreen">
              러닝메이트
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs md:text-sm font-bold text-deepGreen hover:underline"
          >
            ← 홈으로
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-5 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="font-pixel text-2xl md:text-3xl text-deepGreen mb-2">
            이용약관
          </h1>
          <p className="text-xs text-textMuted">
            러닝메이트 서비스 이용 약관 · {LEGAL_EFFECTIVE_DATE} 시행
          </p>
        </div>
        <LegalContent markdown={TERMS_OF_SERVICE} />

        <div className="mt-10 pt-6 border-t border-border flex flex-wrap gap-3 text-xs">
          <Link
            href="/privacy"
            className="text-deepGreen font-bold hover:underline"
          >
            개인정보처리방침 →
          </Link>
          <Link href="/" className="text-textSecondary hover:text-deepGreen">
            홈으로 돌아가기
          </Link>
        </div>
      </article>
    </main>
  );
}
