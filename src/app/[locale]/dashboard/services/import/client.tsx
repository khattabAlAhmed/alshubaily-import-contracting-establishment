"use client";

import { useLocale, useTranslations } from "next-intl";
import { PageHeader, DataTable, Column, DataTableAction, DeleteDialog } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { deleteImportService } from "@/actions/import";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Factory,
    Users,
    Target,
    Ship,
    Truck,
    ShieldCheck,
    Package,
    ThumbsUp,
    HelpCircle,
    Film
} from "lucide-react";
import type { ImportService } from "@/actions/import";

type ImportClientProps = {
    services: ImportService[];
};

const quickButtons = [
    { id: "slides", labelEn: "Slides", labelAr: "الشرائح", href: "/dashboard/services/import/slides", icon: Film },
    { id: "suppliers", labelEn: "Suppliers", labelAr: "الموردين", href: "/dashboard/services/import/suppliers", icon: Factory },
    { id: "beneficiaries", labelEn: "Beneficiaries", labelAr: "المستفيدين", href: "/dashboard/services/import/beneficiaries", icon: Users },
    { id: "usages", labelEn: "Usages", labelAr: "الاستخدامات", href: "/dashboard/services/import/usages", icon: Target },
    { id: "import-methods", labelEn: "Import Methods", labelAr: "طرق الاستيراد", href: "/dashboard/services/import/import-methods", icon: Ship },
    { id: "delivery-methods", labelEn: "Delivery Methods", labelAr: "طرق التوصيل", href: "/dashboard/services/import/delivery-methods", icon: Truck },
    { id: "quality-warranty", labelEn: "Quality & Warranty", labelAr: "الجودة والضمان", href: "/dashboard/services/import/quality-warranty", icon: ShieldCheck },
    { id: "shipments", labelEn: "Shipments", labelAr: "الشحنات", href: "/dashboard/services/import/shipments", icon: Package },
    { id: "why-choose-us", labelEn: "Why Choose Us", labelAr: "لماذا تختارنا", href: "/dashboard/services/import/why-choose-us", icon: ThumbsUp },
    { id: "faqs", labelEn: "FAQs", labelAr: "الأسئلة الشائعة", href: "/dashboard/services/import/faqs", icon: HelpCircle },
];

export function ImportClient({ services }: ImportClientProps) {
    const locale = useLocale();
    const t = useTranslations("dashboard.common");
    const router = useRouter();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<ImportService | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const columns: Column<ImportService>[] = [
        {
            key: "titleEn",
            labelEn: "Title",
            labelAr: "العنوان",
            render: (item) => (
                <span className="font-medium">
                    {locale === "ar" ? item.titleAr : item.titleEn}
                </span>
            ),
        },
        {
            key: "slugEn",
            labelEn: "Slug",
            labelAr: "المعرف",
            render: (item) => (
                <code className="text-xs bg-muted px-2 py-1 rounded">
                    {locale === "ar" ? item.slugAr : item.slugEn}
                </code>
            ),
        },
        {
            key: "createdAt",
            labelEn: "Created",
            labelAr: "تاريخ الإنشاء",
            render: (item) => new Date(item.createdAt).toLocaleDateString(locale),
        },
    ];

    const actions: DataTableAction<ImportService>[] = [
        {
            type: "edit",
            labelEn: t("edit"),
            labelAr: t("edit"),
            href: (item) => `/dashboard/services/import/${item.id}`,
        },
        {
            type: "delete",
            labelEn: t("delete"),
            labelAr: t("delete"),
            onClick: (item) => {
                setSelectedService(item);
                setDeleteDialogOpen(true);
            },
        },
    ];

    const handleDelete = async () => {
        if (!selectedService) return;

        setIsDeleting(true);
        const result = await deleteImportService(selectedService.id);
        setIsDeleting(false);

        if (result.success) {
            toast.success(locale === "ar" ? "تم حذف الخدمة" : "Service deleted");
            setDeleteDialogOpen(false);
            router.refresh();
        } else {
            toast.error(result.message);
        }
    };

    return (
        <>
            <PageHeader
                titleEn="Import Services"
                titleAr="خدمات الاستيراد"
                descriptionEn="Manage import service offerings"
                descriptionAr="إدارة عروض خدمات الاستيراد"
                actionLabel={locale === "ar" ? "إضافة خدمة" : "Add Service"}
                actionHref="/dashboard/services/import/new"
            />

            {/* Quick Actions */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>
                        {locale === "ar" ? "إعدادات سريعة" : "Quick Settings"}
                    </CardTitle>
                    <CardDescription>
                        {locale === "ar" ? "إدارة البيانات المرجعية لخدمات الاستيراد" : "Manage reference data for import services"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
                        {quickButtons.map((btn) => {
                            const Icon = btn.icon;
                            return (
                                <Button
                                    key={btn.id}
                                    variant="outline"
                                    className="h-auto flex-col gap-2 py-4"
                                    asChild
                                >
                                    <Link href={btn.href}>
                                        <Icon className="h-5 w-5" />
                                        <span className="text-xs text-center">
                                            {locale === "ar" ? btn.labelAr : btn.labelEn}
                                        </span>
                                    </Link>
                                </Button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Services List */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {locale === "ar" ? "الخدمات" : "Services"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        data={services}
                        columns={columns}
                        actions={actions}
                        getRowId={(item) => item.id}
                        searchable
                        searchPlaceholder={t("search")}
                        emptyMessageEn="No import services found"
                        emptyMessageAr="لا توجد خدمات استيراد"
                    />
                </CardContent>
            </Card>

            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                itemNameEn={selectedService?.titleEn || "Service"}
                itemNameAr={selectedService?.titleAr || "الخدمة"}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </>
    );
}
