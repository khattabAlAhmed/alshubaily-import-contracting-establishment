"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, X, Image as ImageIcon, Loader2, Check, Grid, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllImages, uploadImage, type ImageRecord } from "@/actions/images";
import { toast } from "sonner";

type MultiImageSelectOrUploadProps = {
    selectedImageIds: string[];
    onSelect: (imageIds: string[]) => void;
    labelEn?: string;
    labelAr?: string;
    className?: string;
};

export function MultiImageSelectOrUpload({
    selectedImageIds,
    onSelect,
    labelEn = "Gallery Images",
    labelAr = "صور المعرض",
    className,
}: MultiImageSelectOrUploadProps) {
    const locale = useLocale();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [images, setImages] = useState<ImageRecord[]>([]);
    const [isLoadingImages, setIsLoadingImages] = useState(true);
    const [activeTab, setActiveTab] = useState<"select" | "upload">("select");

    // Upload state
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [titleEn, setTitleEn] = useState("");
    const [titleAr, setTitleAr] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // Load existing images
    useEffect(() => {
        async function loadImages() {
            setIsLoadingImages(true);
            const result = await getAllImages();
            setImages(result);
            setIsLoadingImages(false);
        }
        loadImages();
    }, []);

    // Find selected images
    const selectedImages = images.filter(img => selectedImageIds.includes(img.id));

    // Filter images by search query
    const filteredImages = images.filter(img => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            (img.titleEn?.toLowerCase().includes(query) || false) ||
            (img.titleAr?.includes(searchQuery) || false)
        );
    });

    const handleFileSelect = useCallback((file: File) => {
        setError(null);

        if (!file.type.startsWith("image/")) {
            setError(locale === "ar" ? "يجب أن يكون الملف صورة" : "File must be an image");
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setError(locale === "ar" ? "حجم الملف يجب أن يكون أقل من 5 ميجابايت" : "File size must be less than 5MB");
            return;
        }

        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, [locale]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const clearUploadSelection = () => {
        setPreview(null);
        setSelectedFile(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("titleEn", titleEn);
        formData.append("titleAr", titleAr);
        formData.append("altEn", titleEn);
        formData.append("altAr", titleAr);

        const result = await uploadImage(formData);

        setIsUploading(false);

        if (result.success && result.image) {
            toast.success(locale === "ar" ? "تم رفع الصورة" : "Image uploaded");
            setImages(prev => [result.image!, ...prev]);
            // Add newly uploaded image to selection
            onSelect([...selectedImageIds, result.image.id]);
            clearUploadSelection();
            setTitleEn("");
            setTitleAr("");
            setActiveTab("select");
        } else {
            setError(result.message);
        }
    };

    const handleToggleImage = (image: ImageRecord) => {
        if (selectedImageIds.includes(image.id)) {
            onSelect(selectedImageIds.filter(id => id !== image.id));
        } else {
            onSelect([...selectedImageIds, image.id]);
        }
    };

    const handleRemoveImage = (imageId: string) => {
        onSelect(selectedImageIds.filter(id => id !== imageId));
    };

    return (
        <Card className={cn("w-full", className)}>
            <CardContent className="pt-6">
                <Label className="mb-3 block">
                    {locale === "ar" ? labelAr : labelEn}
                </Label>

                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {selectedImages.map((image) => (
                            <div key={image.id} className="relative">
                                <img
                                    src={image.url}
                                    alt={locale === "ar" ? image.titleAr || "" : image.titleEn || ""}
                                    className="h-16 w-16 object-cover rounded-lg border"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-5 w-5"
                                    onClick={() => handleRemoveImage(image.id)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "select" | "upload")}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="select" className="gap-2">
                            <Grid className="h-4 w-4" />
                            {locale === "ar" ? "اختيار" : "Select"}
                        </TabsTrigger>
                        <TabsTrigger value="upload" className="gap-2">
                            <Upload className="h-4 w-4" />
                            {locale === "ar" ? "رفع" : "Upload"}
                        </TabsTrigger>
                    </TabsList>

                    {/* Select from existing */}
                    <TabsContent value="select" className="mt-4">
                        {isLoadingImages ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : images.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                                <p>{locale === "ar" ? "لا توجد صور" : "No images found"}</p>
                            </div>
                        ) : (
                            <>
                                {/* Search input */}
                                <div className="relative mb-3">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={locale === "ar" ? "بحث بالاسم..." : "Search by name..."}
                                        className="pl-9 rtl:pl-3 rtl:pr-9 h-9"
                                    />
                                </div>

                                {filteredImages.length === 0 ? (
                                    <div className="text-center py-6 text-muted-foreground">
                                        <p>{locale === "ar" ? "لا توجد نتائج" : "No results found"}</p>
                                    </div>
                                ) : (
                                    <ScrollArea className="h-48">
                                        <div className="grid grid-cols-4 gap-2">
                                            {filteredImages.map((image) => (
                                                <button
                                                    key={image.id}
                                                    type="button"
                                                    onClick={() => handleToggleImage(image)}
                                                    className={cn(
                                                        "relative aspect-square rounded-lg overflow-hidden border-2 transition-colors hover:border-primary",
                                                        selectedImageIds.includes(image.id)
                                                            ? "border-primary ring-2 ring-primary ring-offset-2"
                                                            : "border-muted"
                                                    )}
                                                >
                                                    <img
                                                        src={image.url}
                                                        alt={locale === "ar" ? image.titleAr || "" : image.titleEn || ""}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {selectedImageIds.includes(image.id) && (
                                                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                            <Check className="h-6 w-6 text-primary" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}
                            </>
                        )}
                    </TabsContent>

                    {/* Upload new */}
                    <TabsContent value="upload" className="mt-4 space-y-4">
                        {/* Drop Zone */}
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
                                isDragging && "border-primary bg-primary/5",
                                error && "border-destructive",
                                !isDragging && !error && "border-muted-foreground/25 hover:border-primary"
                            )}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleInputChange}
                                className="hidden"
                            />

                            {preview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="max-h-32 mx-auto rounded-lg object-contain"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-0 right-0 h-6 w-6"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            clearUploadSelection();
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="py-2">
                                    <Plus className="h-8 w-8 mx-auto text-muted-foreground mb-1" />
                                    <p className="text-sm text-muted-foreground">
                                        {locale === "ar" ? "اسحب صورة أو انقر للتحديد" : "Drag an image or click to select"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}

                        {/* Metadata Fields */}
                        {selectedFile && (
                            <>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs">{locale === "ar" ? "العنوان (الإنجليزية)" : "Title (English)"}</Label>
                                        <Input
                                            value={titleEn}
                                            onChange={(e) => setTitleEn(e.target.value)}
                                            placeholder="Image title"
                                            dir="ltr"
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">{locale === "ar" ? "العنوان (العربية)" : "Title (Arabic)"}</Label>
                                        <Input
                                            value={titleAr}
                                            onChange={(e) => setTitleAr(e.target.value)}
                                            placeholder="عنوان الصورة"
                                            dir="rtl"
                                            className="h-8"
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="w-full"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {locale === "ar" ? "جاري الرفع..." : "Uploading..."}
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                                            {locale === "ar" ? "رفع وإضافة" : "Upload & Add"}
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
