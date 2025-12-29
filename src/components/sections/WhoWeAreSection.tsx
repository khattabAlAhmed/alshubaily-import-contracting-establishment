import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { getCompanyProfile } from "@/actions/website-info";
import { getAllVisions, getAllMissions, getAllCompanyValues } from "@/actions/website-info";
import { WhoWeAreSkeleton } from "./SectionSkeletons";
import { WhoWeAreContent } from "./WhoWeAreContent";

async function WhoWeAreData() {
    const locale = await getLocale();
    const isArabic = locale === "ar";

    const [profile, visions, missions, values] = await Promise.all([
        getCompanyProfile(),
        getAllVisions(),
        getAllMissions(),
        getAllCompanyValues(),
    ]);

    return (
        <WhoWeAreContent
            profile={profile}
            visions={visions}
            missions={missions}
            values={values}
            locale={locale}
            isArabic={isArabic}
        />
    );
}

export default function WhoWeAreSection() {
    return (
        <section className="py-16 md:py-24 bg-background" aria-label="Who We Are">
            <Suspense fallback={<WhoWeAreSkeleton />}>
                <WhoWeAreData />
            </Suspense>
        </section>
    );
}
