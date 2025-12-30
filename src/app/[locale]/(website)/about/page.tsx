import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";
import AboutIntroSection from "@/components/about/AboutIntroSection";
import GoalsSection from "@/components/about/GoalsSection";
import PrinciplesSection from "@/components/about/PrinciplesSection";
import PoliciesSection from "@/components/about/PoliciesSection";
import AboutContactSection from "@/components/about/AboutContactSection";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const t = await getTranslations("about");

    return {
        title: t("meta.title"),
        description: t("meta.description"),
    };
}

export default async function AboutPage() {
    return (
        <main className="min-h-screen">
            {/* Introduction: Vision, Mission, Values */}
            <AboutIntroSection />

            {/* Organization Goals */}
            <GoalsSection />

            {/* Work Principles */}
            <PrinciplesSection />

            {/* General Policies */}
            <PoliciesSection />

            {/* Contact + Map */}
            <AboutContactSection />
        </main>
    );
}
