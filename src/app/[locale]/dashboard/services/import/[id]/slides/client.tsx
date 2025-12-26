"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader, DataTable, type Column, type DataTableAction, DeleteDialog } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Image, Check, X } from "lucide-react";
import { toast } from "sonner";
import {
    deleteHeroSlide,
    type HeroSection,
    type HeroSlideWithRelations,
    type AvailableContent,
} from "@/actions/hero-carousel";
import { HeroSlideForm } from "@/app/[locale]/dashboard/hero-carousel/new/form";

type ServiceSlidesClientProps = {
    service: { id: string; titleEn: string; titleAr: string };
    slides: HeroSlideWithRelations[];
    sections: HeroSection[];
    content: AvailableContent;
    images: { id: string; url: string }[];
    serviceType: "import" | "contracting";
};

export function ServiceSlidesClient({
    service,
    slides,
    sections,
    content,
    images,
    serviceType,
}: ServiceSlidesClientProps) {
    const locale = useLocale();
    const router = useRouter();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [selectedSlide, setSelectedSlide] = useState<HeroSlideWithRelations | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");

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

    const openCreateForm = () => {
        setSelectedSlide(null);
        setFormMode("create");
        setFormDialogOpen(true);
    };

    const openEditForm = (slide: HeroSlideWithRelations) => {
        setSelectedSlide(slide);
        setFormMode("edit");
        setFormDialogOpen(true);
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
            key: "active",
            labelEn: "Active",
            labelAr: "نشط",
            render: (item) => item.isActive ? (
                <Check className="h-4 w-4 text-green-500" />
            ) : (
                <X className="h-4 w-4 text-muted-foreground" />
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
            onClick: (item) => openEditForm(item),
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

    const backHref = serviceType === "import"
        ? "/dashboard/services/import/slides"
        : "/dashboard/services/contracting/slides";

    return (
        <>
            <PageHeader
                titleEn={`${service.titleEn} - Slides`}
                titleAr={`${service.titleAr} - الشرائح`}
                descriptionEn={`Manage hero carousel slides for this ${serviceType} service`}
                descriptionAr={`إدارة شرائح البانر لهذه الخدمة`}
            />

            <div className="flex justify-between items-center mb-6">
                <Button variant="outline" asChild>
                    <Link href={backHref}>
                        {locale === "ar" ? "← العودة" : "← Back"}
                    </Link>
                </Button>
                <Button onClick={openCreateForm}>
                    <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {locale === "ar" ? "شريحة جديدة" : "New Slide"}
                </Button>
            </div>

            <DataTable
                data={slides}
                columns={columns}
                actions={actions}
                getRowId={(item) => item.id}
                searchable
                searchPlaceholder={locale === "ar" ? "بحث..." : "Search..."}
                emptyMessageEn="No slides found for this service"
                emptyMessageAr="لا توجد شرائح لهذه الخدمة"
            />

            {/* Slide Form Dialog */}
            <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {formMode === "edit"
                                ? (locale === "ar" ? "تعديل الشريحة" : "Edit Slide")
                                : (locale === "ar" ? "شريحة جديدة" : "New Slide")
                            }
                        </DialogTitle>
                    </DialogHeader>
                    <HeroSlideForm
                        mode={formMode}
                        sections={sections}
                        content={content}
                        images={images}
                        existingSlide={selectedSlide || undefined}
                        parentImportServiceId={serviceType === "import" ? service.id : undefined}
                        parentContractingServiceId={serviceType === "contracting" ? service.id : undefined}
                    />
                </DialogContent>
            </Dialog>

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
