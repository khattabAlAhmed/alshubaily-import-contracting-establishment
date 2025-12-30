import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { getCachedWorkPrinciples } from "@/actions/website-info";
import { PrinciplesContent } from "./PrinciplesContent";
import { PrinciplesSkeleton } from "./PrinciplesSkeleton";

async function PrinciplesData() {
    const locale = await getLocale();
    const principles = await getCachedWorkPrinciples();

    return <PrinciplesContent principles={principles} locale={locale} />;
}

export default function PrinciplesSection() {
    return (
        <section
            className="py-20 md:py-28 bg-background relative overflow-hidden"
            aria-label="Work Principles"
        >
            {/* Subtle background pattern */}
            <div
                className="absolute inset-0 opacity-50 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, var(--border) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px"
                }}
            />

            <Suspense fallback={<PrinciplesSkeleton />}>
                <PrinciplesData />
            </Suspense>
        </section>
    );
}
