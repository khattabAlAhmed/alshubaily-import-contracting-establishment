import { Skeleton } from "@/components/ui/skeleton";

export function AboutContactSkeleton() {
    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Left skeleton */}
                <div>
                    <div className="mb-10">
                        <Skeleton className="h-10 w-48 mb-4 bg-white/10" />
                        <Skeleton className="h-6 w-72 bg-white/10" />
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-5 rounded-2xl"
                                style={{ backgroundColor: "var(--contact-card-bg)" }}
                            >
                                <Skeleton className="w-14 h-14 rounded-xl bg-white/10" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-20 mb-2 bg-white/10" />
                                    <Skeleton className="h-6 w-40 bg-white/10" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <Skeleton className="h-4 w-24 mb-4 bg-white/10" />
                        <div className="flex gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="w-12 h-12 rounded-xl bg-white/10" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right skeleton - Map */}
                <div>
                    <Skeleton className="h-[400px] lg:h-[500px] rounded-3xl bg-white/10" />
                </div>
            </div>
        </div>
    );
}
