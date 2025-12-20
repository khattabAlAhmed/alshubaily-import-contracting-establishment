"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { PageHeader, ImageSelectOrUpload, MultiImageSelectOrUpload } from "@/components/dashboard/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, Save, Plus, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    createProduct,
    updateProduct,
    type ProductWithRelations,
    type ProductCategory,
    type Property,
    type PropertyCategory,
} from "@/actions/products";

type ProductDetail = {
    id?: string;
    categoryId: string;
    propertyId: string;
    valueEn: string;
    valueAr: string;
};

type ExistingDetail = {
    id: string;
    productId: string;
    propertyId: string;
    valueEn: string | null;
    valueAr: string | null;
    property: { id: string; titleEn: string; titleAr: string };
};

type ProductFormProps = {
    mode: "create" | "edit";
    existingProduct?: ProductWithRelations;
    categories: ProductCategory[];
    properties: Property[];
    propertyCategories: PropertyCategory[];
    existingDetails?: ExistingDetail[];
};

export default function ProductForm({
    mode,
    existingProduct,
    categories,
    properties,
    propertyCategories,
    existingDetails = [],
}: ProductFormProps) {
    const locale = useLocale();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        titleEn: existingProduct?.titleEn || "",
        titleAr: existingProduct?.titleAr || "",
        descriptionEn: existingProduct?.descriptionEn || "",
        descriptionAr: existingProduct?.descriptionAr || "",
        slugEn: existingProduct?.slugEn || "",
        slugAr: existingProduct?.slugAr || "",
        categoryId: existingProduct?.categoryId || "",
        mainImageId: existingProduct?.mainImageId || null as string | null,
        imageIds: existingProduct?.images.map(img => img.id) || [] as string[],
    });

    // Product details state - derive categoryId from existing property
    const [details, setDetails] = useState<ProductDetail[]>(
        existingDetails.map(d => {
            const prop = properties.find(p => p.id === d.propertyId);
            return {
                id: d.id,
                categoryId: prop?.categoryId || "",
                propertyId: d.propertyId,
                valueEn: d.valueEn || "",
                valueAr: d.valueAr || "",
            };
        })
    );

    const generateSlug = (title: string, isArabic: boolean) => {
        if (isArabic) {
            return title.trim().replace(/\s+/g, "-");
        }
        return title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    };

    const addDetail = () => {
        setDetails(prev => [...prev, { categoryId: "", propertyId: "", valueEn: "", valueAr: "" }]);
    };

    const removeDetail = (index: number) => {
        setDetails(prev => prev.filter((_, i) => i !== index));
    };

    const updateDetail = (index: number, field: keyof ProductDetail, value: string) => {
        setDetails(prev => prev.map((d, i) => {
            if (i !== index) return d;
            if (field === "categoryId") {
                // Reset propertyId when category changes
                return { ...d, categoryId: value, propertyId: "" };
            }
            return { ...d, [field]: value };
        }));
    };

    // Get available properties for a detail row (filter by category if selected)
    const getFilteredProperties = (categoryId: string, currentPropertyId: string) => {
        // Get already selected property IDs (except current)
        const selectedIds = details.map(d => d.propertyId).filter(id => id !== currentPropertyId);

        let filtered = properties.filter(p => !selectedIds.includes(p.id));

        // Filter by category if selected
        if (categoryId) {
            filtered = filtered.filter(p => p.categoryId === categoryId);
        }

        return filtered;
    };

    const handleSave = async () => {
        if (!formData.titleEn || !formData.titleAr || !formData.slugEn || !formData.slugAr) {
            toast.error(locale === "ar" ? "يرجى ملء الحقول المطلوبة" : "Please fill required fields");
            return;
        }

        setIsSaving(true);

        // Filter out empty details
        const validDetails = details.filter(d => d.propertyId);

        let result;
        if (mode === "create") {
            result = await createProduct({
                ...formData,
                categoryId: formData.categoryId || null,
                details: validDetails.map(d => ({
                    propertyId: d.propertyId,
                    valueEn: d.valueEn,
                    valueAr: d.valueAr,
                })),
            });
        } else if (existingProduct) {
            result = await updateProduct(existingProduct.id, {
                ...formData,
                categoryId: formData.categoryId || null,
                details: validDetails.map(d => ({
                    propertyId: d.propertyId,
                    valueEn: d.valueEn,
                    valueAr: d.valueAr,
                })),
            });
        }

        setIsSaving(false);

        if (result?.success) {
            toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully");
            router.push("/dashboard/products");
            router.refresh();
        } else {
            toast.error(result?.message || "Failed to save");
        }
    };

    return (
        <>
            <PageHeader
                titleEn={mode === "create" ? "New Product" : "Edit Product"}
                titleAr={mode === "create" ? "منتج جديد" : "تعديل المنتج"}
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
                                    placeholder="Product title"
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
                                    placeholder="عنوان المنتج"
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
                    labelEn="Gallery Images"
                    labelAr="صور المعرض"
                />

                {/* Product Details */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>
                            {locale === "ar" ? "تفاصيل المنتج" : "Product Details"}
                        </CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={addDetail}>
                            <Plus className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                            {locale === "ar" ? "إضافة" : "Add"}
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {details.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                {locale === "ar" ? "لا توجد تفاصيل. انقر على إضافة لإضافة خاصية." : "No details. Click Add to add a property."}
                            </p>
                        ) : (
                            details.map((detail, index) => (
                                <DetailRow
                                    key={index}
                                    index={index}
                                    detail={detail}
                                    propertyCategories={propertyCategories}
                                    filteredProperties={getFilteredProperties(detail.categoryId, detail.propertyId)}
                                    locale={locale}
                                    onUpdate={updateDetail}
                                    onRemove={removeDetail}
                                />
                            ))
                        )}
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

// Detail Row Component with searchable selects
type DetailRowProps = {
    index: number;
    detail: ProductDetail;
    propertyCategories: PropertyCategory[];
    filteredProperties: Property[];
    locale: string;
    onUpdate: (index: number, field: keyof ProductDetail, value: string) => void;
    onRemove: (index: number) => void;
};

function DetailRow({
    index,
    detail,
    propertyCategories,
    filteredProperties,
    locale,
    onUpdate,
    onRemove
}: DetailRowProps) {
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [propertyOpen, setPropertyOpen] = useState(false);

    const selectedCategory = propertyCategories.find(c => c.id === detail.categoryId);
    const selectedProperty = filteredProperties.find(p => p.id === detail.propertyId)
        || (detail.propertyId ? { titleEn: "Selected", titleAr: "مختار" } : null);

    return (
        <div className="flex gap-3 items-start border p-3 rounded-lg">
            <div className="flex-1 grid gap-3 md:grid-cols-4">
                {/* Category Select */}
                <div className="space-y-1">
                    <Label className="text-xs">
                        {locale === "ar" ? "تصنيف الخاصية" : "Property Category"}
                    </Label>
                    <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={categoryOpen}
                                className="w-full justify-between h-9 font-normal"
                            >
                                <span className="truncate">
                                    {selectedCategory
                                        ? (locale === "ar" ? selectedCategory.titleAr : selectedCategory.titleEn)
                                        : (locale === "ar" ? "الكل" : "All")}
                                </span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0" align="start">
                            <Command>
                                <CommandInput placeholder={locale === "ar" ? "بحث..." : "Search..."} />
                                <CommandList>
                                    <CommandEmpty>{locale === "ar" ? "لا توجد نتائج" : "No results"}</CommandEmpty>
                                    <CommandGroup>
                                        <CommandItem
                                            value=""
                                            onSelect={() => {
                                                onUpdate(index, "categoryId", "");
                                                setCategoryOpen(false);
                                            }}
                                        >
                                            <Check className={cn("mr-2 h-4 w-4", !detail.categoryId ? "opacity-100" : "opacity-0")} />
                                            {locale === "ar" ? "الكل" : "All Categories"}
                                        </CommandItem>
                                        {propertyCategories.map((cat) => (
                                            <CommandItem
                                                key={cat.id}
                                                value={locale === "ar" ? cat.titleAr : cat.titleEn}
                                                onSelect={() => {
                                                    onUpdate(index, "categoryId", cat.id);
                                                    setCategoryOpen(false);
                                                }}
                                            >
                                                <Check className={cn("mr-2 h-4 w-4", detail.categoryId === cat.id ? "opacity-100" : "opacity-0")} />
                                                {locale === "ar" ? cat.titleAr : cat.titleEn}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Property Select */}
                <div className="space-y-1">
                    <Label className="text-xs">
                        {locale === "ar" ? "الخاصية" : "Property"}
                    </Label>
                    <Popover open={propertyOpen} onOpenChange={setPropertyOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={propertyOpen}
                                className="w-full justify-between h-9 font-normal"
                            >
                                <span className="truncate">
                                    {selectedProperty
                                        ? (locale === "ar" ? selectedProperty.titleAr : selectedProperty.titleEn)
                                        : (locale === "ar" ? "اختر" : "Select")}
                                </span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0" align="start">
                            <Command>
                                <CommandInput placeholder={locale === "ar" ? "بحث..." : "Search..."} />
                                <CommandList>
                                    <CommandEmpty>{locale === "ar" ? "لا توجد نتائج" : "No results"}</CommandEmpty>
                                    <CommandGroup>
                                        {filteredProperties.map((prop) => (
                                            <CommandItem
                                                key={prop.id}
                                                value={locale === "ar" ? prop.titleAr : prop.titleEn}
                                                onSelect={() => {
                                                    onUpdate(index, "propertyId", prop.id);
                                                    setPropertyOpen(false);
                                                }}
                                            >
                                                <Check className={cn("mr-2 h-4 w-4", detail.propertyId === prop.id ? "opacity-100" : "opacity-0")} />
                                                {locale === "ar" ? prop.titleAr : prop.titleEn}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Value EN */}
                <div className="space-y-1">
                    <Label className="text-xs">
                        {locale === "ar" ? "القيمة (EN)" : "Value (EN)"}
                    </Label>
                    <Input
                        value={detail.valueEn}
                        onChange={(e) => onUpdate(index, "valueEn", e.target.value)}
                        dir="ltr"
                        className="h-9"
                        placeholder="Value"
                    />
                </div>

                {/* Value AR */}
                <div className="space-y-1">
                    <Label className="text-xs">
                        {locale === "ar" ? "القيمة (AR)" : "Value (AR)"}
                    </Label>
                    <Input
                        value={detail.valueAr}
                        onChange={(e) => onUpdate(index, "valueAr", e.target.value)}
                        dir="rtl"
                        className="h-9"
                        placeholder="القيمة"
                    />
                </div>
            </div>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive h-9 w-9 mt-5"
                onClick={() => onRemove(index)}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
