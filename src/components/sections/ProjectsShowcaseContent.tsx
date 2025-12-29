"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import type { ProjectWithRelations } from "@/actions/projects";

interface ProjectsShowcaseContentProps {
    projects: ProjectWithRelations[];
    locale: string;
}

export function ProjectsShowcaseContent({ projects, locale }: ProjectsShowcaseContentProps) {
    const isArabic = locale === "ar";
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [activeHover, setActiveHover] = useState<string | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header animation
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
            );

            // Grid items stagger animation
            if (gridRef.current) {
                gsap.fromTo(
                    gridRef.current.children,
                    { opacity: 0, scale: 0.95, y: 30 },
                    { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.3, ease: "power2.out" }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    if (projects.length === 0) {
        return null;
    }

    // Bento grid layout: first project is featured, rest are smaller
    const featuredProject = projects[0];
    const gridProjects = projects.slice(1, 5);

    const getProjectLink = (project: ProjectWithRelations) => {
        const slug = isArabic ? project.slugAr : project.slugEn;
        return `/${locale}/projects/${slug}`;
    };

    return (
        <div className="container mx-auto px-4">
            {/* Section Header */}
            <div
                ref={headerRef}
                className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
                style={{ opacity: 0 }}
            >
                <div>
                    {/* Label */}
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-primary font-semibold text-sm uppercase tracking-widest">
                            {isArabic ? "أعمالنا المميزة" : "Featured Work"}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                        {isArabic ? "مشاريعنا" : "Our Projects"}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-lg text-muted-foreground max-w-xl">
                        {isArabic
                            ? "استعرض مجموعة من أبرز المشاريع التي نفذناها بنجاح"
                            : "Explore our portfolio of successfully completed projects"
                        }
                    </p>
                </div>

                {/* View All Button */}
                <Link
                    href={`/${locale}/projects`}
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-foreground text-foreground rounded-full font-semibold transition-all duration-300 hover:bg-foreground hover:text-background"
                >
                    {isArabic ? "عرض الكل" : "View All"}
                    <svg className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>

            {/* Bento Grid */}
            <div
                ref={gridRef}
                className="grid grid-cols-12 gap-4 md:gap-6"
            >
                {/* Featured Project - Large Card */}
                {featuredProject && (
                    <Link
                        href={getProjectLink(featuredProject)}
                        className="col-span-12 md:col-span-8 lg:col-span-6 row-span-2 group relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-auto min-h-[400px]"
                        style={{ opacity: 0 }}
                        onMouseEnter={() => setActiveHover(featuredProject.id)}
                        onMouseLeave={() => setActiveHover(null)}
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{
                                backgroundImage: featuredProject.mainImage?.url
                                    ? `url(${featuredProject.mainImage.url})`
                                    : "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)"
                            }}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                        {/* Content */}
                        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                            {/* Type Badge */}
                            {featuredProject.projectType && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm w-fit mb-4">
                                    {isArabic ? featuredProject.projectType.titleAr : featuredProject.projectType.titleEn}
                                </span>
                            )}

                            {/* Title */}
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 transition-transform duration-300 group-hover:-translate-y-1">
                                {isArabic ? featuredProject.titleAr : featuredProject.titleEn}
                            </h3>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                                {featuredProject.locationEn && (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {isArabic ? featuredProject.locationAr : featuredProject.locationEn}
                                    </span>
                                )}
                                {featuredProject.year && (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {featuredProject.year}
                                    </span>
                                )}
                            </div>

                            {/* Explore indicator */}
                            <div className={`absolute ${isArabic ? "left-6 md:left-8" : "right-6 md:right-8"} bottom-6 md:bottom-8 w-12 h-12 rounded-full bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white text-foreground`}>
                                <svg className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Grid Projects - Smaller Cards */}
                {gridProjects.map((project, index) => (
                    <Link
                        key={project.id}
                        href={getProjectLink(project)}
                        className={`
                            col-span-6 md:col-span-4 lg:col-span-3 
                            group relative rounded-2xl overflow-hidden aspect-square
                            ${activeHover === project.id ? "z-10" : ""}
                        `}
                        style={{ opacity: 0 }}
                        onMouseEnter={() => setActiveHover(project.id)}
                        onMouseLeave={() => setActiveHover(null)}
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{
                                backgroundImage: project.mainImage?.url
                                    ? `url(${project.mainImage.url})`
                                    : "linear-gradient(135deg, var(--muted) 0%, var(--secondary) 100%)"
                            }}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Content */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                            {/* Year Badge */}
                            {project.year && (
                                <span className="text-white/70 text-xs font-medium mb-1">
                                    {project.year}
                                </span>
                            )}

                            {/* Title */}
                            <h3 className="text-sm md:text-base font-semibold text-white leading-tight transition-transform duration-300 group-hover:-translate-y-0.5">
                                {isArabic ? project.titleAr : project.titleEn}
                            </h3>

                            {/* Location */}
                            {project.locationEn && (
                                <p className="text-white/60 text-xs mt-1 truncate">
                                    {isArabic ? project.locationAr : project.locationEn}
                                </p>
                            )}
                        </div>

                        {/* Number indicator */}
                        <div className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-sm font-bold`}>
                            {String(index + 2).padStart(2, "0")}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
