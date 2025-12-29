"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
    PageHeader,
    ImageSelectOrUpload,
    MultiImageSelectOrUpload,
} from "@/components/dashboard/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Save, Star } from "lucide-react";
import { toast } from "sonner";
import {
    createProject,
    updateProject,
    type ProjectWithRelations,
    type ProjectType,
    type ProjectStatus,
} from "@/actions/projects";

type ProjectFormProps = {
    mode: "create" | "edit";
    existingProject?: ProjectWithRelations;
    types: ProjectType[];
    statuses: ProjectStatus[];
};

export default function ProjectForm({
    mode,
    existingProject,
    types,
    statuses,
}: ProjectFormProps) {
    const locale = useLocale();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        titleEn: existingProject?.titleEn || "",
        titleAr: existingProject?.titleAr || "",
        slugEn: existingProject?.slugEn || "",
        slugAr: existingProject?.slugAr || "",
        descriptionEn: existingProject?.descriptionEn || "",
        descriptionAr: existingProject?.descriptionAr || "",
        locationEn: existingProject?.locationEn || "",
        locationAr: existingProject?.locationAr || "",
        year: existingProject?.year?.toString() || "",
        projectTypeId: existingProject?.projectTypeId || "",
        projectStatusId: existingProject?.projectStatusId || "",
        mainImageId: existingProject?.mainImageId || null as string | null,
        imageIds: existingProject?.images.map((img) => img.id) || ([] as string[]),
        isHighlighted: existingProject?.isHighlighted || false,
        sortOrder: existingProject?.sortOrder?.toString() || "0",
    });

    const generateSlug = (title: string, isArabic: boolean) => {
        if (isArabic) {
            return title.trim().replace(/\s+/g, "-");
        }
        return title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
    };

    const handleSave = async () => {
        if (
            !formData.titleEn ||
            !formData.titleAr ||
            !formData.slugEn ||
            !formData.slugAr
        ) {
            toast.error(
                locale === "ar"
                    ? "يرجى ملء الحقول المطلوبة"
                    : "Please fill required fields"
            );
            return;
        }

        setIsSaving(true);

        const dataToSend = {
            ...formData,
            year: formData.year ? parseInt(formData.year) : null,
            projectTypeId: formData.projectTypeId || null,
            projectStatusId: formData.projectStatusId || null,
            isHighlighted: formData.isHighlighted,
            sortOrder: parseInt(formData.sortOrder) || 0,
        };

        let result;
        if (mode === "create") {
            result = await createProject(dataToSend);
        } else if (existingProject) {
            result = await updateProject(existingProject.id, dataToSend);
        }

        setIsSaving(false);

        if (result?.success) {
            toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully");
            router.push("/dashboard/projects");
            router.refresh();
        } else {
            toast.error(result?.message || "Failed to save");
        }
    };

    return (
        <>
            <PageHeader
                titleEn={mode === "create" ? "New Project" : "Edit Project"}
                titleAr={mode === "create" ? "مشروع جديد" : "تعديل المشروع"}
            />

            <div className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {locale === "ar" ? "المعلومات الأساسية" : "Basic Information"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>
                                    {locale === "ar" ? "العنوان (الإنجليزية) *" : "Title (English) *"}
                                </Label>
                                <Input
                                    value={formData.titleEn}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData((prev) => ({
                                            ...prev,
                                            titleEn: value,
                                            ...(mode === "create"
                                                ? { slugEn: generateSlug(value, false) }
                                                : {}),
                                        }));
                                    }}
                                    dir="ltr"
                                    placeholder="Project title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    {locale === "ar" ? "العنوان (العربية) *" : "Title (Arabic) *"}
                                </Label>
                                <Input
                                    value={formData.titleAr}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData((prev) => ({
                                            ...prev,
                                            titleAr: value,
                                            ...(mode === "create"
                                                ? { slugAr: generateSlug(value, true) }
                                                : {}),
                                        }));
                                    }}
                                    dir="rtl"
                                    placeholder="عنوان المشروع"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>
                                    {locale === "ar" ? "المعرف (الإنجليزية) *" : "Slug (English) *"}
                                </Label>
                                <Input
                                    value={formData.slugEn}
                                    onChange={(e) =>
                                        setFormData({ ...formData, slugEn: e.target.value })
                                    }
                                    dir="ltr"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    {locale === "ar" ? "المعرف (العربية) *" : "Slug (Arabic) *"}
                                </Label>
                                <Input
                                    value={formData.slugAr}
                                    onChange={(e) =>
                                        setFormData({ ...formData, slugAr: e.target.value })
                                    }
                                    dir="rtl"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "النوع" : "Type"}</Label>
                                <Select
                                    value={formData.projectTypeId}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, projectTypeId: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={locale === "ar" ? "اختر النوع" : "Select type"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {types.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>
                                                {locale === "ar" ? type.titleAr : type.titleEn}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "الحالة" : "Status"}</Label>
                                <Select
                                    value={formData.projectStatusId}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, projectStatusId: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={locale === "ar" ? "اختر الحالة" : "Select status"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((status) => (
                                            <SelectItem key={status.id} value={status.id}>
                                                {locale === "ar" ? status.titleAr : status.titleEn}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "السنة" : "Year"}</Label>
                                <Input
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) =>
                                        setFormData({ ...formData, year: e.target.value })
                                    }
                                    placeholder="2024"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>
                                    {locale === "ar" ? "الموقع (الإنجليزية)" : "Location (English)"}
                                </Label>
                                <Input
                                    value={formData.locationEn}
                                    onChange={(e) =>
                                        setFormData({ ...formData, locationEn: e.target.value })
                                    }
                                    dir="ltr"
                                    placeholder="Riyadh, Saudi Arabia"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    {locale === "ar" ? "الموقع (العربية)" : "Location (Arabic)"}
                                </Label>
                                <Input
                                    value={formData.locationAr}
                                    onChange={(e) =>
                                        setFormData({ ...formData, locationAr: e.target.value })
                                    }
                                    dir="rtl"
                                    placeholder="الرياض، المملكة العربية السعودية"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Description */}
                <Card>
                    <CardHeader>
                        <CardTitle>{locale === "ar" ? "الوصف" : "Description"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>
                                {locale === "ar" ? "الوصف (الإنجليزية)" : "Description (English)"}
                            </Label>
                            <Textarea
                                value={formData.descriptionEn}
                                onChange={(e) =>
                                    setFormData({ ...formData, descriptionEn: e.target.value })
                                }
                                dir="ltr"
                                rows={4}
                                placeholder="Project description..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>
                                {locale === "ar" ? "الوصف (العربية)" : "Description (Arabic)"}
                            </Label>
                            <Textarea
                                value={formData.descriptionAr}
                                onChange={(e) =>
                                    setFormData({ ...formData, descriptionAr: e.target.value })
                                }
                                dir="rtl"
                                rows={4}
                                placeholder="وصف المشروع..."
                            />
                        </div>

                        {/* Highlight Settings */}
                        <div className="pt-4 border-t">
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="isHighlighted"
                                        checked={formData.isHighlighted}
                                        onCheckedChange={(checked: boolean) =>
                                            setFormData({ ...formData, isHighlighted: checked })
                                        }
                                    />
                                    <Label htmlFor="isHighlighted" className="flex items-center gap-2 cursor-pointer">
                                        <Star className="h-4 w-4 text-amber-500" />
                                        {locale === "ar" ? "عرض في الصفحة الرئيسية" : "Show on Homepage"}
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="sortOrder">
                                        {locale === "ar" ? "ترتيب العرض" : "Display Order"}
                                    </Label>
                                    <Input
                                        id="sortOrder"
                                        type="number"
                                        value={formData.sortOrder}
                                        onChange={(e) =>
                                            setFormData({ ...formData, sortOrder: e.target.value })
                                        }
                                        className="w-20"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Image */}
                <ImageSelectOrUpload
                    selectedImageId={formData.mainImageId}
                    onSelect={(imageId) => setFormData({ ...formData, mainImageId: imageId })}
                    labelEn="Main Image"
                    labelAr="الصورة الرئيسية"
                />

                {/* Gallery Images */}
                <MultiImageSelectOrUpload
                    selectedImageIds={formData.imageIds}
                    onSelect={(imageIds) => setFormData({ ...formData, imageIds })}
                    labelEn="Project Gallery"
                    labelAr="معرض المشروع"
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
