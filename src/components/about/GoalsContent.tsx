"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Target } from "lucide-react";
import type { OrganizationGoal } from "@/actions/website-info";

gsap.registerPlugin(ScrollTrigger);

interface GoalsContentProps {
    goals: OrganizationGoal[];
    locale: string;
}

export function GoalsContent({ goals, locale }: GoalsContentProps) {
    const isArabic = locale === "ar";
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".goal-card",
                { opacity: 0, y: 30, scale: 0.98 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.1,
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

    if (goals.length === 0) {
        return (
            <div className="container mx-auto px-4 text-center py-12">
                <p className="text-muted-foreground">
                    {isArabic ? "لا توجد أهداف متاحة" : "No goals available"}
                </p>
            </div>
        );
    }

    const featuredGoal = goals[0];
    const otherGoals = goals.slice(1);

    return (
        <div ref={containerRef} className="container mx-auto px-4">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        {isArabic ? "أهدافنا" : "Our Goals"}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        {isArabic ? "نسعى لتحقيق التميز" : "Striving for excellence"}
                    </p>
                </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Featured Goal - Large Card */}
                <div className="goal-card lg:col-span-5 lg:row-span-2">
                    <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden group">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-64 h-64 rounded-full border-[40px] border-current -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full border-[30px] border-current translate-y-1/2 -translate-x-1/2" />
                        </div>

                        <div className="relative z-10">
                            {/* Number badge */}
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8">
                                <span className="text-3xl font-bold">01</span>
                            </div>

                            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                                {isArabic ? featuredGoal.titleAr : featuredGoal.titleEn}
                            </h3>

                            {(featuredGoal.descriptionEn || featuredGoal.descriptionAr) && (
                                <p className="text-lg opacity-90 leading-relaxed">
                                    {isArabic ? featuredGoal.descriptionAr : featuredGoal.descriptionEn}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Other Goals - Smaller Cards */}
                {otherGoals.map((goal, idx) => (
                    <div
                        key={goal.id}
                        className={`goal-card ${idx === 0 || idx === 1 ? "lg:col-span-7" : "lg:col-span-4"
                            }`}
                    >
                        <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors group">
                            <div className="flex items-start gap-4">
                                {/* Number */}
                                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                                    <span className="text-lg font-bold text-foreground/70 group-hover:text-primary transition-colors">
                                        {String(idx + 2).padStart(2, "0")}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {isArabic ? goal.titleAr : goal.titleEn}
                                    </h3>
                                    {(goal.descriptionEn || goal.descriptionAr) && (
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {isArabic ? goal.descriptionAr : goal.descriptionEn}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty state cards if less than 4 goals */}
                {goals.length < 4 && goals.length > 1 && (
                    <div className="goal-card lg:col-span-4">
                        <div className="h-full p-6 rounded-2xl bg-card/50 border border-dashed border-border/50 flex items-center justify-center">
                            <p className="text-muted-foreground text-sm">
                                {isArabic ? "المزيد قريباً" : "More coming soon"}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
