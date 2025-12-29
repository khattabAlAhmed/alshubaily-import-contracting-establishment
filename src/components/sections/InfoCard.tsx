"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface InfoCardProps {
    title: string;
    description?: string | null;
    icon?: React.ReactNode;
    accentColor?: string;
    index?: number;
}

export function InfoCard({ title, description, icon, accentColor, index = 0 }: InfoCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!cardRef.current) return;

        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: index * 0.1,
                ease: "power2.out",
            }
        );
    }, [index]);

    return (
        <div
            ref={cardRef}
            className="group relative p-6 rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            style={{ opacity: 0 }}
        >
            {/* Accent border on hover */}
            <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: `linear-gradient(135deg, ${accentColor || "var(--primary)"}20, transparent)`,
                }}
            />

            {/* Icon */}
            {icon && (
                <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{
                        background: `${accentColor || "var(--primary)"}20`,
                        color: accentColor || "var(--primary)",
                    }}
                >
                    {icon}
                </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold mb-2 text-foreground">
                {title}
            </h3>

            {/* Description */}
            {description && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
}

interface StatCardProps {
    value: string | number;
    label: string;
    suffix?: string;
    accentColor?: string;
}

export function StatCard({ value, label, suffix, accentColor }: StatCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!cardRef.current) return;

        gsap.fromTo(
            cardRef.current,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }, []);

    return (
        <div ref={cardRef} className="text-center" style={{ opacity: 0 }}>
            <div
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ color: accentColor || "var(--primary)" }}
            >
                {value}{suffix}
            </div>
            <p className="text-muted-foreground text-sm">{label}</p>
        </div>
    );
}
