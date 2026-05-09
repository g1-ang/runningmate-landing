import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

/**
 * POST /api/subscribe
 *   body: { email: string }
 *
 * 출시 알림용 이메일 수집. Supabase email_subscribers 테이블에 upsert.
 * 같은 이메일 재등록은 silent no-op (사용자 입장에선 항상 성공).
 *
 * 메일 발송은 별도 — 출시 임박 시 Loops/Resend 같은 정식 transactional
 * 서비스로 옮기거나 SQL Editor 에서 export 해서 일괄 발송.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const email = (body as { email?: string })?.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const userAgent = req.headers.get("user-agent") ?? null;
  const referer = req.headers.get("referer") ?? null;

  const supabase = getServerSupabase();
  if (!supabase) {
    // Supabase 미연결 — Vercel logs 에 남기는 fallback
    console.log(JSON.stringify({
      type: "subscribe",
      email, userAgent, referer,
      at: new Date().toISOString(),
    }));
    return NextResponse.json({ ok: true, persisted: false });
  }

  // upsert: 동일 email 중복 등록은 노출은 silent 성공으로
  const { error } = await supabase
    .from("email_subscribers")
    .upsert(
      {
        email,
        source: "landing-cta",
        user_agent: userAgent,
        referer,
      },
      { onConflict: "email", ignoreDuplicates: true }
    );

  if (error) {
    console.error("[subscribe]", error);
    // 실패해도 사용자 입장 성공으로 (마케팅 funnel 깨지지 않게).
    // 운영자는 logs 에서 추적 가능.
    return NextResponse.json({ ok: true, persisted: false });
  }
  return NextResponse.json({ ok: true, persisted: true });
}
