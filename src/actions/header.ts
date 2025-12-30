"use server";

import { getAllMainServices } from "@/actions/services";
import { getAllImportServices } from "@/actions/import";
import { getAllContractingServices } from "@/actions/contracting";
import { getCompanyProfile, getAllContactInfo } from "@/actions/website-info";

export interface HeaderServiceData {
    mainServices: Array<{
        id: string;
        titleEn: string;
        titleAr: string;
        slugEn: string;
        slugAr: string;
    }>;
    importServices: Array<{
        id: string;
        titleEn: string;
        titleAr: string;
        slugEn: string;
        slugAr: string;
        mainServiceId: string | null;
    }>;
    contractingServices: Array<{
        id: string;
        titleEn: string;
        titleAr: string;
        slugEn: string;
        slugAr: string;
        mainServiceId: string | null;
    }>;
}

export interface HeaderData {
    services: HeaderServiceData;
    companyName: { en: string; ar: string } | null;
    logoUrl: string | null;
    primaryPhone: string | null;
    primaryWhatsApp: string | null;
}

export async function getHeaderData(): Promise<HeaderData> {
    const [mainServices, importServices, contractingServices, companyProfile, contactInfo] =
        await Promise.all([
            getAllMainServices(),
            getAllImportServices(),
            getAllContractingServices(),
            getCompanyProfile(),
            getAllContactInfo(),
        ]);

    const primaryPhone = contactInfo.find((c) => c.type === "phone")?.value || null;
    const primaryWhatsApp = contactInfo.find((c) => c.type === "whatsapp")?.value || null;

    return {
        services: {
            mainServices: mainServices.map((s) => ({
                id: s.id,
                titleEn: s.titleEn,
                titleAr: s.titleAr,
                slugEn: s.slugEn,
                slugAr: s.slugAr,
            })),
            importServices: importServices.map((s) => ({
                id: s.id,
                titleEn: s.titleEn,
                titleAr: s.titleAr,
                slugEn: s.slugEn,
                slugAr: s.slugAr,
                mainServiceId: s.mainServiceId,
            })),
            contractingServices: contractingServices.map((s) => ({
                id: s.id,
                titleEn: s.titleEn,
                titleAr: s.titleAr,
                slugEn: s.slugEn,
                slugAr: s.slugAr,
                mainServiceId: s.mainServiceId,
            })),
        },
        companyName: companyProfile
            ? { en: companyProfile.nameEn, ar: companyProfile.nameAr }
            : null,
        logoUrl: companyProfile?.logoImageUrl || null,
        primaryPhone,
        primaryWhatsApp,
    };
}

import { unstable_cache } from "next/cache";

/**
 * Cached version of getHeaderData - caches for 60 seconds
 */
export const getCachedHeaderData = unstable_cache(
    getHeaderData,
    ["header-data"],
    { revalidate: 60, tags: ["header-data"] }
);
