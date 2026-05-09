"use client";

import { useState } from "react";

type Props = {
  value: number;
  onChange?: (n: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
};

const SIZE_CLASS = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
};

/**
 * 1~5 별점. readOnly 모드는 표시만, 그 외에는 클릭으로 선택.
 * 호버 시 부드러운 프리뷰 (interactive).
 */
export function StarRating({ value, onChange, size = "md", readOnly }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div
      className={`inline-flex gap-0.5 ${SIZE_CLASS[size]}`}
      onMouseLeave={() => setHover(null)}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={`별점 ${value} / 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => !readOnly && onChange?.(n)}
          onMouseEnter={() => !readOnly && setHover(n)}
          disabled={readOnly}
          className={`leading-none transition ${
            n <= display ? "text-[#F0B400]" : "text-textMuted/30"
          } ${readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
          aria-label={`${n}점`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
