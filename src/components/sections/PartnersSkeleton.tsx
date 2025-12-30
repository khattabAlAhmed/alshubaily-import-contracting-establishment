"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PartnersSkeleton() {
    return (
        <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-10">
                <Skeleton className="h-4 w-32 mx-auto mb-3" />
                <Skeleton className="h-10 w-64 mx-auto" />
            </div>

            {/* Marquee skeleton */}
            <div className="flex gap-8 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0">
                        <Skeleton className="w-40 h-20 rounded-xl" />
                    </div>
                ))}
            </div>
        </div>
    );
}
