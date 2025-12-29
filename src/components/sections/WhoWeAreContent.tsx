"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import type { CompanyProfileWithImages, Vision, Mission, CompanyValue } from "@/actions/website-info";
import Link from "next/link";

interface WhoWeAreContentProps {
    profile: CompanyProfileWithImages | null;
    visions: Vision[];
    missions: Mission[];
    values: CompanyValue[];
    locale: string;
    isArabic: boolean;
}

export function WhoWeAreContent({ profile, visions, missions, values, locale, isArabic }: WhoWeAreContentProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate content from left/right based on locale
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, x: isArabic ? 60 : -60 },
                { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
            );

            // Animate image with slight delay
            gsap.fromTo(
                imageRef.current,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.8, delay: 0.2, ease: "power3.out" }
            );

            // Animate cards with stagger
            if (cardsRef.current) {
                gsap.fromTo(
                    cardsRef.current.children,
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, delay: 0.4, ease: "power2.out" }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [isArabic]);

    const name = profile ? (isArabic ? profile.nameAr : profile.nameEn) : (isArabic ? "مؤسسة الشبيلي للاستيراد والمقاولات" : "Al-Shubaily Import & Contracting Est.");
    const tagline = profile ? (isArabic ? profile.taglineAr : profile.taglineEn) : null;
    const description = profile ? (isArabic ? profile.descriptionAr : profile.descriptionEn) : (isArabic
        ? "نحن مؤسسة رائدة في مجال الاستيراد والمقاولات، نسعى لتقديم أفضل الخدمات والمنتجات لعملائنا الكرام."
        : "We are a leading establishment in import and contracting, striving to provide the best services and products to our valued customers.");
    const foundedYear = profile?.foundedYear;
    const yearsInBusiness = foundedYear ? new Date().getFullYear() - foundedYear : null;

    // Combine vision, mission, values for display
    const displayItems = [
        ...visions.slice(0, 1).map(v => ({
            id: v.id,
            type: "vision" as const,
            title: isArabic ? v.titleAr : v.titleEn,
            description: isArabic ? v.descriptionAr : v.descriptionEn,
            icon: "vision",
        })),
        ...missions.slice(0, 1).map(m => ({
            id: m.id,
            type: "mission" as const,
            title: isArabic ? m.titleAr : m.titleEn,
            description: isArabic ? m.descriptionAr : m.descriptionEn,
            icon: "mission",
        })),
        ...values.slice(0, 1).map(v => ({
            id: v.id,
            type: "value" as const,
            title: isArabic ? v.titleAr : v.titleEn,
            description: isArabic ? v.descriptionAr : v.descriptionEn,
            icon: "value",
        })),
    ];

    return (
        <div ref={sectionRef} className="container mx-auto px-4">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center mb-20">
                {/* Text Content */}
                <div
                    ref={contentRef}
                    className={`lg:col-span-6 ${isArabic ? "lg:order-2" : "lg:order-1"}`}
                    style={{ opacity: 0 }}
                >
                    {/* Section Label */}
                    <div className="inline-flex items-center gap-2 mb-6">
                        <div className="w-12 h-[2px] bg-primary" />
                        <span className="text-primary font-semibold text-sm uppercase tracking-widest">
                            {isArabic ? "من نحن" : "About Us"}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                        {name}
                    </h2>

                    {/* Tagline */}
                    {tagline && (
                        <p className="text-xl md:text-2xl text-primary/90 font-medium mb-6 leading-relaxed">
                            {tagline}
                        </p>
                    )}

                    {/* Description */}
                    {description && (
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            {description}
                        </p>
                    )}

                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-8 mb-8">
                        {yearsInBusiness && (
                            <div className="relative">
                                <div className="text-5xl font-bold text-foreground">{yearsInBusiness}+</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    {isArabic ? "سنوات من الخبرة" : "Years Experience"}
                                </div>
                            </div>
                        )}
                        <div className="relative">
                            <div className="text-5xl font-bold text-foreground">100%</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {isArabic ? "رضا العملاء" : "Client Satisfaction"}
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                        href={`/${locale}/about`}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-1"
                    >
                        {isArabic ? "اعرف المزيد عنا" : "Learn More About Us"}
                        <svg className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                {/* Image Section */}
                <div
                    ref={imageRef}
                    className={`lg:col-span-6 ${isArabic ? "lg:order-1" : "lg:order-2"}`}
                    style={{ opacity: 0 }}
                >
                    <div className="relative">
                        {/* Main Image */}
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                            {profile?.heroImageUrl ? (
                                <div
                                    className="aspect-[4/3] w-full bg-cover bg-center"
                                    style={{ backgroundImage: `url(${profile.heroImageUrl})` }}
                                />
                            ) : (
                                <div className="aspect-[4/3] w-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary flex items-center justify-center">
                                    <div className="text-8xl opacity-20">🏢</div>
                                </div>
                            )}
                        </div>

                        {/* Floating Accent Box */}
                        <div
                            className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-2xl -z-10"
                            style={{ transform: "rotate(-6deg)" }}
                        />
                        <div
                            className="absolute -top-6 -left-6 w-24 h-24 border-4 border-primary/20 rounded-2xl -z-10"
                            style={{ transform: "rotate(6deg)" }}
                        />
                    </div>
                </div>
            </div>

            {/* Vision, Mission, Values Cards */}
            {displayItems.length > 0 && (
                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayItems.map((item) => (
                        <div
                            key={item.id}
                            className="group relative p-8 rounded-2xl border border-border bg-card transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
                            style={{ opacity: 0 }}
                        >
                            {/* Gradient Background on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Icon */}
                            <div className="relative mb-6">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                    style={{
                                        background: item.type === "vision"
                                            ? "var(--section-accent-experience)"
                                            : item.type === "mission"
                                                ? "var(--primary)"
                                                : "var(--section-accent-commitment)",
                                        color: "white"
                                    }}
                                >
                                    {item.type === "vision" && (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                    {item.type === "mission" && (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    )}
                                    {item.type === "value" && (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    )}
                                </div>
                            </div>

                            {/* Type Label */}
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                                {item.type === "vision" ? (isArabic ? "رؤيتنا" : "Our Vision") :
                                    item.type === "mission" ? (isArabic ? "مهمتنا" : "Our Mission") :
                                        (isArabic ? "قيمنا" : "Our Values")}
                            </span>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-foreground mb-3 relative">
                                {item.title}
                            </h3>

                            {/* Description */}
                            {item.description && (
                                <p className="text-muted-foreground leading-relaxed relative">
                                    {item.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
