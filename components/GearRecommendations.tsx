"use client";

import {
  type AffiliateProduct,
  COUPANG_DISCLOSURE,
  coupangSearchURL,
  recommendProducts,
} from "@/lib/affiliate";
import type { Course } from "@/lib/marathons";

type Props = {
  courses: Course[];
};

/**
 * 마라톤 상세 모달 하단에 노출되는 추천 장비 섹션.
 * 코스별 매칭 상품 + 공통 상품 최대 6개. 클릭 → 새 탭으로 쿠팡 검색.
 */
export function GearRecommendations({ courses }: Props) {
  const products = recommendProducts(courses);
  if (products.length === 0) return null;

  return (
    <section>
      <h3 className="text-xs font-bold text-textMuted mb-3 flex items-center gap-2">
        🛒 추천 장비
        <span className="text-[10px] font-normal text-textMuted/70">
          쿠팡 파트너스
        </span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <p className="text-[10px] text-textMuted/80 mt-3 leading-relaxed">
        {COUPANG_DISCLOSURE}
      </p>
    </section>
  );
}

function ProductCard({ product }: { product: AffiliateProduct }) {
  return (
    <a
      href={coupangSearchURL(product.searchQuery)}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group rounded-xl border border-border bg-surface p-3 hover:border-deepGreen/40 hover:shadow-sm transition flex items-start gap-2"
    >
      <span className="text-2xl shrink-0" aria-hidden="true">
        {product.emoji}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-xs text-textPrimary truncate">
          {product.name}
        </div>
        <div className="text-[10px] text-textMuted leading-tight mt-0.5 line-clamp-2">
          {product.description}
        </div>
        <div className="text-[10px] text-deepGreen font-bold mt-1 group-hover:underline">
          쿠팡에서 보기 →
        </div>
      </div>
    </a>
  );
}
