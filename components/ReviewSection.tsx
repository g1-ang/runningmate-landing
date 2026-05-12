"use client";

import { useEffect, useState } from "react";
import { useReviews, type ReviewItem } from "@/lib/useReviews";
import { StarRating } from "./StarRating";

type Props = {
  marathonId: string;
};

const BODY_MAX = 500;

/**
 * 마라톤 리뷰 + 별점 섹션. 본인 별점 입력 + 다른 사람 리뷰 list + 평균.
 */
export function ReviewSection({ marathonId }: Props) {
  const { summary, mine, recent, loaded, submit, remove } = useReviews(marathonId);
  const [draftRating, setDraftRating] = useState(0);
  const [draftBody, setDraftBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // mine 변경 시 draft 동기화
  useEffect(() => {
    if (mine) {
      setDraftRating(mine.rating);
      setDraftBody(mine.body ?? "");
    } else {
      setDraftRating(0);
      setDraftBody("");
    }
  }, [mine]);

  async function handleSubmit() {
    if (draftRating < 1) {
      setMessage("별점을 1~5 사이로 선택해주세요.");
      return;
    }
    setSubmitting(true);
    setMessage(null);
    const ok = await submit(draftRating, draftBody);
    setSubmitting(false);
    setMessage(ok ? "저장됐어요. 다른 러너들에게 도움이 될 거예요!" : "저장에 실패했어요. 잠시 후 다시 시도해주세요.");
  }

  async function handleRemove() {
    if (!confirm("내 리뷰를 삭제할까요?")) return;
    setSubmitting(true);
    const ok = await remove();
    setSubmitting(false);
    setMessage(ok ? "리뷰가 삭제됐어요." : "삭제에 실패했어요.");
  }

  return (
    <section>
      <h3 className="text-xs font-bold text-textMuted mb-3 flex items-center gap-2">
        ⭐ 러너 리뷰
        {summary && summary.count > 0 && (
          <span className="text-[11px] font-normal text-textMuted/70">
            평균 ★ {summary.rating.toFixed(1)} · {summary.count}명
          </span>
        )}
      </h3>

      {/* 본인 입력 */}
      <div className="rounded-xl border border-border bg-surface p-4 mb-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <span className="text-xs font-bold text-textSecondary">
            {mine ? "내 리뷰 (수정 가능)" : "별점 남기기"}
          </span>
          <StarRating value={draftRating} onChange={setDraftRating} size="md" />
        </div>
        <textarea
          value={draftBody}
          onChange={(e) => setDraftBody(e.target.value.slice(0, BODY_MAX))}
          placeholder="한 줄 후기 (선택) — 코스·운영·분위기 등"
          rows={2}
          aria-label="후기 입력"
          className="w-full rounded-lg border border-border bg-ivory px-3 py-2 text-sm focus:outline-none focus:border-deepGreen focus:ring-2 focus:ring-deepGreen/20 resize-none"
        />
        <div className="flex items-center justify-between mt-2 gap-2">
          <span className="text-[10px] text-textMuted">
            {draftBody.length} / {BODY_MAX}
          </span>
          <div className="flex gap-2">
            {mine && (
              <button
                onClick={handleRemove}
                disabled={submitting}
                className="px-3 py-2 rounded-lg text-xs font-bold border border-border text-textMuted hover:border-[#B01760] hover:text-[#B01760] transition disabled:opacity-50"
              >
                삭제
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={submitting || draftRating < 1}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-deepGreen text-ivory hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "저장 중…" : mine ? "수정" : "남기기"}
            </button>
          </div>
        </div>
        {message && (
          <p className="text-[11px] text-deepGreen mt-2">{message}</p>
        )}
      </div>

      {/* 다른 리뷰 list */}
      {!loaded ? (
        <p className="text-xs text-textMuted text-center py-4">불러오는 중…</p>
      ) : recent.length === 0 ? (
        <p className="text-xs text-textMuted text-center py-4">
          아직 리뷰가 없어요. 첫 리뷰를 남겨보세요!
        </p>
      ) : (
        <ul className="space-y-2">
          {recent.map((r, idx) => (
            <ReviewRow key={`${r.userTag}-${idx}`} review={r} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ReviewRow({ review }: { review: ReviewItem }) {
  return (
    <li className="rounded-xl border border-border bg-surface p-3">
      <div className="flex items-center justify-between gap-2 mb-1">
        <StarRating value={review.rating} size="sm" readOnly />
        <span className="text-[10px] text-textMuted">
          {review.userTag} · {timeAgo(review.updatedAt)}
        </span>
      </div>
      {review.body && (
        <p className="text-xs text-textSecondary leading-relaxed mt-1">
          {review.body}
        </p>
      )}
    </li>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}일 전`;
  if (d < 30) return `${Math.floor(d / 7)}주 전`;
  if (d < 365) return `${Math.floor(d / 30)}개월 전`;
  return `${Math.floor(d / 365)}년 전`;
}
