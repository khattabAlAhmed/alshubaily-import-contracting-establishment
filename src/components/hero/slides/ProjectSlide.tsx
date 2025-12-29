"use client";

import { HeroSlideBase } from "../HeroSlideBase";
import type { ProjectSlideProps } from "@/types/hero-carousel";

export function ProjectSlide({ slide, locale, isActive }: ProjectSlideProps) {
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
    const location = isArabic ? slide.reference?.locationAr : slide.reference?.locationEn;
    const year = slide.reference?.year;
    const projectTypeName = slide.reference?.projectTypeName;

    // Always link to project page when reference exists
    const ctaHref = slide.reference
        ? `/${locale}/projects/${isArabic ? slide.reference.slugAr : slide.reference.slugEn}`
        : slide.ctaHref || "#";

    return (
        <HeroSlideBase
            title={title}
            subtitle={subtitle}
            backgroundImageUrl={imageUrl}
            backgroundColor={slide.backgroundColor}
            overlayOpacity={slide.overlayOpacity ?? 50}
            ctaEnabled={true}
            ctaText={ctaText || (isArabic ? "عرض المشروع" : "View Project")}
            ctaHref={ctaHref}
            isActive={isActive}
        >
            {/* Project-specific badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Project type badge */}
                {projectTypeName && (
                    <span
                        className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full"
                        style={{
                            background: "var(--hero-accent-project)",
                            color: "white",
                        }}
                    >
                        {projectTypeName}
                    </span>
                )}

                {/* Year badge */}
                {year && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-white/20 backdrop-blur-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {year}
                    </span>
                )}

                {/* Location badge */}
                {location && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-white/10 backdrop-blur-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {location}
                    </span>
                )}

                {/* Project indicator */}
                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-white/10 backdrop-blur-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    {isArabic ? "مشروع" : "Project"}
                </span>
            </div>
        </HeroSlideBase>
    );
}
