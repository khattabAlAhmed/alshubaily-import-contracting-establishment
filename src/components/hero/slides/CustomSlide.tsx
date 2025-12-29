"use client";

import { HeroSlideBase } from "../HeroSlideBase";
import type { CustomSlideProps } from "@/types/hero-carousel";

export function CustomSlide({ slide, locale, isActive }: CustomSlideProps) {
    const isArabic = locale === "ar";
    const title = isArabic ? slide.titleAr : slide.titleEn;
    const subtitle = isArabic ? slide.subtitleAr : slide.subtitleEn;
    const ctaText = isArabic ? slide.ctaTextAr : slide.ctaTextEn;

    return (
        <HeroSlideBase
            title={title}
            subtitle={subtitle}
            backgroundImageUrl={slide.backgroundImageUrl}
            backgroundColor={slide.backgroundColor}
            overlayOpacity={slide.overlayOpacity ?? 50}
            ctaEnabled={slide.ctaEnabled}
            ctaText={ctaText}
            ctaHref={slide.ctaHref}
            isActive={isActive}
        >
            {/* Custom slides have no badges by default */}
            {/* They can be fully customized via the CMS */}
        </HeroSlideBase>
    );
}
