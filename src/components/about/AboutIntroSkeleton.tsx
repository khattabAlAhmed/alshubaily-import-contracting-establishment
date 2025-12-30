import { Skeleton } from "@/components/ui/skeleton";

export function AboutIntroSkeleton() {
    return (
        <div className="container mx-auto px-4">
            {/* Header skeleton */}
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <Skeleton className="h-8 w-32 mx-auto mb-6 rounded-full" />
                <Skeleton className="h-12 w-80 mx-auto mb-4" />
                <Skeleton className="h-6 w-64 mx-auto" />
            </div>

            {/* Cards grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 lg:p-8 rounded-2xl border border-border/50 bg-card/80">
                        <Skeleton className="w-14 h-14 rounded-xl mb-6" />
                        <Skeleton className="h-7 w-32 mb-4" />
                        <div className="space-y-3">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                        <div className="mt-6 pt-4 border-t border-border/50">
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
