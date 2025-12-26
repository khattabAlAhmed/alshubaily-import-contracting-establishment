"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader, DataTable, type Column, type DataTableAction, DeleteDialog } from "@/components/dashboard/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, Plus, Pencil, Trash2, Image, Check, X } from "lucide-react";
import { toast } from "sonner";
import {
    deleteHeroSlide,
    type HeroSection,
    type HeroSlideWithRelations,
} from "@/actions/hero-carousel";

type HeroCarouselClientProps = {
    sections: HeroSection[];
    slides: HeroSlideWithRelations[];
};

export function HeroCarouselClient({ sections, slides }: HeroCarouselClientProps) {
    const locale = useLocale();
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedSlide, setSelectedSlide] = useState<HeroSlideWithRelations | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!selectedSlide) return;

        setIsDeleting(true);
        const result = await deleteHeroSlide(selectedSlide.id);
        setIsDeleting(false);

        if (result.success) {
            toast.success(locale === "ar" ? "تم حذف الشريحة" : "Slide deleted");
            setDeleteDialogOpen(false);
            router.refresh();
        } else {
            toast.error(result.message);
        }
    };

    const slideTypeLabels: Record<string, { en: string; ar: string }> = {
        article: { en: "Article", ar: "مقال" },
        product: { en: "Product", ar: "منتج" },
        main_service: { en: "Main Service", ar: "خدمة رئيسية" },
        import_service: { en: "Import Service", ar: "خدمة استيراد" },
        contracting_service: { en: "Contracting Service", ar: "خدمة مقاولات" },
        project: { en: "Project", ar: "مشروع" },
        custom: { en: "Custom", ar: "مخصص" },
    };

    const columns: Column<HeroSlideWithRelations>[] = [
        {
            key: "image",
            labelEn: "Image",
            labelAr: "الصورة",
            className: "w-16",
            render: (item) => item.backgroundImage ? (
                <img src={item.backgroundImage.url} alt="" className="w-12 h-12 object-cover rounded" />
            ) : (
                <div
                    className="w-12 h-12 rounded flex items-center justify-center"
                    style={{ backgroundColor: item.backgroundColor || '#e5e7eb' }}
                >
                    <Image className="h-5 w-5 text-white/50" />
                </div>
            ),
        },
        {
            key: "title",
            labelEn: "Title",
            labelAr: "العنوان",
            render: (item) => (
                <div>
                    <p className="font-medium">{locale === "ar" ? item.titleAr : item.titleEn}</p>
                    {item.subtitleEn && (
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {locale === "ar" ? item.subtitleAr : item.subtitleEn}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: "type",
            labelEn: "Type",
            labelAr: "النوع",
            render: (item) => (
                <span className="text-sm px-2 py-1 bg-muted rounded">
                    {locale === "ar"
                        ? slideTypeLabels[item.slideType]?.ar || item.slideType
                        : slideTypeLabels[item.slideType]?.en || item.slideType
                    }
                </span>
            ),
        },
        {
            key: "cta",
            labelEn: "CTA",
            labelAr: "زر العمل",
            render: (item) => item.ctaEnabled ? (
                <Check className="h-4 w-4 text-green-500" />
            ) : (
                <X className="h-4 w-4 text-muted-foreground" />
            ),
        },
        {
            key: "active",
            labelEn: "Active",
            labelAr: "نشط",
            render: (item) => item.isActive ? (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                    {locale === "ar" ? "نشط" : "Active"}
                </span>
            ) : (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded">
                    {locale === "ar" ? "غير نشط" : "Inactive"}
                </span>
            ),
        },
        {
            key: "order",
            labelEn: "Order",
            labelAr: "الترتيب",
            render: (item) => <span className="text-muted-foreground">{item.sortOrder}</span>,
        },
    ];

    const actions: DataTableAction<HeroSlideWithRelations>[] = [
        {
            type: "edit",
            labelEn: "Edit",
            labelAr: "تعديل",
            href: (item) => `/dashboard/hero-carousel/${item.id}`,
            icon: <Pencil className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />,
        },
        {
            type: "delete",
            labelEn: "Delete",
            labelAr: "حذف",
            onClick: (item) => {
                setSelectedSlide(item);
                setDeleteDialogOpen(true);
            },
            icon: <Trash2 className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />,
        },
    ];

    const quickActions = [
        {
            href: "/dashboard/hero-carousel/sections",
            icon: Layers,
            labelEn: "Sections",
            labelAr: "الأقسام",
            countEn: `${sections.length} sections`,
            countAr: `${sections.length} قسم`,
        },
    ];

    return (
        <>
            <PageHeader
                titleEn="Hero Carousel"
                titleAr="شرائح البانر"
                descriptionEn="Manage hero carousel slides for main pages"
                descriptionAr="إدارة شرائح البانر للصفحات الرئيسية"
                actionLabel={locale === "ar" ? "شريحة جديدة" : "New Slide"}
                actionHref="/dashboard/hero-carousel/new"
            />

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 mb-6">
                {quickActions.map((action) => (
                    <Link key={action.href} href={action.href}>
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <action.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">
                                        {locale === "ar" ? action.labelAr : action.labelEn}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {locale === "ar" ? action.countAr : action.countEn}
                                    </p>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Slides Table */}
            <DataTable
                data={slides}
                columns={columns}
                actions={actions}
                getRowId={(item) => item.id}
                searchable
                searchPlaceholder={locale === "ar" ? "بحث..." : "Search..."}
                emptyMessageEn="No slides found"
                emptyMessageAr="لا توجد شرائح"
            />

            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                itemNameEn={selectedSlide?.titleEn || "Slide"}
                itemNameAr={selectedSlide?.titleAr || "الشريحة"}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </>
    );
}
