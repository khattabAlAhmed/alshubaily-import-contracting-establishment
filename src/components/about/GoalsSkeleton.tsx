import { Skeleton } from "@/components/ui/skeleton";

export function GoalsSkeleton() {
    return (
        <div className="container mx-auto px-4">
            {/* Header skeleton */}
            <div className="flex items-center gap-4 mb-12">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div>
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>

            {/* Bento grid skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Featured skeleton */}
                <div className="lg:col-span-5 lg:row-span-2">
                    <Skeleton className="h-full min-h-[300px] rounded-2xl" />
                </div>

                {/* Other cards */}
                <div className="lg:col-span-7">
                    <Skeleton className="h-32 rounded-2xl" />
                </div>
                <div className="lg:col-span-7">
                    <Skeleton className="h-32 rounded-2xl" />
                </div>
                <div className="lg:col-span-4">
                    <Skeleton className="h-32 rounded-2xl" />
                </div>
                <div className="lg:col-span-4">
                    <Skeleton className="h-32 rounded-2xl" />
                </div>
                <div className="lg:col-span-4">
                    <Skeleton className="h-32 rounded-2xl" />
                </div>
            </div>
        </div>
    );
}
