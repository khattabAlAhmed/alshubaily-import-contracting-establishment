"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { PageHeader, ImageSelectOrUpload } from "@/components/dashboard/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Info } from "lucide-react";
import {
    createHeroSlide,
    updateHeroSlide,
    type HeroSection,
    type HeroSlideWithRelations,
    type AvailableContent,
    type SlideType,
} from "@/actions/hero-carousel";

type HeroSlideFormProps = {
    mode: "create" | "edit";
    sections: HeroSection[];
    content: AvailableContent;
    images: { id: string; url: string }[];
    existingSlide?: HeroSlideWithRelations;
    // For service-specific slides
    parentImportServiceId?: string;
    parentContractingServiceId?: string;
};

const slideTypes: { value: SlideType; labelEn: string; labelAr: string; descEn: string; descAr: string }[] = [
    { value: "custom", labelEn: "Custom Slide", labelAr: "شريحة مخصصة", descEn: "Enter title, subtitle and image manually", descAr: "أدخل العنوان والوصف والصورة يدوياً" },
    { value: "article", labelEn: "Article", labelAr: "مقال", descEn: "Uses article's title, excerpt and image", descAr: "يستخدم عنوان ووصف وصورة المقال" },
    { value: "product", labelEn: "Product", labelAr: "منتج", descEn: "Uses product's title, description and image", descAr: "يستخدم عنوان ووصف وصورة المنتج" },
    { value: "main_service", labelEn: "Main Service", labelAr: "خدمة رئيسية", descEn: "Uses service's title, description and image", descAr: "يستخدم عنوان ووصف وصورة الخدمة" },
    { value: "import_service", labelEn: "Import Service", labelAr: "خدمة استيراد", descEn: "Uses service's title, description and image", descAr: "يستخدم عنوان ووصف وصورة الخدمة" },
    { value: "contracting_service", labelEn: "Contracting Service", labelAr: "خدمة مقاولات", descEn: "Uses service's title, description and image", descAr: "يستخدم عنوان ووصف وصورة الخدمة" },
    { value: "project", labelEn: "Project", labelAr: "مشروع", descEn: "Uses project's title, description and image", descAr: "يستخدم عنوان ووصف وصورة المشروع" },
];

export function HeroSlideForm({
    mode,
    sections,
    content,
    images,
    existingSlide,
    parentImportServiceId,
    parentContractingServiceId,
}: HeroSlideFormProps) {
    const locale = useLocale();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    // Determine if this is for a hero section or service
    const isServiceSlide = !!parentImportServiceId || !!parentContractingServiceId;
    const isCustomSlide = (type: SlideType) => type === "custom";

    const [formData, setFormData] = useState({
        heroSectionId: existingSlide?.heroSectionId || "",
        slideType: (existingSlide?.slideType || "custom") as SlideType,
        // Custom slide fields (only used when slideType === "custom")
        titleEn: existingSlide?.titleEn || "",
        titleAr: existingSlide?.titleAr || "",
        subtitleEn: existingSlide?.subtitleEn || "",
        subtitleAr: existingSlide?.subtitleAr || "",
        backgroundImageId: existingSlide?.backgroundImageId || null as string | null,
        backgroundColor: existingSlide?.backgroundColor || "#1a1a2e",
        overlayOpacity: existingSlide?.overlayOpacity || 50,
        // Reference IDs (used when slideType !== "custom")
        articleId: existingSlide?.articleId || "",
        productId: existingSlide?.productId || "",
        mainServiceId: existingSlide?.mainServiceId || "",
        importServiceId: existingSlide?.importServiceId || "",
        contractingServiceId: existingSlide?.contractingServiceId || "",
        projectId: existingSlide?.projectId || "",
        // Common fields
        ctaEnabled: existingSlide?.ctaEnabled || false,
        ctaTextEn: existingSlide?.ctaTextEn || "",
        ctaTextAr: existingSlide?.ctaTextAr || "",
        ctaHref: existingSlide?.ctaHref || "",
        isActive: existingSlide?.isActive ?? true,
        sortOrder: existingSlide?.sortOrder || 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation for custom slides
        if (isCustomSlide(formData.slideType)) {
            if (!formData.titleEn || !formData.titleAr) {
                toast.error(locale === "ar" ? "العنوان مطلوب للشرائح المخصصة" : "Title is required for custom slides");
                return;
            }
        } else {
            // Validation for reference slides - must have a content selected
            const contentId = getSelectedContentId();
            if (!contentId) {
                toast.error(locale === "ar" ? "يجب اختيار المحتوى" : "Please select content");
                return;
            }
        }

        if (!isServiceSlide && !formData.heroSectionId) {
            toast.error(locale === "ar" ? "القسم مطلوب" : "Section is required");
            return;
        }

        setIsSaving(true);

        // For reference slides, we store only the reference ID
        // Title, subtitle, and image will be derived from the reference at render time
        const data = {
            heroSectionId: isServiceSlide ? null : formData.heroSectionId || null,
            parentImportServiceId: parentImportServiceId || null,
            parentContractingServiceId: parentContractingServiceId || null,
            slideType: formData.slideType,
            // Only include custom content for custom slides
            titleEn: isCustomSlide(formData.slideType) ? formData.titleEn : "",
            titleAr: isCustomSlide(formData.slideType) ? formData.titleAr : "",
            subtitleEn: isCustomSlide(formData.slideType) ? formData.subtitleEn || null : null,
            subtitleAr: isCustomSlide(formData.slideType) ? formData.subtitleAr || null : null,
            backgroundImageId: isCustomSlide(formData.slideType) ? formData.backgroundImageId : null,
            backgroundColor: isCustomSlide(formData.slideType) ? formData.backgroundColor || null : null,
            overlayOpacity: isCustomSlide(formData.slideType) ? formData.overlayOpacity : 0,
            // Reference IDs based on slide type
            articleId: formData.slideType === "article" ? formData.articleId || null : null,
            productId: formData.slideType === "product" ? formData.productId || null : null,
            mainServiceId: formData.slideType === "main_service" ? formData.mainServiceId || null : null,
            importServiceId: formData.slideType === "import_service" ? formData.importServiceId || null : null,
            contractingServiceId: formData.slideType === "contracting_service" ? formData.contractingServiceId || null : null,
            projectId: formData.slideType === "project" ? formData.projectId || null : null,
            // CTA - user can optionally override for reference slides
            ctaEnabled: formData.ctaEnabled,
            ctaTextEn: formData.ctaEnabled ? formData.ctaTextEn || null : null,
            ctaTextAr: formData.ctaEnabled ? formData.ctaTextAr || null : null,
            ctaHref: formData.ctaEnabled ? formData.ctaHref || null : null,
            isActive: formData.isActive,
            sortOrder: formData.sortOrder,
        };

        if (mode === "edit" && existingSlide) {
            const result = await updateHeroSlide(existingSlide.id, data);
            if (result.success) {
                toast.success(locale === "ar" ? "تم تحديث الشريحة" : "Slide updated");
                router.back();
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } else {
            const result = await createHeroSlide(data);
            if (result.success) {
                toast.success(locale === "ar" ? "تم إنشاء الشريحة" : "Slide created");
                router.back();
                router.refresh();
            } else {
                toast.error(result.message);
            }
        }

        setIsSaving(false);
    };

    const getContentOptions = () => {
        switch (formData.slideType) {
            case "article": return content.articles;
            case "product": return content.products;
            case "main_service": return content.mainServices;
            case "import_service": return content.importServices;
            case "contracting_service": return content.contractingServices;
            case "project": return content.projects;
            default: return [];
        }
    };

    const getSelectedContentId = () => {
        switch (formData.slideType) {
            case "article": return formData.articleId;
            case "product": return formData.productId;
            case "main_service": return formData.mainServiceId;
            case "import_service": return formData.importServiceId;
            case "contracting_service": return formData.contractingServiceId;
            case "project": return formData.projectId;
            default: return "";
        }
    };

    const setSelectedContentId = (id: string) => {
        const updates: Partial<typeof formData> = {
            articleId: "",
            productId: "",
            mainServiceId: "",
            importServiceId: "",
            contractingServiceId: "",
            projectId: "",
        };

        switch (formData.slideType) {
            case "article": updates.articleId = id; break;
            case "product": updates.productId = id; break;
            case "main_service": updates.mainServiceId = id; break;
            case "import_service": updates.importServiceId = id; break;
            case "contracting_service": updates.contractingServiceId = id; break;
            case "project": updates.projectId = id; break;
        }

        setFormData(prev => ({ ...prev, ...updates }));
    };

    const getSelectedTypeInfo = () => slideTypes.find(t => t.value === formData.slideType);

    return (
        <>
            <PageHeader
                titleEn={mode === "edit" ? "Edit Slide" : "New Slide"}
                titleAr={mode === "edit" ? "تعديل الشريحة" : "شريحة جديدة"}
                descriptionEn={mode === "edit" ? "Update slide details" : "Create a new hero slide"}
                descriptionAr={mode === "edit" ? "تحديث تفاصيل الشريحة" : "إنشاء شريحة بانر جديدة"}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section Selection (for non-service slides) */}
                {!isServiceSlide && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{locale === "ar" ? "القسم" : "Section"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select
                                value={formData.heroSectionId}
                                onValueChange={(v) => setFormData(prev => ({ ...prev, heroSectionId: v }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={locale === "ar" ? "اختر القسم" : "Select section"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {sections.map(s => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {locale === "ar" ? s.titleAr : s.titleEn}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>
                )}

                {/* Slide Type Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>{locale === "ar" ? "نوع الشريحة" : "Slide Type"}</CardTitle>
                        <CardDescription>
                            {locale === "ar"
                                ? "اختر نوع الشريحة - مخصصة أو مرتبطة بمحتوى موجود"
                                : "Choose slide type - custom or linked to existing content"
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select
                            value={formData.slideType}
                            onValueChange={(v) => {
                                setFormData(prev => ({
                                    ...prev,
                                    slideType: v as SlideType,
                                    // Clear reference IDs when changing type
                                    articleId: "",
                                    productId: "",
                                    mainServiceId: "",
                                    importServiceId: "",
                                    contractingServiceId: "",
                                    projectId: "",
                                }));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {slideTypes.map(t => (
                                    <SelectItem key={t.value} value={t.value}>
                                        <div className="flex flex-col">
                                            <span>{locale === "ar" ? t.labelAr : t.labelEn}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Type description */}
                        <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                            <Info className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                                {locale === "ar"
                                    ? getSelectedTypeInfo()?.descAr
                                    : getSelectedTypeInfo()?.descEn
                                }
                            </p>
                        </div>

                        {/* Content selector for non-custom slides */}
                        {!isCustomSlide(formData.slideType) && (
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "اختر المحتوى" : "Select Content"} *</Label>
                                <Select
                                    value={getSelectedContentId()}
                                    onValueChange={setSelectedContentId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={locale === "ar" ? "اختر..." : "Select..."} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getContentOptions().map(item => (
                                            <SelectItem key={item.id} value={item.id}>
                                                {locale === "ar" ? item.titleAr : item.titleEn}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    {locale === "ar"
                                        ? "سيتم استخدام عنوان وصورة ورابط المحتوى المختار تلقائياً"
                                        : "The selected content's title, image, and link will be used automatically"
                                    }
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Custom Slide Content - Only shown for custom slides */}
                {isCustomSlide(formData.slideType) && (
                    <>
                        {/* Title & Subtitle */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{locale === "ar" ? "المحتوى" : "Content"}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>{locale === "ar" ? "العنوان (إنجليزي)" : "Title (English)"} *</Label>
                                        <Input
                                            value={formData.titleEn}
                                            onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                                            placeholder="Welcome to our company"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{locale === "ar" ? "العنوان (عربي)" : "Title (Arabic)"} *</Label>
                                        <Input
                                            value={formData.titleAr}
                                            onChange={(e) => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                                            placeholder="مرحباً بكم في شركتنا"
                                            dir="rtl"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>{locale === "ar" ? "العنوان الفرعي (إنجليزي)" : "Subtitle (English)"}</Label>
                                        <Textarea
                                            value={formData.subtitleEn}
                                            onChange={(e) => setFormData(prev => ({ ...prev, subtitleEn: e.target.value }))}
                                            placeholder="Discover our services..."
                                            rows={2}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{locale === "ar" ? "العنوان الفرعي (عربي)" : "Subtitle (Arabic)"}</Label>
                                        <Textarea
                                            value={formData.subtitleAr}
                                            onChange={(e) => setFormData(prev => ({ ...prev, subtitleAr: e.target.value }))}
                                            placeholder="اكتشف خدماتنا..."
                                            dir="rtl"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Background Image */}
                        <ImageSelectOrUpload
                            selectedImageId={formData.backgroundImageId}
                            onSelect={(imageId) => setFormData(prev => ({ ...prev, backgroundImageId: imageId }))}
                            labelEn="Background Image"
                            labelAr="صورة الخلفية"
                        />

                        {/* Background Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{locale === "ar" ? "إعدادات الخلفية" : "Background Settings"}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>{locale === "ar" ? "لون الخلفية" : "Background Color"}</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="color"
                                                value={formData.backgroundColor}
                                                onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                                                className="w-12 h-10 p-1"
                                            />
                                            <Input
                                                value={formData.backgroundColor}
                                                onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                                                placeholder="#1a1a2e"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{locale === "ar" ? "شفافية التراكب" : "Overlay Opacity"} ({formData.overlayOpacity}%)</Label>
                                        <Input
                                            type="range"
                                            min={0}
                                            max={100}
                                            value={formData.overlayOpacity}
                                            onChange={(e) => setFormData(prev => ({ ...prev, overlayOpacity: parseInt(e.target.value) }))}
                                        />
                                    </div>
                                </div>

                                {/* Preview */}
                                <div
                                    className="relative h-32 rounded-lg overflow-hidden flex items-center justify-center"
                                    style={{ backgroundColor: formData.backgroundColor }}
                                >
                                    {formData.backgroundImageId && images.find(i => i.id === formData.backgroundImageId) && (
                                        <img
                                            src={images.find(i => i.id === formData.backgroundImageId)?.url}
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    )}
                                    <div
                                        className="absolute inset-0 bg-black"
                                        style={{ opacity: formData.overlayOpacity / 100 }}
                                    />
                                    <div className="relative z-10 text-white text-center p-4">
                                        <p className="font-bold">{formData.titleEn || "Title Preview"}</p>
                                        {formData.subtitleEn && <p className="text-sm opacity-80">{formData.subtitleEn}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* CTA Button - Only for custom slides */}
                {isCustomSlide(formData.slideType) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{locale === "ar" ? "زر الإجراء" : "CTA Button"}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <Checkbox
                                    id="ctaEnabled"
                                    checked={formData.ctaEnabled}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ctaEnabled: checked === true }))}
                                />
                                <Label htmlFor="ctaEnabled">{locale === "ar" ? "تفعيل زر الإجراء" : "Enable CTA Button"}</Label>
                            </div>

                            {formData.ctaEnabled && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>{locale === "ar" ? "نص الزر (إنجليزي)" : "Button Text (English)"}</Label>
                                            <Input
                                                value={formData.ctaTextEn}
                                                onChange={(e) => setFormData(prev => ({ ...prev, ctaTextEn: e.target.value }))}
                                                placeholder="Learn More"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{locale === "ar" ? "نص الزر (عربي)" : "Button Text (Arabic)"}</Label>
                                            <Input
                                                value={formData.ctaTextAr}
                                                onChange={(e) => setFormData(prev => ({ ...prev, ctaTextAr: e.target.value }))}
                                                placeholder="اعرف المزيد"
                                                dir="rtl"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{locale === "ar" ? "رابط الزر" : "Button Link"}</Label>
                                        <Input
                                            value={formData.ctaHref}
                                            onChange={(e) => setFormData(prev => ({ ...prev, ctaHref: e.target.value }))}
                                            placeholder="/services"
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Status & Ordering */}
                <Card>
                    <CardHeader>
                        <CardTitle>{locale === "ar" ? "الحالة والترتيب" : "Status & Ordering"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <Checkbox
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked === true }))}
                                />
                                <Label htmlFor="isActive">{locale === "ar" ? "نشط" : "Active"}</Label>
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "الترتيب" : "Sort Order"}</Label>
                                <Input
                                    type="number"
                                    value={formData.sortOrder}
                                    onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                                    min={0}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card >

                {/* Actions */}
                < div className="flex justify-end gap-4" >
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        {locale === "ar" ? "إلغاء" : "Cancel"}
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving
                            ? (locale === "ar" ? "جاري الحفظ..." : "Saving...")
                            : (locale === "ar" ? "حفظ" : "Save")
                        }
                    </Button>
                </div >
            </form >
        </>
    );
}
