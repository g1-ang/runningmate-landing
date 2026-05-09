import type { Metadata } from "next";
import { fetchMarathons } from "@/lib/marathons";
import { SITE_URL } from "@/lib/site";
import { CalendarClient } from "./CalendarClient";

export const metadata: Metadata = {
  title: "마라톤 달력",
  description:
    "전국 180+ 마라톤 일정을 한눈에. 지역·코스·신청 상태 필터, 찜·인기순 정렬, 매주 자동 갱신.",
  alternates: { canonical: `${SITE_URL}/calendar` },
  openGraph: {
    title: "전국 마라톤 달력 · 러닝메이트",
    description: "지역·코스·신청 상태로 필터링. 매주 일요일 자동 갱신.",
    url: `${SITE_URL}/calendar`,
    type: "website",
  },
};

export default async function CalendarPage() {
  const catalog = await fetchMarathons();
  return (
    <>
      <CalendarClient marathons={catalog.marathons} generatedAt={catalog.generatedAt} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": catalog.marathons.slice(0, 50).map((m) => ({
              "@type": "SportsEvent",
              name: m.name,
              startDate: m.raceDate,
              location: {
                "@type": "Place",
                name: m.venue || `${m.region} (장소 미정)`,
                address: { "@type": "PostalAddress", addressRegion: m.region, addressCountry: "KR" },
              },
              organizer: m.organizer ? { "@type": "Organization", name: m.organizer } : undefined,
              url: m.officialURL || undefined,
              description: `${m.courses.join(", ")} · 신청 ${m.registrationOpenDate.slice(0, 10)} ~ ${m.registrationCloseDate.slice(0, 10)}`,
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            })),
          }),
        }}
      />
    </>
  );
}
