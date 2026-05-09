import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

/**
 * 리뷰 API.
 *
 * GET  /api/reviews?marathonId=...&userId=...
 *      응답: { summary: { rating, count }, mine, recent: Review[] }
 *
 * POST /api/reviews { marathonId, userId, rating (1-5), body? }
 *      upsert. 같은 (user, marathon) 두 번째 → 덮어쓰기.
 *
 * DELETE /api/reviews?marathonId=...&userId=...
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const BODY_MAX = 500;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const marathonId = url.searchParams.get("marathonId")?.trim();
  const userId = url.searchParams.get("userId")?.trim();
  if (!marathonId) {
    return NextResponse.json({ ok: false, error: "marathon_id_required" }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({
      summary: null,
      mine: null,
      recent: [],
    });
  }

  const [summaryRes, mineRes, recentRes] = await Promise.all([
    supabase
      .from("marathon_review_summary")
      .select("review_count, average_rating")
      .eq("marathon_id", marathonId)
      .maybeSingle(),
    userId && UUID_RE.test(userId)
      ? supabase
          .from("marathon_reviews")
          .select("rating, body, updated_at")
          .eq("marathon_id", marathonId)
          .eq("user_id", userId)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("marathon_reviews")
      .select("user_id, rating, body, created_at, updated_at")
      .eq("marathon_id", marathonId)
      .order("updated_at", { ascending: false })
      .limit(20),
  ]);

  if (summaryRes.error) console.error("[reviews summary]", summaryRes.error);
  if (mineRes.error) console.error("[reviews mine]", mineRes.error);
  if (recentRes.error) console.error("[reviews recent]", recentRes.error);

  return NextResponse.json({
    summary: summaryRes.data
      ? {
          count: summaryRes.data.review_count ?? 0,
          rating: summaryRes.data.average_rating ?? 0,
        }
      : null,
    mine: mineRes.data
      ? { rating: mineRes.data.rating, body: mineRes.data.body, updatedAt: mineRes.data.updated_at }
      : null,
    recent: (recentRes.data ?? []).map((r) => ({
      userTag: shortTag(r.user_id as string),
      rating: r.rating as number,
      body: (r.body as string) ?? "",
      updatedAt: r.updated_at as string,
    })),
  });
}

export async function POST(req: Request) {
  let body: { marathonId?: string; userId?: string; rating?: number; body?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const marathonId = body.marathonId?.trim();
  const userId = body.userId?.trim();
  const rating = body.rating;
  const reviewBody = (body.body ?? "").trim().slice(0, BODY_MAX) || null;

  if (!marathonId || !userId || !UUID_RE.test(userId)) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating! < 1 || rating! > 5) {
    return NextResponse.json({ ok: false, error: "invalid_rating" }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  const { error } = await supabase
    .from("marathon_reviews")
    .upsert(
      {
        user_id: userId,
        marathon_id: marathonId,
        rating,
        body: reviewBody,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,marathon_id" }
    );
  if (error) {
    console.error("[reviews post]", error);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, persisted: true });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const marathonId = url.searchParams.get("marathonId")?.trim();
  const userId = url.searchParams.get("userId")?.trim();
  if (!marathonId || !userId || !UUID_RE.test(userId)) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ ok: true, persisted: false });

  const { error } = await supabase
    .from("marathon_reviews")
    .delete()
    .eq("user_id", userId)
    .eq("marathon_id", marathonId);
  if (error) {
    console.error("[reviews delete]", error);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, persisted: true });
}

/**
 * 익명 user_id 의 마지막 6자리를 태그로 노출. PII 0, 동일 사람의 여러
 * 리뷰는 같은 태그로 보임.
 */
function shortTag(uuid: string): string {
  return `러너#${uuid.replace(/-/g, "").slice(-6)}`;
}
