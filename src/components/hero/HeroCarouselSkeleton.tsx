"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function HeroCarouselSkeleton() {
    return (
        <div className="relative w-full h-[50vh] min-h-[400px] md:h-[60vh] lg:h-[70vh] overflow-hidden">
            {/* Background skeleton */}
            <Skeleton className="absolute inset-0 w-full h-full" />

            {/* Content skeleton */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
                {/* Badge skeleton */}
                <Skeleton className="w-24 h-6 mb-4 rounded-full" />

                {/* Title skeleton */}
                <Skeleton className="w-3/4 h-10 md:h-14 mb-3" />
                <Skeleton className="w-1/2 h-10 md:h-14 mb-4" />

                {/* Subtitle skeleton */}
                <Skeleton className="w-2/3 h-5 mb-6" />

                {/* CTA skeleton */}
                <Skeleton className="w-40 h-12 rounded-lg" />
            </div>

            {/* Navigation dots skeleton */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="w-3 h-3 rounded-full" />
                ))}
            </div>
        </div>
    );
}
