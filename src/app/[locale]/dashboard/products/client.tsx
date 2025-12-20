"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { PageHeader, DataTable, type Column, type DataTableAction } from "@/components/dashboard/ui";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Folder,
    Tags,
    ListTree,
    FileText,
    Pencil,
    Trash2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteProduct, type ProductWithRelations, type ProductCategory } from "@/actions/products";

type ProductsClientProps = {
    products: ProductWithRelations[];
    categories: ProductCategory[];
};

export default function ProductsClient({ products, categories }: ProductsClientProps) {
    const locale = useLocale();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const quickActions = [
        {
            icon: Folder,
            labelEn: "Categories",
            labelAr: "التصنيفات",
            href: "/dashboard/products/categories",
        },
        {
            icon: Tags,
            labelEn: "Property Categories",
            labelAr: "تصنيفات الخصائص",
            href: "/dashboard/products/property-categories",
        },
        {
            icon: ListTree,
            labelEn: "Properties",
            labelAr: "الخصائص",
            href: "/dashboard/products/properties",
        },
        {
            icon: FileText,
            labelEn: "Product Details",
            labelAr: "تفاصيل المنتجات",
            href: "/dashboard/products/details",
        },
    ];

    const handleDelete = async (id: string) => {
        setIsDeleting(id);
        const result = await deleteProduct(id);
        setIsDeleting(null);

        if (result.success) {
            toast.success(locale === "ar" ? "تم حذف المنتج" : "Product deleted");
            router.refresh();
        } else {
            toast.error(result.message);
        }
    };

    const columns: Column<ProductWithRelations>[] = [
        {
            key: "image",
            labelEn: "Image",
            labelAr: "الصورة",
            render: (product) => (
                product.mainImage ? (
                    <img
                        src={product.mainImage.url}
                        alt=""
                        className="h-10 w-10 object-cover rounded"
                    />
                ) : (
                    <div className="h-10 w-10 bg-muted rounded flex items-center justify-center text-xs">
                        N/A
                    </div>
                )
            ),
        },
        {
            key: "title",
            labelEn: "Title",
            labelAr: "العنوان",
            render: (product) => locale === "ar" ? product.titleAr : product.titleEn,
        },
        {
            key: "category",
            labelEn: "Category",
            labelAr: "التصنيف",
            render: (product) => product.category
                ? (locale === "ar" ? product.category.titleAr : product.category.titleEn)
                : "-",
        },
        {
            key: "slug",
            labelEn: "Slug",
            labelAr: "المعرف",
            render: (product) => locale === "ar" ? product.slugAr : product.slugEn,
        },
    ];

    const actions: DataTableAction<ProductWithRelations>[] = [
        {
            type: "edit",
            labelEn: "Edit",
            labelAr: "تعديل",
            href: (product) => `/dashboard/products/${product.id}`,
            icon: <Pencil className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />,
        },
        {
            type: "delete",
            labelEn: "Delete",
            labelAr: "حذف",
            onClick: (product) => handleDelete(product.id),
            icon: <Trash2 className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />,
        },
    ];

    return (
        <>
            <PageHeader
                titleEn="Products"
                titleAr="المنتجات"
                descriptionEn="Manage products catalog"
                descriptionAr="إدارة كتالوج المنتجات"
                actionLabel={locale === "ar" ? "إضافة منتج" : "Add Product"}
                actionHref="/dashboard/products/new"
            />

            {/* Quick Actions */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <h3 className="font-medium mb-4">
                        {locale === "ar" ? "إجراءات سريعة" : "Quick Actions"}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {quickActions.map((action) => (
                            <Button
                                key={action.href}
                                variant="outline"
                                className="h-auto py-3 flex flex-col items-center gap-2"
                                asChild
                            >
                                <Link href={action.href}>
                                    <action.icon className="h-5 w-5" />
                                    <span className="text-xs">
                                        {locale === "ar" ? action.labelAr : action.labelEn}
                                    </span>
                                </Link>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Products Table */}
            <DataTable
                data={products}
                columns={columns}
                actions={actions}
                getRowId={(product) => product.id}
            />
        </>
    );
}
