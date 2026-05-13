import { fetchMarathons, formatKoreanDate, formatKoreanDateRange, statusLabel, statusOf } from "@/lib/marathons";
import { SITE_URL } from "@/lib/site";

/**
 * GET /rss.xml — RSS 2.0 feed.
 *
 * 다가오는 대회 50개 (대회일 가까운 순). 러닝 블로그·feed reader·
 * Google News 등에서 자동 픽업되는 publishing 표준. 새 마라톤 데이터는
 * 매주 일요일 갱신되므로 1시간 ISR 로 충분.
 */

export const revalidate = 3600;

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const catalog = await fetchMarathons();
  const now = new Date();

  const upcoming = catalog.marathons
    .filter((m) => statusOf(m, now) !== "finished")
    .sort((a, b) => a.raceDate.localeCompare(b.raceDate))
    .slice(0, 50);

  const items = upcoming
    .map((m) => {
      const url = `${SITE_URL}/marathon/${m.id}`;
      const dateStr = formatKoreanDate(m.raceDate);
      const status = statusOf(m, now);
      const desc = [
        `${dateStr} · ${m.region}${m.venue ? " · " + m.venue : ""}`,
        `코스: ${m.courses.join(", ")}`,
        `상태: ${statusLabel(status)}`,
        `신청: ${formatKoreanDateRange(m.registrationOpenDate, m.registrationCloseDate)}`,
      ].join(" / ");

      return `    <item>
      <title>${escape(m.name)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(m.raceDate).toUTCString()}</pubDate>
      <description>${escape(desc)}</description>
      <category>${escape(m.region)}</category>
    </item>`;
    })
    .join("\n");

  const updated = new Date().toUTCString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>러닝메이트 — 2026 마라톤 일정</title>
    <link>${SITE_URL}</link>
    <description>전국 마라톤 대회 일정. 매주 일요일 자동 갱신.</description>
    <language>ko-KR</language>
    <lastBuildDate>${updated}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=600, s-maxage=3600",
    },
  });
}
