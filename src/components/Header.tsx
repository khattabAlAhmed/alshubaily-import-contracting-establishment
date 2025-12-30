import { Suspense } from "react";
import { getCachedHeaderData } from "@/actions/header";
import { HeaderClient } from "./header/HeaderClient";
import { Skeleton } from "@/components/ui/skeleton";

async function HeaderData() {
    const data = await getCachedHeaderData();
    return <HeaderClient data={data} />;
}

function HeaderSkeleton() {
    return (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-xl" />
                        <Skeleton className="hidden sm:block h-6 w-32" />
                    </div>
                    <div className="hidden lg:flex items-center gap-2">
                        <Skeleton className="h-8 w-20 rounded-lg" />
                        <Skeleton className="h-8 w-24 rounded-lg" />
                        <Skeleton className="h-8 w-20 rounded-lg" />
                        <Skeleton className="h-8 w-20 rounded-lg" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <Skeleton className="w-10 h-10 rounded-xl" />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default function Header() {
    return (
        <Suspense fallback={<HeaderSkeleton />}>
            <HeaderData />
        </Suspense>
    );
}