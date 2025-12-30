import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { getCachedOrganizationGoals } from "@/actions/website-info";
import { GoalsContent } from "./GoalsContent";
import { GoalsSkeleton } from "./GoalsSkeleton";

async function GoalsData() {
    const locale = await getLocale();
    const goals = await getCachedOrganizationGoals();

    return <GoalsContent goals={goals} locale={locale} />;
}

export default function GoalsSection() {
    return (
        <section
            className="py-20 md:py-28"
            style={{ backgroundColor: "var(--about-goals-bg)" }}
            aria-label="Organization Goals"
        >
            <Suspense fallback={<GoalsSkeleton />}>
                <GoalsData />
            </Suspense>
        </section>
    );
}
