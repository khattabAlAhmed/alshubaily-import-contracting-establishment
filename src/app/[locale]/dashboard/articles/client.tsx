"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader, DataTable, type Column, type DataTableAction } from "@/components/dashboard/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Users, Plus, Pencil, Trash2, Image } from "lucide-react";
import { toast } from "sonner";
import {
    deleteArticle,
    type ArticleWithRelations,
    type ArticleCategory,
    type Author,
} from "@/actions/articles";

type ArticlesClientProps = {
    articles: ArticleWithRelations[];
    categories: ArticleCategory[];
    authors: Author[];
};

export default function ArticlesClient({ articles, categories, authors }: ArticlesClientProps) {
    const locale = useLocale();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Debug
    console.log("ArticlesClient - received articles:", articles.length);
    console.log("ArticlesClient - articles data:", articles);


    const handleDelete = async (id: string) => {
        setIsDeleting(id);
        const result = await deleteArticle(id);
        setIsDeleting(null);

        if (result.success) {
            toast.success(locale === "ar" ? "تم الحذف" : "Deleted successfully");
            router.refresh();
        } else {
            toast.error(result.message);
        }
    };

    const columns: Column<ArticleWithRelations>[] = [
        {
            key: "image",
            labelEn: "Image",
            labelAr: "الصورة",
            className: "w-16",
            render: (item) => item.mainImage ? (
                <img src={item.mainImage.url} alt="" className="w-12 h-12 object-cover rounded" />
            ) : (
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                    <Image className="h-5 w-5 text-muted-foreground" />
                </div>
            ),
        },
        {
            key: "title",
            labelEn: "Title",
            labelAr: "العنوان",
            render: (item) => (
                <div>
                    <p className="font-medium">{locale === "ar" ? item.titleAr : item.titleEn}</p>
                    <p className="text-xs text-muted-foreground">{item.slugEn}</p>
                </div>
            ),
        },
        {
            key: "category",
            labelEn: "Category",
            labelAr: "التصنيف",
            render: (item) => item.category
                ? (locale === "ar" ? item.category.titleAr : item.category.titleEn)
                : "-",
        },
        {
            key: "author",
            labelEn: "Author",
            labelAr: "الكاتب",
            render: (item) => item.author
                ? (locale === "ar" ? item.author.publicNameAr : item.author.publicNameEn)
                : "-",
        },
    ];

    const actions: DataTableAction<ArticleWithRelations>[] = [
        {
            type: "edit",
            labelEn: "Edit",
            labelAr: "تعديل",
            href: (item) => `/dashboard/articles/${item.id}`,
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

    const quickActions = [
        {
            href: "/dashboard/articles/categories",
            icon: FolderOpen,
            labelEn: "Categories",
            labelAr: "التصنيفات",
            countEn: `${categories.length} categories`,
            countAr: `${categories.length} تصنيف`,
        },
        {
            href: "/dashboard/articles/authors",
            icon: Users,
            labelEn: "Authors",
            labelAr: "الكتّاب",
            countEn: `${authors.length} authors`,
            countAr: `${authors.length} كاتب`,
        },
    ];

    return (
        <>
            <PageHeader
                titleEn="Articles"
                titleAr="المقالات"
                descriptionEn="Manage blog articles and content"
                descriptionAr="إدارة المقالات والمحتوى"
                actionLabel={locale === "ar" ? "مقال جديد" : "New Article"}
                actionHref="/dashboard/articles/new"
            />

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 mb-6">
                {quickActions.map((action) => (
                    <Link key={action.href} href={action.href}>
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <action.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">
                                        {locale === "ar" ? action.labelAr : action.labelEn}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {locale === "ar" ? action.countAr : action.countEn}
                                    </p>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>


            {/* Articles Table */}
            <DataTable
                data={articles}
                columns={columns}
                actions={actions}
                getRowId={(item) => item.id}
                searchable
                searchPlaceholder={locale === "ar" ? "بحث..." : "Search..."}
                emptyMessageEn="No articles found"
                emptyMessageAr="لا توجد مقالات"
            />
        </>
    );
}

