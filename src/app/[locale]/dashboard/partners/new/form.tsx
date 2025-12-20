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
    createPartner,
    updatePartner,
    type PartnerWithImage,
} from "@/actions/partners";

type PartnerFormProps = {
    mode: "create" | "edit";
    existingPartner?: PartnerWithImage;
};

export default function PartnerForm({ mode, existingPartner }: PartnerFormProps) {
    const locale = useLocale();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        nameEn: existingPartner?.nameEn || "",
        nameAr: existingPartner?.nameAr || "",
        logoImageId: existingPartner?.logoImageId || null as string | null,
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
            result = await createPartner(formData);
        } else if (existingPartner) {
            result = await updatePartner(existingPartner.id, formData);
        }

        setIsSaving(false);

        if (result?.success) {
            toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully");
            router.push("/dashboard/partners");
            router.refresh();
        } else {
            toast.error(result?.message || "Failed to save");
        }
    };

    return (
        <>
            <PageHeader
                titleEn={mode === "create" ? "New Partner" : "Edit Partner"}
                titleAr={mode === "create" ? "شريك جديد" : "تعديل الشريك"}
            />

            <div className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {locale === "ar" ? "معلومات الشريك" : "Partner Information"}
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
                                    placeholder="Partner name"
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
                                    placeholder="اسم الشريك"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Logo Image */}
                <ImageSelectOrUpload
                    selectedImageId={formData.logoImageId}
                    onSelect={(imageId) => setFormData({ ...formData, logoImageId: imageId })}
                    labelEn="Partner Logo"
                    labelAr="شعار الشريك"
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
