"use client";

import Link from "next/link";
import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function EmailSignupForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting" || !consent) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "submit_failed");
      setStatus("success");
      setMessage("등록 완료! 출시 직전에 메일 드릴게요.");
      setEmail("");
      setConsent(false);
    } catch (err) {
      setStatus("error");
      const code = (err as Error).message;
      setMessage(
        code === "invalid_email"
          ? "이메일 형식을 확인해주세요."
          : "잠시 후 다시 시도해주세요."
      );
    }
  }

  const disabled = status === "submitting" || !email || !consent;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="이메일을 남기면 출시 시 알려드려요"
          aria-label="이메일"
          className="flex-1 rounded-xl border border-border bg-surface px-4 py-3.5 text-sm focus:outline-none focus:border-deepGreen focus:ring-2 focus:ring-deepGreen/20"
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-xl bg-deepGreen text-ivory px-6 py-3.5 text-sm font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "등록 중…" : "알림 받기"}
        </button>
      </div>
      <label className="flex items-start gap-2 max-w-lg cursor-pointer text-xs text-textSecondary leading-relaxed">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 rounded border-border text-deepGreen focus:ring-deepGreen shrink-0 cursor-pointer"
          aria-label="개인정보 수집·이용 동의"
        />
        <span>
          출시 알림 발송을 위한 이메일 수집·이용에 동의합니다.{" "}
          <Link
            href="/privacy"
            target="_blank"
            className="text-deepGreen underline hover:opacity-80"
          >
            개인정보처리방침
          </Link>
        </span>
      </label>
      <p
        className={`text-xs ${
          status === "success"
            ? "text-deepGreen"
            : status === "error"
            ? "text-[#B01760]"
            : "text-textMuted"
        }`}
      >
        {message ||
          "출시 알림 1회 발송 후 30일 이내 파기. 광고·제3자 제공 없음."}
      </p>
    </form>
  );
}
