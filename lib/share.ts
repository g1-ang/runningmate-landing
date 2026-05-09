import type { Marathon } from "./marathons";
import { formatKoreanDate } from "./marathons";

/**
 * 마라톤 공유 — Web Share API (모바일) 또는 클립보드 복사 (데스크톱) fallback.
 * 반환: 사용자에게 보여줄 토스트 메시지 (또는 null = 사용자 취소)
 */
export async function shareMarathon(m: Marathon): Promise<string | null> {
  const url = `${window.location.origin}/marathon/${m.id}`;
  const title = m.name;
  const text = `${m.name} · ${formatKoreanDate(m.raceDate)} · ${m.region}`;

  // 모바일: 시스템 공유 시트 (카톡·메시지·기타 앱 선택 가능)
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await navigator.share({ title, text, url });
      return null; // 사용자 작업 진행 — 별도 토스트 없음
    } catch (err) {
      // AbortError = 사용자 취소, 무시
      if ((err as Error).name === "AbortError") return null;
      // 그 외 실패는 클립보드 fallback 으로
    }
  }

  // 데스크톱 / Web Share 미지원: 클립보드 복사
  try {
    await navigator.clipboard.writeText(url);
    return "링크가 복사됐어요. 카톡에 붙여넣으세요.";
  } catch {
    return "링크 복사에 실패했어요. 주소창에서 복사해주세요.";
  }
}
