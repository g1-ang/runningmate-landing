"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function EmailSignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

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

  const disabled = status === "submitting" || !email;

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
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
          className="flex-1 rounded-xl border border-border bg-surface px-4 py-3.5 text-sm focus:outline-none focus:border-deepGreen"
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-xl bg-deepGreen text-ivory px-6 py-3.5 text-sm font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "등록 중…" : "알림 받기"}
        </button>
      </div>
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
          "메일 주소만 받고 출시 알림 외에는 사용하지 않아요. 광고도 안 보냅니다."}
      </p>
    </form>
  );
}
