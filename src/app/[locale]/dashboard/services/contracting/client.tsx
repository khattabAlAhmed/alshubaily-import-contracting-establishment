"use client";

import { useLocale, useTranslations } from "next-intl";
import { PageHeader, DataTable, Column, DataTableAction, DeleteDialog } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { deleteContractingService } from "@/actions/contracting";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Hammer,
    Layers,
    Wrench,
    ShieldCheck,
    ThumbsUp,
    HelpCircle,
    ArrowRight,
    Film
} from "lucide-react";
import type { ContractingService } from "@/actions/contracting";

type ContractingClientProps = {
    services: ContractingService[];
};

const quickButtons = [
    { id: "slides", labelEn: "Slides", labelAr: "الشرائح", href: "/dashboard/services/contracting/slides", icon: Film },
    { id: "works", labelEn: "Works", labelAr: "الأعمال", href: "/dashboard/services/contracting/works", icon: Hammer },
    { id: "materials", labelEn: "Materials", labelAr: "المواد", href: "/dashboard/services/contracting/materials", icon: Layers },
    { id: "techniques", labelEn: "Techniques", labelAr: "التقنيات", href: "/dashboard/services/contracting/techniques", icon: Wrench },
    { id: "quality-safety", labelEn: "Quality & Safety", labelAr: "الجودة والسلامة", href: "/dashboard/services/contracting/quality-safety", icon: ShieldCheck },
    { id: "why-choose-us", labelEn: "Why Choose Us", labelAr: "لماذا تختارنا", href: "/dashboard/services/contracting/why-choose-us", icon: ThumbsUp },
    { id: "faqs", labelEn: "FAQs", labelAr: "الأسئلة الشائعة", href: "/dashboard/services/contracting/faqs", icon: HelpCircle },
];

export function ContractingClient({ services }: ContractingClientProps) {
    const locale = useLocale();
    const t = useTranslations("dashboard.common");
    const router = useRouter();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<ContractingService | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const columns: Column<ContractingService>[] = [
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

    const actions: DataTableAction<ContractingService>[] = [
        {
            type: "edit",
            labelEn: t("edit"),
            labelAr: t("edit"),
            href: (item) => `/dashboard/services/contracting/${item.id}`,
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
        const result = await deleteContractingService(selectedService.id);
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
                titleEn="Contracting Services"
                titleAr="خدمات المقاولات"
                descriptionEn="Manage contracting service offerings"
                descriptionAr="إدارة عروض خدمات المقاولات"
                actionLabel={locale === "ar" ? "إضافة خدمة" : "Add Service"}
                actionHref="/dashboard/services/contracting/new"
            />

            {/* Quick Actions */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>
                        {locale === "ar" ? "إعدادات سريعة" : "Quick Settings"}
                    </CardTitle>
                    <CardDescription>
                        {locale === "ar" ? "إدارة البيانات المرجعية لخدمات المقاولات" : "Manage reference data for contracting services"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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
                                        <span className="text-xs">
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
                        emptyMessageEn="No contracting services found"
                        emptyMessageAr="لا توجد خدمات مقاولات"
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
