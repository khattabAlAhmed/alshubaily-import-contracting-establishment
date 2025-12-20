"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
    PageHeader,
    ImageSelectOrUpload,
    MultiImageSelectOrUpload,
    RichTextEditor,
} from "@/components/dashboard/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import {
    createArticle,
    updateArticle,
    createArticleCategory,
    type ArticleWithRelations,
    type ArticleCategory,
    type Author,
} from "@/actions/articles";

type ArticleFormProps = {
    mode: "create" | "edit";
    existingArticle?: ArticleWithRelations;
    categories: ArticleCategory[];
    authors: Author[];
    isAdmin: boolean;
    currentAuthorId: string | null;
};

export default function ArticleForm({
    mode,
    existingArticle,
    categories: initialCategories,
    authors,
    isAdmin,
    currentAuthorId,
}: ArticleFormProps) {
    const locale = useLocale();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState(initialCategories);

    // Category creation dialog
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({ titleEn: "", titleAr: "" });
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

    // Determine the author ID to use
    const getInitialAuthorId = () => {
        if (existingArticle?.authorId) {
            return existingArticle.authorId;
        }
        if (!isAdmin && currentAuthorId) {
            return currentAuthorId;
        }
        return "";
    };

    const [formData, setFormData] = useState({
        titleEn: existingArticle?.titleEn || "",
        titleAr: existingArticle?.titleAr || "",
        slugEn: existingArticle?.slugEn || "",
        slugAr: existingArticle?.slugAr || "",
        categoryId: existingArticle?.categoryId || "",
        authorId: getInitialAuthorId(),
        mainImageId: existingArticle?.mainImageId || null as string | null,
        imageIds: existingArticle?.images.map((img) => img.id) || ([] as string[]),
        contentEn: existingArticle?.richContent?.contentEn || "",
        contentAr: existingArticle?.richContent?.contentAr || "",
        publishNow: mode === "create" ? true : !!existingArticle?.publishedAt,
    });

    // For non-admin authors, ensure authorId is set
    useEffect(() => {
        if (!isAdmin && currentAuthorId && !formData.authorId) {
            setFormData(prev => ({ ...prev, authorId: currentAuthorId }));
        }
    }, [isAdmin, currentAuthorId, formData.authorId]);

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

    const handleCreateCategory = async () => {
        if (!newCategory.titleEn || !newCategory.titleAr) {
            toast.error(locale === "ar" ? "يرجى ملء الحقول المطلوبة" : "Please fill required fields");
            return;
        }

        setIsCreatingCategory(true);

        const slugEn = generateSlug(newCategory.titleEn, false);
        const slugAr = generateSlug(newCategory.titleAr, true);

        const result = await createArticleCategory({
            titleEn: newCategory.titleEn,
            titleAr: newCategory.titleAr,
            slugEn,
            slugAr,
        });

        setIsCreatingCategory(false);

        if (result.success && result.id) {
            toast.success(locale === "ar" ? "تم إنشاء التصنيف" : "Category created");
            // Add to local categories list and select it
            const newCat: ArticleCategory = {
                id: result.id,
                titleEn: newCategory.titleEn,
                titleAr: newCategory.titleAr,
                slugEn,
                slugAr,
                imageId: null,
                descriptionEn: null,
                descriptionAr: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setCategories(prev => [...prev, newCat]);
            setFormData(prev => ({ ...prev, categoryId: result.id! }));
            setCategoryDialogOpen(false);
            setNewCategory({ titleEn: "", titleAr: "" });
        } else {
            toast.error(result.message);
        }
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

        // Determine the author ID to save
        const authorIdToSave = isAdmin
            ? (formData.authorId || null)
            : (currentAuthorId || null);

        setIsSaving(true);

        let result;
        if (mode === "create") {
            result = await createArticle({
                ...formData,
                categoryId: formData.categoryId || null,
                authorId: authorIdToSave,
                publishedAt: formData.publishNow ? new Date() : null,
            });
        } else if (existingArticle) {
            result = await updateArticle(existingArticle.id, {
                ...formData,
                categoryId: formData.categoryId || null,
                authorId: authorIdToSave,
                publishedAt: formData.publishNow ? (existingArticle.publishedAt || new Date()) : null,
            });
        }

        setIsSaving(false);

        if (result?.success) {
            toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully");
            router.push("/dashboard/articles");
            router.refresh();
        } else {
            toast.error(result?.message || "Failed to save");
        }
    };

    // Get the current author's name (for display when non-admin)
    const currentAuthorName = authors.find(a => a.id === currentAuthorId);

    return (
        <>
            <PageHeader
                titleEn={mode === "create" ? "New Article" : "Edit Article"}
                titleAr={mode === "create" ? "مقال جديد" : "تعديل المقال"}
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
                                    {locale === "ar"
                                        ? "العنوان (الإنجليزية) *"
                                        : "Title (English) *"}
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
                                    placeholder="Article title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    {locale === "ar"
                                        ? "العنوان (العربية) *"
                                        : "Title (Arabic) *"}
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
                                    placeholder="عنوان المقال"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>
                                    {locale === "ar"
                                        ? "المعرف (الإنجليزية) *"
                                        : "Slug (English) *"}
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
                                    {locale === "ar"
                                        ? "المعرف (العربية) *"
                                        : "Slug (Arabic) *"}
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
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Category with create option */}
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "التصنيف" : "Category"}</Label>
                                <div className="flex gap-2">
                                    <Select
                                        value={formData.categoryId}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, categoryId: value })
                                        }
                                    >
                                        <SelectTrigger className="flex-1">
                                            <SelectValue
                                                placeholder={
                                                    locale === "ar" ? "اختر تصنيف" : "Select category"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {locale === "ar" ? cat.titleAr : cat.titleEn}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCategoryDialogOpen(true)}
                                        title={locale === "ar" ? "إضافة تصنيف" : "Add category"}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Author field - only show for admins */}
                            {isAdmin ? (
                                <div className="space-y-2">
                                    <Label>{locale === "ar" ? "الكاتب" : "Author"}</Label>
                                    <Select
                                        value={formData.authorId}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, authorId: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    locale === "ar" ? "اختر الكاتب" : "Select author"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {authors.map((author) => (
                                                <SelectItem key={author.id} value={author.id}>
                                                    {locale === "ar"
                                                        ? author.publicNameAr
                                                        : author.publicNameEn}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : currentAuthorName ? (
                                <div className="space-y-2">
                                    <Label>{locale === "ar" ? "الكاتب" : "Author"}</Label>
                                    <Input
                                        value={locale === "ar" ? currentAuthorName.publicNameAr : currentAuthorName.publicNameEn}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {locale === "ar"
                                            ? "يتم تعيين الكاتب تلقائيًا"
                                            : "Author is automatically assigned"}
                                    </p>
                                </div>
                            ) : null}
                        </div>

                        {/* Publish Now checkbox */}
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Checkbox
                                id="publishNow"
                                checked={formData.publishNow}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, publishNow: !!checked })
                                }
                            />
                            <Label htmlFor="publishNow" className="cursor-pointer">
                                {locale === "ar" ? "نشر المقال الآن" : "Publish article now"}
                            </Label>
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

                {/* Rich Content Editor */}
                <RichTextEditor
                    labelEn="Article Content"
                    labelAr="محتوى المقال"
                    contentEn={formData.contentEn}
                    contentAr={formData.contentAr}
                    onChangeEn={(html) => setFormData({ ...formData, contentEn: html })}
                    onChangeAr={(html) => setFormData({ ...formData, contentAr: html })}
                />

                {/* Gallery Images */}
                <MultiImageSelectOrUpload
                    selectedImageIds={formData.imageIds}
                    onSelect={(imageIds) => setFormData({ ...formData, imageIds })}
                    labelEn="Additional Images"
                    labelAr="صور إضافية"
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

            {/* Category Creation Dialog */}
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {locale === "ar" ? "إضافة تصنيف جديد" : "Add New Category"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>{locale === "ar" ? "الاسم (انجليزي) *" : "Name (English) *"}</Label>
                            <Input
                                value={newCategory.titleEn}
                                onChange={(e) => setNewCategory({ ...newCategory, titleEn: e.target.value })}
                                dir="ltr"
                                placeholder="Category name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{locale === "ar" ? "الاسم (عربي) *" : "Name (Arabic) *"}</Label>
                            <Input
                                value={newCategory.titleAr}
                                onChange={(e) => setNewCategory({ ...newCategory, titleAr: e.target.value })}
                                dir="rtl"
                                placeholder="اسم التصنيف"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                            {locale === "ar" ? "إلغاء" : "Cancel"}
                        </Button>
                        <Button onClick={handleCreateCategory} disabled={isCreatingCategory}>
                            {isCreatingCategory && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {locale === "ar" ? "إضافة" : "Add"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
