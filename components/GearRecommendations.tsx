"use client";

import {
  type AffiliateProduct,
  COUPANG_DISCLOSURE,
  type RecommendationContext,
  badgeFor,
  coupangSearchURL,
  recommendProducts,
  seasonLabel,
  seasonOf,
} from "@/lib/affiliate";
import type { Course } from "@/lib/marathons";

type Props = {
  courses: Course[];
  raceDate: string;
};

/**
 * 마라톤 상세 모달·페이지에서 코스 + 시즌 기반 큐레이션. 카드마다
 * "여름 추천" / "Half 추천" 같은 매칭 배지 + 가격대.
 */
export function GearRecommendations({ courses, raceDate }: Props) {
  const ctx: RecommendationContext = {
    courses,
    season: seasonOf(new Date(raceDate)),
  };
  const products = recommendProducts(ctx);
  if (products.length === 0) return null;

  return (
    <section>
      <h3 className="text-xs font-bold text-textMuted mb-1 flex items-center gap-2">
        🛒 추천 장비
        <span className="text-[10px] font-normal text-textMuted/70">
          쿠팡 파트너스
        </span>
      </h3>
      <p className="text-[11px] text-textMuted/80 mb-3">
        {seasonLabel(ctx.season)} 시즌 · {courses.join(" · ")} 코스에 맞춤 큐레이션
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} ctx={ctx} />
        ))}
      </div>
      <p className="text-[10px] text-textMuted/80 mt-3 leading-relaxed">
        {COUPANG_DISCLOSURE}
      </p>
    </section>
  );
}

function ProductCard({
  product,
  ctx,
}: {
  product: AffiliateProduct;
  ctx: RecommendationContext;
}) {
  const badge = badgeFor(product, ctx);

  return (
    <a
      href={coupangSearchURL(product.searchQuery)}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group rounded-xl border border-border bg-surface p-3 hover:border-deepGreen/40 hover:shadow-sm transition flex flex-col"
    >
      <div className="flex items-start gap-2 mb-1">
        <span className="text-3xl shrink-0 leading-none mt-0.5" aria-hidden="true">
          {product.emoji}
        </span>
        <div className="flex-1 min-w-0">
          {badge && (
            <div className="inline-block rounded-full bg-pastelLime text-deepGreen px-2 py-0.5 text-[9px] font-bold mb-1">
              {badge}
            </div>
          )}
          <div className="font-bold text-xs text-textPrimary leading-tight">
            {product.name}
          </div>
        </div>
      </div>
      <div className="text-[10px] text-textMuted leading-tight mb-2 line-clamp-2">
        {product.description}
      </div>
      <div className="flex items-center justify-between mt-auto pt-1">
        {product.priceRange ? (
          <span className="text-[10px] font-bold text-textSecondary">
            {product.priceRange}
          </span>
        ) : (
          <span />
        )}
        <span className="text-[10px] text-deepGreen font-bold group-hover:underline">
          쿠팡에서 보기 →
        </span>
      </div>
    </a>
  );
}
