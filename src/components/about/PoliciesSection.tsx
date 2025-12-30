import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { getCachedGeneralPolicies } from "@/actions/website-info";
import { PoliciesContent } from "./PoliciesContent";
import { PoliciesSkeleton } from "./PoliciesSkeleton";

async function PoliciesData() {
    const locale = await getLocale();
    const policies = await getCachedGeneralPolicies();

    return <PoliciesContent policies={policies} locale={locale} />;
}

export default function PoliciesSection() {
    return (
        <section
            className="py-20 md:py-28"
            style={{ backgroundColor: "var(--about-policies-bg)" }}
            aria-label="General Policies"
        >
            <Suspense fallback={<PoliciesSkeleton />}>
                <PoliciesData />
            </Suspense>
        </section>
    );
}
