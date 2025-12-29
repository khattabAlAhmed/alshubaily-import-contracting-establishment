"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/ui";
import { ImageSelectOrUpload } from "@/components/dashboard/ui/ImageSelectOrUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getCompanyProfile, upsertCompanyProfile } from "@/actions/website-info";
import type { CompanyProfileWithImages } from "@/actions/website-info";
import { Save, Loader2 } from "lucide-react";

export default function CompanyProfileClient() {
    const locale = useLocale();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<CompanyProfileWithImages | null>(null);

    // Form state
    const [nameEn, setNameEn] = useState("");
    const [nameAr, setNameAr] = useState("");
    const [taglineEn, setTaglineEn] = useState("");
    const [taglineAr, setTaglineAr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [descriptionAr, setDescriptionAr] = useState("");
    const [foundedYear, setFoundedYear] = useState<number | undefined>();
    const [logoImageId, setLogoImageId] = useState<string | null>(null);
    const [heroImageId, setHeroImageId] = useState<string | null>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const data = await getCompanyProfile();
            if (data) {
                setProfile(data);
                setNameEn(data.nameEn);
                setNameAr(data.nameAr);
                setTaglineEn(data.taglineEn || "");
                setTaglineAr(data.taglineAr || "");
                setDescriptionEn(data.descriptionEn || "");
                setDescriptionAr(data.descriptionAr || "");
                setFoundedYear(data.foundedYear || undefined);
                setLogoImageId(data.logoImageId || null);
                setHeroImageId(data.heroImageId || null);
            }
        } catch (error) {
            console.error("Error loading profile:", error);
            toast.error(locale === "ar" ? "فشل تحميل البيانات" : "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!nameEn.trim() || !nameAr.trim()) {
            toast.error(locale === "ar" ? "الاسم مطلوب" : "Name is required");
            return;
        }

        setSaving(true);
        try {
            const result = await upsertCompanyProfile({
                nameEn: nameEn.trim(),
                nameAr: nameAr.trim(),
                taglineEn: taglineEn.trim() || undefined,
                taglineAr: taglineAr.trim() || undefined,
                descriptionEn: descriptionEn.trim() || undefined,
                descriptionAr: descriptionAr.trim() || undefined,
                foundedYear: foundedYear || undefined,
                logoImageId: logoImageId || undefined,
                heroImageId: heroImageId || undefined,
            });

            if (result.success) {
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully");
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Error saving:", error);
            toast.error(locale === "ar" ? "فشل الحفظ" : "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <PageHeader
                titleEn="Company Profile"
                titleAr="الملف التعريفي للمؤسسة"
                descriptionEn="Manage main company information"
                descriptionAr="إدارة المعلومات الرئيسية للمؤسسة"
            />

            <div className="grid gap-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {locale === "ar" ? "المعلومات الأساسية" : "Basic Information"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nameEn">Name (English) *</Label>
                                <Input
                                    id="nameEn"
                                    value={nameEn}
                                    onChange={(e) => setNameEn(e.target.value)}
                                    placeholder="Company Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nameAr">الاسم (عربي) *</Label>
                                <Input
                                    id="nameAr"
                                    value={nameAr}
                                    onChange={(e) => setNameAr(e.target.value)}
                                    placeholder="اسم الشركة"
                                    dir="rtl"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="taglineEn">Tagline (English)</Label>
                                <Input
                                    id="taglineEn"
                                    value={taglineEn}
                                    onChange={(e) => setTaglineEn(e.target.value)}
                                    placeholder="Short company tagline"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="taglineAr">الشعار (عربي)</Label>
                                <Input
                                    id="taglineAr"
                                    value={taglineAr}
                                    onChange={(e) => setTaglineAr(e.target.value)}
                                    placeholder="شعار الشركة القصير"
                                    dir="rtl"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="foundedYear">
                                {locale === "ar" ? "سنة التأسيس" : "Founded Year"}
                            </Label>
                            <Input
                                id="foundedYear"
                                type="number"
                                value={foundedYear || ""}
                                onChange={(e) => setFoundedYear(e.target.value ? parseInt(e.target.value) : undefined)}
                                placeholder="e.g., 2005"
                                className="max-w-40"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Description */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {locale === "ar" ? "الوصف" : "Description"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="descriptionEn">Description (English)</Label>
                            <Textarea
                                id="descriptionEn"
                                value={descriptionEn}
                                onChange={(e) => setDescriptionEn(e.target.value)}
                                placeholder="Company description..."
                                rows={4}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="descriptionAr">الوصف (عربي)</Label>
                            <Textarea
                                id="descriptionAr"
                                value={descriptionAr}
                                onChange={(e) => setDescriptionAr(e.target.value)}
                                placeholder="وصف الشركة..."
                                rows={4}
                                dir="rtl"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Images */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {locale === "ar" ? "الصور" : "Images"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Logo Image */}
                            <ImageSelectOrUpload
                                selectedImageId={logoImageId}
                                onSelect={(imageId) => setLogoImageId(imageId)}
                                labelEn="Company Logo"
                                labelAr="شعار الشركة"
                            />

                            {/* Hero Image */}
                            <ImageSelectOrUpload
                                selectedImageId={heroImageId}
                                onSelect={(imageId) => setHeroImageId(imageId)}
                                labelEn="Hero Image (About Section)"
                                labelAr="صورة العرض (قسم من نحن)"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        {locale === "ar" ? "حفظ التغييرات" : "Save Changes"}
                    </Button>
                </div>
            </div>
        </>
    );
}
