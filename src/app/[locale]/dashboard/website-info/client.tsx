"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/ui";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Building2,
    Phone,
    Share2,
    Target,
    Scale,
    FileText,
    Eye,
    MessageSquare,
    Heart,
    Zap,
    Award,
    Shield,
} from "lucide-react";

const sections = [
    {
        href: "/dashboard/website-info/company-profile",
        icon: Building2,
        labelEn: "Company Profile",
        labelAr: "الملف التعريفي",
        descEn: "Main company information and branding",
        descAr: "المعلومات الرئيسية والهوية",
    },
    {
        href: "/dashboard/website-info/contact",
        icon: Phone,
        labelEn: "Contact Info",
        labelAr: "بيانات التواصل",
        descEn: "Emails, phone numbers, WhatsApp",
        descAr: "الإيميلات وأرقام التواصل والواتساب",
    },
    {
        href: "/dashboard/website-info/social-media",
        icon: Share2,
        labelEn: "Social Media",
        labelAr: "حسابات التواصل الاجتماعي",
        descEn: "Social media accounts",
        descAr: "حسابات مواقع التواصل",
    },
    {
        href: "/dashboard/website-info/goals",
        icon: Target,
        labelEn: "Organization Goals",
        labelAr: "أهداف المؤسسة",
        descEn: "Company goals and objectives",
        descAr: "أهداف وغايات الشركة",
    },
    {
        href: "/dashboard/website-info/principles",
        icon: Scale,
        labelEn: "Work Principles",
        labelAr: "مبادئ العمل",
        descEn: "Core work principles",
        descAr: "مبادئ العمل الأساسية",
    },
    {
        href: "/dashboard/website-info/policies",
        icon: FileText,
        labelEn: "General Policies",
        labelAr: "السياسات العامة",
        descEn: "Company policies",
        descAr: "سياسات الشركة",
    },
    {
        href: "/dashboard/website-info/vision",
        icon: Eye,
        labelEn: "Vision",
        labelAr: "الرؤى",
        descEn: "Company vision statements",
        descAr: "رؤى الشركة",
    },
    {
        href: "/dashboard/website-info/mission",
        icon: MessageSquare,
        labelEn: "Mission",
        labelAr: "الرسائل",
        descEn: "Mission statements",
        descAr: "رسائل الشركة",
    },
    {
        href: "/dashboard/website-info/values",
        icon: Heart,
        labelEn: "Values",
        labelAr: "القيم",
        descEn: "Core company values",
        descAr: "قيم الشركة الأساسية",
    },
    {
        href: "/dashboard/website-info/strengths",
        icon: Zap,
        labelEn: "Strengths",
        labelAr: "القوة",
        descEn: "Company strengths",
        descAr: "نقاط قوة الشركة",
    },
    {
        href: "/dashboard/website-info/experience",
        icon: Award,
        labelEn: "Experience",
        labelAr: "الخبرة",
        descEn: "Company experience",
        descAr: "خبرات الشركة",
    },
    {
        href: "/dashboard/website-info/commitment",
        icon: Shield,
        labelEn: "Commitment",
        labelAr: "الالتزام",
        descEn: "Company commitments",
        descAr: "التزامات الشركة",
    },
];

export default function WebsiteInfoClient() {
    const locale = useLocale();

    return (
        <>
            <PageHeader
                titleEn="Website Info"
                titleAr="معلومات الموقع"
                descriptionEn="Manage company information displayed on the website"
                descriptionAr="إدارة معلومات الشركة المعروضة على الموقع"
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sections.map((section) => (
                    <Link key={section.href} href={section.href}>
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-start gap-4">
                                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                                    <section.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-base">
                                        {locale === "ar" ? section.labelAr : section.labelEn}
                                    </CardTitle>
                                    <CardDescription>
                                        {locale === "ar" ? section.descAr : section.descEn}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </>
    );
}
