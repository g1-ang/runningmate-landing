import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

/**
 * GET /api/favorites/counts
 *   응답: { counts: { [marathonId]: number }, promotedIDs: string[] }
 *
 * 페이지 로드 시 1회 호출 → 모든 마라톤 카운트 + 추천 ID 한번에. ISR 30s
 * 로 캐싱해서 같은 분 안의 다중 호출은 origin 도달 안 함.
 */

export const revalidate = 30;

export async function GET() {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ counts: {}, promotedIDs: [] });
  }

  const [countsRes, promosRes] = await Promise.all([
    supabase.from("favorite_counts").select("marathon_id, count"),
    supabase.from("promotions").select("marathon_id"),
  ]);

  if (countsRes.error) console.error("[counts]", countsRes.error);
  if (promosRes.error) console.error("[promos]", promosRes.error);

  const counts: Record<string, number> = {};
  for (const row of countsRes.data ?? []) {
    counts[row.marathon_id as string] = Number(row.count ?? 0);
  }
  const promotedIDs = (promosRes.data ?? []).map(
    (r) => r.marathon_id as string
  );

  return NextResponse.json({ counts, promotedIDs });
}
