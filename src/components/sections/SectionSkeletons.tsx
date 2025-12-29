"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SectionSkeleton() {
    return (
        <div className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                {/* Section header skeleton */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <Skeleton className="h-4 w-32 mx-auto mb-6" />
                    <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
                    <Skeleton className="h-6 w-full mx-auto" />
                </div>

                {/* Three column grid skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {[1, 2, 3].map((i) => (
                        <div key={i}>
                            {/* Category header */}
                            <div className="flex items-center gap-4 mb-6">
                                <Skeleton className="w-14 h-14 rounded-2xl" />
                                <div>
                                    <Skeleton className="h-7 w-32 mb-2" />
                                    <Skeleton className="h-1 w-12" />
                                </div>
                            </div>

                            {/* List items */}
                            <div className="space-y-4 ps-6 border-s-2 border-border ms-6">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="ps-4 py-2">
                                        <Skeleton className="h-5 w-3/4 mb-2" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function WhoWeAreSkeleton() {
    return (
        <div className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center mb-20">
                    {/* Text content skeleton */}
                    <div className="lg:col-span-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Skeleton className="w-12 h-[2px]" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-14 w-full mb-4" />
                        <Skeleton className="h-14 w-3/4 mb-6" />
                        <Skeleton className="h-6 w-full mb-3" />
                        <Skeleton className="h-6 w-5/6 mb-3" />
                        <Skeleton className="h-6 w-4/5 mb-8" />

                        {/* Stats skeleton */}
                        <div className="flex gap-8 mb-8">
                            <div>
                                <Skeleton className="h-12 w-20 mb-2" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                            <div>
                                <Skeleton className="h-12 w-20 mb-2" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                        </div>

                        <Skeleton className="h-14 w-48 rounded-full" />
                    </div>

                    {/* Image skeleton */}
                    <div className="lg:col-span-6">
                        <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
                    </div>
                </div>

                {/* Cards skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-8 rounded-2xl border border-border">
                            <Skeleton className="w-16 h-16 rounded-2xl mb-6" />
                            <Skeleton className="h-3 w-24 mb-3" />
                            <Skeleton className="h-6 w-3/4 mb-3" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
