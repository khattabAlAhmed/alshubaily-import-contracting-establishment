"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { PageHeader, ImageSelectOrUpload } from "@/components/dashboard/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
    createSupplier,
    updateSupplier,
    type SupplierWithImage,
} from "@/actions/suppliers";

type SupplierFormProps = {
    mode: "create" | "edit";
    existingSupplier?: SupplierWithImage;
};

export default function SupplierForm({ mode, existingSupplier }: SupplierFormProps) {
    const locale = useLocale();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        nameEn: existingSupplier?.nameEn || "",
        nameAr: existingSupplier?.nameAr || "",
        logoImageId: existingSupplier?.logoImageId || null as string | null,
    });

    const handleSave = async () => {
        if (!formData.nameEn || !formData.nameAr) {
            toast.error(
                locale === "ar"
                    ? "يرجى ملء الحقول المطلوبة"
                    : "Please fill required fields"
            );
            return;
        }

        setIsSaving(true);

        let result;
        if (mode === "create") {
            result = await createSupplier(formData);
        } else if (existingSupplier) {
            result = await updateSupplier(existingSupplier.id, formData);
        }

        setIsSaving(false);

        if (result?.success) {
            toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully");
            router.push("/dashboard/suppliers");
            router.refresh();
        } else {
            toast.error(result?.message || "Failed to save");
        }
    };

    return (
        <>
            <PageHeader
                titleEn={mode === "create" ? "New Supplier" : "Edit Supplier"}
                titleAr={mode === "create" ? "مورد جديد" : "تعديل المورد"}
            />

            <div className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {locale === "ar" ? "معلومات المورد" : "Supplier Information"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>
                                    {locale === "ar" ? "الاسم (الإنجليزية) *" : "Name (English) *"}
                                </Label>
                                <Input
                                    value={formData.nameEn}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nameEn: e.target.value })
                                    }
                                    dir="ltr"
                                    placeholder="Supplier name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    {locale === "ar" ? "الاسم (العربية) *" : "Name (Arabic) *"}
                                </Label>
                                <Input
                                    value={formData.nameAr}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nameAr: e.target.value })
                                    }
                                    dir="rtl"
                                    placeholder="اسم المورد"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Logo Image */}
                <ImageSelectOrUpload
                    selectedImageId={formData.logoImageId}
                    onSelect={(imageId) => setFormData({ ...formData, logoImageId: imageId })}
                    labelEn="Supplier Logo"
                    labelAr="شعار المورد"
                />

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => router.back()}>
                        {locale === "ar" ? "إلغاء" : "Cancel"}
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                        {locale === "ar" ? "حفظ" : "Save"}
                    </Button>
                </div>
            </div>
        </>
    );
}
