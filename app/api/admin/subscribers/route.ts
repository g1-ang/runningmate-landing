import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

/**
 * GET /api/admin/subscribers?key=<ADMIN_API_KEY>&format=csv
 *
 * 출시 알림 발송용 이메일 구독자 export.
 * 환경변수 ADMIN_API_KEY 와 동일한 key 쿼리만 허용 (timing-safe 비교).
 *
 * 결과 (CSV):
 *   email,source,created_at
 *   alice@example.com,landing-cta,2026-04-21T03:21:00.000Z
 *   ...
 *
 * BCC 일괄 발송 시 Gmail 작성창에 "email" 열만 추출해 붙여넣기.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function csvEscape(v: string | null | undefined): string {
  if (v == null) return "";
  const needs = /[",\n\r]/.test(v);
  const escaped = v.replace(/"/g, '""');
  return needs ? `"${escaped}"` : escaped;
}

export async function GET(req: Request) {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "admin_key_not_configured" },
      { status: 500 }
    );
  }

  const url = new URL(req.url);
  const provided = url.searchParams.get("key") ?? "";
  if (!timingSafeEqual(provided, expected)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("email_subscribers")
    .select("email, source, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[admin/subscribers]", error);
    return NextResponse.json(
      { ok: false, error: "query_failed" },
      { status: 500 }
    );
  }

  const format = (url.searchParams.get("format") ?? "csv").toLowerCase();
  const rows = data ?? [];

  if (format === "bcc") {
    // BCC 붙여넣기 전용 — 이메일만 콤마로
    const body = rows.map((r) => r.email).join(", ");
    return new Response(body, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  if (format === "json") {
    return NextResponse.json({ ok: true, count: rows.length, rows });
  }

  // 기본: CSV
  const header = "email,source,created_at\n";
  const csv =
    header +
    rows
      .map(
        (r) =>
          `${csvEscape(r.email)},${csvEscape(r.source)},${csvEscape(r.created_at)}`
      )
      .join("\n") +
    "\n";

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="runningmate-subscribers-${stamp}.csv"`,
      "cache-control": "no-store",
    },
  });
}
