"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, ChevronDown, FileText } from "lucide-react";
import type { GeneralPolicy } from "@/actions/website-info";

gsap.registerPlugin(ScrollTrigger);

interface PoliciesContentProps {
    policies: GeneralPolicy[];
    locale: string;
}

export function PoliciesContent({ policies, locale }: PoliciesContentProps) {
    const isArabic = locale === "ar";
    const containerRef = useRef<HTMLDivElement>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".policy-card",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.08,
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

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (policies.length === 0) {
        return (
            <div className="container mx-auto px-4 text-center py-12">
                <p className="text-muted-foreground">
                    {isArabic ? "لا توجد سياسات متاحة" : "No policies available"}
                </p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="container mx-auto px-4">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                            {isArabic ? "السياسات العامة" : "General Policies"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isArabic
                                ? "المبادئ التوجيهية التي تحكم عملياتنا"
                                : "Guidelines that govern our operations"
                            }
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>
                        {policies.length} {isArabic ? "سياسة" : policies.length === 1 ? "policy" : "policies"}
                    </span>
                </div>
            </div>

            {/* Policies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {policies.map((policy, idx) => {
                    const isExpanded = expandedId === policy.id;
                    const hasDescription = policy.descriptionEn || policy.descriptionAr;

                    return (
                        <div
                            key={policy.id}
                            className="policy-card"
                        >
                            <div
                                className={`rounded-2xl border transition-all duration-300 ${isExpanded
                                        ? "border-primary/50 bg-primary/5 shadow-lg"
                                        : "border-border/50 bg-card hover:border-primary/30"
                                    }`}
                            >
                                {/* Header - Always visible */}
                                <button
                                    onClick={() => hasDescription && toggleExpand(policy.id)}
                                    disabled={!hasDescription}
                                    className={`w-full p-5 flex items-center justify-between gap-4 text-start ${hasDescription ? "cursor-pointer" : "cursor-default"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Number badge */}
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${isExpanded
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-accent text-accent-foreground"
                                                }`}
                                        >
                                            {String(idx + 1).padStart(2, "0")}
                                        </div>

                                        <h3 className={`font-semibold transition-colors ${isExpanded ? "text-primary" : "text-foreground"
                                            }`}>
                                            {isArabic ? policy.titleAr : policy.titleEn}
                                        </h3>
                                    </div>

                                    {/* Chevron */}
                                    {hasDescription && (
                                        <ChevronDown
                                            className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                                                }`}
                                        />
                                    )}
                                </button>

                                {/* Expandable content */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-96" : "max-h-0"
                                        }`}
                                >
                                    {hasDescription && (
                                        <div className="px-5 pb-5 pt-0">
                                            <div className="ps-14">
                                                <p className="text-muted-foreground text-sm leading-relaxed">
                                                    {isArabic ? policy.descriptionAr : policy.descriptionEn}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
