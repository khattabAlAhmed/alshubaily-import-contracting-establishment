"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { PageHeader, DataTable, type Column, type DataTableAction } from "@/components/dashboard/ui";
import { Pencil, Trash2, Image } from "lucide-react";
import { toast } from "sonner";
import { deletePartner, type PartnerWithImage } from "@/actions/partners";

type PartnersClientProps = {
    partners: PartnerWithImage[];
};

export default function PartnersClient({ partners }: PartnersClientProps) {
    const locale = useLocale();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        setIsDeleting(id);
        const result = await deletePartner(id);
        setIsDeleting(null);

        if (result.success) {
            toast.success(locale === "ar" ? "تم الحذف" : "Deleted successfully");
            router.refresh();
        } else {
            toast.error(result.message);
        }
    };

    const columns: Column<PartnerWithImage>[] = [
        {
            key: "logo",
            labelEn: "Logo",
            labelAr: "الشعار",
            className: "w-16",
            render: (item) => item.logoImage ? (
                <img src={item.logoImage.url} alt="" className="w-12 h-12 object-contain rounded" />
            ) : (
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                    <Image className="h-5 w-5 text-muted-foreground" />
                </div>
            ),
        },
        {
            key: "nameEn",
            labelEn: "Name (EN)",
            labelAr: "الاسم (إنجليزي)",
            render: (item) => item.nameEn,
        },
        {
            key: "nameAr",
            labelEn: "Name (AR)",
            labelAr: "الاسم (عربي)",
            render: (item) => <span dir="rtl">{item.nameAr}</span>,
        },
    ];

    const actions: DataTableAction<PartnerWithImage>[] = [
        {
            type: "edit",
            labelEn: "Edit",
            labelAr: "تعديل",
            href: (item) => `/dashboard/partners/${item.id}`,
            icon: <Pencil className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />,
        },
        {
            type: "delete",
            labelEn: "Delete",
            labelAr: "حذف",
            onClick: (item) => handleDelete(item.id),
            icon: <Trash2 className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />,
        },
    ];

    return (
        <>
            <PageHeader
                titleEn="Partners"
                titleAr="الشركاء"
                descriptionEn="Manage partner companies and organizations"
                descriptionAr="إدارة الشركات والمؤسسات الشريكة"
                actionLabel={locale === "ar" ? "شريك جديد" : "New Partner"}
                actionHref="/dashboard/partners/new"
            />

            <DataTable
                data={partners}
                columns={columns}
                actions={actions}
                getRowId={(item) => item.id}
                searchable
                searchPlaceholder={locale === "ar" ? "بحث..." : "Search..."}
                emptyMessageEn="No partners found"
                emptyMessageAr="لا يوجد شركاء"
            />
        </>
    );
}
