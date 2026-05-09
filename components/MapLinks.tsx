"use client";

import {
  googleMapsSearchURL,
  kakaoMapSearchURL,
  naverMapSearchURL,
} from "@/lib/maps";

type Props = {
  venue: string;
};

/**
 * Marathon detail 의 지도 섹션. venue 텍스트를 네이버맵·카카오맵·구글맵
 * 검색으로 보내는 외부 링크 3종. 모바일에선 OS 가 설치된 지도 앱으로
 * 라우팅, 데스크톱에선 새 탭으로 웹 지도 열림.
 */
export function MapLinks({ venue }: Props) {
  if (!venue) return null;
  return (
    <section>
      <h3 className="text-xs font-bold text-textMuted mb-3">📍 위치 찾아가기</h3>
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="text-sm font-bold text-textPrimary mb-3">{venue}</div>
        <div className="grid grid-cols-3 gap-2">
          <MapButton href={naverMapSearchURL(venue)} label="네이버지도" emoji="🟢" />
          <MapButton href={kakaoMapSearchURL(venue)} label="카카오맵" emoji="🟡" />
          <MapButton href={googleMapsSearchURL(venue)} label="구글맵" emoji="🔵" />
        </div>
      </div>
    </section>
  );
}

function MapButton({
  href,
  label,
  emoji,
}: {
  href: string;
  label: string;
  emoji: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center gap-1 rounded-lg border border-border bg-ivory p-3 hover:border-deepGreen/40 hover:bg-pastelLime/30 transition"
    >
      <span className="text-base" aria-hidden="true">{emoji}</span>
      <span className="text-[11px] font-bold text-textPrimary">{label}</span>
    </a>
  );
}
