"use client";

import { useEffect, useState } from "react";

type CountsResponse = {
  counts: Record<string, number>;
  promotedIDs: string[];
};

/**
 * 마라톤별 찜 카운트 + 추천 마라톤 ID 를 서버에서 한 번 fetch.
 * 실패하거나 Supabase 미연결이면 빈 데이터 반환 (앱 깨지지 않음).
 */
export function useFavoriteCounts() {
  const [data, setData] = useState<CountsResponse>({ counts: {}, promotedIDs: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/favorites/counts")
      .then((r) => r.json() as Promise<CountsResponse>)
      .then((res) => {
        if (cancelled) return;
        setData({
          counts: res.counts ?? {},
          promotedIDs: res.promotedIDs ?? [],
        });
        setLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const countsMap = new Map(Object.entries(data.counts));
  const promotedSet = new Set(data.promotedIDs);
  return { countsMap, promotedSet, loaded };
}
