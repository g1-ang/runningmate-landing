import type { MetadataRoute } from "next";
import { fetchMarathons } from "@/lib/marathons";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const out: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/calendar`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/stats`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 마라톤 개별 페이지도 sitemap 에 포함 → Google 인덱싱
  try {
    const catalog = await fetchMarathons();
    for (const m of catalog.marathons) {
      out.push({
        url: `${SITE_URL}/marathon/${m.id}`,
        lastModified: new Date(catalog.generatedAt),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  } catch {
    // fetch 실패 시 root + calendar 만 있는 sitemap 반환 (안전)
  }

  return out;
}
