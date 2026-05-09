import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GearRecommendations } from "@/components/GearRecommendations";
import { MapLinks } from "@/components/MapLinks";
import {
  dDayLabel,
  fetchMarathons,
  formatKoreanDate,
  formatKoreanDateRange,
  statusColorClass,
  statusLabel,
  statusOf,
} from "@/lib/marathons";
import { SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const catalog = await fetchMarathons();
  const m = catalog.marathons.find((x) => x.id === id);
  if (!m) {
    return { title: "마라톤을 찾을 수 없어요" };
  }
  const dateStr = formatKoreanDate(m.raceDate);
  const description = `${dateStr} · ${m.region}${m.venue ? ` · ${m.venue}` : ""} · ${m.courses.join(", ")}`;
  const url = `${SITE_URL}/marathon/${m.id}`;
  return {
    title: m.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${m.name} · 러닝메이트`,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${m.name} · 러닝메이트`,
      description,
    },
  };
}

export default async function MarathonPage({ params }: Props) {
  const { id } = await params;
  const catalog = await fetchMarathons();
  const m = catalog.marathons.find((x) => x.id === id);
  if (!m) notFound();

  const status = statusOf(m);
  const dDay = dDayLabel(m.raceDate);

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
            href="/calendar"
            className="text-xs md:text-sm font-bold text-deepGreen hover:underline"
          >
            ← 마라톤 달력으로
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-5 py-8 md:py-12 space-y-8">
        <header>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusColorClass(status)}`}>
              {statusLabel(status)}
            </span>
            <span className="inline-block rounded-full bg-pastelLilac text-[#5C2DAA] px-2.5 py-0.5 text-[10px] font-bold">
              {m.region}
            </span>
            <span className="text-deepGreen font-pixel text-sm">{dDay}</span>
          </div>
          <h1 className="font-pixel text-2xl md:text-3xl text-textPrimary leading-snug">
            {m.name}
          </h1>
        </header>

        <section>
          <h2 className="text-xs font-bold text-textMuted mb-3">코스</h2>
          <div className="flex flex-wrap gap-2">
            {m.courses.map((c) => (
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
          <h2 className="text-xs font-bold text-textMuted mb-3">일정</h2>
          <ul className="space-y-2 text-sm">
            <ScheduleRow color="bg-pastelSky" label="신청 접수" value={formatKoreanDateRange(m.registrationOpenDate, m.registrationCloseDate)} />
            <ScheduleRow color="bg-pastelLilac" label="발표" value={formatKoreanDate(m.announcementDate)} />
            <ScheduleRow color="bg-pastelPink" label="대회일" value={formatKoreanDate(m.raceDate)} highlight />
          </ul>
        </section>

        <section>
          <h2 className="text-xs font-bold text-textMuted mb-3">상세</h2>
          <dl className="space-y-2 text-sm">
            <DetailRow label="장소" value={m.venue || "미정"} />
            <DetailRow label="주최" value={m.organizer || "—"} />
            <DetailRow label="참가비" value={m.entryFee || "—"} />
          </dl>
        </section>

        {m.venue && <MapLinks venue={m.venue} />}

        <a
          href={m.officialURL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-5 py-4 rounded-xl bg-deepGreen text-ivory text-sm font-bold hover:opacity-90 transition"
        >
          공식 사이트에서 신청 →
        </a>

        <p className="text-xs text-textMuted leading-relaxed">
          ※ 일정 데이터는 마라톤온라인(roadrun.co.kr)에서 자동 수집된 정보입니다.
          정확한 신청·참가비·일정은 반드시 위 공식 사이트에서 확인해주세요.
        </p>

        <div className="border-t border-border pt-8">
          <GearRecommendations courses={m.courses} />
        </div>
      </article>

      <footer className="border-t border-border bg-cream py-10 mt-8">
        <div className="mx-auto max-w-3xl px-5 text-xs text-textMuted text-center">
          <Link
            href="/calendar"
            className="inline-block mb-3 px-4 py-2 rounded-xl border border-border bg-ivory text-deepGreen font-bold hover:border-deepGreen"
          >
            📅 다른 마라톤 보기
          </Link>
          <p>© 2026 RunningMate · 일정 출처: 마라톤온라인 (roadrun.co.kr)</p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            name: m.name,
            startDate: m.raceDate,
            location: {
              "@type": "Place",
              name: m.venue || `${m.region} (장소 미정)`,
              address: { "@type": "PostalAddress", addressRegion: m.region, addressCountry: "KR" },
            },
            organizer: m.organizer ? { "@type": "Organization", name: m.organizer } : undefined,
            url: m.officialURL || `${SITE_URL}/marathon/${m.id}`,
            description: `${m.courses.join(", ")} · 신청 ${m.registrationOpenDate.slice(0, 10)} ~ ${m.registrationCloseDate.slice(0, 10)}`,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          }),
        }}
      />
    </main>
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
