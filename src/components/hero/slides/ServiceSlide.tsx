"use client";

import { HeroSlideBase } from "../HeroSlideBase";
import type { ServiceSlideProps } from "@/types/hero-carousel";

export function ServiceSlide({ slide, locale, isActive, serviceType }: ServiceSlideProps) {
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

    // Service type labels
    const serviceTypeLabels: Record<string, { en: string; ar: string }> = {
        main_service: { en: "Main Service", ar: "خدمة رئيسية" },
        import_service: { en: "Import Service", ar: "خدمة استيراد" },
        contracting_service: { en: "Contracting Service", ar: "خدمة مقاولات" },
    };

    const serviceLabel = serviceTypeLabels[serviceType] || serviceTypeLabels.main_service;

    // Always link to service page when reference exists
    const getServiceHref = () => {
        if (!slide.reference) return slide.ctaHref || "#";

        const slug = isArabic ? slide.reference.slugAr : slide.reference.slugEn;
        switch (serviceType) {
            case "main_service":
                return `/${locale}/services/${slug}`;
            case "import_service":
                return `/${locale}/import/${slug}`;
            case "contracting_service":
                return `/${locale}/contracting/${slug}`;
            default:
                return `/${locale}/services/${slug}`;
        }
    };

    return (
        <HeroSlideBase
            title={title}
            subtitle={subtitle}
            backgroundImageUrl={imageUrl}
            backgroundColor={slide.backgroundColor}
            overlayOpacity={slide.overlayOpacity ?? 55}
            ctaEnabled={true}
            ctaText={ctaText || (isArabic ? "اعرف المزيد" : "Learn More")}
            ctaHref={getServiceHref()}
            isActive={isActive}
        >
            {/* Service-specific badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Service type badge */}
                <span
                    className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full"
                    style={{
                        background: "var(--hero-accent-service)",
                        color: "white",
                    }}
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    {isArabic ? serviceLabel.ar : serviceLabel.en}
                </span>
            </div>
        </HeroSlideBase>
    );
}
