import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { HeroCarousel } from "@/components/hero/HeroCarousel";
import { HeroCarouselSkeleton } from "@/components/hero/HeroCarouselSkeleton";
import { getCachedSlidesForDisplay, getCachedHeroSectionBySlug } from "@/actions/hero-carousel";

async function HeroCarouselContent() {
    const locale = await getLocale();

    // Get the main homepage hero section (cached)
    const heroSection = await getCachedHeroSectionBySlug("homepage");

    if (!heroSection) {
        // Return empty state if no hero section found
        return (
            <div className="relative w-full h-[50vh] min-h-[400px] md:h-[60vh] lg:h-[70vh] bg-gradient-to-br from-primary/10 to-secondary flex items-center justify-center">
                <p className="text-muted-foreground text-lg">
                    {locale === "ar" ? "لم يتم العثور على قسم العرض الرئيسي" : "Hero section not found"}
                </p>
            </div>
        );
    }

    // Get slides (cached + batched queries)
    const slides = await getCachedSlidesForDisplay(heroSection.id);

    return <HeroCarousel slides={slides} locale={locale} autoPlayInterval={5000} />;
}

export default function HeroSection() {
    return (
        <section className="w-full" aria-label="Hero Carousel">
            <Suspense fallback={<HeroCarouselSkeleton />}>
                <HeroCarouselContent />
            </Suspense>
        </section>
    );
}
