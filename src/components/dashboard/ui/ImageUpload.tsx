"use client";

import { useRef, useState, useCallback } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
    onUpload: (formData: FormData) => Promise<{ success: boolean; message: string }>;
    onSuccess?: () => void;
    showMetadataFields?: boolean;
    maxSizeMB?: number;
    className?: string;
};

export function ImageUpload({
    onUpload,
    onSuccess,
    showMetadataFields = true,
    maxSizeMB = 5,
    className,
}: ImageUploadProps) {
    const locale = useLocale();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [titleEn, setTitleEn] = useState("");
    const [titleAr, setTitleAr] = useState("");
    const [altEn, setAltEn] = useState("");
    const [altAr, setAltAr] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = useCallback((file: File) => {
        setError(null);

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError(locale === "ar" ? "يجب أن يكون الملف صورة" : "File must be an image");
            return;
        }

        // Validate file size
        const maxSize = maxSizeMB * 1024 * 1024;
        if (file.size > maxSize) {
            setError(
                locale === "ar"
                    ? `حجم الملف يجب أن يكون أقل من ${maxSizeMB} ميجابايت`
                    : `File size must be less than ${maxSizeMB}MB`
            );
            return;
        }

        setSelectedFile(file);

        // Generate preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, [locale, maxSizeMB]);

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

    const clearSelection = () => {
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
        formData.append("altEn", altEn);
        formData.append("altAr", altAr);

        const result = await onUpload(formData);

        setIsUploading(false);

        if (result.success) {
            // Reset form
            clearSelection();
            setTitleEn("");
            setTitleAr("");
            setAltEn("");
            setAltAr("");
            onSuccess?.();
        } else {
            setError(result.message);
        }
    };

    return (
        <Card className={cn("w-full", className)}>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {/* Drop Zone */}
                    <div
                        className={cn(
                            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
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
                            <div className="relative">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="max-h-48 mx-auto rounded-lg object-contain"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-0 right-0 h-8 w-8"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearSelection();
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="py-4">
                                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    {locale === "ar"
                                        ? "اسحب وأفلت صورة هنا، أو انقر للاختيار"
                                        : "Drag and drop an image here, or click to select"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {locale === "ar"
                                        ? `الحد الأقصى للحجم: ${maxSizeMB} ميجابايت`
                                        : `Maximum size: ${maxSizeMB}MB`}
                                </p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    {/* Metadata Fields */}
                    {showMetadataFields && selectedFile && (
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "العنوان (الإنجليزية)" : "Title (English)"}</Label>
                                <Input
                                    value={titleEn}
                                    onChange={(e) => setTitleEn(e.target.value)}
                                    placeholder="Image title"
                                    dir="ltr"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "العنوان (العربية)" : "Title (Arabic)"}</Label>
                                <Input
                                    value={titleAr}
                                    onChange={(e) => setTitleAr(e.target.value)}
                                    placeholder="عنوان الصورة"
                                    dir="rtl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "النص البديل (الإنجليزية)" : "Alt Text (English)"}</Label>
                                <Input
                                    value={altEn}
                                    onChange={(e) => setAltEn(e.target.value)}
                                    placeholder="Description for accessibility"
                                    dir="ltr"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "النص البديل (العربية)" : "Alt Text (Arabic)"}</Label>
                                <Input
                                    value={altAr}
                                    onChange={(e) => setAltAr(e.target.value)}
                                    placeholder="وصف للوصول"
                                    dir="rtl"
                                />
                            </div>
                        </div>
                    )}

                    {/* Upload Button */}
                    {selectedFile && (
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
                                    {locale === "ar" ? "رفع الصورة" : "Upload Image"}
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
