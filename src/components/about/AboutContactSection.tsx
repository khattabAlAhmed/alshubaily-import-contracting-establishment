import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { getCachedContactInfo, getCachedCompanyProfile, getCachedSocialMedia } from "@/actions/website-info";
import { AboutContactContent } from "./AboutContactContent";
import { AboutContactSkeleton } from "./AboutContactSkeleton";

async function AboutContactData() {
    const locale = await getLocale();
    const [contactInfo, profile, socialMedia] = await Promise.all([
        getCachedContactInfo(),
        getCachedCompanyProfile(),
        getCachedSocialMedia(),
    ]);

    return (
        <AboutContactContent
            contactInfo={contactInfo}
            companyName={profile ? (locale === "ar" ? profile.nameAr : profile.nameEn) : null}
            socialMedia={socialMedia}
            locale={locale}
        />
    );
}

export default function AboutContactSection() {
    return (
        <section
            className="py-20 md:py-28"
            style={{ backgroundColor: "var(--contact-bg)" }}
            aria-label="Contact Information"
        >
            <Suspense fallback={<AboutContactSkeleton />}>
                <AboutContactData />
            </Suspense>
        </section>
    );
}
