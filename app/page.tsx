import Image from "next/image";
import Link from "next/link";
import { EmailSignupForm } from "@/components/EmailSignupForm";

const FEATURES = [
  {
    emoji: "📅",
    title: "전국 마라톤 달력",
    desc: "180+ 한국 마라톤 일정이 자동 갱신. 지역·코스·상태 필터로 한눈에. 관심 대회 찜하면 신청 1시간 전 + 대회 D-1 알림이 울려요.",
    bg: "bg-pastelLime",
  },
  {
    emoji: "🏠",
    title: "픽셀 마이룸",
    desc: "달린 만큼 자라는 나만의 러너. 모자·신발·배경 4슬롯 꾸미기. 누적 거리에 따라 한정판·시즌·콜라보 아이템 해금.",
    bg: "bg-pastelPink",
  },
  {
    emoji: "❤️",
    title: "Apple 건강 연동",
    desc: "iOS 건강 앱의 러닝 기록을 자동으로 마이룸·공유 카드에 반영. 1km당 10P 자동 적립. 모든 데이터는 단말 안에서만 처리.",
    bg: "bg-pastelSky",
  },
  {
    emoji: "✨",
    title: "완주 인증 카드",
    desc: "8-bit 픽셀 카드로 러닝 자랑하기. 거리·페이스·시간 자동 표시. 텍스트·스티커 추가해서 친구에게 공유.",
    bg: "bg-pastelSand",
  },
] as const;

const SCREENSHOTS = [
  { src: "/screenshots/03_마이룸_메인.png", alt: "마이룸 메인", caption: "매일 다른 인사로 맞이하는 나만의 러너" },
  { src: "/screenshots/04_마이룸_꾸미기.png", alt: "마이룸 꾸미기", caption: "달린 만큼 해금되는 한정 아이템" },
  { src: "/screenshots/01_달력_월뷰.png", alt: "마라톤 달력", caption: "전국 180+ 마라톤 일정 자동 갱신" },
  { src: "/screenshots/06_마라톤_상세.png", alt: "마라톤 상세", caption: "신청 1시간 전 알림까지" },
  { src: "/screenshots/02_피드_꿀팁.png", alt: "피드", caption: "러너들의 생생한 후기와 꿀팁" },
  { src: "/screenshots/07_인증샷_에디터.png", alt: "인증샷 에디터", caption: "8-bit 카드로 자랑하기" },
  { src: "/screenshots/05_설정.png", alt: "설정", caption: "투명한 로컬 저장" },
] as const;

const FAQ = [
  {
    q: "출시는 언제인가요?",
    a: "현재 App Store 심사 준비 중이에요. 출시 알림을 받으려면 페이지 상단 폼에 이메일을 남겨주세요.",
  },
  {
    q: "데이터는 어디에 저장되나요?",
    a: "전부 본인 단말 안에만 저장됩니다. 외부 서버 전송 없음, 로그인 없음, 수집하는 정보 없음. Apple 건강 데이터도 표시 용도로만 읽고 저장하지 않아요.",
  },
  {
    q: "Android 도 지원하나요?",
    a: "현재 V1 은 iOS 만 지원합니다. iOS 17.0 이상에서 동작해요.",
  },
  {
    q: "마라톤 일정은 어디서 가져오나요?",
    a: "마라톤온라인(roadrun.co.kr) 의 공개된 대회 일정을 매주 일요일 자동으로 가져와 갱신합니다. 정확한 일정·신청은 각 대회 공식 사이트에서 재확인해 주세요.",
  },
  {
    q: "유료인가요?",
    a: "V1 은 무료. 광고도 없고 결제도 없습니다. 향후 광고 제거·프리미엄 꾸미기 옵션이 생길 수 있어요.",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-ivory text-textPrimary">
      <Header />
      <Hero />
      <FeatureGrid />
      <ScreenshotGallery />
      <PrivacyHighlight />
      <FAQSection />
      <Footer />
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="sticky top-0 z-30 bg-ivory/85 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-3.5 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <span className="text-2xl">🏃</span>
          <span className="font-pixel text-lg text-deepGreen">러닝메이트</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-textSecondary">
          <Link href="/calendar" className="hover:text-deepGreen">마라톤 달력</Link>
          <Link href="/stats" className="hover:text-deepGreen">통계</Link>
          <a href="#features" className="hover:text-deepGreen">기능</a>
          <a href="#faq" className="hover:text-deepGreen">FAQ</a>
        </nav>
        <a
          href="#cta"
          className="rounded-full bg-deepGreen text-ivory px-4 py-2 text-sm font-bold hover:opacity-90 transition"
        >
          출시 알림 받기
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-24 md:pt-24 md:pb-32 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block rounded-full bg-neon/30 text-deepGreen font-bold text-xs px-3 py-1 mb-5">
            iOS · 출시 준비 중
          </span>
          <h1 className="font-pixel text-4xl md:text-5xl lg:text-6xl leading-tight text-deepGreen mb-6">
            한 걸음마다<br />꾸미는 러닝
          </h1>
          <p className="text-base md:text-lg text-textPrimary font-bold mb-3">
            2026 전국 마라톤 달력 · 무료 러닝 앱
          </p>
          <p className="text-lg md:text-xl text-textSecondary leading-relaxed mb-8">
            2026 한국 마라톤 일정 180+ 와 픽셀 캐릭터 마이룸을<br />
            한 앱에서. 5km·10km·하프·풀 — 달릴 때마다 캐릭터도 같이 자라요.
          </p>
          <div id="cta">
            <EmailSignupForm />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 rounded-xl bg-pastelLime text-deepGreen px-5 py-3 text-sm font-bold hover:bg-neon transition"
            >
              📅 마라톤 달력 먼저 보기 →
            </Link>
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="device-frame relative w-[280px] md:w-[320px]">
            <Image
              src="/screenshots/03_마이룸_메인.png"
              alt="러닝메이트 마이룸"
              width={1320}
              height={2868}
              priority
              className="rounded-[44px] border-8 border-textPrimary"
            />
          </div>
          <div className="absolute -z-10 inset-0 bg-gradient-to-br from-pastelLime to-pastelSky opacity-30 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section id="features" className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-pixel text-3xl md:text-4xl text-deepGreen mb-3">
          전국 마라톤 일정 · 한 곳에서
        </h2>
        <p className="text-textSecondary text-base md:text-lg mb-12">
          2026 마라톤 달력 + 픽셀 캐릭터 꾸미기 + 자동 러닝 기록까지.
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`rounded-3xl border border-border ${f.bg} p-7 md:p-9`}
            >
              <div className="text-4xl mb-4">{f.emoji}</div>
              <h3 className="font-pixel text-xl text-deepGreen mb-3">{f.title}</h3>
              <p className="text-textSecondary text-sm md:text-base leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScreenshotGallery() {
  return (
    <section id="screenshots" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-pixel text-3xl md:text-4xl text-deepGreen mb-3">
          화면 둘러보기
        </h2>
        <p className="text-textSecondary text-base md:text-lg mb-12">
          7개 화면, 8-bit 픽셀로 다듬은 작은 디테일.
        </p>
        <div className="overflow-x-auto -mx-5 px-5 pb-4">
          <div className="flex gap-6 md:gap-8">
            {SCREENSHOTS.map((s) => (
              <figure key={s.src} className="flex-shrink-0 w-[200px] md:w-[240px]">
                <div className="device-frame">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    width={1320}
                    height={2868}
                    className="rounded-[28px] border-[6px] border-textPrimary"
                  />
                </div>
                <figcaption className="text-center text-xs md:text-sm text-textSecondary mt-4 leading-snug px-2">
                  {s.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PrivacyHighlight() {
  return (
    <section id="privacy" className="bg-deepGreen text-ivory py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <div className="inline-block rounded-full bg-neon/20 text-neon font-bold text-xs px-3 py-1 mb-5">
          🔒 개인정보
        </div>
        <h2 className="font-pixel text-3xl md:text-4xl mb-6">
          서버 없음. 단말에만 저장.
        </h2>
        <p className="text-base md:text-lg leading-relaxed opacity-90 mb-10">
          러닝메이트 V1 은 백엔드 서버를 운영하지 않습니다.<br />
          닉네임·러닝 기록·아이템·찜한 대회 — 전부 본인 단말 안에서만 처리됩니다.<br />
          외부 전송 없음. 로그인 없음. 수집하는 정보 없음.
        </p>
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
          <PrivacyStat label="수집하는 데이터" value="0" />
          <PrivacyStat label="외부 서버" value="0" />
          <PrivacyStat label="필요한 로그인" value="0" />
        </div>
      </div>
    </section>
  );
}

function PrivacyStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-pixel text-5xl md:text-6xl text-neon">{value}</div>
      <div className="text-xs md:text-sm opacity-75 mt-2">{label}</div>
    </div>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5">
        <h2 className="font-pixel text-3xl md:text-4xl text-deepGreen mb-12 text-center">
          자주 묻는 질문
        </h2>
        <dl className="space-y-4">
          {FAQ.map((item, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border border-border bg-surface p-5 md:p-6 [&[open]]:bg-cream"
            >
              <summary className="cursor-pointer flex items-center justify-between font-bold text-textPrimary text-base md:text-lg">
                {item.q}
                <span className="text-deepGreen group-open:rotate-45 transition-transform text-xl">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm md:text-base text-textSecondary leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-cream py-12">
      <div className="mx-auto max-w-6xl px-5 flex flex-col md:flex-row justify-between gap-6 text-sm text-textSecondary">
        <div>
          <div className="font-pixel text-base text-deepGreen mb-2">🏃 러닝메이트</div>
          <div className="text-xs text-textMuted">한 걸음마다 꾸미는 러닝</div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
          <Link href="/privacy" className="hover:text-deepGreen">
            개인정보처리방침
          </Link>
          <Link href="/terms" className="hover:text-deepGreen">
            이용약관
          </Link>
          <a href="mailto:runningmate.g1@gmail.com" className="hover:text-deepGreen">
            문의
          </a>
          <span className="text-textMuted">© 2026 RunningMate</span>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-5 mt-6 text-xs text-textMuted leading-relaxed">
        일정 데이터 출처: 마라톤온라인 (roadrun.co.kr) · 정확한 신청은 각 대회 공식 사이트에서 확인해주세요.
        <br />
        본 사이트는 쿠팡 파트너스 활동의 일환으로 일정액의 수수료를 제공받을 수 있습니다.
      </div>
    </footer>
  );
}
