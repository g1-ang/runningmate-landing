import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ivory text-textPrimary flex items-center justify-center px-5">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4" aria-hidden="true">
          🏃‍♂️💨
        </div>
        <h1 className="font-pixel text-3xl md:text-4xl text-deepGreen mb-3">
          페이지를 못 찾았어요
        </h1>
        <p className="text-sm md:text-base text-textSecondary mb-8 leading-relaxed">
          URL 이 잘못됐거나, 페이지가 이동·삭제됐을 수 있어요.
          <br />
          마라톤 일정은 달력에서 확인할 수 있어요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/calendar"
            className="rounded-xl bg-deepGreen text-ivory px-6 py-3 text-sm font-bold hover:opacity-90 transition"
          >
            📅 마라톤 달력 보기
          </Link>
          <Link
            href="/"
            className="rounded-xl bg-ivory text-deepGreen border border-deepGreen px-6 py-3 text-sm font-bold hover:bg-pastelLime transition"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
