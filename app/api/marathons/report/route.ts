import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

/**
 * POST /api/marathons/report
 *   body: {
 *     name: string (required),
 *     schedule?: string,
 *     url?: string,
 *     email?: string,
 *     notes?: string
 *   }
 *
 * 제보 한 건을 marathon_reports 테이블에 저장. 운영자가 SQL Editor 에서
 * 검토 후 marathons.json 수동 추가 → 다음 cron / push 에서 반영.
 */

const NAME_MAX = 120;
const TEXT_MAX = 500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/[^\s]+$/i;

function clean(s: unknown, max: number): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim().slice(0, max);
  return t || null;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const name = clean(body.name, NAME_MAX);
  if (!name) {
    return NextResponse.json({ ok: false, error: "name_required" }, { status: 400 });
  }
  const schedule = clean(body.schedule, TEXT_MAX);
  const url = clean(body.url, TEXT_MAX);
  const email = clean(body.email, TEXT_MAX);
  const notes = clean(body.notes, TEXT_MAX);

  if (url && !URL_RE.test(url)) {
    return NextResponse.json({ ok: false, error: "invalid_url" }, { status: 400 });
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    // Supabase 미연결 — Vercel logs 에 남기고 200
    console.log(JSON.stringify({
      type: "marathon_report",
      name, schedule, url, email, notes,
      at: new Date().toISOString(),
    }));
    return NextResponse.json({ ok: true, persisted: false });
  }

  const { error } = await supabase.from("marathon_reports").insert({
    marathon_name: name,
    schedule_text: schedule,
    official_url: url,
    reporter_email: email,
    notes,
  });
  if (error) {
    console.error("[marathon_report]", error);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, persisted: true });
}
