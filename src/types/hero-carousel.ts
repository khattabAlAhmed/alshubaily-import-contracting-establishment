import type { SlideType } from "@/lib/db/schema/hero-carousel-schema";

/**
 * Reference data from linked content (article, product, service, project)
 */
export interface SlideReference {
    id: string;
    titleEn: string;
    titleAr: string;
    slugEn: string;
    slugAr: string;
    descriptionEn?: string | null;
    descriptionAr?: string | null;
    imageUrl?: string | null;
    // Article-specific
    categoryName?: string | null;
    publishedAt?: Date | null;
    // Product-specific
    productCategoryName?: string | null;
    // Project-specific
    locationEn?: string | null;
    locationAr?: string | null;
    year?: number | null;
    projectTypeName?: string | null;
}

/**
 * Slide data ready for display in the carousel
 */
export interface DisplaySlide {
    id: string;
    slideType: SlideType;
    // Bilingual content from slide itself
    titleEn: string;
    titleAr: string;
    subtitleEn: string | null;
    subtitleAr: string | null;
    // CTA
    ctaEnabled: boolean;
    ctaTextEn: string | null;
    ctaTextAr: string | null;
    ctaHref: string | null;
    // Background (custom slides)
    backgroundImageUrl: string | null;
    backgroundColor: string | null;
    overlayOpacity: number | null;
    // Referenced content data (non-custom slides)
    reference: SlideReference | null;
    // Sort order
    sortOrder: number;
}

/**
 * Props for base slide component
 */
export interface HeroSlideBaseProps {
    title: string;
    subtitle?: string | null;
    backgroundImageUrl?: string | null;
    backgroundColor?: string | null;
    overlayOpacity?: number;
    ctaEnabled?: boolean;
    ctaText?: string | null;
    ctaHref?: string | null;
    isActive: boolean;
    children?: React.ReactNode;
}

/**
 * Props for article slide
 */
export interface ArticleSlideProps {
    slide: DisplaySlide;
    locale: string;
    isActive: boolean;
}

/**
 * Props for product slide
 */
export interface ProductSlideProps {
    slide: DisplaySlide;
    locale: string;
    isActive: boolean;
}

/**
 * Props for service slide (main, import, contracting)
 */
export interface ServiceSlideProps {
    slide: DisplaySlide;
    locale: string;
    isActive: boolean;
    serviceType: "main_service" | "import_service" | "contracting_service";
}

/**
 * Props for project slide
 */
export interface ProjectSlideProps {
    slide: DisplaySlide;
    locale: string;
    isActive: boolean;
}

/**
 * Props for custom slide
 */
export interface CustomSlideProps {
    slide: DisplaySlide;
    locale: string;
    isActive: boolean;
}

/**
 * Props for the main carousel component
 */
export interface HeroCarouselProps {
    slides: DisplaySlide[];
    locale: string;
    autoPlayInterval?: number;
}
