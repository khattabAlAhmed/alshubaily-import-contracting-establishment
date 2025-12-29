"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import type { HeroSlideBaseProps } from "@/types/hero-carousel";
import Link from "next/link";

export function HeroSlideBase({
    title,
    subtitle,
    backgroundImageUrl,
    backgroundColor,
    overlayOpacity = 50,
    ctaEnabled,
    ctaText,
    ctaHref,
    isActive,
    children,
}: HeroSlideBaseProps) {
    const slideRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!slideRef.current || !contentRef.current) return;

        if (isActive) {
            // Animate in
            gsap.fromTo(
                slideRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.6, ease: "power2.out" }
            );
            gsap.fromTo(
                contentRef.current.children,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "power2.out",
                    delay: 0.2,
                }
            );
        } else {
            // Hide immediately
            gsap.set(slideRef.current, { opacity: 0 });
        }
    }, [isActive]);

    const overlayStyle = {
        background: `linear-gradient(to top, var(--hero-gradient-end), var(--hero-gradient-start))`,
        opacity: overlayOpacity / 100,
    };

    return (
        <div
            ref={slideRef}
            className={`absolute inset-0 w-full h-full ${isActive ? "z-10" : "z-0 pointer-events-none"}`}
            style={{ opacity: isActive ? 1 : 0 }}
        >
            {/* Background Image */}
            {backgroundImageUrl && (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${backgroundImageUrl})` }}
                />
            )}

            {/* Background Color Fallback */}
            {!backgroundImageUrl && backgroundColor && (
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor }}
                />
            )}

            {/* Default gradient background if no image or color */}
            {!backgroundImageUrl && !backgroundColor && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary" />
            )}

            {/* Overlay */}
            <div className="absolute inset-0" style={overlayStyle} />

            {/* Content */}
            <div
                ref={contentRef}
                className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16 text-white"
            >
                {/* Type-specific content (badges, etc.) from children */}
                {children}

                {/* Title */}
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 drop-shadow-lg max-w-4xl">
                    {title}
                </h1>

                {/* Subtitle */}
                {subtitle && (
                    <p className="text-lg md:text-xl lg:text-2xl mb-6 opacity-90 drop-shadow max-w-3xl">
                        {subtitle}
                    </p>
                )}

                {/* CTA Button */}
                {ctaEnabled && ctaText && ctaHref && (
                    <Link
                        href={ctaHref}
                        className="inline-flex items-center justify-center w-fit px-6 py-3 text-base md:text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
                        style={{
                            background: "var(--primary)",
                            color: "var(--primary-foreground)",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        {ctaText}
                    </Link>
                )}
            </div>
        </div>
    );
}
