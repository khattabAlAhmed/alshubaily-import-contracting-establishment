"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { PageHeader, DataTable, type Column, type DataTableAction } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
    createProductCategory,
    updateProductCategory,
    deleteProductCategory,
    type ProductCategory,
} from "@/actions/products";

type ProductCategoriesClientProps = {
    categories: ProductCategory[];
};

export default function ProductCategoriesClient({ categories }: ProductCategoriesClientProps) {
    const locale = useLocale();
    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ProductCategory | null>(null);
    const [formData, setFormData] = useState({
        titleEn: "",
        titleAr: "",
        descriptionEn: "",
        descriptionAr: "",
    });
    const [isSaving, setIsSaving] = useState(false);

    const openCreate = () => {
        setEditingItem(null);
        setFormData({ titleEn: "", titleAr: "", descriptionEn: "", descriptionAr: "" });
        setDialogOpen(true);
    };

    const openEdit = (item: ProductCategory) => {
        setEditingItem(item);
        setFormData({
            titleEn: item.titleEn,
            titleAr: item.titleAr,
            descriptionEn: item.descriptionEn || "",
            descriptionAr: item.descriptionAr || "",
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.titleEn || !formData.titleAr) {
            toast.error(locale === "ar" ? "يرجى ملء الحقول المطلوبة" : "Please fill required fields");
            return;
        }

        setIsSaving(true);

        let result;
        if (editingItem) {
            result = await updateProductCategory(editingItem.id, formData);
        } else {
            result = await createProductCategory(formData);
        }

        setIsSaving(false);

        if (result.success) {
            toast.success(locale === "ar" ? "تم الحفظ" : "Saved successfully");
            setDialogOpen(false);
            router.refresh();
        } else {
            toast.error(result.message);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteProductCategory(id);
        if (result.success) {
            toast.success(locale === "ar" ? "تم الحذف" : "Deleted successfully");
            router.refresh();
        } else {
            toast.error(result.message);
        }
    };

    const columns: Column<ProductCategory>[] = [
        {
            key: "title",
            labelEn: "Title",
            labelAr: "العنوان",
            render: (item) => locale === "ar" ? item.titleAr : item.titleEn,
        },
        {
            key: "description",
            labelEn: "Description",
            labelAr: "الوصف",
            render: (item) => {
                const desc = locale === "ar" ? item.descriptionAr : item.descriptionEn;
                return desc ? (desc.length > 50 ? desc.slice(0, 50) + "..." : desc) : "-";
            },
        },
    ];

    const actions: DataTableAction<ProductCategory>[] = [
        {
            type: "edit",
            labelEn: "Edit",
            labelAr: "تعديل",
            onClick: (item) => openEdit(item),
            icon: <Pencil className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />,
        },
        {
            type: "delete",
            labelEn: "Delete",
            labelAr: "حذف",
            onClick: (item) => handleDelete(item.id),
            icon: <Trash2 className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />,
        },
    ];

    return (
        <>
            <PageHeader
                titleEn="Product Categories"
                titleAr="تصنيفات المنتجات"
                descriptionEn="Manage product categories"
                descriptionAr="إدارة تصنيفات المنتجات"
            />

            <div className="mb-4 flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/products">
                        <ArrowLeft className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        {locale === "ar" ? "رجوع" : "Back"}
                    </Link>
                </Button>
                <Button onClick={openCreate}>
                    <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {locale === "ar" ? "إضافة" : "Add"}
                </Button>
            </div>

            <DataTable
                data={categories}
                columns={columns}
                actions={actions}
                getRowId={(item) => item.id}
            />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem
                                ? (locale === "ar" ? "تعديل" : "Edit")
                                : (locale === "ar" ? "إضافة جديد" : "Add New")}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>{locale === "ar" ? "العنوان (الإنجليزية)" : "Title (English)"}</Label>
                            <Input
                                value={formData.titleEn}
                                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                dir="ltr"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{locale === "ar" ? "العنوان (العربية)" : "Title (Arabic)"}</Label>
                            <Input
                                value={formData.titleAr}
                                onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                                dir="rtl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{locale === "ar" ? "الوصف (الإنجليزية)" : "Description (English)"}</Label>
                            <Textarea
                                value={formData.descriptionEn}
                                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                dir="ltr"
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{locale === "ar" ? "الوصف (العربية)" : "Description (Arabic)"}</Label>
                            <Textarea
                                value={formData.descriptionAr}
                                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                                dir="rtl"
                                rows={2}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            {locale === "ar" ? "إلغاء" : "Cancel"}
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {locale === "ar" ? "حفظ" : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
