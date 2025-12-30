"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ContactSkeleton() {
    return (
        <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Left side - Info */}
                <div className="space-y-6">
                    <div>
                        <Skeleton className="h-4 w-32 mb-3" />
                        <Skeleton className="h-12 w-80 mb-4" />
                        <Skeleton className="h-20 w-full" />
                    </div>

                    {/* Quick contact buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Skeleton className="h-14 w-40 rounded-xl" />
                        <Skeleton className="h-14 w-40 rounded-xl" />
                        <Skeleton className="h-14 w-40 rounded-xl" />
                    </div>
                </div>

                {/* Right side - Form */}
                <div className="rounded-3xl p-8" style={{ backgroundColor: "var(--contact-card-bg)" }}>
                    <Skeleton className="h-8 w-48 mb-6" />
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-12 rounded-xl" />
                            <Skeleton className="h-12 rounded-xl" />
                        </div>
                        <Skeleton className="h-12 rounded-xl" />
                        <Skeleton className="h-12 rounded-xl" />
                        <Skeleton className="h-32 rounded-xl" />
                        <Skeleton className="h-14 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
