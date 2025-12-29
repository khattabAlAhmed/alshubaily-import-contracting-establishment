import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { getAllStrengths, getAllExperiences, getAllCommitments } from "@/actions/website-info";
import { SectionSkeleton } from "./SectionSkeletons";
import { WhyUsContent } from "./WhyUsContent";

async function WhyUsData() {
    const locale = await getLocale();
    const isArabic = locale === "ar";

    const [strengths, experiences, commitments] = await Promise.all([
        getAllStrengths(),
        getAllExperiences(),
        getAllCommitments(),
    ]);

    return (
        <WhyUsContent
            strengths={strengths}
            experiences={experiences}
            commitments={commitments}
            locale={locale}
            isArabic={isArabic}
        />
    );
}

export default function WhyUsSection() {
    return (
        <section
            className="py-16 md:py-24"
            style={{ background: "var(--section-bg-alt)" }}
            aria-label="Why Choose Us"
        >
            <Suspense fallback={<SectionSkeleton />}>
                <WhyUsData />
            </Suspense>
        </section>
    );
}
