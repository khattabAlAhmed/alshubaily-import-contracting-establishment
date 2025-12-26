"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { PageHeader, DataTable, type Column } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Film, ChevronRight } from "lucide-react";
import type { ImportService } from "@/actions/import";

type ServiceWithSlideCount = ImportService & {
    slideCount: number;
};

type ImportSlidesClientProps = {
    services: ServiceWithSlideCount[];
};

export function ImportSlidesClient({ services }: ImportSlidesClientProps) {
    const locale = useLocale();

    const columns: Column<ServiceWithSlideCount>[] = [
        {
            key: "title",
            labelEn: "Service",
            labelAr: "الخدمة",
            render: (item) => (
                <span className="font-medium">{locale === "ar" ? item.titleAr : item.titleEn}</span>
            ),
        },
        {
            key: "slideCount",
            labelEn: "Slides",
            labelAr: "الشرائح",
            render: (item) => (
                <span className="flex items-center gap-2">
                    <Film className="h-4 w-4 text-muted-foreground" />
                    {item.slideCount}
                </span>
            ),
        },
        {
            key: "actions",
            labelEn: "Actions",
            labelAr: "إجراءات",
            render: (item) => (
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/services/import/${item.id}/slides`}>
                        {locale === "ar" ? "إدارة الشرائح" : "Manage Slides"}
                        <ChevronRight className="h-4 w-4 ml-1 rtl:mr-1 rtl:ml-0 rtl:rotate-180" />
                    </Link>
                </Button>
            ),
        },
    ];

    return (
        <>
            <PageHeader
                titleEn="Import Services Slides"
                titleAr="شرائح خدمات الاستيراد"
                descriptionEn="Manage hero carousel slides for each import service"
                descriptionAr="إدارة شرائح البانر لكل خدمة استيراد"
            />

            <DataTable
                data={services}
                columns={columns}
                getRowId={(item) => item.id}
                searchable
                searchPlaceholder={locale === "ar" ? "بحث..." : "Search..."}
                emptyMessageEn="No import services found"
                emptyMessageAr="لا توجد خدمات استيراد"
            />
        </>
    );
}
