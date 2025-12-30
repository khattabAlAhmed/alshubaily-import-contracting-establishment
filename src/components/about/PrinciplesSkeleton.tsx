import { Skeleton } from "@/components/ui/skeleton";

export function PrinciplesSkeleton() {
    return (
        <div className="container mx-auto px-4 relative z-10">
            {/* Header skeleton */}
            <div className="text-center mb-16">
                <Skeleton className="h-10 w-40 mx-auto mb-6 rounded-full" />
                <Skeleton className="h-10 w-72 mx-auto mb-4" />
                <Skeleton className="h-5 w-96 mx-auto" />
            </div>

            {/* Timeline skeleton */}
            <div className="relative max-w-4xl mx-auto">
                {/* Center line */}
                <Skeleton className="hidden md:block absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2" />

                {/* Cards */}
                <div className="space-y-8 md:space-y-12">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-4 md:gap-0 ${i % 2 === 1 ? "md:flex-row" : "md:flex-row-reverse"
                                }`}
                        >
                            {/* Mobile dot */}
                            <Skeleton className="md:hidden w-8 h-8 rounded-full flex-shrink-0" />

                            {/* Card */}
                            <div className={`flex-1 md:w-[calc(50%-2rem)] ${i % 2 === 1 ? "md:pe-8" : "md:ps-8"}`}>
                                <div className="p-6 rounded-2xl border border-border/50">
                                    <div className="flex items-start gap-4">
                                        <Skeleton className="hidden md:block w-10 h-10 rounded-lg flex-shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-6 w-48" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Center dot skeleton */}
                            <Skeleton className="hidden md:block absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full" />

                            {/* Spacer */}
                            <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
