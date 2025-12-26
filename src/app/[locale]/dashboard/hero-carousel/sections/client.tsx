"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { PageHeader, DataTable, type Column, type DataTableAction, DeleteDialog } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Check, X, Plus } from "lucide-react";
import { toast } from "sonner";
import {
    createHeroSection,
    updateHeroSection,
    deleteHeroSection,
    type HeroSection,
} from "@/actions/hero-carousel";

type SectionsClientProps = {
    sections: HeroSection[];
};

export function SectionsClient({ sections }: SectionsClientProps) {
    const locale = useLocale();
    const router = useRouter();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<HeroSection | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        titleEn: "",
        titleAr: "",
        slugEn: "",
        slugAr: "",
        isActive: true,
    });

    const openCreateDialog = () => {
        setSelectedSection(null);
        setFormData({
            titleEn: "",
            titleAr: "",
            slugEn: "",
            slugAr: "",
            isActive: true,
        });
        setEditDialogOpen(true);
    };

    const openEditDialog = (section: HeroSection) => {
        setSelectedSection(section);
        setFormData({
            titleEn: section.titleEn,
            titleAr: section.titleAr,
            slugEn: section.slugEn,
            slugAr: section.slugAr,
            isActive: section.isActive,
        });
        setEditDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.titleEn || !formData.titleAr || !formData.slugEn || !formData.slugAr) {
            toast.error(locale === "ar" ? "جميع الحقول مطلوبة" : "All fields are required");
            return;
        }

        setIsSaving(true);

        if (selectedSection) {
            const result = await updateHeroSection(selectedSection.id, formData);
            if (result.success) {
                toast.success(locale === "ar" ? "تم تحديث القسم" : "Section updated");
                setEditDialogOpen(false);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } else {
            const result = await createHeroSection(formData);
            if (result.success) {
                toast.success(locale === "ar" ? "تم إنشاء القسم" : "Section created");
                setEditDialogOpen(false);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        }

        setIsSaving(false);
    };

    const handleDelete = async () => {
        if (!selectedSection) return;

        setIsDeleting(true);
        const result = await deleteHeroSection(selectedSection.id);
        setIsDeleting(false);

        if (result.success) {
            toast.success(locale === "ar" ? "تم حذف القسم" : "Section deleted");
            setDeleteDialogOpen(false);
            router.refresh();
        } else {
            toast.error(result.message);
        }
    };

    const columns: Column<HeroSection>[] = [
        {
            key: "title",
            labelEn: "Title",
            labelAr: "العنوان",
            render: (item) => (
                <span className="font-medium">{locale === "ar" ? item.titleAr : item.titleEn}</span>
            ),
        },
        {
            key: "slug",
            labelEn: "Slug",
            labelAr: "المعرف",
            render: (item) => (
                <code className="text-xs bg-muted px-2 py-1 rounded">
                    {locale === "ar" ? item.slugAr : item.slugEn}
                </code>
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
    ];

    const actions: DataTableAction<HeroSection>[] = [
        {
            type: "edit",
            labelEn: "Edit",
            labelAr: "تعديل",
            onClick: (item) => openEditDialog(item),
            icon: <Pencil className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />,
        },
        {
            type: "delete",
            labelEn: "Delete",
            labelAr: "حذف",
            onClick: (item) => {
                setSelectedSection(item);
                setDeleteDialogOpen(true);
            },
            icon: <Trash2 className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />,
        },
    ];

    return (
        <>
            <PageHeader
                titleEn="Hero Sections"
                titleAr="أقسام البانر"
                descriptionEn="Manage hero carousel sections"
                descriptionAr="إدارة أقسام البانر"
            />

            <div className="mb-4">
                <Button onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {locale === "ar" ? "قسم جديد" : "New Section"}
                </Button>
            </div>

            <DataTable
                data={sections}
                columns={columns}
                actions={actions}
                getRowId={(item) => item.id}
                searchable
                searchPlaceholder={locale === "ar" ? "بحث..." : "Search..."}
                emptyMessageEn="No sections found"
                emptyMessageAr="لا توجد أقسام"
            />

            {/* Create/Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedSection
                                ? (locale === "ar" ? "تعديل القسم" : "Edit Section")
                                : (locale === "ar" ? "قسم جديد" : "New Section")
                            }
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}</Label>
                                <Input
                                    value={formData.titleEn}
                                    onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                                    placeholder="Homepage Hero"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}</Label>
                                <Input
                                    value={formData.titleAr}
                                    onChange={(e) => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                                    placeholder="بانر الصفحة الرئيسية"
                                    dir="rtl"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "المعرف (إنجليزي)" : "Slug (English)"}</Label>
                                <Input
                                    value={formData.slugEn}
                                    onChange={(e) => setFormData(prev => ({ ...prev, slugEn: e.target.value }))}
                                    placeholder="homepage-hero"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "المعرف (عربي)" : "Slug (Arabic)"}</Label>
                                <Input
                                    value={formData.slugAr}
                                    onChange={(e) => setFormData(prev => ({ ...prev, slugAr: e.target.value }))}
                                    placeholder="بانر-الرئيسية"
                                    dir="rtl"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Checkbox
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked === true }))}
                            />
                            <Label htmlFor="isActive">
                                {locale === "ar" ? "نشط" : "Active"}
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            {locale === "ar" ? "إلغاء" : "Cancel"}
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving
                                ? (locale === "ar" ? "جاري الحفظ..." : "Saving...")
                                : (locale === "ar" ? "حفظ" : "Save")
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                itemNameEn={selectedSection?.titleEn || "Section"}
                itemNameAr={selectedSection?.titleAr || "القسم"}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </>
    );
}
