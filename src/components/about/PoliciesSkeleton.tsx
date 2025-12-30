import { Skeleton } from "@/components/ui/skeleton";

export function PoliciesSkeleton() {
    return (
        <div className="container mx-auto px-4">
            {/* Header skeleton */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                <div className="flex items-start gap-4">
                    <Skeleton className="w-14 h-14 rounded-2xl" />
                    <div>
                        <Skeleton className="h-8 w-40 mb-2" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                </div>
                <Skeleton className="h-5 w-24" />
            </div>

            {/* Grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="rounded-2xl border border-border/50 p-5">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="w-5 h-5 rounded ms-auto" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
