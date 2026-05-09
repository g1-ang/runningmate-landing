import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

/**
 * POST /api/favorites
 *   body: { marathonId: string, userId: string, action: "add" | "remove" }
 *
 * 익명 user_id 와 marathon_id 의 조합으로 unique row. 같은 사용자가
 * 여러 번 add 해도 UPSERT 로 1건만 남고 dedup 됨.
 */

const BODY_RE = {
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
};

export async function POST(req: Request) {
  let body: { marathonId?: string; userId?: string; action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const marathonId = body.marathonId?.trim();
  const userId = body.userId?.trim();
  const action = body.action;

  if (!marathonId || !userId || !BODY_RE.uuid.test(userId)) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }
  if (action !== "add" && action !== "remove") {
    return NextResponse.json({ ok: false, error: "invalid_action" }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    // Supabase 미연결 — 클라이언트는 LocalStorage 만으로 동작 가능하니
    // 200 응답 후 silent skip. 라이브화 되면 이후 호출부터 정상 적재.
    return NextResponse.json({ ok: true, persisted: false });
  }

  if (action === "add") {
    const { error } = await supabase
      .from("favorites")
      .upsert(
        { user_id: userId, marathon_id: marathonId },
        { onConflict: "user_id,marathon_id" }
      );
    if (error) {
      console.error("[favorites add]", error);
      return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
    }
  } else {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("marathon_id", marathonId);
    if (error) {
      console.error("[favorites remove]", error);
      return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, persisted: true });
}
