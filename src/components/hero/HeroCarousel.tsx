"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { gsap } from "gsap";
import type { HeroCarouselProps, DisplaySlide } from "@/types/hero-carousel";
import { ArticleSlide } from "./slides/ArticleSlide";
import { ProductSlide } from "./slides/ProductSlide";
import { ServiceSlide } from "./slides/ServiceSlide";
import { ProjectSlide } from "./slides/ProjectSlide";
import { CustomSlide } from "./slides/CustomSlide";

export function HeroCarousel({
    slides,
    locale,
    autoPlayInterval = 5000,
}: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dotsRef = useRef<HTMLDivElement>(null);
    const isRTL = locale === "ar";

    // Auto-play functionality
    useEffect(() => {
        if (slides.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [slides.length, autoPlayInterval, isPaused]);

    // Animate dots on index change
    useEffect(() => {
        if (!dotsRef.current) return;

        const dots = dotsRef.current.children;
        gsap.to(dots, {
            scale: 1,
            opacity: 0.5,
            duration: 0.3,
            ease: "power2.out",
        });
        gsap.to(dots[currentIndex], {
            scale: 1.3,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
        });
    }, [currentIndex]);

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                isRTL ? goToNext() : goToPrevious();
            } else if (e.key === "ArrowRight") {
                isRTL ? goToPrevious() : goToNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [goToNext, goToPrevious, isRTL]);

    // Render the appropriate slide component based on type
    const renderSlide = (slide: DisplaySlide, isActive: boolean) => {
        switch (slide.slideType) {
            case "article":
                return (
                    <ArticleSlide
                        key={slide.id}
                        slide={slide}
                        locale={locale}
                        isActive={isActive}
                    />
                );
            case "product":
                return (
                    <ProductSlide
                        key={slide.id}
                        slide={slide}
                        locale={locale}
                        isActive={isActive}
                    />
                );
            case "main_service":
            case "import_service":
            case "contracting_service":
                return (
                    <ServiceSlide
                        key={slide.id}
                        slide={slide}
                        locale={locale}
                        isActive={isActive}
                        serviceType={slide.slideType}
                    />
                );
            case "project":
                return (
                    <ProjectSlide
                        key={slide.id}
                        slide={slide}
                        locale={locale}
                        isActive={isActive}
                    />
                );
            case "custom":
            default:
                return (
                    <CustomSlide
                        key={slide.id}
                        slide={slide}
                        locale={locale}
                        isActive={isActive}
                    />
                );
        }
    };

    if (slides.length === 0) {
        return (
            <div className="relative w-full h-[50vh] min-h-[400px] md:h-[60vh] lg:h-[70vh] bg-gradient-to-br from-primary/10 to-secondary flex items-center justify-center">
                <p className="text-muted-foreground text-lg">
                    {isRTL ? "لا توجد شرائح متاحة" : "No slides available"}
                </p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[50vh] min-h-[400px] md:h-[60vh] lg:h-[70vh] overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Slides */}
            {slides.map((slide, index) => renderSlide(slide, index === currentIndex))}

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    {/* Previous Arrow */}
                    <button
                        onClick={isRTL ? goToNext : goToPrevious}
                        className="absolute top-1/2 -translate-y-1/2 left-4 z-20 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white transition-all duration-300 hover:bg-black/50 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label={isRTL ? "الشريحة التالية" : "Previous slide"}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Next Arrow */}
                    <button
                        onClick={isRTL ? goToPrevious : goToNext}
                        className="absolute top-1/2 -translate-y-1/2 right-4 z-20 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white transition-all duration-300 hover:bg-black/50 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label={isRTL ? "الشريحة السابقة" : "Next slide"}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Navigation Dots */}
            {slides.length > 1 && (
                <div
                    ref={dotsRef}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2"
                >
                    {slides.map((slide, index) => (
                        <button
                            key={slide.id}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${index === currentIndex
                                    ? "bg-white scale-125"
                                    : "bg-white/50 hover:bg-white/70"
                                }`}
                            aria-label={`${isRTL ? "انتقل إلى الشريحة" : "Go to slide"} ${index + 1}`}
                            aria-current={index === currentIndex ? "true" : undefined}
                        />
                    ))}
                </div>
            )}

            {/* Progress Bar (optional visual indicator) */}
            {slides.length > 1 && !isPaused && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
                    <div
                        className="h-full bg-primary transition-none"
                        style={{
                            animation: `progress ${autoPlayInterval}ms linear`,
                            width: "100%",
                        }}
                        key={currentIndex}
                    />
                </div>
            )}

            {/* CSS for progress animation */}
            <style jsx>{`
                @keyframes progress {
                    from {
                        width: 0%;
                    }
                    to {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}
