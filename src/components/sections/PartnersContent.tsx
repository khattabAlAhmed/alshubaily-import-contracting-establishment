"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import type { PartnerWithImage } from "@/actions/partners";

interface PartnersContentProps {
    partners: PartnerWithImage[];
    locale: string;
}

export function PartnersContent({ partners, locale }: PartnersContentProps) {
    const isArabic = locale === "ar";
    const headerRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header animation
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
            );
        });

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (!marqueeRef.current || partners.length === 0) return;

        const marquee = marqueeRef.current;
        const items = marquee.querySelectorAll(".marquee-item");
        if (items.length === 0) return;

        // Calculate total width of all items
        let totalWidth = 0;
        items.forEach((item) => {
            totalWidth += (item as HTMLElement).offsetWidth + 32; // 32px gap
        });

        // Set total animation distance
        const xDirection = isArabic ? totalWidth / 2 : -totalWidth / 2;

        const tl = gsap.timeline({ repeat: -1 });
        tl.to(marquee, {
            x: xDirection,
            duration: partners.length * 4,
            ease: "none",
        });

        return () => {
            tl.kill();
        };
    }, [partners, isArabic]);

    if (partners.length === 0) {
        return null;
    }

    // Duplicate partners for seamless loop
    const displayPartners = [...partners, ...partners];

    return (
        <div className="container mx-auto px-4">
            {/* Header */}
            <div
                ref={headerRef}
                className="text-center mb-10"
                style={{ opacity: 0 }}
            >
                <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-3">
                    {isArabic ? "شركاء النجاح" : "Our Partners"}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    {isArabic ? "نفخر بشراكاتنا" : "Trusted By Industry Leaders"}
                </h2>
            </div>

            {/* Infinite Marquee */}
            <div className="relative overflow-hidden">
                {/* Gradient masks */}
                <div
                    className="absolute inset-y-0 left-0 w-20 md:w-40 z-10 pointer-events-none"
                    style={{ background: `linear-gradient(to right, var(--partners-bg), transparent)` }}
                />
                <div
                    className="absolute inset-y-0 right-0 w-20 md:w-40 z-10 pointer-events-none"
                    style={{ background: `linear-gradient(to left, var(--partners-bg), transparent)` }}
                />

                {/* Marquee track */}
                <div
                    ref={marqueeRef}
                    className="flex gap-8 items-center"
                    style={{ width: "fit-content" }}
                >
                    {displayPartners.map((partner, index) => (
                        <div
                            key={`${partner.id}-${index}`}
                            className="marquee-item flex-shrink-0 group"
                        >
                            <div
                                className="flex items-center justify-center px-8 py-5 rounded-2xl border-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                                style={{
                                    backgroundColor: "var(--background)",
                                    borderColor: "var(--partners-border)",
                                }}
                            >
                                {partner.logoImage?.url ? (
                                    <img
                                        src={partner.logoImage.url}
                                        alt={isArabic ? partner.nameAr : partner.nameEn}
                                        className="h-12 md:h-16 w-auto max-w-[160px] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                    />
                                ) : (
                                    <span className="text-lg font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                                        {isArabic ? partner.nameAr : partner.nameEn}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
