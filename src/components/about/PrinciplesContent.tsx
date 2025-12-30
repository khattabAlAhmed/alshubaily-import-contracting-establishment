"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, CheckCircle2 } from "lucide-react";
import type { WorkPrinciple } from "@/actions/website-info";

gsap.registerPlugin(ScrollTrigger);

interface PrinciplesContentProps {
    principles: WorkPrinciple[];
    locale: string;
}

export function PrinciplesContent({ principles, locale }: PrinciplesContentProps) {
    const isArabic = locale === "ar";
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate connector line
            gsap.fromTo(
                ".timeline-line",
                { scaleY: 0 },
                {
                    scaleY: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 70%",
                    },
                }
            );

            // Animate cards alternating from sides
            gsap.fromTo(
                ".principle-card",
                { opacity: 0, x: (i) => (i % 2 === 0 ? -40 : 40) },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 70%",
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    if (principles.length === 0) {
        return (
            <div className="container mx-auto px-4 text-center py-12">
                <p className="text-muted-foreground">
                    {isArabic ? "لا توجد مبادئ متاحة" : "No principles available"}
                </p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="container mx-auto px-4 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/10 mb-6">
                    <Compass className="w-5 h-5 text-primary" />
                    <span className="font-medium text-primary">
                        {isArabic ? "مبادئ العمل" : "Work Principles"}
                    </span>
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                    {isArabic ? "القيم التي نعمل بها" : "The Values We Work By"}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    {isArabic
                        ? "نلتزم بمجموعة من المبادئ الأساسية التي توجه عملنا"
                        : "We adhere to a set of core principles that guide our work"
                    }
                </p>
            </div>

            {/* Timeline */}
            <div className="relative max-w-4xl mx-auto">
                {/* Center line - visible on md+ */}
                <div
                    className="timeline-line hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 origin-top"
                    style={{ backgroundColor: "var(--about-principles-connector)" }}
                />

                {/* Left line for mobile */}
                <div
                    className="timeline-line md:hidden absolute left-4 top-0 bottom-0 w-0.5 origin-top"
                    style={{ backgroundColor: "var(--about-principles-connector)" }}
                />

                {/* Principles */}
                <div className="space-y-8 md:space-y-0">
                    {principles.map((principle, idx) => {
                        const isEven = idx % 2 === 0;

                        return (
                            <div
                                key={principle.id}
                                className={`principle-card relative flex items-start md:items-center gap-4 md:gap-0 ${isEven ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                            >
                                {/* Mobile dot */}
                                <div className="md:hidden relative z-10 flex-shrink-0">
                                    <div
                                        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold"
                                    >
                                        {idx + 1}
                                    </div>
                                </div>

                                {/* Card */}
                                <div className={`flex-1 md:w-[calc(50%-2rem)] ${isEven ? "md:pe-8" : "md:ps-8"}`}>
                                    <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                                        <div className="flex items-start gap-4">
                                            <div className="hidden md:flex w-10 h-10 rounded-lg bg-primary/10 items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                                                    {isArabic ? principle.titleAr : principle.titleEn}
                                                </h3>
                                                {(principle.descriptionEn || principle.descriptionAr) && (
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {isArabic ? principle.descriptionAr : principle.descriptionEn}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Center dot - desktop */}
                                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
                                    <div
                                        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg"
                                    >
                                        {idx + 1}
                                    </div>
                                </div>

                                {/* Spacer for opposite side */}
                                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                            </div>
                        );
                    })}
                </div>

                {/* End dot */}
                <div className="flex justify-center mt-8">
                    <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: "var(--about-principles-connector)" }}
                    />
                </div>
            </div>
        </div>
    );
}
