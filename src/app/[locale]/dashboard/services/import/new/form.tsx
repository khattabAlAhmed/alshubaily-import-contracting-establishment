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
    createImportService,
    updateImportService,
    type ImportServiceWithRelations
} from "@/actions/import";
import {
    createCountry,
    createSupplier,
    createBeneficiaryCategory,
    createUsage,
    createImportMethod,
    createDeliveryMethod,
    createQualityWarrantyStandard,
    createShipment,
    createWhyChooseUs,
    createFaq,
    type Country,
    type Supplier,
    type BeneficiaryCategory,
    type Usage,
    type ImportMethod,
    type DeliveryMethod,
    type QualityWarrantyStandard,
    type Shipment,
    type WhyChooseUsItem,
    type FaqItem,
} from "@/actions/services";

type ImportServiceFormProps = {
    mode: "create" | "edit";
    existingService?: ImportServiceWithRelations;
    lookups: {
        countries: Country[];
        suppliers: Supplier[];
        beneficiaries: BeneficiaryCategory[];
        usages: Usage[];
        importMethods: ImportMethod[];
        deliveryMethods: DeliveryMethod[];
        qualityWarranty: QualityWarrantyStandard[];
        shipments: Shipment[];
        whyChooseUs: WhyChooseUsItem[];
        faqs: FaqItem[];
    };
};

export function ImportServiceForm({ mode, existingService, lookups }: ImportServiceFormProps) {
    const locale = useLocale();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        titleEn: existingService?.titleEn || "",
        titleAr: existingService?.titleAr || "",
        descriptionEn: existingService?.descriptionEn || "",
        descriptionAr: existingService?.descriptionAr || "",
        slugEn: existingService?.slugEn || "",
        slugAr: existingService?.slugAr || "",
        mainImageId: existingService?.mainImageId || null as string | null,
        countryIds: existingService?.countries.map(c => c.id) || [],
        supplierIds: existingService?.suppliers.map(s => s.id) || [],
        beneficiaryIds: existingService?.beneficiaries.map(b => b.id) || [],
        usageIds: existingService?.usages.map(u => u.id) || [],
        importMethodIds: existingService?.importMethods.map(i => i.id) || [],
        deliveryMethodIds: existingService?.deliveryMethods.map(d => d.id) || [],
        qualityWarrantyIds: existingService?.qualityWarranty.map(q => q.id) || [],
        shipmentIds: existingService?.shipments.map(s => s.id) || [],
        whyChooseUsIds: existingService?.whyChooseUs.map(w => w.id) || [],
        faqIds: existingService?.faqs.map(f => f.id) || [],
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
            result = await createImportService(formData);
        } else if (existingService) {
            result = await updateImportService(existingService.id, formData);
        }

        setIsSaving(false);

        if (result?.success) {
            toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully");
            router.push("/dashboard/services/import");
            router.refresh();
        } else {
            toast.error(result?.message || "Failed to save");
        }
    };

    return (
        <>
            <PageHeader
                titleEn={mode === "create" ? "New Import Service" : "Edit Import Service"}
                titleAr={mode === "create" ? "خدمة استيراد جديدة" : "تعديل خدمة الاستيراد"}
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

                {/* Countries & Suppliers */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {locale === "ar" ? "الدول والموردين" : "Countries & Suppliers"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <MultiSelectCreatable
                            items={dynamicLookups.countries.map(c => ({ id: c.id, titleEn: c.nameEn, titleAr: c.nameAr, createdAt: c.createdAt, updatedAt: c.updatedAt }))}
                            selectedIds={formData.countryIds}
                            onChange={(ids) => setFormData({ ...formData, countryIds: ids })}
                            onCreate={async (data) => {
                                const result = await createCountry({ nameEn: data.titleEn, nameAr: data.titleAr });
                                if (result.success && result.id) {
                                    setDynamicLookups(prev => ({
                                        ...prev,
                                        countries: [...prev.countries, { id: result.id!, nameEn: data.titleEn, nameAr: data.titleAr, createdAt: new Date(), updatedAt: new Date() }],
                                    }));
                                }
                                return result;
                            }}
                            labelEn="Countries"
                            labelAr="الدول"
                            displayField="title"
                            createFields={[
                                { key: "titleEn", labelEn: "Name (English)", labelAr: "الاسم (الإنجليزية)", dir: "ltr" },
                                { key: "titleAr", labelEn: "Name (Arabic)", labelAr: "الاسم (العربية)", dir: "rtl" },
                            ]}
                        />

                        <MultiSelectCreatable
                            items={dynamicLookups.suppliers.map(s => ({ id: s.id, titleEn: s.nameEn, titleAr: s.nameAr, createdAt: s.createdAt, updatedAt: s.updatedAt }))}
                            selectedIds={formData.supplierIds}
                            onChange={(ids) => setFormData({ ...formData, supplierIds: ids })}
                            onCreate={async (data) => {
                                const result = await createSupplier({ nameEn: data.titleEn, nameAr: data.titleAr });
                                if (result.success && result.id) {
                                    setDynamicLookups(prev => ({
                                        ...prev,
                                        suppliers: [...prev.suppliers, {
                                            id: result.id!,
                                            nameEn: data.titleEn,
                                            nameAr: data.titleAr,
                                            logoImageId: null,
                                            createdAt: new Date(),
                                            updatedAt: new Date()
                                        }],
                                    }));
                                }
                                return result;
                            }}
                            labelEn="Suppliers"
                            labelAr="الموردين"
                            displayField="title"
                            createFields={[
                                { key: "titleEn", labelEn: "Name (English)", labelAr: "الاسم (الإنجليزية)", dir: "ltr" },
                                { key: "titleAr", labelEn: "Name (Arabic)", labelAr: "الاسم (العربية)", dir: "rtl" },
                            ]}
                        />
                    </CardContent>
                </Card>

                {/* Beneficiaries & Usages */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {locale === "ar" ? "المستفيدين والاستخدامات" : "Beneficiaries & Usages"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <MultiSelectCreatable
                            items={dynamicLookups.beneficiaries}
                            selectedIds={formData.beneficiaryIds}
                            onChange={(ids) => setFormData({ ...formData, beneficiaryIds: ids })}
                            onCreate={async (data) => {
                                const result = await createBeneficiaryCategory({ titleEn: data.titleEn, titleAr: data.titleAr });
                                if (result.success && result.id) {
                                    setDynamicLookups(prev => ({
                                        ...prev,
                                        beneficiaries: [...prev.beneficiaries, { id: result.id!, titleEn: data.titleEn, titleAr: data.titleAr, createdAt: new Date(), updatedAt: new Date() }],
                                    }));
                                }
                                return result;
                            }}
                            labelEn="Beneficiary Categories"
                            labelAr="فئات المستفيدين"
                            displayField="title"
                            createFields={[
                                { key: "titleEn", labelEn: "Title (English)", labelAr: "العنوان (الإنجليزية)", dir: "ltr" },
                                { key: "titleAr", labelEn: "Title (Arabic)", labelAr: "العنوان (العربية)", dir: "rtl" },
                            ]}
                        />

                        <MultiSelectCreatable
                            items={dynamicLookups.usages}
                            selectedIds={formData.usageIds}
                            onChange={(ids) => setFormData({ ...formData, usageIds: ids })}
                            onCreate={async (data) => {
                                const result = await createUsage({ titleEn: data.titleEn, titleAr: data.titleAr });
                                if (result.success && result.id) {
                                    setDynamicLookups(prev => ({
                                        ...prev,
                                        usages: [...prev.usages, { id: result.id!, titleEn: data.titleEn, titleAr: data.titleAr, createdAt: new Date(), updatedAt: new Date() }],
                                    }));
                                }
                                return result;
                            }}
                            labelEn="Usages"
                            labelAr="الاستخدامات"
                            displayField="title"
                            createFields={[
                                { key: "titleEn", labelEn: "Title (English)", labelAr: "العنوان (الإنجليزية)", dir: "ltr" },
                                { key: "titleAr", labelEn: "Title (Arabic)", labelAr: "العنوان (العربية)", dir: "rtl" },
                            ]}
                        />
                    </CardContent>
                </Card>

                {/* Import & Delivery Methods */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {locale === "ar" ? "طرق الاستيراد والتوصيل" : "Import & Delivery Methods"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <MultiSelectCreatable
                            items={dynamicLookups.importMethods}
                            selectedIds={formData.importMethodIds}
                            onChange={(ids) => setFormData({ ...formData, importMethodIds: ids })}
                            onCreate={async (data) => {
                                const result = await createImportMethod({ titleEn: data.titleEn, titleAr: data.titleAr });
                                if (result.success && result.id) {
                                    setDynamicLookups(prev => ({
                                        ...prev,
                                        importMethods: [...prev.importMethods, { id: result.id!, titleEn: data.titleEn, titleAr: data.titleAr, createdAt: new Date(), updatedAt: new Date() }],
                                    }));
                                }
                                return result;
                            }}
                            labelEn="Import Methods"
                            labelAr="طرق الاستيراد"
                            displayField="title"
                            createFields={[
                                { key: "titleEn", labelEn: "Title (English)", labelAr: "العنوان (الإنجليزية)", dir: "ltr" },
                                { key: "titleAr", labelEn: "Title (Arabic)", labelAr: "العنوان (العربية)", dir: "rtl" },
                            ]}
                        />

                        <MultiSelectCreatable
                            items={dynamicLookups.deliveryMethods}
                            selectedIds={formData.deliveryMethodIds}
                            onChange={(ids) => setFormData({ ...formData, deliveryMethodIds: ids })}
                            onCreate={async (data) => {
                                const result = await createDeliveryMethod({ titleEn: data.titleEn, titleAr: data.titleAr });
                                if (result.success && result.id) {
                                    setDynamicLookups(prev => ({
                                        ...prev,
                                        deliveryMethods: [...prev.deliveryMethods, { id: result.id!, titleEn: data.titleEn, titleAr: data.titleAr, createdAt: new Date(), updatedAt: new Date() }],
                                    }));
                                }
                                return result;
                            }}
                            labelEn="Delivery Methods"
                            labelAr="طرق التوصيل"
                            displayField="title"
                            createFields={[
                                { key: "titleEn", labelEn: "Title (English)", labelAr: "العنوان (الإنجليزية)", dir: "ltr" },
                                { key: "titleAr", labelEn: "Title (Arabic)", labelAr: "العنوان (العربية)", dir: "rtl" },
                            ]}
                        />
                    </CardContent>
                </Card>

                {/* Quality Warranty & Shipments */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {locale === "ar" ? "الجودة والشحنات" : "Quality & Shipments"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <MultiSelectCreatable
                            items={dynamicLookups.qualityWarranty}
                            selectedIds={formData.qualityWarrantyIds}
                            onChange={(ids) => setFormData({ ...formData, qualityWarrantyIds: ids })}
                            onCreate={async (data) => {
                                const result = await createQualityWarrantyStandard({ titleEn: data.titleEn, titleAr: data.titleAr });
                                if (result.success && result.id) {
                                    setDynamicLookups(prev => ({
                                        ...prev,
                                        qualityWarranty: [...prev.qualityWarranty, { id: result.id!, titleEn: data.titleEn, titleAr: data.titleAr, createdAt: new Date(), updatedAt: new Date() }],
                                    }));
                                }
                                return result;
                            }}
                            labelEn="Quality & Warranty Standards"
                            labelAr="معايير الجودة والضمان"
                            displayField="title"
                            createFields={[
                                { key: "titleEn", labelEn: "Title (English)", labelAr: "العنوان (الإنجليزية)", dir: "ltr" },
                                { key: "titleAr", labelEn: "Title (Arabic)", labelAr: "العنوان (العربية)", dir: "rtl" },
                            ]}
                        />

                        <MultiSelectCreatable
                            items={dynamicLookups.shipments}
                            selectedIds={formData.shipmentIds}
                            onChange={(ids) => setFormData({ ...formData, shipmentIds: ids })}
                            onCreate={async (data) => {
                                const result = await createShipment({ titleEn: data.titleEn, titleAr: data.titleAr });
                                if (result.success && result.id) {
                                    setDynamicLookups(prev => ({
                                        ...prev,
                                        shipments: [...prev.shipments, {
                                            id: result.id!,
                                            titleEn: data.titleEn,
                                            titleAr: data.titleAr,
                                            mainImageId: null,
                                            descriptionEn: null,
                                            descriptionAr: null,
                                            arrivalDate: null,
                                            createdAt: new Date(),
                                            updatedAt: new Date()
                                        }],
                                    }));
                                }
                                return result;
                            }}
                            labelEn="Shipments"
                            labelAr="الشحنات"
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
