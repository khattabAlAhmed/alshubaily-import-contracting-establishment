"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsShowcaseSkeleton() {
    return (
        <div className="container mx-auto px-4">
            {/* Header skeleton */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                <div>
                    <Skeleton className="h-4 w-32 mb-4" />
                    <Skeleton className="h-12 w-80 mb-3" />
                    <Skeleton className="h-6 w-96" />
                </div>
                <Skeleton className="h-12 w-40 rounded-full" />
            </div>

            {/* Bento grid skeleton */}
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {/* Large featured card */}
                <div className="col-span-12 md:col-span-8 lg:col-span-6 row-span-2">
                    <Skeleton className="aspect-[4/3] md:aspect-auto md:h-full w-full rounded-3xl" />
                </div>

                {/* Top right cards */}
                <div className="col-span-6 md:col-span-4 lg:col-span-3">
                    <Skeleton className="aspect-square rounded-2xl" />
                </div>
                <div className="col-span-6 md:col-span-4 lg:col-span-3">
                    <Skeleton className="aspect-square rounded-2xl" />
                </div>

                {/* Bottom cards */}
                <div className="col-span-6 md:col-span-4 lg:col-span-3">
                    <Skeleton className="aspect-square rounded-2xl" />
                </div>
                <div className="col-span-6 md:col-span-4 lg:col-span-3">
                    <Skeleton className="aspect-square rounded-2xl" />
                </div>
            </div>
        </div>
    );
}
