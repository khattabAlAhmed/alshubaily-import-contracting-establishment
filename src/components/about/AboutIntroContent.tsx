"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, Target, Heart, Sparkles } from "lucide-react";
import type { Vision, Mission, CompanyValue } from "@/actions/website-info";

gsap.registerPlugin(ScrollTrigger);

interface AboutIntroContentProps {
    visions: Vision[];
    missions: Mission[];
    values: CompanyValue[];
    companyName: string | null;
    tagline: string | null;
    locale: string;
}

export function AboutIntroContent({
    visions,
    missions,
    values,
    companyName,
    tagline,
    locale,
}: AboutIntroContentProps) {
    const isArabic = locale === "ar";
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header animation
            gsap.fromTo(
                ".intro-header",
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out",
                }
            );

            // Cards stagger animation
            gsap.fromTo(
                ".intro-card",
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const sections = [
        {
            key: "vision",
            icon: Eye,
            color: "var(--about-vision)",
            label: isArabic ? "رؤيتنا" : "Our Vision",
            items: visions,
        },
        {
            key: "mission",
            icon: Target,
            color: "var(--about-mission)",
            label: isArabic ? "رسالتنا" : "Our Mission",
            items: missions,
        },
        {
            key: "values",
            icon: Heart,
            color: "var(--about-values)",
            label: isArabic ? "قيمنا" : "Our Values",
            items: values,
        },
    ];

    return (
        <div ref={containerRef} className="container mx-auto px-4 relative z-10">
            {/* Header */}
            <div className="intro-header text-center mb-16 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                    <Sparkles className="w-4 h-4" />
                    {isArabic ? "تعرف علينا" : "About Us"}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                    {companyName || (isArabic ? "مؤسسة الشبيلي" : "Alshubaily Establishment")}
                </h1>
                {tagline && (
                    <p className="text-lg md:text-xl text-muted-foreground">
                        {tagline}
                    </p>
                )}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {sections.map((section, idx) => {
                    const Icon = section.icon;
                    const firstItem = section.items[0];
                    const hasMultiple = section.items.length > 1;

                    return (
                        <div
                            key={section.key}
                            className="intro-card group relative"
                            style={{ "--accent-color": section.color } as React.CSSProperties}
                        >
                            {/* Glass card */}
                            <div
                                className="relative h-full p-6 lg:p-8 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-[var(--accent-color)]/30"
                            >
                                {/* Icon */}
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                                    style={{ backgroundColor: `color-mix(in oklch, var(--accent-color) 15%, transparent)` }}
                                >
                                    <Icon
                                        className="w-7 h-7"
                                        style={{ color: "var(--accent-color)" }}
                                    />
                                </div>

                                {/* Title */}
                                <h2
                                    className="text-xl lg:text-2xl font-bold mb-4"
                                    style={{ color: "var(--accent-color)" }}
                                >
                                    {section.label}
                                </h2>

                                {/* Content */}
                                {firstItem && (
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-foreground">
                                            {isArabic ? firstItem.titleAr : firstItem.titleEn}
                                        </h3>
                                        {(firstItem.descriptionEn || firstItem.descriptionAr) && (
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {isArabic ? firstItem.descriptionAr : firstItem.descriptionEn}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Additional items indicator */}
                                {hasMultiple && (
                                    <div className="mt-6 pt-4 border-t border-border/50">
                                        <div className="flex flex-wrap gap-2">
                                            {section.items.slice(1, 4).map((item, i) => (
                                                <span
                                                    key={item.id}
                                                    className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground"
                                                >
                                                    {isArabic ? item.titleAr : item.titleEn}
                                                </span>
                                            ))}
                                            {section.items.length > 4 && (
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                                    +{section.items.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* No content fallback */}
                                {!firstItem && (
                                    <p className="text-muted-foreground text-sm">
                                        {isArabic ? "لا توجد بيانات متاحة" : "No data available"}
                                    </p>
                                )}

                                {/* Accent line at bottom */}
                                <div
                                    className="absolute bottom-0 left-6 right-6 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ backgroundColor: "var(--accent-color)" }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
