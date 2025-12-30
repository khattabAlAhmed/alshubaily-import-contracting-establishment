import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { getAllPartners } from "@/actions/partners";
import { PartnersContent } from "./PartnersContent";
import { PartnersSkeleton } from "./PartnersSkeleton";

async function PartnersData() {
    const locale = await getLocale();
    const partners = await getAllPartners();

    return <PartnersContent partners={partners} locale={locale} />;
}

export default function PartnersSection() {
    return (
        <section
            className="py-16 md:py-20 overflow-hidden"
            style={{ backgroundColor: "var(--partners-bg)" }}
            aria-label="Partners"
        >
            <Suspense fallback={<PartnersSkeleton />}>
                <PartnersData />
            </Suspense>
        </section>
    );
}
