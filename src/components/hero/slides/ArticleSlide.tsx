"use client";

import { HeroSlideBase } from "../HeroSlideBase";
import type { ArticleSlideProps } from "@/types/hero-carousel";

export function ArticleSlide({ slide, locale, isActive }: ArticleSlideProps) {
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
    const categoryName = slide.reference?.categoryName;
    const publishedAt = slide.reference?.publishedAt;

    // Always link to article page when reference exists
    const ctaHref = slide.reference
        ? `/${locale}/articles/${isArabic ? slide.reference.slugAr : slide.reference.slugEn}`
        : slide.ctaHref || "#";

    const formatDate = (date: Date | null | undefined) => {
        if (!date) return null;
        return new Intl.DateTimeFormat(isArabic ? "ar-SA" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(new Date(date));
    };

    return (
        <HeroSlideBase
            title={title}
            subtitle={subtitle}
            backgroundImageUrl={imageUrl}
            backgroundColor={slide.backgroundColor}
            overlayOpacity={slide.overlayOpacity ?? 60}
            ctaEnabled={true}
            ctaText={ctaText || (isArabic ? "اقرأ المقال" : "Read Article")}
            ctaHref={ctaHref}
            isActive={isActive}
        >
            {/* Article-specific badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Category badge */}
                {categoryName && (
                    <span
                        className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full"
                        style={{
                            background: "var(--hero-accent-article)",
                            color: "white",
                        }}
                    >
                        {categoryName}
                    </span>
                )}

                {/* Date badge */}
                {publishedAt && (
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-white/20 backdrop-blur-sm">
                        {formatDate(publishedAt)}
                    </span>
                )}

                {/* Article type indicator */}
                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-white/10 backdrop-blur-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                    {isArabic ? "مقال" : "Article"}
                </span>
            </div>
        </HeroSlideBase>
    );
}
