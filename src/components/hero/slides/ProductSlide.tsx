"use client";

import { HeroSlideBase } from "../HeroSlideBase";
import type { ProductSlideProps } from "@/types/hero-carousel";

export function ProductSlide({ slide, locale, isActive }: ProductSlideProps) {
    const isArabic = locale === "ar";

    // Use reference title/subtitle if available, otherwise fall back to slide content
    const title = slide.reference
        ? (isArabic ? slide.reference.titleAr : slide.reference.titleEn)
        : (isArabic ? slide.titleAr : slide.titleEn);

    const subtitle = slide.reference?.descriptionEn || slide.reference?.descriptionAr
        ? (isArabic ? slide.reference.descriptionAr : slide.reference.descriptionEn)
        : (isArabic ? slide.subtitleAr : slide.subtitleEn);

    const ctaText = isArabic ? slide.ctaTextAr : slide.ctaTextEn;

    // Get image from reference or fallback to background
    const imageUrl = slide.reference?.imageUrl || slide.backgroundImageUrl;
    const productCategoryName = slide.reference?.productCategoryName;

    // Always link to product page when reference exists
    const ctaHref = slide.reference
        ? `/${locale}/products/${isArabic ? slide.reference.slugAr : slide.reference.slugEn}`
        : slide.ctaHref || "#";

    return (
        <HeroSlideBase
            title={title}
            subtitle={subtitle}
            backgroundImageUrl={imageUrl}
            backgroundColor={slide.backgroundColor}
            overlayOpacity={slide.overlayOpacity ?? 55}
            ctaEnabled={true}
            ctaText={ctaText || (isArabic ? "اكتشف المنتج" : "View Product")}
            ctaHref={ctaHref}
            isActive={isActive}
        >
            {/* Product-specific badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Category badge */}
                {productCategoryName && (
                    <span
                        className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full"
                        style={{
                            background: "var(--hero-accent-product)",
                            color: "white",
                        }}
                    >
                        {productCategoryName}
                    </span>
                )}

                {/* Product type indicator */}
                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-white/10 backdrop-blur-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM7 10a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    {isArabic ? "منتج" : "Product"}
                </span>
            </div>
        </HeroSlideBase>
    );
}
