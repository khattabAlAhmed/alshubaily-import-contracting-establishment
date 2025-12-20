"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { PageHeader, DataTable, type Column, type DataTableAction } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
    createProperty,
    updateProperty,
    deleteProperty,
    type Property,
    type PropertyCategory,
} from "@/actions/products";

type PropertiesClientProps = {
    properties: Property[];
    categories: PropertyCategory[];
};

export default function PropertiesClient({ properties, categories }: PropertiesClientProps) {
    const locale = useLocale();
    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Property | null>(null);
    const [formData, setFormData] = useState({
        titleEn: "",
        titleAr: "",
        categoryId: "",
    });
    const [isSaving, setIsSaving] = useState(false);

    const openCreate = () => {
        setEditingItem(null);
        setFormData({ titleEn: "", titleAr: "", categoryId: "" });
        setDialogOpen(true);
    };

    const openEdit = (item: Property) => {
        setEditingItem(item);
        setFormData({
            titleEn: item.titleEn,
            titleAr: item.titleAr,
            categoryId: item.categoryId || "",
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
            result = await updateProperty(editingItem.id, {
                titleEn: formData.titleEn,
                titleAr: formData.titleAr,
                categoryId: formData.categoryId || null,
            });
        } else {
            result = await createProperty({
                titleEn: formData.titleEn,
                titleAr: formData.titleAr,
                categoryId: formData.categoryId || null,
            });
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
        const result = await deleteProperty(id);
        if (result.success) {
            toast.success(locale === "ar" ? "تم الحذف" : "Deleted successfully");
            router.refresh();
        } else {
            toast.error(result.message);
        }
    };

    const columns: Column<Property>[] = [
        {
            key: "title",
            labelEn: "Title",
            labelAr: "العنوان",
            render: (item) => locale === "ar" ? item.titleAr : item.titleEn,
        },
        {
            key: "category",
            labelEn: "Category",
            labelAr: "التصنيف",
            render: (item) => item.category
                ? (locale === "ar" ? item.category.titleAr : item.category.titleEn)
                : "-",
        },
    ];

    const actions: DataTableAction<Property>[] = [
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
                titleEn="Properties"
                titleAr="الخصائص"
                descriptionEn="Manage product properties (e.g., length, weight, color)"
                descriptionAr="إدارة خصائص المنتجات (مثل الطول، الوزن، اللون)"
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
                data={properties}
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
                            <Label>{locale === "ar" ? "التصنيف" : "Category"}</Label>
                            <Select
                                value={formData.categoryId}
                                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={locale === "ar" ? "اختر تصنيف" : "Select category"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {locale === "ar" ? cat.titleAr : cat.titleEn}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
