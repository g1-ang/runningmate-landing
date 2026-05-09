"use client";

import { useCallback, useEffect, useState } from "react";
import { getOrCreateAnonId } from "./anonId";

export type ReviewSummary = { rating: number; count: number };

export type ReviewItem = {
  userTag: string;
  rating: number;
  body: string;
  updatedAt: string;
};

export type MyReview = { rating: number; body: string; updatedAt: string };

type Data = {
  summary: ReviewSummary | null;
  mine: MyReview | null;
  recent: ReviewItem[];
};

const EMPTY: Data = { summary: null, mine: null, recent: [] };

/**
 * 마라톤 리뷰 hook — 마운트 시 본인 + 최근 + 집계 fetch.
 * submit/remove 후 자동 refetch.
 */
export function useReviews(marathonId: string | null) {
  const [data, setData] = useState<Data>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  const refetch = useCallback(async () => {
    if (!marathonId) {
      setData(EMPTY);
      setLoaded(true);
      return;
    }
    const userId = getOrCreateAnonId();
    const url = `/api/reviews?marathonId=${encodeURIComponent(marathonId)}${userId ? `&userId=${userId}` : ""}`;
    try {
      const res = await fetch(url, { cache: "no-store" });
      const json = (await res.json()) as Data;
      setData({
        summary: json.summary ?? null,
        mine: json.mine ?? null,
        recent: json.recent ?? [],
      });
    } catch {
      setData(EMPTY);
    }
    setLoaded(true);
  }, [marathonId]);

  useEffect(() => {
    setLoaded(false);
    void refetch();
  }, [refetch]);

  const submit = useCallback(
    async (rating: number, body: string): Promise<boolean> => {
      if (!marathonId) return false;
      const userId = getOrCreateAnonId();
      if (!userId) return false;
      try {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ marathonId, userId, rating, body }),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) return false;
        await refetch();
        return true;
      } catch {
        return false;
      }
    },
    [marathonId, refetch]
  );

  const remove = useCallback(async (): Promise<boolean> => {
    if (!marathonId) return false;
    const userId = getOrCreateAnonId();
    if (!userId) return false;
    try {
      const res = await fetch(
        `/api/reviews?marathonId=${encodeURIComponent(marathonId)}&userId=${userId}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (!res.ok || !json.ok) return false;
      await refetch();
      return true;
    } catch {
      return false;
    }
  }, [marathonId, refetch]);

  return { ...data, loaded, submit, remove };
}
