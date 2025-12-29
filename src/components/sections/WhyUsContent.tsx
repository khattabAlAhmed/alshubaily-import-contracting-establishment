"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import type { Strength, Experience, Commitment } from "@/actions/website-info";

interface WhyUsContentProps {
    strengths: Strength[];
    experiences: Experience[];
    commitments: Commitment[];
    locale: string;
    isArabic: boolean;
}

// Category config with icons and colors
const categoryConfig = {
    strength: {
        labelEn: "Our Strengths",
        labelAr: "نقاط قوتنا",
        color: "var(--section-accent-strength)",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
    experience: {
        labelEn: "Our Experience",
        labelAr: "خبراتنا",
        color: "var(--section-accent-experience)",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        ),
    },
    commitment: {
        labelEn: "Our Commitments",
        labelAr: "التزاماتنا",
        color: "var(--section-accent-commitment)",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
        ),
    },
};

interface CategoryListProps {
    items: Array<{ id: string; titleEn: string; titleAr: string; descriptionEn?: string | null; descriptionAr?: string | null }>;
    category: keyof typeof categoryConfig;
    isArabic: boolean;
    animationDelay: number;
}

function CategoryList({ items, category, isArabic, animationDelay }: CategoryListProps) {
    const listRef = useRef<HTMLDivElement>(null);
    const config = categoryConfig[category];

    useEffect(() => {
        if (!listRef.current || items.length === 0) return;

        gsap.fromTo(
            listRef.current,
            { opacity: 0, x: isArabic ? 40 : -40 },
            { opacity: 1, x: 0, duration: 0.6, delay: animationDelay, ease: "power3.out" }
        );
    }, [isArabic, animationDelay, items.length]);

    if (items.length === 0) return null;

    return (
        <div
            ref={listRef}
            className="relative"
            style={{ opacity: 0 }}
        >
            {/* Category Header */}
            <div className="flex items-center gap-4 mb-6">
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    style={{ background: config.color }}
                >
                    {config.icon}
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-foreground">
                        {isArabic ? config.labelAr : config.labelEn}
                    </h3>
                    <div className="w-12 h-1 rounded-full mt-1" style={{ background: config.color }} />
                </div>
            </div>

            {/* Items List */}
            <div className="space-y-4 ps-6 border-s-2 ms-6" style={{ borderColor: `${config.color}30` }}>
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className="relative group"
                    >
                        {/* Connection dot */}
                        <div
                            className="absolute -start-[25px] top-2 w-3 h-3 rounded-full border-2 bg-background transition-all duration-300 group-hover:scale-125"
                            style={{ borderColor: config.color }}
                        />

                        {/* Content */}
                        <div className="ps-4 py-2">
                            <h4 className="text-lg font-semibold text-foreground mb-1 transition-colors duration-300 group-hover:text-primary">
                                {isArabic ? item.titleAr : item.titleEn}
                            </h4>
                            {(item.descriptionEn || item.descriptionAr) && (
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {isArabic ? item.descriptionAr : item.descriptionEn}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function WhyUsContent({ strengths, experiences, commitments, locale, isArabic }: WhyUsContentProps) {
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (headerRef.current) {
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
            );
        }
    }, []);

    const hasContent = strengths.length > 0 || experiences.length > 0 || commitments.length > 0;

    if (!hasContent) {
        return null;
    }

    return (
        <div className="container mx-auto px-4">
            {/* Section Header */}
            <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16" style={{ opacity: 0 }}>
                {/* Label */}
                <div className="inline-flex items-center gap-3 mb-6">
                    <div className="w-12 h-[2px] bg-primary" />
                    <span className="text-primary font-semibold text-sm uppercase tracking-widest">
                        {isArabic ? "لماذا تختارنا" : "Why Choose Us"}
                    </span>
                    <div className="w-12 h-[2px] bg-primary" />
                </div>

                {/* Title */}
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                    {isArabic ? "ما يميزنا عن غيرنا" : "What Sets Us Apart"}
                </h2>

                {/* Subtitle */}
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {isArabic
                        ? "نلتزم بتقديم أعلى معايير الجودة والخدمة لعملائنا، مع خبرة واسعة وفريق محترف يضمن نجاح مشاريعكم"
                        : "We are committed to delivering the highest standards of quality and service, with extensive experience and a professional team ensuring your project's success"
                    }
                </p>
            </div>

            {/* Three Column Grid for Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
                <CategoryList
                    items={strengths}
                    category="strength"
                    isArabic={isArabic}
                    animationDelay={0.2}
                />
                <CategoryList
                    items={experiences}
                    category="experience"
                    isArabic={isArabic}
                    animationDelay={0.4}
                />
                <CategoryList
                    items={commitments}
                    category="commitment"
                    isArabic={isArabic}
                    animationDelay={0.6}
                />
            </div>

            {/* Bottom CTA Section */}
            <div className="mt-20 text-center">
                <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 rounded-3xl bg-card border border-border shadow-lg">
                    <div className="text-center sm:text-start">
                        <h3 className="text-xl font-bold text-foreground mb-1">
                            {isArabic ? "هل لديك مشروع؟" : "Have a project in mind?"}
                        </h3>
                        <p className="text-muted-foreground">
                            {isArabic ? "تواصل معنا اليوم للحصول على استشارة مجانية" : "Contact us today for a free consultation"}
                        </p>
                    </div>
                    <a
                        href={`/${locale}/contact`}
                        className="shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-1"
                    >
                        {isArabic ? "تواصل معنا" : "Contact Us"}
                        <svg className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
