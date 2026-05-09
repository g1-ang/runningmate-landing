"use client";

import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

type Status = "idle" | "submitting" | "success" | "error";

export function ReportModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  function reset() {
    setName("");
    setSchedule("");
    setUrl("");
    setEmail("");
    setNotes("");
    setStatus("idle");
    setMessage("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    if (!name.trim()) {
      setStatus("error");
      setMessage("대회명을 입력해주세요.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/marathons/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, schedule, url, email, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "submit_failed");
      setStatus("success");
      setMessage("제보 감사합니다! 검토 후 추가하겠습니다.");
    } catch (err) {
      setStatus("error");
      const code = (err as Error).message;
      setMessage(
        code === "invalid_url"
          ? "URL 형식을 확인해주세요 (http:// 또는 https://)"
          : code === "invalid_email"
          ? "이메일 형식을 확인해주세요."
          : "잠시 후 다시 시도해주세요."
      );
    }
  }

  function handleClose() {
    onClose();
    // 닫을 때 success 상태 잠시 후 리셋 (다음 열림 깨끗)
    setTimeout(reset, 300);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-lg bg-ivory rounded-t-3xl md:rounded-3xl border border-border max-h-[92vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-ivory/95 backdrop-blur z-10 px-6 pt-5 pb-4 border-b border-border flex items-center justify-between gap-3">
          <h2 className="font-pixel text-lg md:text-xl text-deepGreen">
            🙋 빠진 대회 제보
          </h2>
          <button
            onClick={handleClose}
            aria-label="닫기"
            className="shrink-0 size-9 rounded-full border border-border text-textMuted hover:bg-surface text-lg"
          >
            ✕
          </button>
        </div>

        {status === "success" ? (
          <div className="px-6 py-12 text-center space-y-3">
            <div className="text-5xl">🎉</div>
            <p className="font-pixel text-base text-deepGreen">
              {message}
            </p>
            <p className="text-xs text-textMuted">
              검토 후 다음 갱신 (매주 일요일) 에서 추가됩니다.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-5 py-3 rounded-xl bg-deepGreen text-ivory text-sm font-bold hover:opacity-90"
            >
              닫기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <Field
              label="대회명"
              required
              placeholder="예: 2026 서울마라톤"
              value={name}
              onChange={setName}
            />
            <Field
              label="일정"
              placeholder="예: 2026년 11월 1일 또는 신청 4/1~4/30"
              value={schedule}
              onChange={setSchedule}
            />
            <Field
              label="공식 사이트 URL"
              placeholder="https://..."
              type="url"
              value={url}
              onChange={setUrl}
            />
            <Field
              label="회신 메일 (선택)"
              placeholder="등록 알림 받고 싶으면 입력"
              type="email"
              value={email}
              onChange={setEmail}
            />
            <Textarea
              label="추가 정보"
              placeholder="장소, 코스, 주최 등 알고 있는 정보"
              value={notes}
              onChange={setNotes}
            />

            {status === "error" && (
              <p className="text-xs text-[#B01760] font-bold">{message}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-5 py-3 rounded-xl border border-border bg-ivory text-textSecondary text-sm font-bold hover:border-deepGreen"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={status === "submitting" || !name.trim()}
                className="flex-1 px-5 py-3 rounded-xl bg-deepGreen text-ivory text-sm font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? "전송 중…" : "제보 보내기"}
              </button>
            </div>
            <p className="text-[11px] text-textMuted leading-relaxed">
              제보된 정보는 운영자가 검토하여 마라톤 데이터에 반영됩니다.
              개인 메일은 회신 외 용도로 사용되지 않아요.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "url" | "email";
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-textSecondary mb-1 block">
        {label}
        {required && <span className="text-[#B01760] ml-1">*</span>}
      </span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:outline-none focus:border-deepGreen"
      />
    </label>
  );
}

function Textarea({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-textSecondary mb-1 block">{label}</span>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:outline-none focus:border-deepGreen resize-none"
      />
    </label>
  );
}
