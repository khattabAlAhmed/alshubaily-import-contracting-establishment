import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { getCachedContactInfo, getCachedCompanyProfile } from "@/actions/website-info";
import { ContactContent } from "./ContactContent";
import { ContactSkeleton } from "./ContactSkeleton";

async function ContactData() {
    const locale = await getLocale();
    const [contactInfo, companyProfile] = await Promise.all([
        getCachedContactInfo(),
        getCachedCompanyProfile(),
    ]);

    return (
        <ContactContent
            contactInfo={contactInfo}
            companyProfile={companyProfile}
            locale={locale}
        />
    );
}

export default function ContactSection() {
    return (
        <section
            className="py-20 md:py-28 relative overflow-hidden"
            style={{ backgroundColor: "var(--contact-bg)" }}
            aria-label="Contact"
        >
            {/* Background decoration */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 20% 80%, var(--contact-accent) 0%, transparent 50%),
                                     radial-gradient(circle at 80% 20%, var(--primary) 0%, transparent 40%)`
                }}
            />

            <Suspense fallback={<ContactSkeleton />}>
                <ContactData />
            </Suspense>
        </section>
    );
}
