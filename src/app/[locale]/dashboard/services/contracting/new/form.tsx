"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { PageHeader, MultiSelectCreatable, ImageSelectOrUpload } from "@/components/dashboard/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
    createContractingService,
    updateContractingService,
    type ContractingServiceWithRelations
} from "@/actions/contracting";
import {
    createWork,
    createMaterial,
    createTechnique,
    createQualitySafetyStandard,
    createWhyChooseUs,
    createFaq,
    type Work,
    type Material,
    type Technique,
    type QualitySafetyStandard,
    type WhyChooseUsItem,
    type FaqItem,
} from "@/actions/services";

type ContractingServiceFormProps = {
    mode: "create" | "edit";
    existingService?: ContractingServiceWithRelations;
    lookups: {
        projects: { id: string; titleEn: string; titleAr: string }[];
        works: Work[];
        materials: Material[];
        techniques: Technique[];
        qualitySafety: QualitySafetyStandard[];
        whyChooseUs: WhyChooseUsItem[];
        faqs: FaqItem[];
    };
};

export function ContractingServiceForm({ mode, existingService, lookups }: ContractingServiceFormProps) {
    const locale = useLocale();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        titleEn: existingService?.titleEn || "",
        titleAr: existingService?.titleAr || "",
        descriptionEn: existingService?.descriptionEn || "",
        descriptionAr: existingService?.descriptionAr || "",
        targetAudienceEn: existingService?.targetAudienceEn || "",
        targetAudienceAr: existingService?.targetAudienceAr || "",
        whenNeededEn: existingService?.whenNeededEn || "",
        whenNeededAr: existingService?.whenNeededAr || "",
        slugEn: existingService?.slugEn || "",
        slugAr: existingService?.slugAr || "",
        projectIds: existingService?.projects.map(p => p.id) || [],
        includedWorkIds: existingService?.includedWorks.map(w => w.id) || [],
        excludedWorkIds: existingService?.excludedWorks.map(w => w.id) || [],
        materialIds: existingService?.materials.map(m => m.id) || [],
        techniqueIds: existingService?.techniques.map(t => t.id) || [],
        qualitySafetyIds: existingService?.qualitySafety.map(q => q.id) || [],
        whyChooseUsIds: existingService?.whyChooseUs.map(w => w.id) || [],
        faqIds: existingService?.faqs.map(f => f.id) || [],
        mainImageId: existingService?.mainImageId || null as string | null,
    });

    const [dynamicLookups, setDynamicLookups] = useState(lookups);

    const generateSlug = (title: string, isArabic: boolean) => {
        if (isArabic) {
            return title.trim().replace(/\s+/g, "-");
        }
        return title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    };

    const handleSave = async () => {
        if (!formData.titleEn || !formData.titleAr || !formData.slugEn || !formData.slugAr) {
            toast.error(locale === "ar" ? "يرجى ملء الحقول المطلوبة" : "Please fill required fields");
            return;
        }

        setIsSaving(true);

        let result;
        if (mode === "create") {
            result = await createContractingService(formData);
        } else if (existingService) {
            result = await updateContractingService(existingService.id, formData);
        }

        setIsSaving(false);

        if (result?.success) {
            toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully");
            router.push("/dashboard/services/contracting");
            router.refresh();
        } else {
            toast.error(result?.message || "Failed to save");
        }
    };

    return (
        <>
            <PageHeader
                titleEn={mode === "create" ? "New Contracting Service" : "Edit Contracting Service"}
                titleAr={mode === "create" ? "خدمة مقاولات جديدة" : "تعديل خدمة المقاولات"}
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
                                <Label>{locale === "ar" ? "العنوان (الإنجليزية) *" : "Title (English) *"}</Label>
                                <Input
                                    value={formData.titleEn}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            titleEn: value,
                                            ...(mode === "create" ? { slugEn: generateSlug(value, false) } : {}),
                                        }));
                                    }}
                                    dir="ltr"
                                    placeholder="Service title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "العنوان (العربية) *" : "Title (Arabic) *"}</Label>
                                <Input
                                    value={formData.titleAr}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            titleAr: value,
                                            ...(mode === "create" ? { slugAr: generateSlug(value, true) } : {}),
                                        }));
                                    }}
                                    dir="rtl"
                                    placeholder="عنوان الخدمة"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "الوصف (الإنجليزية)" : "Description (English)"}</Label>
                                <Textarea
                                    value={formData.descriptionEn}
                                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                    dir="ltr"
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "الوصف (العربية)" : "Description (Arabic)"}</Label>
                                <Textarea
                                    value={formData.descriptionAr}
                                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                                    dir="rtl"
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "المعرف (الإنجليزية) *" : "Slug (English) *"}</Label>
                                <Input
                                    value={formData.slugEn}
                                    onChange={(e) => setFormData({ ...formData, slugEn: e.target.value })}
                                    dir="ltr"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "المعرف (العربية) *" : "Slug (Arabic) *"}</Label>
                                <Input
                                    value={formData.slugAr}
                                    onChange={(e) => setFormData({ ...formData, slugAr: e.target.value })}
                                    dir="rtl"
                                />
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

                {/* Projects */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {locale === "ar" ? "المشاريع" : "Projects"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MultiSelectCreatable
                            items={dynamicLookups.projects}
                            selectedIds={formData.projectIds}
                            onChange={(ids) => setFormData({ ...formData, projectIds: ids })}
                            labelEn="Related Projects"
                            labelAr="المشاريع ذات الصلة"
                            displayField="title"
                        />
                    </CardContent>
                </Card>

                {/* Works */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {locale === "ar" ? "الأعمال" : "Works"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <MultiSelectCreatable
                            items={dynamicLookups.works}
                            selectedIds={formData.includedWorkIds}
                            onChange={(ids) => setFormData({ ...formData, includedWorkIds: ids })}
                            onCreate={async (data) => {
                                const result = await createWork({ titleEn: data.titleEn, titleAr: data.titleAr });
                                if (result.success && result.id) {
                                    setDynamicLookups(prev => ({
                                        ...prev,
                                        works: [...prev.works, { id: result.id!, titleEn: data.titleEn, titleAr: data.titleAr, createdAt: new Date(), updatedAt: new Date() }],
                                    }));
                                }
                                return result;
                            }}
                            labelEn="Included Works"
                            labelAr="الأعمال المشمولة"
                            displayField="title"
                            createFields={[
                                { key: "titleEn", labelEn: "Title (English)", labelAr: "العنوان (الإنجليزية)", dir: "ltr" },
                                { key: "titleAr", labelEn: "Title (Arabic)", labelAr: "العنوان (العربية)", dir: "rtl" },
                            ]}
                        />

                        <MultiSelectCreatable
                            items={dynamicLookups.works}
                            selectedIds={formData.excludedWorkIds}
                            onChange={(ids) => setFormData({ ...formData, excludedWorkIds: ids })}
                            labelEn="Excluded Works"
                            labelAr="الأعمال المستثناة"
                            displayField="title"
                        />
                    </CardContent>
                </Card>

                {/* Materials & Techniques */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {locale === "ar" ? "المواد والتقنيات" : "Materials & Techniques"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <MultiSelectCreatable
                            items={dynamicLookups.materials}
                            selectedIds={formData.materialIds}
                            onChange={(ids) => setFormData({ ...formData, materialIds: ids })}
                            onCreate={async (data) => {
                                const result = await createMaterial({ titleEn: data.titleEn, titleAr: data.titleAr });
                                if (result.success && result.id) {
                                    setDynamicLookups(prev => ({
                                        ...prev,
                                        materials: [...prev.materials, { id: result.id!, titleEn: data.titleEn, titleAr: data.titleAr, createdAt: new Date(), updatedAt: new Date() }],
                                    }));
                                }
                                return result;
                            }}
                            labelEn="Materials"
                            labelAr="المواد"
                            displayField="title"
                            createFields={[
                                { key: "titleEn", labelEn: "Title (English)", labelAr: "العنوان (الإنجليزية)", dir: "ltr" },
                                { key: "titleAr", labelEn: "Title (Arabic)", labelAr: "العنوان (العربية)", dir: "rtl" },
                            ]}
                        />

                        <MultiSelectCreatable
                            items={dynamicLookups.techniques}
                            selectedIds={formData.techniqueIds}
                            onChange={(ids) => setFormData({ ...formData, techniqueIds: ids })}
                            onCreate={async (data) => {
                                const result = await createTechnique({ titleEn: data.titleEn, titleAr: data.titleAr });
                                if (result.success && result.id) {
                                    setDynamicLookups(prev => ({
                                        ...prev,
                                        techniques: [...prev.techniques, { id: result.id!, titleEn: data.titleEn, titleAr: data.titleAr, createdAt: new Date(), updatedAt: new Date() }],
                                    }));
                                }
                                return result;
                            }}
                            labelEn="Techniques"
                            labelAr="التقنيات"
                            displayField="title"
                            createFields={[
                                { key: "titleEn", labelEn: "Title (English)", labelAr: "العنوان (الإنجليزية)", dir: "ltr" },
                                { key: "titleAr", labelEn: "Title (Arabic)", labelAr: "العنوان (العربية)", dir: "rtl" },
                            ]}
                        />
                    </CardContent>
                </Card>

                {/* Quality & Safety */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {locale === "ar" ? "معايير الجودة والسلامة" : "Quality & Safety Standards"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MultiSelectCreatable
                            items={dynamicLookups.qualitySafety}
                            selectedIds={formData.qualitySafetyIds}
                            onChange={(ids) => setFormData({ ...formData, qualitySafetyIds: ids })}
                            onCreate={async (data) => {
                                const result = await createQualitySafetyStandard({ titleEn: data.titleEn, titleAr: data.titleAr });
                                if (result.success && result.id) {
                                    setDynamicLookups(prev => ({
                                        ...prev,
                                        qualitySafety: [...prev.qualitySafety, { id: result.id!, titleEn: data.titleEn, titleAr: data.titleAr, createdAt: new Date(), updatedAt: new Date() }],
                                    }));
                                }
                                return result;
                            }}
                            labelEn="Quality & Safety Standards"
                            labelAr="معايير الجودة والسلامة"
                            displayField="title"
                            createFields={[
                                { key: "titleEn", labelEn: "Title (English)", labelAr: "العنوان (الإنجليزية)", dir: "ltr" },
                                { key: "titleAr", labelEn: "Title (Arabic)", labelAr: "العنوان (العربية)", dir: "rtl" },
                            ]}
                        />
                    </CardContent>
                </Card>

                {/* Why Choose Us */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {locale === "ar" ? "لماذا تختارنا" : "Why Choose Us"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MultiSelectCreatable
                            items={dynamicLookups.whyChooseUs}
                            selectedIds={formData.whyChooseUsIds}
                            onChange={(ids) => setFormData({ ...formData, whyChooseUsIds: ids })}
                            onCreate={async (data) => {
                                const result = await createWhyChooseUs({ reasonEn: data.reasonEn, reasonAr: data.reasonAr });
                                if (result.success && result.id) {
                                    setDynamicLookups(prev => ({
                                        ...prev,
                                        whyChooseUs: [...prev.whyChooseUs, { id: result.id!, reasonEn: data.reasonEn, reasonAr: data.reasonAr, createdAt: new Date(), updatedAt: new Date() }],
                                    }));
                                }
                                return result;
                            }}
                            labelEn="Reasons"
                            labelAr="الأسباب"
                            displayField="reason"
                            createFields={[
                                { key: "reasonEn", labelEn: "Reason (English)", labelAr: "السبب (الإنجليزية)", dir: "ltr" },
                                { key: "reasonAr", labelEn: "Reason (Arabic)", labelAr: "السبب (العربية)", dir: "rtl" },
                            ]}
                        />
                    </CardContent>
                </Card>

                {/* FAQs */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {locale === "ar" ? "الأسئلة الشائعة" : "FAQs"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MultiSelectCreatable
                            items={dynamicLookups.faqs}
                            selectedIds={formData.faqIds}
                            onChange={(ids) => setFormData({ ...formData, faqIds: ids })}
                            onCreate={async (data) => {
                                const result = await createFaq({
                                    questionEn: data.questionEn,
                                    questionAr: data.questionAr,
                                    answerEn: data.answerEn || "",
                                    answerAr: data.answerAr || "",
                                });
                                if (result.success && result.id) {
                                    setDynamicLookups(prev => ({
                                        ...prev,
                                        faqs: [...prev.faqs, {
                                            id: result.id!,
                                            questionEn: data.questionEn,
                                            questionAr: data.questionAr,
                                            answerEn: data.answerEn || "",
                                            answerAr: data.answerAr || "",
                                            createdAt: new Date(),
                                            updatedAt: new Date(),
                                        }],
                                    }));
                                }
                                return result;
                            }}
                            labelEn="FAQs"
                            labelAr="الأسئلة الشائعة"
                            displayField="question"
                            createFields={[
                                { key: "questionEn", labelEn: "Question (English)", labelAr: "السؤال (الإنجليزية)", dir: "ltr" },
                                { key: "questionAr", labelEn: "Question (Arabic)", labelAr: "السؤال (العربية)", dir: "rtl" },
                                { key: "answerEn", labelEn: "Answer (English)", labelAr: "الإجابة (الإنجليزية)", dir: "ltr" },
                                { key: "answerAr", labelEn: "Answer (Arabic)", labelAr: "الإجابة (العربية)", dir: "rtl" },
                            ]}
                        />
                    </CardContent>
                </Card>

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
