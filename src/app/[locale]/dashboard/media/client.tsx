"use client";

import { useLocale, useTranslations } from "next-intl";
import { PageHeader, DataTable, Column, DataTableAction, DeleteDialog, FormDialog } from "@/components/dashboard/ui";
import { ImageUpload } from "@/components/dashboard/ui/ImageUpload";
import { useState } from "react";
import { uploadImage, deleteImage, updateImage } from "@/actions/images";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy, ExternalLink } from "lucide-react";
import type { ImageRecord } from "@/actions/images";

type MediaClientProps = {
    images: ImageRecord[];
    translations: {
        title: string;
        description: string;
        uploadImage: string;
        noImages: string;
    };
};

export function MediaClient({ images, translations }: MediaClientProps) {
    const locale = useLocale();
    const t = useTranslations("dashboard.common");
    const router = useRouter();

    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageRecord | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Edit form state
    const [editTitleEn, setEditTitleEn] = useState("");
    const [editTitleAr, setEditTitleAr] = useState("");
    const [editAltEn, setEditAltEn] = useState("");
    const [editAltAr, setEditAltAr] = useState("");

    const columns: Column<ImageRecord>[] = [
        {
            key: "url",
            labelEn: "Image",
            labelAr: "الصورة",
            render: (item) => (
                <img
                    src={item.url}
                    alt={locale === "ar" ? item.altAr || "" : item.altEn || ""}
                    className="h-12 w-12 object-cover rounded"
                />
            ),
            className: "w-[80px]",
        },
        {
            key: "titleEn",
            labelEn: "Title",
            labelAr: "العنوان",
            render: (item) => {
                const title = locale === "ar" ? item.titleAr : item.titleEn;
                return title ? <span>{title}</span> : <span className="text-muted-foreground">-</span>;
            },
        },
        {
            key: "filename",
            labelEn: "URL",
            labelAr: "الرابط",
            render: (item) => (
                <div className="flex items-center gap-2 max-w-[200px]">
                    <span className="truncate text-sm text-muted-foreground">
                        {item.url.split("/").pop()}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(item.url);
                            toast.success(locale === "ar" ? "تم نسخ الرابط" : "URL copied");
                        }}
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>
            ),
        },
        {
            key: "createdAt",
            labelEn: "Uploaded",
            labelAr: "تاريخ الرفع",
            render: (item) => new Date(item.createdAt).toLocaleDateString(locale),
        },
    ];

    const actions: DataTableAction<ImageRecord>[] = [
        {
            type: "view",
            labelEn: "Open",
            labelAr: "فتح",
            icon: <ExternalLink className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />,
            onClick: (item) => window.open(item.url, "_blank"),
        },
        {
            type: "edit",
            labelEn: t("edit"),
            labelAr: t("edit"),
            onClick: (item) => {
                setSelectedImage(item);
                setEditTitleEn(item.titleEn || "");
                setEditTitleAr(item.titleAr || "");
                setEditAltEn(item.altEn || "");
                setEditAltAr(item.altAr || "");
                setEditDialogOpen(true);
            },
        },
        {
            type: "delete",
            labelEn: t("delete"),
            labelAr: t("delete"),
            onClick: (item) => {
                setSelectedImage(item);
                setDeleteDialogOpen(true);
            },
        },
    ];

    const handleUpload = async (formData: FormData) => {
        const result = await uploadImage(formData);
        if (result.success) {
            toast.success(locale === "ar" ? "تم رفع الصورة بنجاح" : "Image uploaded successfully");
            setUploadDialogOpen(false);
            router.refresh();
        }
        return result;
    };

    const handleDelete = async () => {
        if (!selectedImage) return;

        setIsDeleting(true);
        const result = await deleteImage(selectedImage.id);
        setIsDeleting(false);

        if (result.success) {
            toast.success(locale === "ar" ? "تم حذف الصورة" : "Image deleted");
            setDeleteDialogOpen(false);
            router.refresh();
        } else {
            toast.error(result.message);
        }
    };

    const handleEdit = async () => {
        if (!selectedImage) return;

        setIsEditing(true);
        const result = await updateImage(selectedImage.id, {
            titleEn: editTitleEn || null,
            titleAr: editTitleAr || null,
            altEn: editAltEn || null,
            altAr: editAltAr || null,
        });
        setIsEditing(false);

        if (result.success) {
            toast.success(locale === "ar" ? "تم تحديث الصورة" : "Image updated");
            setEditDialogOpen(false);
            router.refresh();
        } else {
            toast.error(result.message);
        }
    };

    return (
        <>
            <PageHeader
                titleEn={translations.title}
                titleAr={translations.title}
                descriptionEn={translations.description}
                descriptionAr={translations.description}
                actionLabel={translations.uploadImage}
                onAction={() => setUploadDialogOpen(true)}
            />

            <DataTable
                data={images}
                columns={columns}
                actions={actions}
                getRowId={(item) => item.id}
                searchable
                searchPlaceholder={t("search")}
                emptyMessageEn={translations.noImages}
                emptyMessageAr={translations.noImages}
            />

            {/* Upload Dialog */}
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {locale === "ar" ? "رفع صورة جديدة" : "Upload New Image"}
                        </DialogTitle>
                    </DialogHeader>
                    <ImageUpload
                        onUpload={handleUpload}
                        onSuccess={() => {
                            setUploadDialogOpen(false);
                            router.refresh();
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <FormDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                titleEn="Edit Image"
                titleAr="تعديل الصورة"
                onSubmit={handleEdit}
                isSubmitting={isEditing}
            >
                {selectedImage && (
                    <div className="space-y-4">
                        <div className="flex justify-center mb-4">
                            <img
                                src={selectedImage.url}
                                alt=""
                                className="max-h-32 rounded object-contain"
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "العنوان (الإنجليزية)" : "Title (English)"}</Label>
                                <Input
                                    value={editTitleEn}
                                    onChange={(e) => setEditTitleEn(e.target.value)}
                                    dir="ltr"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "العنوان (العربية)" : "Title (Arabic)"}</Label>
                                <Input
                                    value={editTitleAr}
                                    onChange={(e) => setEditTitleAr(e.target.value)}
                                    dir="rtl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "النص البديل (الإنجليزية)" : "Alt (English)"}</Label>
                                <Input
                                    value={editAltEn}
                                    onChange={(e) => setEditAltEn(e.target.value)}
                                    dir="ltr"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === "ar" ? "النص البديل (العربية)" : "Alt (Arabic)"}</Label>
                                <Input
                                    value={editAltAr}
                                    onChange={(e) => setEditAltAr(e.target.value)}
                                    dir="rtl"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </FormDialog>

            {/* Delete Dialog */}
            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                itemNameEn={selectedImage?.titleEn || "Image"}
                itemNameAr={selectedImage?.titleAr || "الصورة"}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </>
    );
}
