import { NextResponse } from "next/server";

/**
 * 출시 알림 이메일 수집 endpoint.
 *
 * V1: 단순히 구조 검증 후 console.log + 200 응답. Vercel runtime log 에서
 * 본인이 수동으로 확인. 트래픽 늘면 Loops/Resend 등 정식 서비스로 swap.
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

  // V1: Vercel Functions log 에 남기기. 이메일 수집 정식 서비스 연동 전
  // 단순한 capture 매커니즘.
  console.log(JSON.stringify({
    type: "subscribe",
    email,
    at: new Date().toISOString(),
    ua: req.headers.get("user-agent") ?? null,
    ref: req.headers.get("referer") ?? null,
  }));

  return NextResponse.json({ ok: true });
}
