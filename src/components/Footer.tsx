import { Suspense } from "react";
import { getCachedHeaderData } from "@/actions/header";
import { getCachedContactInfo, getCachedSocialMedia } from "@/actions/website-info";
import { FooterClient } from "./footer/FooterClient";
import { Skeleton } from "@/components/ui/skeleton";

async function FooterData() {
    const [headerData, contactInfo, socialLinks] = await Promise.all([
        getCachedHeaderData(),
        getCachedContactInfo(),
        getCachedSocialMedia(),
    ]);

    return (
        <FooterClient
            data={headerData}
            contactInfo={contactInfo}
            socialLinks={socialLinks}
        />
    );
}

function FooterSkeleton() {
    return (
        <footer className="bg-foreground text-background">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <Skeleton className="w-12 h-12 rounded-xl bg-background/10" />
                            <Skeleton className="h-6 w-24 bg-background/10" />
                        </div>
                        <Skeleton className="h-20 w-full bg-background/10 mb-6" />
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="w-10 h-10 rounded-xl bg-background/10" />
                            ))}
                        </div>
                    </div>
                    {[1, 2, 3].map((col) => (
                        <div key={col}>
                            <Skeleton className="h-6 w-32 bg-background/10 mb-6" />
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="h-4 w-28 bg-background/10" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="border-t border-background/10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-64 bg-background/10" />
                        <div className="flex gap-6">
                            <Skeleton className="h-4 w-24 bg-background/10" />
                            <Skeleton className="h-4 w-24 bg-background/10" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default function Footer() {
    return (
        <Suspense fallback={<FooterSkeleton />}>
            <FooterData />
        </Suspense>
    );
}
