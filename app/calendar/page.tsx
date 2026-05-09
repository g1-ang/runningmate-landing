import { fetchMarathons } from "@/lib/marathons";
import { CalendarClient } from "./CalendarClient";

export const metadata = {
  title: "마라톤 달력 — 러닝메이트",
  description: "전국 180+ 마라톤 일정을 한눈에. 지역·코스·신청 상태로 필터링하고 찜해두세요.",
};

export default async function CalendarPage() {
  const catalog = await fetchMarathons();
  return <CalendarClient marathons={catalog.marathons} generatedAt={catalog.generatedAt} />;
}
