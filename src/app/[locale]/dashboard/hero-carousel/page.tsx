import { getAllHeroSections, getHeroSlidesBySection, getAllHeroSlides } from "@/actions/hero-carousel";
import { HeroCarouselClient } from "./client";

export const dynamic = "force-dynamic";

export default async function HeroCarouselPage() {
    const [sections, slides] = await Promise.all([
        getAllHeroSections(),
        getAllHeroSlides(),
    ]);

    // Filter slides that belong to hero sections (not service-specific)
    const sectionSlides = slides.filter(s => s.heroSectionId !== null);

    return <HeroCarouselClient sections={sections} slides={sectionSlides} />;
}
