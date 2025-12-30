import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { getCachedVisions, getCachedMissions, getCachedCompanyValues, getCachedCompanyProfile } from "@/actions/website-info";
import { AboutIntroContent } from "./AboutIntroContent";
import { AboutIntroSkeleton } from "./AboutIntroSkeleton";

async function AboutIntroData() {
    const locale = await getLocale();
    const [visions, missions, values, profile] = await Promise.all([
        getCachedVisions(),
        getCachedMissions(),
        getCachedCompanyValues(),
        getCachedCompanyProfile(),
    ]);

    return (
        <AboutIntroContent
            visions={visions}
            missions={missions}
            values={values}
            companyName={profile ? (locale === "ar" ? profile.nameAr : profile.nameEn) : null}
            tagline={profile ? (locale === "ar" ? profile.taglineAr : profile.taglineEn) : null}
            locale={locale}
        />
    );
}

export default function AboutIntroSection() {
    return (
        <section
            className="relative py-20 md:py-28 overflow-hidden"
            style={{ background: "linear-gradient(135deg, var(--background) 0%, var(--section-bg-alt) 100%)" }}
            aria-label="About Us Introduction"
        >
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full opacity-30"
                    style={{ background: "radial-gradient(circle, var(--about-vision) 0%, transparent 70%)" }}
                />
                <div
                    className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle, var(--about-mission) 0%, transparent 70%)" }}
                />
            </div>

            <Suspense fallback={<AboutIntroSkeleton />}>
                <AboutIntroData />
            </Suspense>
        </section>
    );
}
